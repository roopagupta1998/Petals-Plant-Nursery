import { fetchProducts } from "../js/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadPlants(); // Fetch and display only plants on page load

  // Search event listener
  // document.querySelector(".search-input").addEventListener("input", async function () {
  //   const query = this.value.trim().toLowerCase();
  //   await fetchAndRenderPlants(query);
  // });
});

// Function to fetch and display only plant products
async function loadPlants() {
  const products = await fetchProducts();
  const plants = products.filter(product => product.categoryName === "Seeds");
  renderProducts(plants);
}

// Function to fetch and display searched plant products
async function fetchAndRenderPlants(query = "") {
  const products = await fetchProducts();
  const filteredPlants = products.filter(product =>
    product.categoryName === "Soil & Fertilizers" && 
    (product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query))
  );
  renderProducts(filteredPlants);
}

// Function to render products on the page
function renderProducts(products) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML = "<p>No plants available.</p>";
    return;
  }

  products.forEach(product => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p class="description">${product.description}</p>
      <p class="price">${product.price}</p>
      <button class="add-to-cart" data-name="${product.name}">Add to Cart</button>
    `;
    container.appendChild(productDiv);
  });

     // Re-attach event listeners after rendering
     document.querySelectorAll(".add-to-cart").forEach(button => {
      button.addEventListener("click", function () {
          let productName = this.getAttribute("data-name");
          addToCart(productName);
      });
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
