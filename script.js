// Build  columns function

function buildColsForProductType(value, optionType, productType, row){
  let cols = document.getElementById(row)

  for (let i = 0; i < value.length; i++){
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
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    console.log(value);
    buildColsForProductType(value, optionType, productType, row);
  
  })
  .catch(function(err) {
    // Une erreur est survenue
  });
}

// Calling fetch function to catch data and create the 3 html rows of products

fetchProducts('http://localhost:3000/api/furniture/', 'varnish', 'furniture', 'meublesRow');
fetchProducts('http://localhost:3000/api/teddies/', 'colors', 'teddies', 'teddiesRow' );
fetchProducts('http://localhost:3000/api/cameras', 'lenses', 'cameras', 'camerasRow' );


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
 .then(function(res) {
   if (res.ok) {
     return res.json();
    }
  })
  .then(function(productValue) {
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
           
document
          .getElementById(productQuantityDiv);  
           productQuantityDiv.innerHTML = `<label for="quantity">Quantité:</label>
           <input type="number" id="productQuantity" name="quantity"  value="1" min="1"  placeholder="1">`; 

// document
//          .getElementById(addToCartBtn);
//          addToCartBtn.innerHTML = `<button type="button" id="addToCart" class="btn btn-primary mt-3">Ajouter au panier</button>`;            

 //let productQuantity = document.getElementById('productQuantity').value;
//console.log("product quantity: ", productQuantity); 

// Get Add to Cart button and attach click event
let btnSubmit = document.getElementById('addToCart');
btnSubmit.addEventListener('click', function() {
  // Get product data
  let productQuantity = document.getElementById('productQuantity').value;
  let selectedProperties = {
    quantity: productQuantity,
  }
  sendProductToLocalStorage(productValue, selectedProperties);
});


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
  
}})

  .catch(function(err) {
    // Une erreur est survenue
  })

// Function to create options input

function buildInputForOptionsInput(value, type){
  let optionForm = document.getElementById('optionForm')
  console.log("type: ", type);
  let options = value[type]
  for (let i = 0; i < options.length; i++){
    console.log("log options: ", value);
    let inputAndLabel = `<input type="radio" name="productoptions" value="${options[i]}" ${i === 0 ? 'checked' : ''}>
    <label for="${options[i]}">${options[i]}</label><br>`
    optionForm.innerHTML += inputAndLabel                

  }
}

// product click event

  // let btnClickEvent = document.getElementById('addToCart');
  // btnClickEvent.addEventListener('click', function() {   
    
  //    productQuantity = document.getElementById('productQuantity').value;
  //   console.log("product quantity: ", productQuantity);
  // });




  

// send product and quantity to localStorage

function sendProductToLocalStorage(product, selectedProperties) {
  console.log('product: ', product);
  console.log('selectedProperties: ', selectedProperties);
  let itemToSave = { 
    ...product,
    ...selectedProperties,
  }
  console.log('itemToSave: ', itemToSave);
  localStorage.setItem(product._id, JSON.stringify(itemToSave));
  console.log("local storage: ", localStorage);
}
