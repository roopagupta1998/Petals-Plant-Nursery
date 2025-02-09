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

  products.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p class="description">${product.description}</p>
      <p class="category">Category: ${product.categoryName}</p>
      <p class="price">₹${product.price}</p>
      <button class="add-to-cart" data-id="${product.id}"
    data-name="${product.name}"
    data-category="${product.category}"
    data-description="${product.description}"
    data-price="${product.price}"
    data-image="${product.image}">Add to Cart</button>
    `;
    container.appendChild(productDiv);
  });


    // Attach event listeners after loading products
    document.querySelectorAll(".add-to-cart").forEach(button => {
      button.addEventListener("click", function () {
        const product = {
          id: this.getAttribute("data-id"),
          name: this.getAttribute("data-name"),
          category: this.getAttribute("data-category"),
          description: this.getAttribute("data-description"),
          price: parseFloat(this.getAttribute("data-price")),
          image: this.getAttribute("data-image"),
          quantity: 1
        };
  
        addToCart(product);
      });
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