// Api meubles product 0 fetch:

function askHello() {
    fetch("http://localhost:3000/api/furniture/5be9cc611c9d440000c1421e")
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
      document
          .getElementById("meubles0")
          .innerText = value.queryString.name;
    })
    .catch(function(err) {
      // Une erreur est survenue
    });
  }
  

   