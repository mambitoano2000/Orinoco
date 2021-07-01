// Get API products
function fetchProducts(url, row) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (value) {
      console.log(value);
      buildIndexPage(value, row);

    })
    .catch(function (err) {
      console.log("api error")
    });
}

// Build  index page function
function buildIndexPage(value, row) {
  let cols = document.getElementById(row)

  for (let i = 0; i < value.length; i++) {
    let col = `<div class="col-sm-12 col-lg-6 mb-4">
    <a href="/product.html?id=${value[i]._id}"><div class="card h-100">
                         <div class="card-body">
                         <img src="${value[i].imageUrl}" class="card-img-top">  
                        <div class="d-flex justify-content-between mt-2" ><h5>${value[i].name}</h5> <span>${value[i].price}€</span></h5>
                       </div>
                       <p>${value[i].description}</p>
                       </div></a>
                       </div>`
    cols.innerHTML += col

  }
}

// Calling fetch function to catch data and create the row of products

fetchProducts('http://localhost:3000/api/furniture/', 'meublesRow');


// function to fetch product page and call other functions inside this page
// product get query string
function fetchProductPage() {
  const queryProductUrlData = window.location.search;
  console.log(queryProductUrlData);

  // product extract query string

  const params = new URLSearchParams(queryProductUrlData);
  const id = params.get("id");
  console.log(id);

  //product.html fetch

  fetch(`http://localhost:3000/api/furniture/${id}`)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (productValue) {
      console.log(productValue);
      // creates product data in html
      document
        .getElementById(productName)
      productName.textContent = `${productValue.name}`;
      document
        .getElementById(productPrice)
      productPrice.textContent = `Prix: ${productValue.price}$`;
      document
        .getElementById(productDescription)
      productDescription.textContent = `${productValue.description}`;

      document
        .getElementById(productImage)
      productImage.src = productValue.imageUrl;


      //calling function to create options in html
      buildOptionsQuantitySubmit(productValue, 'varnish');



      // Function to create options select and quantity input

      function buildOptionsQuantitySubmit(value, type) {
        let optionsSelect = document.getElementById('optionsselect')
        console.log("type: ", type);
        let options = value[type]
        for (let i = 0; i < options.length; i++) {
          console.log("log options: ", value);
          let selectOption = `<option value="${options[i]}">${options[i]}</option>`
          optionsSelect.innerHTML += selectOption;
        }

        // Create quantity and submit btn
        document.getElementById(optionForm);
        let quantityAndSubmitBtns = `<label  class="me-2" for="quantity">Quantité:</label>
       <input type="number" id="productQuantity" name="quantity" required  value="1" min="1"  placeholder="1"><br><div class="text-center"><button type="submit" id="addToCart" class="btn btn-primary mt-5">Ajouter au panier</button></div>`;
        optionForm.innerHTML += quantityAndSubmitBtns;
      }

      //defines where is the event to get product page submit btn and calls the function to get it
      const form = document.getElementById('optionForm');
      form.addEventListener('submit', logSubmit);

      // gets the data from product page submit btn
      function logSubmit(event) {
        event.preventDefault();
        console.log('SUBMIT!!!')
        console.log(event.target.elements);
        console.log(event.target.elements.quantity.value);

        let productQuantity = event.target.elements.quantity.value;

        let selectedProperties = {
          quantity: productQuantity
        }
        sendProductToLocalStorage(productValue, selectedProperties);
      }
    })

    .catch(function (err) {
      console.log("api error")
    })
}

// calls the function to fetch product page

fetchProductPage()



// send product and quantity to localStorage

function sendProductToLocalStorage(product, selectedProperties) {
  console.log('product: ', product);
  console.log('selectedProperties: ', selectedProperties);
  let itemToSave = {
    ...product,
    ...selectedProperties,
  }
  console.log('itemToSave: ', itemToSave);

  if (localStorage.getItem(product._id) !== null) {
    //Data item exists
    let itemAlreadyInCart = JSON.parse(localStorage.getItem(product._id)) || [];
    console.log("item already in cart: ", itemAlreadyInCart);

    itemAlreadyInCart.quantity = (+itemAlreadyInCart.quantity) + (+itemToSave.quantity);

    localStorage.setItem(product._id, JSON.stringify(itemAlreadyInCart));
    alert("Produit/Produits ajoutés au panier.");
    window.location = "index.html";


  } else {
    localStorage.setItem(product._id, JSON.stringify(itemToSave));
    alert("Produit/Produits ajoutés au panier.");
    window.location = "index.html";

  }

  console.log("local storage: ", localStorage);
}



