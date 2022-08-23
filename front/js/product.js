import { url } from "./utils.js";
const productDOM = document.querySelector(".product");

// Tu récupère l'id du produit dans l'url
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const fetchProducts = async (id) => {
  try {
    const response = await fetch(`${url}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return false;
  }
};

const displayProduct = async () => {
  productDOM.innerHTML = '<h4 class="loading">Loading...</h4>';
  const product = await fetchProducts(id);

  if (!product)
    productDOM.innerHTML =
      '<p class="error">There was a problem fetching products. Please try again later </p>';

  displayProducts(product);
};

const start = async () => {
  // Récupère et affiche les produits
  await displayProduct();

  // Bind le click listener au button
  onCartButtonClicked();
};

start();

const displayProducts = (product, index) => {
  const item = {
    img: product.imageUrl,
    alt: product.altTxt,
    name: product.name,
    price: product.price,
    description: product.description,
    colors: product.colors,
  };

  const colorsList = item.colors
    .map((color) => {
      return `<option value="${color}">${color}</option>`;
    })
    .join("");

  productDOM.innerHTML = `
    <article class="product" id="product">
      <div class="item__img">
        <img src="${item.img}" alt="${item.alt}" />
      </div>
      <div class="item__content">
        <div class="item__content__titlePrice">
          <h1 id="title">${item.name}</h1>
          <p>Prix : <span id="price">${item.price / 10}</span>€</p>
        </div>

        <div class="item__content__description">
          <p class="item__content__description__title">Description :</p>
          <p id="description">${item.description}</p>
        </div>

        <div class="item__content__settings">
          <div class="item__content__settings__color">
            <label  for="color-select">Choisir une couleur :</label>
            <select name="color-select" id="colors" >
              <option value="">--SVP, choisissez une couleur --</option>
              ${colorsList}
            </select>
            </div>
            <p id="colorsError"></p>
            
            <div class="item__content__settings__quantity">
            <label id="color" for="itemQuantity">Nombre d'article(s) (1-5) :</label>
            <input type="number" name="itemQuantity" min="1" max="5" value="0" id="quantity" />
            <p id="numbersError"></p>
            </div>
      </div>

      <div class="item__content__addButton">
        <button id="addToCart">Ajouter au panier</button>
      </div>
    </div>
  </article>
  `;

  addToCart(product);
};

function addToCart(product) {
  document.getElementById("addToCart").addEventListener("click", () => {
    const quantity = document.getElementById("quantity").value;
    const color = document.getElementById("colors").value;
    const name = document.getElementById("title").innerText;
    const alt = document.getElementById("title").value;
    const image = document.getElementById("title").innerText;

    if (!color.length) {
      document.getElementById("colorsError").innerHTML = "Choisir une couleur";
      return;
    }
    if (!parseInt(quantity) || parseInt(quantity) >= 6) {
      document.getElementById("numbersError").innerHTML =
        "Choisir quantity entre 1 et 5";
      return;
    }

    const data = {
      id: id,
      color: color,
      quantity: parseInt(quantity),
      name: name,
      alt: product.altTxt,
      image: product.imageUrl,
    };

    const goToCart = () => {
      window.confirm(`
          Nom : ${name},
          Color : ${color},
          Quantity : ${quantity}

          Elle est ajoutée au panier
          `);
      window.location.href = "cart.html";
    };

    let dataStorage = JSON.parse(localStorage.getItem("DATA_STORAGE"));

    if (dataStorage) {
      const resultFind = dataStorage.find(
        (el) => el.id === id && el.color === color
      );
      if (resultFind) {
        let newQuantite =
          parseInt(data.quantity) + parseInt(resultFind.quantity);
        resultFind.quantity = newQuantite;

        if (resultFind.quantity >= 6) {
          alert("quantity est plus 5");
        } else {
          localStorage.setItem("DATA_STORAGE", JSON.stringify(dataStorage));
          goToCart();
        }
      } else {
        dataStorage.push(data);
        localStorage.setItem("DATA_STORAGE", JSON.stringify(dataStorage));
        goToCart();
      }
    } else {
      dataStorage = [];
      dataStorage.push(data);
      localStorage.setItem("DATA_STORAGE", JSON.stringify(dataStorage));
      goToCart();
    }
  });
}
