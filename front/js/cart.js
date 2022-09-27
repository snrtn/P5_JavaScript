import { url } from './utils.js';
let dataSelected = JSON.parse(localStorage.getItem('DATA_STORAGE'));
const productDOM = document.getElementsByClassName('cart__item');

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

async function displayProducts() {
  const productList = await fetchProducts();

  if (dataSelected === null || dataSelected == 0) {
    let nodeEmpty = document.createElement('p');
    let textEmpty = document.createTextNode('Votre panier est vide');
    let elementEmpty = nodeEmpty.appendChild(textEmpty);
    productDOM.appendChild(elementEmpty);
  } else {
    const products = dataSelected.map((product) => {
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
      let textName = document.createTextNode(item.name);
      let textColor = document.createTextNode(item.color);
      let textPrice = document.createTextNode(item.price / 10 + '€');
      let text = document.createTextNode('Qté :');
      let textDel = document.createTextNode('Supprimer');

      let productImg = document.createElement('img');
      document.querySelector('.cart__item__img').appendChild(productImg);
      productImg.src = item.image;
      productImg.alt = item.alt;

      let productName = document.createElement('h2');
      document
        .querySelector('.cart__item__content__description')
        .appendChild(productName);
      productName.appendChild(textName);

      let productColor = document.createElement('p');
      document
        .querySelector('.cart__item__content__description')
        .appendChild(productColor);
      productColor.appendChild(textColor);

      let productPrice = document.createElement('p');
      document
        .querySelector('.cart__item__content__description')
        .appendChild(productPrice);
      productPrice.appendChild(textPrice);

      let productText = document.createElement('span');
      document
        .querySelector('.cart__item__content__description')
        .appendChild(productText);
      productText.appendChild(text);

      let productQuantity = document.createElement('input');
      document
        .querySelector('.cart__item__content__description')
        .appendChild(productQuantity);
      productQuantity.value = item.quantity;
      productQuantity.className = 'itemQuantity';
      productQuantity.id = 'itemQuantity';
      productQuantity.setAttribute('type', 'number');
      productQuantity.setAttribute('name', 'itemQuantity');
      productQuantity.setAttribute('min', '1');
      productQuantity.setAttribute('max', '5');

      let productDel = document.createElement('p');
      document
        .querySelector('.cart__item__content__description')
        .appendChild(productDel);
      productDel.className = 'deleteItem';
      productDel.appendChild(textDel);

      return;
    });

    productDOM.appendChild = products;
  }
  displayTotals(productList);
  changeQuantity();
  deleteProduct();
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

  let textTotalQty = document.createTextNode(totalQty);
  let textTotalPrice = document.createTextNode(totalPrice / 10);

  displayTotalQuantity.appendChild(textTotalQty);
  displayTotalPrice.appendChild(textTotalPrice);
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
      if (totalValue.quantity >= 6) {
        alert("Quantity n'est pas plus 5");
      } else {
        dataSelected[c].quantity = totalValue.quantity;
        localStorage.setItem('DATA_STORAGE', JSON.stringify(dataSelected));
        location.reload();
      }
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

  const isValidName = (name) => {
    const re = /^[a-zA-Z]*$/;
    return re.test(String(name).toLowerCase());
  };

  const validateInputs = () => {
    const userFirstNameValue = userFirstName.value.trim();
    const userLastNameValue = userLastName.value.trim();
    const userEmailValue = userEmail.value.trim();
    const userCityValue = userCity.value.trim();
    const userAddressValue = userAddress.value.trim();

    if (userFirstNameValue === '') {
      setError(userFirstName, 'FirstName is required');
    } else if (!isValidName(userFirstNameValue)) {
      setError(userFirstName, 'Provide a valid FirstName');
    } else {
      setSuccess(userFirstName);
    }

    if (userLastNameValue === '') {
      setError(userLastName, 'LastName is required');
    } else if (!isValidName(userLastNameValue)) {
      setError(userLastName, 'Provide a valid LastName');
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
        let orderID = data.orderId;

        if (data.contact.firstName.length === 0 && data.products.length < 0) {
          return;
        } else {
          localStorage.clear();
          document.location.href = `confirmation.html?id=${orderID}`;
        }
      });
  });
}
order();
