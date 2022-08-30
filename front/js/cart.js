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

async function displayProducts() {
  const productList = await fetchProducts();

  if (dataSelected === null || dataSelected == 0) {
    productDOM.innerHTML = `<p>Votre panier est vide</p>`;
  } else {
    const products = dataSelected
      .map((product) => {
        const itemSEL = productList.find((prod) => {
          return prod._id === product.id;
        });

        const item = {
          id: product.id,
          color: product.color,
          quantity: product.quantity,
          name: itemSEL.name,
          alt: itemSEL.altTxt,
          image: itemSEL.imageUrl,
          price: itemSEL.price,
        };

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
          <p>${item.price / 10}€</p>
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
    displayTotals(productList);
  }
}
displayProducts();

function displayTotals(productList) {
  let itemQuantity = document.getElementsByClassName("itemQuantity");
  let displayTotalQuantity = document.getElementById("totalQuantity");
  let displayTotalPrice = document.getElementById("totalPrice");

  let totalPrice = 0,
    total = 0,
    totalQty = 0;

  dataSelected.forEach((cartItem, index) => {
    const itemSEL = productList.find((prod) => {
      return prod._id === cartItem.id;
    });
    totalQty += parseInt(cartItem.quantity);
    totalPrice += parseInt(cartItem.quantity) * parseFloat(itemSEL.price);
  });

  displayTotalQuantity.innerHTML = totalQty;
  displayTotalPrice.innerHTML = totalPrice / 10;
}

function getForm() {
  const form = document.getElementById("cart__order__form");
  const userFirstName = document.getElementById("firstName");
  const userLastName = document.getElementById("lastName");
  const userAddress = document.getElementById("address");
  const userCity = document.getElementById("city");
  const userEmail = document.getElementById("email");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    validateInputs();
  });

  const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error");

    errorDisplay.innerText = message;
    inputControl.classList.add("error");
    inputControl.classList.remove("success");
  };

  const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error");

    errorDisplay.innerText = "";
    inputControl.classList.add("success");
    inputControl.classList.remove("error");
  };

  const isValidEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validateInputs = () => {
    const userFirstNameValue = userFirstName.value.trim();
    const userLastNameValue = userLastName.value.trim();
    const userEmailValue = userEmail.value.trim();
    const userCityValue = userCity.value.trim();
    const userAddressValue = userAddress.value.trim();

    if (userFirstNameValue === "") {
      setError(userFirstName, "FirstName is required");
    } else {
      setSuccess(userFirstName);
    }

    if (userLastNameValue === "") {
      setError(userLastName, "LastName is required");
    } else {
      setSuccess(userLastName);
    }

    if (userEmailValue === "") {
      setError(userEmail, "Email is required");
    } else if (!isValidEmail(userEmailValue)) {
      setError(userEmail, "Provide a valid email address");
    } else {
      setSuccess(userEmail);
    }

    if (userCityValue === "") {
      setError(userCity, "Ville is required");
    } else {
      setSuccess(userCity);
    }

    if (userAddressValue === "") {
      setError(userAddress, "Adresse is required");
    } else {
      setSuccess(userAddress);
    }
  };
}

getForm();
