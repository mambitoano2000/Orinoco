// Build  columns function
function buildColsForProductType(value, optionType, productType, row) {
  let cols = document.getElementById(row)

  for (let i = 0; i < value.length; i++) {
    let col = `<div class="col">
    <a href="/product.html?option=${optionType}&type=${productType}&id=${value[i]._id}"><div class="card">
                         <div class="card-body">
                         <img src="${value[i].imageUrl}" class="img-fluid">  
                        <h5 class="card-title" >${value[i].name}</h5>
                       </div>
                       </div></a>
                       </div>`
    cols.innerHTML += col

  }
}

// Get API products
function fetchProducts(url, optionType, productType, row) {
  fetch(url)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (value) {
      console.log(value);
      buildColsForProductType(value, optionType, productType, row);

    })
    .catch(function (err) {
      // Une erreur est survenue
    });
}

// Calling fetch function to catch data and create the 3 html rows of products

fetchProducts('http://localhost:3000/api/furniture/', 'varnish', 'furniture', 'meublesRow');



// product get query string

const queryProductUrlData = window.location.search;
console.log(queryProductUrlData);

// product extract query string

const params = new URLSearchParams(queryProductUrlData);

const option = params.get("option");
console.log(option);

const type = params.get("type");
console.log(type);

const id = params.get("id");
console.log(id);






//product.html fetch

fetch(`http://localhost:3000/api/${type}/${id}`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (productValue) {
    console.log(productValue);

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

    if (type === 'teddies') {
      document
        .getElementById(optionType)
      optionType.textContent = "Couleurs:";
      buildInputForOptionsInput(productValue, 'colors');

    }

    else if (type === 'cameras') {
      document
        .getElementById(optionType)
      optionType.textContent = "Lentilles:";
      buildInputForOptionsInput(productValue, 'lenses');

    }


    else if (type === 'furniture') {
      document
        .getElementById(optionType)
      optionType.textContent = "Vernis:";
      buildInputForOptionsInput(productValue, 'varnish');

    }

    // Function to create options input

    function buildInputForOptionsInput(value, type) {
      let optionForm = document.getElementById('optionForm')
      console.log("type: ", type);
      let options = value[type]
      for (let i = 0; i < options.length; i++) {
        console.log("log options: ", value);
        let inputAndLabel = `<input type="radio" name="productoptions" value="${options[i]}" ${i === 0 ? 'checked' : ''}>
    <label for="${options[i]}">${options[i]}</label><br>`
        optionForm.innerHTML += inputAndLabel

      }
    }

    // Create quantity and submit btn
    document
      .getElementById(optionForm);
    let quantityAndSubmitBtns = `<label for="quantity">Quantité:</label>
           <input type="number" id="productQuantity" name="quantity"  value="1" min="1"  placeholder="1"><br><button type="submit" id="addToCart" class="btn btn-primary mt-3">Ajouter au panier</button>`;
    optionForm.innerHTML += quantityAndSubmitBtns;



    function logSubmit(event) {
      event.preventDefault();
      console.log('SUBMIT!!!')
      console.log(event.target.elements);
      console.log(event.target.elements.productoptions.value);
      console.log(event.target.elements.quantity.value);

      let productQuantity = event.target.elements.quantity.value;
      let productOptions = event.target.elements.productoptions.value;



      let selectedProperties = {
        quantity: productQuantity,
        options: productOptions,
      }
      sendProductToLocalStorage(productValue, selectedProperties);

    }

    const form = document.getElementById('optionForm');
    form.addEventListener('submit', logSubmit);


  })

  .catch(function (err) {
    // Une erreur est survenue
  })




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


  } else {
    localStorage.setItem(product._id, JSON.stringify(itemToSave));
    alert("Produit/Produits ajoutés au panier.");

  }

  console.log("local storage: ", localStorage);
}



// get localStorage products
document.addEventListener('DOMContentLoaded', function () {
  function getLocalStorageItems(localStorage) {
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
      let cartCardData = `<div class="m-3 d-flex align-items-center justify-content-between js-product" id="${value._id}"><img src="${value.imageUrl}" class="img-fluid"> <p>${value.name}</p> <form><label for="quantity">Quantité:</label>
      <input type="number"  name="quantity" class="quantityInput" value="${value.quantity}" data-productdataid="${value._id}" min="1"  placeholder="${value.quantity}"></form> <p class="totalpriceparagraph" data-productdataparagraphid="${value._id}">Prix: <span class="js-product-total-price">${totalSingleProductPrice}</span>€</p>      <button type="button" data-productdataid="${value._id}"class="btn btn-labeled btn-danger btn-supprimer-produit">
      Effacer</button> </div>`;
      cartCard.innerHTML += cartCardData;
      // create total price div
      let totalPriceDiv = document.getElementById('totalpricediv');
      let totalPriceParagraph = `<div class="d-flex justify-content-end"><p>Prix Total: <span id="ordertotalprice" class="js-total-price">${totalPrice}</span>€</p></div>`;
      totalPriceDiv.innerHTML = totalPriceParagraph;
      updateItemQuantityOnCart();
    }
  }
  getLocalStorageItems(localStorage);
  emptyCart()
  

  // delete product from cart
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
      item.parentElement.remove();
      console.log(totalPrice.innerText);
      if (totalPrice.innerText == 0) {
        totalPrice.parentElement.remove();
        emptyCart()
        orderDiv = document.getElementById('order');
        orderDiv.remove();
      }
    })
  })
}, false);


