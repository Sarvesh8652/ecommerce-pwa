const products = [
  { id: 1, name: "Wireless Headphones", price: "$49" },
  { id: 2, name: "Leather Wallet",      price: "$29" },
  { id: 3, name: "Running Shoes",       price: "$89" },
];

const container = document.getElementById("products");
products.forEach(p => {
  container.innerHTML += `
    <div class="card">
      <h3>${p.name}</h3>
      <p>${p.price}</p>
      <button onclick="alert('Added: ${p.name}')">Add to Cart</button>
    </div>`;
});

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("SW registered"))
    .catch(err => console.error("SW error:", err));
}