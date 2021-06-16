// Build  columns function
function buildColsForProductType(value, optionType, productType, row) {
  let cols = document.getElementById(row)

  for (let i = 0; i < value.length; i++) {
    let col = `<div class="col-sm-12 col-lg-6 mb-4">
    <a href="/product.html?option=${optionType}&type=${productType}&id=${value[i]._id}"><div class="card h-100">
                         <div class="card-body">
                         <img src="${value[i].imageUrl}" class="card-img-top">  
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
      optionType.textContent = "Choisissez votre vernis:";
      buildInputForOptionsInput(productValue, 'varnish');

    }

    // Function to create options input

    function buildInputForOptionsInput(value, type) {
      let optionsSelect = document.getElementById('optionsselect')
      console.log("type: ", type);
      let options = value[type]
      for (let i = 0; i < options.length; i++) {
        console.log("log options: ", value);
        let selectOption = `<option value="${options[i]}">${options[i]}</option>`
        optionsSelect.innerHTML += selectOption;

      }
    }

    // Create quantity and submit btn
    document
      .getElementById(optionForm);
    let quantityAndSubmitBtns = `<label  for="quantity">Quantité:</label>
           <input type="number" id="productQuantity" name="quantity" required  value="1" min="1"  placeholder="1"><br><div class="text-center"><button type="submit" id="addToCart" class="btn btn-primary mt-5">Ajouter au panier</button></div>`;
    optionForm.innerHTML += quantityAndSubmitBtns;



    function logSubmit(event) {
      event.preventDefault();
      console.log('SUBMIT!!!')
      console.log(event.target.elements);
      //console.log(event.target.elements.productoptions.value);
      console.log(event.target.elements.quantity.value);

      let productQuantity = event.target.elements.quantity.value;
      //let productOptions = event.target.elements.productoptions.value;



      let selectedProperties = {
        quantity: productQuantity,
        //options: productOptions,
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
      let cartCardData = `<div class=" col m-3 d-flex flex-column flex-md-row justify-content-md-between align-items-center js-product" id="${value._id}"><img src="${value.imageUrl}" class="img-products m-3"> <p class="m-0">${value.name}</p> <form id="orderFormQuantity"><label  class="m-3" for="quantity">Quantité:</label>
      <input type="number"  name="quantity" class="quantityInput m-3" value="${value.quantity}"  required data-productdataid="${value._id}" min="1"  placeholder="${value.quantity}"></form> <p class="totalpriceparagraph" data-productdataparagraphid="${value._id}">Prix: <span class="js-product-total-price">${totalSingleProductPrice}</span>€</p>      <button type="button" data-productdataid="${value._id}"class="btn btn-labeled btn-danger btn-supprimer-produit m-3">
      Effacer</button> </div>`;
      cartCard.innerHTML += cartCardData;
      // create total price div
      let totalPriceDiv = document.getElementById('totalpricediv');
      let totalPriceParagraph = `<div class="d-flex  justify-content-center justify-content-md-end"><p>Prix Total: <span id="ordertotalprice" class="js-total-price">${totalPrice}</span>€</p></div>`;
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
   totalPriceDivEmpty.innerHTML = `<div class="text-center emptycartmargin"><p>Votre panier est vide.</p><a href="index.html"><button type="button" class="btn btn-success m-5">Retour à l'accueil</button></a></div>`;
     /*const createP = document.createElement("P");
    createP.classList.add('text-center');
    createP.classList.add('emptycartmargin');
    const createText = document.createTextNode("Votre panier est vide.");
    createP.appendChild(createText);
    totalPriceDivEmpty.appendChild(createP);*/
  } else {
    orderDiv = document.getElementById('order')
    orderDiv.innerHTML = `<div class="d-flex flex-column px-md-5"><label  for="prenom">Prénom</label><br><input  id="prenom" pattern="[A-Za-z]+" type="text" required></input></div><div class="d-flex flex-column px-md-5"><label for="nom">Nom</label><br><input id="nom" pattern="[A-Za-z]+" type="text" required></input></div><div class="d-flex flex-column px-md-5"><label for="adresse">Adresse</label><br><input id="adresse" type="text" required></input></div><div class="d-flex flex-column px-md-5"><label for="ville">Ville</label><br><input id="ville" pattern="[A-Za-z]+" type="text" required></input></div><div class="d-flex flex-column px-md-5"><label for="email" required>Email</label><br><input id="email" type="email"></input></div><br><div class="text-center"><button type="submit" id="btnorder" class="btn btn-success">Commander</button></div>`;
  }
}




// submit command

document.addEventListener('DOMContentLoaded', function () {

  const orderForm = document.getElementById('orderform');
  
  orderForm.addEventListener('submit', logOrderSubmit);
 

  function logOrderSubmit(event) {
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



    //let orderTotalPrice = document.getElementById("ordertotalprice").innerText;

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

    if (typeof contact.firstName === 'string' || typeof contact.lastName === 'string' || typeof contact.address === 'string' || typeof contact.city === 'string' || typeof contact.email === 'string') {
      console.log('Contact is a string');
      validateInputs(orderAllInputs, contact, products)
    }
    else {
      console.log('Variable is not a string');
    }



    
  }
})

// validate Inputs 

function validateInputs(orderAllInputs, contact, products) {
  console.log("products na funcao", products)
  let valid = true;
  for (let i = 0; i < orderAllInputs.length; i++) {

    valid &= orderAllInputs[i].reportValidity();
    if (!valid) {
      break;
    }
  }
  if (valid) {
    //alert("Votre commande a été faite.");
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
        //window.location = "commande.html";

        orderTotalPrice = document.getElementById("ordertotalprice").innerText;
        localStorage.clear();


        let orderValueWithTotal = {orderValue, orderTotalPrice}
        console.log( "OrDer ValUe wiTh ToTal", orderValueWithTotal)
        setOrderInLocalStorage(orderValueWithTotal);
        window.location = "commande.html";

      })

  }

}

function setOrderInLocalStorage(orderValueWithTotal) {

  localStorage.setItem("order", JSON.stringify(orderValueWithTotal));
  //let orderInLocalStorage = JSON.parse(localStorage.getItem("order"));
 // console.log("Order in local storage", orderInLocalStorage)
  


}
 
// Create order page

document.addEventListener("DOMContentLoaded", function () {

  if(document.querySelector('.commandepage') && localStorage.getItem("order") == null) {
    window.location = "index.html";
  } else {
    let orderConfirmation = document.getElementById("orderconfirmation")
    let orderInLocalStorage = JSON.parse(localStorage.getItem("order"));
  console.log("Order in local storage", orderInLocalStorage)
  orderConfirmation.innerHTML = `<p class="m-5" id="orderconfirmationparagraph">Félicitations <strong>${orderInLocalStorage.orderValue.contact.firstName} ${orderInLocalStorage.orderValue.contact.lastName}</strong>, vous avez passez une commande avec l'identifiant ${orderInLocalStorage.orderValue.orderId} et un prix total de ${orderInLocalStorage.orderTotalPrice}€.</p><div class="mt-5 text-center orderconfirmationmargin"><a href="index.html"><button type="button" class="btn btn-success m-5">Retour à l'accueil</button></a></div>`
  localStorage.clear();
 
  }


 
 
});