// update quantity in shopping page/localStorage

function updateItemQuantityOnCart() {
  document.querySelectorAll('.quantityInput').forEach(item => {
    item.addEventListener('input', event => {
      let changedItemQuantityValue = item.value;
      console.log(changedItemQuantityValue);
      let productId = item.dataset.productdataid;
      console.log("product id ", productId)
      let value = JSON.parse(localStorage.getItem(productId));
      console.log("product array ", value)
      value.quantity = changedItemQuantityValue;
      console.log("new quantity ", value.quantity)
      localStorage.setItem(productId, JSON.stringify(value));
      let newTotalProductPrice = value.price * changedItemQuantityValue;
      console.log("new total product price ", newTotalProductPrice)
      // let newTotalProductPriceParagraph = document.querySelectorAll(`[data-productdataparagraphid="${value._id}"]`)
      //   console.log("totalPriceParagraph", newTotalProductPriceParagraph)
      //   newTotalProductPriceParagraph[0].innerText = `Prix: ${newTotalProductPrice}€`; 

      /*const productTotalPrice = item.closest('.js-product').querySelector('.js-product-total-price');
      const oldProductTotalPrice = Number(productTotalPrice.innerHTML);
      productTotalPrice.innerHTML = newTotalProductPrice;
      const totalPrice = document.querySelector('.js-total-price');
      const oldTotalPrice = Number(totalPrice.innerText);
      totalPrice.innerText = oldTotalPrice - oldProductTotalPrice + newTotalProductPrice;*/
      updateTotalPrice(item, newTotalProductPrice);
    })
  })
}

// update total price in DOM

function updateTotalPrice(item, newTotalProductPrice) {
  const productTotalPrice = item.closest('.js-product').querySelector('.js-product-total-price');
  const oldProductTotalPrice = Number(productTotalPrice.innerHTML);
  productTotalPrice.innerHTML = newTotalProductPrice;
  const totalPrice = document.querySelector('.js-total-price');
  const oldTotalPrice = Number(totalPrice.innerText);
  totalPrice.innerText = oldTotalPrice - oldProductTotalPrice + newTotalProductPrice;
}

// empty cart message
function emptyCart() {
  if (localStorage.length === 0) {
    totalPriceDivEmpty = document.getElementById('totalpricediv');
    const createP = document.createElement("P");   
    createP.classList.add('text-center');                   
    const createText = document.createTextNode("Votre panier est vide.");    
    createP.appendChild(createText);                                           
    totalPriceDivEmpty.appendChild(createP);                               
  } else {
    orderDiv = document.getElementById('order')
    orderDiv.innerHTML = `<form id="orderform"><div><label for="prenom">Prénom</label><br><input id="prenom" pattern="[A-Za-z]+" type="text" required></input></div><div><label for="nom">Nom</label><br><input id="nom" pattern="[A-Za-z]+" type="text" required></input></div><div><label for="adresse">Adresse</label><br><input id="adresse" type="text" required></input></div><div><label for="ville">Ville</label><br><input id="ville" pattern="[A-Za-z]+" type="text" required></input></div><div><label for="email" required>Email</label><br><input id="email" type="email"></input></div><br><button type="submit" id="btnorder" class="btn btn-success">Commander</button></form>`;
  }
}




// submit command

document.addEventListener('DOMContentLoaded', function () {
  
  const orderForm = document.getElementById('orderform');
  orderForm.addEventListener('submit', logOrderSubmit);
  
  function logOrderSubmit(event) {
    event.preventDefault();
    console.log("ORDER")
    //let orderRandomNumber = Math.floor(Math.random() * 10000000000000);
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

    validateInputs(orderAllInputs)

    //let orderTotalPrice = document.getElementById("ordertotalprice").innerText;
   
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
    
      let value = JSON.parse(localStorage.getItem(key));
      console.log(key, value)
      products.push(key)
      console.log("List of order product ", products)
    }

    let contact = {
      firstName: orderFirstName,
      lastName: orderLastName,
      adress: orderAdress,
      city: orderCity,
      email: orderEmail
    }

    console.log(contact)
  }
})

// validate Inputs 

function validateInputs(orderAllInputs) {
  let valid = true;
  for (let i = 0; i < orderAllInputs.length; i++) {

    valid &= orderAllInputs[i].reportValidity();
    if(!valid){
        break;
    }
}
if(valid){
    alert("Votre commande a été faite.");
}

  }


