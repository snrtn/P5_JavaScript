import { url, id } from './utils.js';
const productDOM = document.querySelector('.product');

const fetchProducts = async (id) => {
  try {
    const response = await fetch(`${url}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return false;
  }
};

const start = async () => {
  const product = await fetchProducts(id);

  if (!product) {
    let nodeError = document.createElement('p');
    let textError = document.createTextNode('Error');
    let elementError = nodeError.appendChild(textError);
    productDOM.appendChild(elementError);
  }

  displayProduct(product);
};
start();

const displayProduct = (product) => {
  const item = {
    img: product.imageUrl,
    alt: product.altTxt,
    name: product.name,
    price: product.price,
    desc: product.description,
    colors: product.colors,
  };
  let textName = document.createTextNode(item.name);
  let textDesc = document.createTextNode(item.desc);
  let textPrice = document.createTextNode(item.price);

  let productImg = document.createElement('img');
  document.querySelector('.item__img').appendChild(productImg);
  productImg.src = item.img;
  productImg.alt = item.alt;

  let productName = document.getElementById('title');
  productName.append(textName);

  let productPrice = document.getElementById('price');
  productPrice.appendChild(textPrice);

  let productDescription = document.getElementById('description');
  productDescription.appendChild(textDesc);

  for (let colors of item.colors) {
    let productColors = document.createElement('option');
    document.querySelector('#colors').appendChild(productColors);
    productColors.value = colors;
    let textColors = document.createTextNode(colors);
    productColors.appendChild(textColors);
  }

  addToCart();
};

function addToCart() {
  document.getElementById('addToCart').addEventListener('click', () => {
    const quantity = document.getElementById('quantity').value;
    const color = document.getElementById('colors').value;
    const name = document.getElementById('title').innerText;

    if (!color.length) {
      let colorError = document.createTextNode('Choisir une couleur');
      document.getElementById('colorsError').appendChild(colorError);
      return;
    }
    if (!parseInt(quantity) || parseInt(quantity) >= 6) {
      let numberError = document.createTextNode(
        'Choisir quantity entre 1 et 5'
      );
      document.getElementById('numbersError').appendChild(numberError);
      return;
    }

    const data = {
      id: id,
      color: color,
      quantity: parseInt(quantity),
    };

    const goToCart = () => {
      window.confirm(`
          Nom : ${name},
          Color : ${color},
          Quantity : ${quantity}

          Elle est ajoutée au panier
          `);
      window.location.href = 'cart.html';
    };

    let dataStorage = JSON.parse(localStorage.getItem('DATA_STORAGE'));

    if (dataStorage) {
      const resultFind = dataStorage.find(
        (el) => el.id === id && el.color === color
      );
      if (resultFind) {
        let newQuantite =
          parseInt(data.quantity) + parseInt(resultFind.quantity);
        resultFind.quantity = newQuantite;

        if (resultFind.quantity >= 6) {
          alert('quantity est plus 5');
        } else {
          localStorage.setItem('DATA_STORAGE', JSON.stringify(dataStorage));
          goToCart();
        }
      } else {
        dataStorage.push(data);
        localStorage.setItem('DATA_STORAGE', JSON.stringify(dataStorage));
        goToCart();
      }
    } else {
      dataStorage = [];
      dataStorage.push(data);
      localStorage.setItem('DATA_STORAGE', JSON.stringify(dataStorage));
      goToCart();
    }
  });
}
