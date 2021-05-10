// 1 + 1 = 2
// 2 + 2 = 4 

function sumValues(value1, value2) {
  return value1 + value2;
}

// Build  columns function

function buildColsForProductType(value, row){
  let cols = document.getElementById(row)

  for (let i = 0; i < value.length; i++){
    let col = `<div class="col">
                        <div class="card">
                         <div class="card-body">
                         <img src="${value[i].imageUrl}">  
                        <h5 class="card-title" >${value[i].name}</h5>
                       </div>
                       </div>
                       </div>`
    cols.innerHTML += col                

  }
}



// Get API products
function fetchProducts(typeOfProduct, row) {
  fetch(typeOfProduct)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    console.log(value);
    buildColsForProductType(value, row);
  
  })
  .catch(function(err) {
    // Une erreur est survenue
  });
}

fetchProducts('http://localhost:3000/api/furniture/', 'meublesRow');
fetchProducts('http://localhost:3000/api/teddies/','teddiesRow' );
fetchProducts('http://localhost:3000/api/cameras','camerasRow' );