// get localStorage products
document.addEventListener('DOMContentLoaded', function () {
  function createCartPage(localStorage) {
    let totalPrice = 0;
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = JSON.parse(localStorage.getItem(key));
      console.log({ key, value });
      console.log(value.name);
      let totalSingleProductPrice = value.quantity * value.price;
      console.log(totalSingleProductPrice);
      totalPrice += totalSingleProductPrice;
      console.log(totalPrice);
      // create cart div
      let cartCard = document.getElementById('panier');
      let cartCardData = `<div class="row js-product text-center mb-5" id="${value._id}"><div class="col-12 col-sm-3"><img src="${value.imageUrl}" class="img-fluid"></div> <div class="col mt-2"> <p>${value.name}</p></div> <div class="col mt-2"><form id="orderFormQuantity"><label  class="" for="quantity">Quantité:</label>
      <input type="number"  name="quantity" class="quantityInput" value="${value.quantity}"  required data-productdataid="${value._id}" min="1"  placeholder="${value.quantity}" style="width: 50px"></form></div> <div class="col mt-2"> <p class="totalpriceparagraph" data-productdataparagraphid="${value._id}">Prix: <span class="js-product-total-price">${totalSingleProductPrice}</span>€</p></div><div class="col text-center mt-2"><button type="button" data-productdataid="${value._id}"class="  btn btn-labeled btn-danger btn-supprimer-produit btn-width">
      Effacer</button></div></div>`;
      cartCard.innerHTML += cartCardData;
      // create total price div
      let totalPriceDiv = document.getElementById('totalpricediv');
      let totalPriceParagraph = `<div class="d-flex  justify-content-center justify-content-md-end"><p>Prix Total: <span id="ordertotalprice" class="js-total-price">${totalPrice}</span>€</p></div>`;
      totalPriceDiv.innerHTML = totalPriceParagraph;
      // create order part
      orderDiv = document.getElementById('order')
      orderDiv.innerHTML = `<div class="d-flex flex-column px-md-5 mb-3"><label class="mb-2" for="prenom">Prénom</label><input  id="prenom" pattern="[A-Za-z]+" type="text" required></input></div><div class="mb-3 d-flex flex-column px-md-5"><label class="mb-2" for="nom">Nom</label><input id="nom" pattern="[A-Za-z]+" type="text" required></input></div><div class="mb-3 d-flex flex-column px-md-5"><label class="mb-2" for="adresse">Adresse</label><input id="adresse" type="text" required></input></div><div class="mb-3 d-flex flex-column px-md-5"><label class="mb-2" for="ville">Ville</label><input id="ville" pattern="[A-Za-z]+" type="text" required></input></div><div class=" mb-3 d-flex flex-column px-md-5"><label class="mb-2" for="email">Email</label><input id="email" type="email" required></input></div><div class="text-center"><button type="submit" id="btnorder" class="btn btn-success mt-3">Commander</button></div>`;
      updateProductQuantityOnCart();
    }
  }
  createCartPage(localStorage);
  createEmptyCartMessage()
  deleteProductFromCart()

  // empty cart message
  function createEmptyCartMessage() {
    if (localStorage.length === 0) {
      totalPriceDivEmpty = document.getElementById('totalpricediv');
      totalPriceDivEmpty.innerHTML = `<div class="text-center emptycartmargin"><p>Votre panier est vide.</p><a href="index.html"><button type="button" class="btn btn-success m-5">Retour à l'accueil</button></a></div>`;
      orderDiv = document.getElementById('order');
      orderDiv.remove();
    }
  }


  // delete product from cart
  function deleteProductFromCart() {
    document.querySelectorAll('.btn-supprimer-produit').forEach(item => {
      item.addEventListener('click', event => {
        let productId = item.dataset.productdataid;

        console.log("product id ", productId)
        let value = JSON.parse(localStorage.getItem(productId));
        console.log("product array ", value)
        let productTotalPrice = value.quantity * value.price;
        console.log("productTotalPrice ", productTotalPrice)
        const totalPrice = document.querySelector('.js-total-price');
        const oldTotalPrice = Number(totalPrice.innerText);
        totalPrice.innerText = oldTotalPrice - productTotalPrice;


        window.localStorage.removeItem(productId);
        let productHtmlToRemove = document.getElementById(productId);
        productHtmlToRemove.remove();
        console.log(totalPrice.innerText);
        if (totalPrice.innerText == 0) {
          createEmptyCartMessage()
        }
      })
    })
  }

}, false);


// update quantity in shopping page/localStorage

function updateProductQuantityOnCart() {
  document.querySelectorAll('.quantityInput').forEach(item => {
    item.addEventListener('input', event => {
      let changedItemQuantityValue = item.value;
      console.log(changedItemQuantityValue);
      let productId = item.dataset.productdataid;
      console.log("product id ", productId)
      let value = JSON.parse(localStorage.getItem(productId));
      console.log("product array ", value)
      value.quantity = changedItemQuantityValue;
      if (value.quantity == "") {
        value.quantity = 0;
      }
      console.log("new quantity ", value.quantity)
      localStorage.setItem(productId, JSON.stringify(value));
      let newTotalProductPrice = value.price * changedItemQuantityValue;
      console.log("new total product price ", newTotalProductPrice)
      updateTotalPricesInDom(item, newTotalProductPrice);
    })
  })
}

