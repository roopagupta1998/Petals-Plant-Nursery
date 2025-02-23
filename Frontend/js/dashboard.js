import { fetchProducts} from "../js/api.js";
import { handleLogoutButton } from "../js/logout.js";

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const welcomeMessage = document.getElementById("welcomeMessage");

  welcomeMessage.textContent = user && user.name 
      ? `Welcome back, ${user.name}!` 
      : "Welcome to Petals Plant Nursery!";
      
  await loadAllProducts(); // Load all products initially
  await handleLogoutButton()
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

  function getUserCartKey() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? `cart_${user._id}` : 'tempCart';
  }

  const cartKey = getUserCartKey();

  // ✅ Ensure cart is always an array
  let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  if (!Array.isArray(cart)) {
    cart = [];
  }
  
  products.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    // ✅ Use productId instead of _id to check if product is in cart
    const isInCart = cart.some(item => item.productId === product._id);

    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p class="description">${product.description}</p>
      <p class="category">Category: ${product.categoryName}</p>
      <p class="price">₹${product.price}</p>
      <button class="add-to-cart" data-id="${product._id}">
        ${isInCart ? "View Cart" : "Add to Cart"}
      </button>
    `;

    container.appendChild(productDiv);

    // Attach event listener for the button
    const button = productDiv.querySelector(".add-to-cart");

    if (isInCart) {
      // 🔹 If already in cart, clicking should directly go to cart page
      button.onclick = function () {
        window.location.href = "/Frontend/pages/cart.html";
      };
    } else {
      // 🔹 If not in cart, clicking should add the product
      button.addEventListener("click", function () {
        addToCart(product, button, '/Frontend/pages/cart.html');
      });
    }
  });
}




    // // 🔹 Logout Function
    // const logoutBtn = document.getElementById("logoutBtn");
    // if (logoutBtn) {
    //     logoutBtn.addEventListener("click", function () {
    //         localStorage.removeItem("user");
    //         window.location.href = "login.html";
    //     });
    // }