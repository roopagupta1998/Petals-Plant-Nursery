import { fetchProducts } from "../js/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadAllProducts(); // Load all products initially

  document.querySelector(".search-input").addEventListener("input", async function () {
    const query = this.value.trim().toLowerCase();
    await fetchAndRenderAllProducts(query);
  });
});

// Function to load all products initially
async function loadAllProducts() {
  const products = await fetchProducts();
  renderProducts(products);
}

// Function to fetch and display searched products globally
async function fetchAndRenderAllProducts(query = "") {
  const products = await fetchProducts();
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query) || 
    product.description.toLowerCase().includes(query) ||
    product.categoryName.toLowerCase().includes(query) // Search includes category names
  );

  renderProducts(filteredProducts);
}

// Function to render products dynamically
function renderProducts(products) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML = "<p>No products available.</p>";
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  products.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    const isInCart = cart.some(item => item.id === product.id);

    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p class="description">${product.description}</p>
      <p class="category">Category: ${product.categoryName}</p>
      <p class="price">₹${product.price}</p>
      <button class="add-to-cart" data-id="${product.id}">
        ${isInCart ? "View Cart" : "Add to Cart"}
      </button>
    `;

    container.appendChild(productDiv);

    // Attach event listener for the button
    const button = productDiv.querySelector(".add-to-cart");

    if (isInCart) {
      // 🔹 If already in cart, clicking should directly go to cart page
      button.onclick = function () {
        window.location.href = "cart.html";
      };
    } else {
      // 🔹 If not in cart, clicking should add the product
      button.addEventListener("click", function () {
        addToCart(product, button,'/Frontend/pages/cart.html');
      });
    }
  });
}



    // 🔹 Logout Function
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });
    }