// update total price in DOM

function updateTotalPricesInDom(item, newTotalProductPrice) {
  const productTotalPrice = item.closest('.js-product').querySelector('.js-product-total-price');
  const oldProductTotalPrice = Number(productTotalPrice.innerHTML);
  productTotalPrice.innerHTML = newTotalProductPrice;
  const totalPrice = document.querySelector('.js-total-price');
  const oldTotalPrice = Number(totalPrice.innerText);
  totalPrice.innerText = oldTotalPrice - oldProductTotalPrice + newTotalProductPrice;
}





// get contact form data

document.addEventListener('DOMContentLoaded', function () {

  const orderForm = document.getElementById('orderform');

  orderForm.addEventListener('submit', getOrderSubmit);


  function getOrderSubmit(event) {
    event.preventDefault();
    console.log("ORDER")

    let orderFirstName = event.target.elements.prenom.value;
    let orderLastName = event.target.elements.nom.value;
    let orderAdress = event.target.elements.adresse.value;
    let orderCity = event.target.elements.ville.value;
    let orderEmail = event.target.elements.email.value;
    let products = [];
    let orderAllInputs = []

    let orderFirstNameInput = event.target.elements.prenom;
    let orderLastNameInput = event.target.elements.nom;
    let orderAdressInput = event.target.elements.adresse;
    let orderCityInput = event.target.elements.ville;
    let orderEmailInput = event.target.elements.email;

    orderAllInputs.push(orderFirstNameInput, orderLastNameInput, orderAdressInput, orderCityInput, orderEmailInput)

    console.log("Array of all inputs in event", orderAllInputs)
    // verifies if localStorage data is type string
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);

      let value = JSON.parse(localStorage.getItem(key));
      console.log(key, value)

      if (typeof key === 'string') {
        console.log('Variable is a string');
        products.push(key)
      }
      else {
        console.log('Variable is not a string');
      }

      console.log("List of order product ", products)
    }

    let contact = {
      firstName: orderFirstName,
      lastName: orderLastName,
      address: orderAdress,
      city: orderCity,
      email: orderEmail
    }

    console.log(contact)
    // verifies if form data is type string
    if (typeof contact.firstName === 'string' || typeof contact.lastName === 'string' || typeof contact.address === 'string' || typeof contact.city === 'string' || typeof contact.email === 'string') {
      console.log('Contact is a string');
      // if true call the function to validate inputs and send order to api
      validateInputsSendOrder(orderAllInputs, contact, products)
    }
    else {
      console.log('Variable is not a string');
    }
  }
})

// validate Inputs and send order to api

function validateInputsSendOrder(orderAllInputs, contact, products) {
  console.log("products na funcao", products)
  let valid = true;
  for (let i = 0; i < orderAllInputs.length; i++) {

    valid &= orderAllInputs[i].reportValidity();
    if (!valid) {
      break;
    }
  }
  if (valid) {
    
    fetch("http://localhost:3000/api/furniture/order", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contact, products })
    })
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (orderValue) {
        console.log(orderValue);

        orderTotalPrice = document.getElementById("ordertotalprice").innerText;
        localStorage.clear();


        let orderValueWithTotal = { orderValue, orderTotalPrice }
        console.log("OrDer ValUe wiTh ToTal", orderValueWithTotal)
        setOrderInLocalStorage(orderValueWithTotal);
       

      })

  }

}

// Sends api result + total price to local storage and opens order confirmation page
function setOrderInLocalStorage(orderValueWithTotal) {

  localStorage.setItem("order", JSON.stringify(orderValueWithTotal));
  window.location = "commande.html";

}

// Creates html content of order confirmation page

document.addEventListener("DOMContentLoaded", function orderConfirmationPage() {

  if (document.querySelector('.commandepage') && localStorage.getItem("order") == null) {
    window.location = "index.html";
  } else {
    let orderConfirmation = document.getElementById("orderconfirmation")
    let orderInLocalStorage = JSON.parse(localStorage.getItem("order"));
    console.log("Order in local storage", orderInLocalStorage)
    orderConfirmation.innerHTML = `<p class="m-5" id="orderconfirmationparagraph">Félicitations <strong>${orderInLocalStorage.orderValue.contact.firstName} ${orderInLocalStorage.orderValue.contact.lastName}</strong>, vous avez passez une commande avec l'identifiant ${orderInLocalStorage.orderValue.orderId} et un prix total de ${orderInLocalStorage.orderTotalPrice}€.</p><div class="mt-5 text-center orderconfirmationmargin"><a href="index.html"><button type="button" class="btn btn-success m-5">Retour à l'accueil</button></a></div>`
    localStorage.clear();
  }
});




