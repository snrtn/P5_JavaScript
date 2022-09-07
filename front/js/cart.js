import { url } from './utils.js';
let dataSelected = JSON.parse(localStorage.getItem('DATA_STORAGE'));
const productDOM = document.querySelector('#cart__items');

const fetchProducts = async () => {
  productDOM.innerHTML = '<div class="loading">Loading</div>';
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    productDOM.innerHTML = '<p>Votre panier est vide</p>';
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
            <p class="deleteItem" >Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;
      })
      .join('');
    productDOM.innerHTML = `<section id="cart__items">${products}</section>`;
    displayTotals(productList);
    changeQuantity();
    deleteProduct();
  }
}
displayProducts();

function displayTotals(productList) {
  let displayTotalQuantity = document.getElementById('totalQuantity');
  let displayTotalPrice = document.getElementById('totalPrice');

  let totalPrice = 0,
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

function changeQuantity() {
  let quantityItem = document.querySelectorAll('.itemQuantity');

  for (let c = 0; c < quantityItem.length; c++) {
    quantityItem[c].addEventListener('change', (event) => {
      event.preventDefault();

      let defaultValue = dataSelected[c].quantity;
      let value = quantityItem[c].valueAsNumber;

      const totalValue = dataSelected.find((el) => el.value !== defaultValue);

      totalValue.quantity = value;
      dataSelected[c].quantity = totalValue.quantity;

      localStorage.setItem('DATA_STORAGE', JSON.stringify(dataSelected));
      location.reload();
    });
  }
}

function deleteProduct() {
  let deleteBtn = document.querySelectorAll('.deleteItem');

  for (let d = 0; d < deleteBtn.length; d++) {
    deleteBtn[d].addEventListener('click', (e) => {
      e.preventDefault();

      let idDelete = dataSelected[d].id;
      let colorDelete = dataSelected[d].color;

      dataSelected = dataSelected.filter(
        (el) => el.id !== idDelete || el.color !== colorDelete
      );

      localStorage.setItem('DATA_STORAGE', JSON.stringify(dataSelected));
      location.reload();
    });
  }
}

// clientInputs
const userFirstName = document.getElementById('firstName');
const userLastName = document.getElementById('lastName');
const userAddress = document.getElementById('address');
const userCity = document.getElementById('city');
const userEmail = document.getElementById('email');

function validateForm() {
  const form = document.getElementById('cart__order__form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    validateInputs();
  });

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

    if (userFirstNameValue === '') {
      setError(userFirstName, 'FirstName is required');
    } else {
      setSuccess(userFirstName);
    }

    if (userLastNameValue === '') {
      setError(userLastName, 'LastName is required');
    } else {
      setSuccess(userLastName);
    }

    if (userEmailValue === '') {
      setError(userEmail, 'Email is required');
    } else if (!isValidEmail(userEmailValue)) {
      setError(userEmail, 'Provide a valid email address');
    } else {
      setSuccess(userEmail);
    }

    if (userCityValue === '') {
      setError(userCity, 'Ville is required');
    } else {
      setSuccess(userCity);
    }

    if (userAddressValue === '') {
      setError(userAddress, 'Adresse is required');
    } else {
      setSuccess(userAddress);
    }
  };

  const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
  };

  const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
  };
}
validateForm();

function order() {
  const buttonOrder = document.getElementById('order');

  buttonOrder.addEventListener('click', (e) => {
    let itemsId = [];

    for (let i = 0; i < dataSelected.length; i++) {
      itemsId.push(dataSelected[i].id);
    }

    const infoClient = {
      contact: {
        firstName: userFirstName.value,
        lastName: userLastName.value,
        address: userAddress.value,
        city: userCity.value,
        email: userEmail.value,
      },
      products: itemsId,
    };

    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(infoClient),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let orderID = data.orderId;
        localStorage.clear();
        document.location.href = `confirmation.html?id=${orderID}`;
      });
  });
}
order();
