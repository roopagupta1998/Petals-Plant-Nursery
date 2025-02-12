document.addEventListener("DOMContentLoaded", function () {
    initializeCart();
    let checkoutButton = document.getElementById("checkout-button");

    if (checkoutButton) {
        checkoutButton.addEventListener("click", function () {
            proceedToCheckout();
        });
    }
});

function proceedToCheckout() {
    const isLoggedIn = Boolean(localStorage.getItem("userToken")); // Example check

    if (!isLoggedIn) {
        const confirmLogin = confirm("You are not logged in. Please login to proceed.");
        if (confirmLogin) {
            window.location.href = "login.html";
        }
    } else {
        window.location.href = "cart.html";
    }
}

// Initialize the cart and update UI
function initializeCart() {
    let cartContainer = document.getElementById("cartItems");
    let checkoutButton = document.getElementById("checkout-button");
    let totalPriceElement = document.getElementById("totalPrice");

    // Check if required elements exist
    if (!cartContainer || !checkoutButton || !totalPriceElement) {
        console.error("❌ Required elements not found in DOM.");
        return;
    }

    updateCartUI();
}

// Function to add an item to the cart
window.addToCart = function (product, buttonElement,pathToRedirect) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingProduct = cart.find(item => item.id === product.id);
    if (!existingProduct) {
        product.quantity = 1;
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI(); // ✅ Update the cart UI

        alert(`${product.name} added to cart!`);
    }

    // 🔹 Directly Update the Button to "View Cart" **Immediately**
    if (buttonElement) {
        buttonElement.textContent = "View Cart";
        buttonElement.onclick = function () {
            console.log("PATJ TP REDIRC",pathToRedirect)
            window.location.href = pathToRedirect; // Redirect to cart page
        };
    }
};

// Function to update the cart UI
function updateCartUI() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cartItems");
    let checkoutButton = document.getElementById("checkout-button");
    let totalPriceElement = document.getElementById("totalPrice");

    if (!cartContainer || !checkoutButton || !totalPriceElement) {
        console.error("❌ Required elements not found in DOM. Check your HTML structure.");
        return;
    }

    cartContainer.innerHTML = ""; // Clear cart display

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty. Please add some items to proceed.</p>";
        checkoutButton.disabled = true;
        totalPriceElement.innerText = "Total: ₹0";
        return;
    }

    let total = 0;

    cart.forEach(item => {
        let itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
            <p class="product-name">${item.name}</p>
            <div class="quantity-controls">
                <button class="quantity-decrease" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-increase" data-id="${item.id}">+</button>
            </div>
            <p class="product-price">₹${item.price * item.quantity}</p>
        `;
        cartContainer.appendChild(itemDiv);

        total += item.price * item.quantity;
    });

    totalPriceElement.innerText = `Total: ₹${total}`;
    checkoutButton.disabled = false;

    attachQuantityEvents();
}

// Function to handle quantity changes
function attachQuantityEvents() {
    document.querySelectorAll(".quantity-increase").forEach(button => {
        button.addEventListener("click", function () {
            adjustQuantity(this.getAttribute("data-id"), 1);
        });
    });

    document.querySelectorAll(".quantity-decrease").forEach(button => {
        button.addEventListener("click", function () {
            adjustQuantity(this.getAttribute("data-id"), -1);
        });
    });
}

// Adjust the quantity of a product in the cart
function adjustQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = cart.find(item => item.id === productId);

    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId); // Remove item if quantity is 0
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

// Function to clear the cart
window.clearCart = function () {
    localStorage.removeItem("cart");
    updateCartUI();
};
