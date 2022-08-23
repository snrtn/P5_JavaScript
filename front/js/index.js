import { url } from "./utils.js";
const productDOM = document.querySelector(".items");

const fetchProducts = async () => {
  productDOM.innerHTML = '<div class="loading">Loading</div>';
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    productDOM.innerHTML = '<p class="error">Error</p>';
  }
};

const start = async () => {
  const data = await fetchProducts();
  displayProducts(data);
};
start();

const displayProducts = (list) => {
  const products = list
    .map((product) => {
      const item = {
        id: product._id,
        name: product.name,
        alt: product.altTxt,
        image: product.imageUrl,
        desc: product.description,
      };

      return `
      <a href="./product.html?id=${item.id}">
        <article>
          <img src="${item.image}" alt="${item.alt}"/>
          <h3 class="productName">${item.name}</h3>
          <p class="productDescription">${item.desc}</p>
        </article>
      </a>
    `;
    })
    .join("");
  productDOM.innerHTML = `<section class="items" id="items">${products}</section>`;
};
