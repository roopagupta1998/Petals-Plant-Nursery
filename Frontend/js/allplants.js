import { fetchProducts } from "../js/api.js";
import { handleLogoutButton } from "../js/logout.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadPlants(); // Fetch and display only plants on page load
  await handleLogoutButton()
});

// Function to fetch and display only plant products
async function loadPlants() {
  const products = await fetchProducts();
  const plants = products.filter(product => product.categoryName === "Plants");
  renderProducts(plants);
}

// Function to fetch and display searched plant products
async function fetchAndRenderPlants(query = "") {
  const products = await fetchProducts();
  const filteredPlants = products.filter(product =>
    product.categoryName === "Plants" && 
    (product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query))
  );
  renderProducts(filteredPlants);
}

// Function to render plants on the page
function renderProducts(products) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML = "<p>No plants available.</p>";
    return;
  }

  function getUserCartKey() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? `cart_${user._id}` : 'tempCart';
}

const cartKey = getUserCartKey();

let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
if (!Array.isArray(cart)) {
  cart = [];
}

  products.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    // ✅ Check if product is already in the cart
    const isInCart = cart.some(item => item._id === product._id);

    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p class="description">${product.description}</p>
      <p class="price">₹${product.price}</p>
      <button class="add-to-cart" data-id="${product._id}">
        ${isInCart ? "View Cart" : "Add to Cart"}
      </button>
    `;

    container.appendChild(productDiv);

    // ✅ Attach event listener
    const button = productDiv.querySelector(".add-to-cart");
    
    // ✅ If already in cart, make the button redirect immediately
    if (isInCart) {
      button.onclick = function () {
        window.location.href = "/Frontend/pages/cart.html";  // ✅ Redirect instantly
      };
    } else {
      button.addEventListener("click", function () {
        window.addToCart(product, button,'/Frontend/pages/cart.html');
      });
    }
  });
}

