document.addEventListener("DOMContentLoaded", function () {
    attachAddToCartEvents();
});

// Function to add a product to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product already exists in the cart
    let existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// Function to update cart count
// function updateCartCount() {
//     let cart = JSON.parse(localStorage.getItem("cart")) || [];
//     document.querySelector(".quantity").textContent = cart.length;
// }
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartCountElement = document.querySelector(".quantity");

    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// Attach "Add to Cart" button functionality dynamically
function attachAddToCartEvents() {
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

// Make addToCart globally accessible
window.addToCart = addToCart;
