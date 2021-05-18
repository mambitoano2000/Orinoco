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
  .then(function(value) {
    console.log(value);
 if (type === 'teddies') {
    document
        .getElementById(productCard)
         productCard.innerHTML = `<ul><li>${value.name}</li><li>tedizinhos</li></ul>`
 
 }

else if (type === 'cameras') {
   document
       .getElementById(productCard)
        productCard.innerHTML = `<ul><li>${value.name}</li><li>camerazinhas</li></ul>`

}  


else if (type === 'furniture') {
    document
        .getElementById(productCard)
        productCard.innerHTML = `<ul><li>${value.name}</li><li>moveizinhos</li></ul>`
  
}
  })

  .catch(function(err) {
    // Une erreur est survenue
  })



