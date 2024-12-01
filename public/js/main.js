function addToCart(productId) {
    fetch(`/api/carts`, {
      method: 'POST',
      body: JSON.stringify({ productId: productId, quantity: 1 }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Producto agregado al carrito');
      } else {
        alert('Hubo un error al agregar el producto');
      }
    })
    .catch(error => console.error('Error:', error));
  }
  
  function getCart() {
    fetch('/api/carts')
      .then(response => response.json())
      .then(cart => {
        console.log(cart);
      })
      .catch(error => console.error('Error:', error));
}