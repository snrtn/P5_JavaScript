import { url } from './utils.js';
const productDOM = document.querySelector('.items');

const fetchProducts = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    let nodeError = document.createElement('p');
    let textError = document.createTextNode('Error');
    let elementError = nodeError.appendChild(textError);
    productDOM.appendChild(elementError);
  }
};

const start = async () => {
  const data = await fetchProducts();
  displayProducts(data);
};
start();

const displayProducts = (list) => {
  const products = list.map((product) => {
    const item = {
      id: product._id,
      name: product.name,
      alt: product.altTxt,
      image: product.imageUrl,
      desc: product.description,
    };
    let textName = document.createTextNode(item.name);
    let textDesc = document.createTextNode(item.desc);

    let productLink = document.createElement('a');
    document.querySelector('.items').appendChild(productLink);
    productLink.href = `product.html?id=${item.id}`;

    let productArticle = document.createElement('article');
    productLink.appendChild(productArticle);

    let productImg = document.createElement('img');
    productArticle.appendChild(productImg);
    productImg.src = item.image;
    productImg.alt = item.alt;

    let productName = document.createElement('h3');
    productArticle.appendChild(productName);
    productName.classList.add('productName');
    productName.appendChild(textName);

    let productDescription = document.createElement('p');
    productArticle.appendChild(productDescription);
    productDescription.classList.add('productName');
    productDescription.appendChild(textDesc);

    return;
  });
  productDOM.appendChild = products;
};
