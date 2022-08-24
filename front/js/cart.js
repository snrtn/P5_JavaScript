import { url } from "./utils.js";
let dataSelected = JSON.parse(localStorage.getItem("DATA_STORAGE"));
const productDOM = document.querySelector("#cart__items");

const fetchProducts = async () => {
  productDOM.innerHTML = '<div class="loading">Loading</div>';
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    productDOM.innerHTML = "<p>Votre panier est vide</p>";
  }
};

const start = async () => {
  const data = await fetchProducts();
  displayProducts(data);
};
start();

async function displayProducts() {
  const productList = await fetchProducts();

  if (dataSelected === null || dataSelected == 0) {
    productDOM.innerHTML = `<p>Votre panier est vide</p>`;
  } else {
    const products = dataSelected
      .map((product) => {
        const itemSEL = productList.find((prod) => {
          if (prod.id === product.id) {
            const item = {
              id: product.id,
              color: product.color,
              quantity: product.quantity,
              name: itemSEL.name,
              alt: itemSEL.altTxt,
              image: itemSEL.imageUrl,
              price: itemSEL.price,
            };

            return item;
          }

          return itemSEL;
        });

        return `<article
      class="cart__item"
      data-id="${item.id}"
      data-color="${item.color}"
    >
      <div class="cart__item__img">
        <img
          src="${item.image}"
          alt="${item.alt}"
        />
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${item.name}</h2>
          <p>${item.color}</p>
          <p>${item.price}€</p>
        </div>
        <p/>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté :</p>
            <input
              type="number"
              class="itemQuantity"
              name="itemQuantity"
              min="1"
              max="5"
              value="${item.quantity}"
            />
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;
      })
      .join("");
    productDOM.innerHTML = `<section id="cart__items">${products}</section>`;
  }
}
displayProducts();

function displayTotals() {
  let itemQuantity = document.getElementsByClassName("itemQuantity");

  let itemLength = itemQuantity.length,
    total = 0;

  for (let i = 0; i < itemLength; ++i) {
    total += itemQuantity[i].valueAsNumber;
  }

  let displayTotalQuantity = document.getElementById("totalQuantity");
  displayTotalQuantity.innerHTML = total;

  let totalPrice = 0;

  for (let i = 0; i < itemLength; ++i) {
    totalPrice += itemQuantity[i].valueAsNumber * data[i].price;
  }

  let displayTotalPrice = document.getElementById("totalPrice");
  displayTotalPrice.innerHTML = totalPrice / 10;
}
displayTotals();
