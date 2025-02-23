import { addToCart,clearCartFromBackend,adjustCartQuantity,fetchCartFromBackend,fetchProductById} from "../js/api.js";

document.addEventListener("DOMContentLoaded", function () {
        updateCartQuantity(); // On page load, update the cart quantity

    initializeCart();

    let checkoutButton = document.getElementById("checkout-button");

    if (checkoutButton) {
        checkoutButton.addEventListener("click", function () {
            proceedToCheckout();
        });
    }
});

function proceedToCheckout() {
    const isLoggedIn = Boolean(localStorage.getItem("user")); // Example check
    if (!isLoggedIn) {
        const confirmLogin = confirm("You are not logged in. Please login to proceed.");
        if (confirmLogin) {
            window.location.href = "login.html";
        }
    } else {
        window.location.href = "checkout.html";
       
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

function isUserLoggedIn() {
    const user = localStorage.getItem('user');
    return user && JSON.parse(user)._id;
}

function getUserCartKey() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? `cart_${user._id}` : 'tempCart';
}

// Function to add an item to the cart
window.addToCart = async function (product, buttonElement, pathToRedirect) {
    const cartKey = getUserCartKey();
    let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    if (!Array.isArray(cart)) {
      cart = [];
    }
        const isLoggedIn = isUserLoggedIn();

    // Check if the product already exists in the cart
    let existingProduct = cart.find(item => item._id === product._id);
    if (!existingProduct) {
        product.quantity = 1;
        cart.push(product);
        alert(`${product.name} added to cart!`);
    } else {
        existingProduct.quantity += 1;
    }

    // Save to localStorage
    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartUI();
    updateCartQuantity();

    // If logged in, sync with backend
    if (isLoggedIn) {
        try {
            const response = await addToCart(product._id, product.quantity,isLoggedIn);
       
        } catch (error) {
            console.error("❌ Error in addToCart:", error);
        }
    }

// Update the button to "View Cart"
    // 🔹 Directly Update the Button to "View Cart" **Immediately**
    if (buttonElement) {
        buttonElement.textContent = "View Cart";
        buttonElement.onclick = function () {
            window.location.href = pathToRedirect; // Redirect to cart page
        };
    }

};

// Function to update the cart UI
function updateCartUI() {
    const cartKey = getUserCartKey(); // Get cart key based on user login status
    let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    if (!Array.isArray(cart)) {
      cart = [];
    }
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
                <button class="quantity-decrease" data-id="${item._id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-increase" data-id="${item._id}">+</button>
            </div>
            <p class="product-price">₹${item.price * item.quantity}</p>
        `;
        cartContainer.appendChild(itemDiv);

        total += item.price * item.quantity;
    });

    totalPriceElement.innerText = `Total: ₹${total}`;
    checkoutButton.disabled = false;

    attachQuantityEvents(); // Attach event listeners to quantity buttons
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

// Helper function to fetch product details by productId
async function fetchProductDetailsById(productId) {
    try {
        const response = await fetchProductById(productId);
        
        return response;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
}

// Adjust the quantity of a product in the cart
async function adjustQuantity(productId, change) {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user._id : null;
    const cartKey = userId ? `cart_${userId}` : 'tempCart';
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (userId) {
        // For logged-in users, call backend API
        try {
            const response = await adjustCartQuantity(userId, productId, change);
            console.log("Backend response:", response);

            if (response && response.cart && response.cart.items) {
                // 🔹 Fetch detailed product data for each item
                const detailedCart = await Promise.all(response.cart.items.map(async (item) => {
                    const productDetails = await fetchProductDetailsById(item.productId);
                    if (productDetails) {
                        // Merge product details with quantity
                        return {
                            ...productDetails,
                            quantity: item.quantity
                        };
                    } else {
                        console.error('Product details not found:', item.productId);
                        return item;
                    }
                }));

                // 🔹 Update local storage with detailed cart data
                localStorage.setItem(cartKey, JSON.stringify(detailedCart));

                // 🔹 Refresh UI after updating local storage
                updateCartUI();
                updateCartQuantity();
            } else {
                console.error("❌ Failed to get updated cart from backend.");
            }
        } catch (error) {
            console.error('Error adjusting quantity:', error);
        }
    } else {
        // 🔹 For non-logged-in users, update localStorage directly
        let product = cart.find(item => item._id === productId);

        if (product) {
            product.quantity += change;

            // Remove item if quantity is 0 or less
            if (product.quantity <= 0) {
                cart = cart.filter(item => item._id !== productId);
            }
        }

        // 🔹 Update local storage
        localStorage.setItem(cartKey, JSON.stringify(cart));

        // 🔹 Refresh UI
        updateCartUI();
        updateCartQuantity();
    }
}

// Function to update the cart quantity (the number of items in the cart)
async function updateCartQuantity() {
    const user = JSON.parse(localStorage.getItem('user'));
    const cartKey = getUserCartKey(); // Get cart key based on user login status
    let cart = [];

    if (user) {
        // If user is logged in, fetch cart from backend
        try {
            const cartData = await fetchCartFromBackend(user._id);
            console.log("cartData",cartData)
            if (cartData && cartData.items) {
                cart = cartData.items;
                localStorage.setItem(cartKey, JSON.stringify(cart)); // Sync with localStorage
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    } else {
        // If not logged in, use localStorage cart
        cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    }

    // Calculate total quantity of all items
    let cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);

    // Select the cart quantity indicator (e.g., the cart icon badge)
    let quantityElements = document.querySelectorAll('.cart-quantity');

    // Update each element with the total cart quantity
    quantityElements.forEach(element => {
        element.textContent = cartQuantity > 0 ? cartQuantity : ""; // Show quantity or nothing if empty
    });
}

// Function to clear the cart
window.clearCart = function () {
    const cartKey = getUserCartKey();

    // Clear the specific cart from localStorage
    localStorage.removeItem(cartKey);

    // Update UI
    updateCartUI();
    updateCartQuantity();
    const userId = isUserLoggedIn();

    // If the user is logged in, also clear the backend cart
    if (cartKey.startsWith('cart_')) {
        clearCartFromBackend(userId)
            .then(() => console.log('Backend cart cleared.'))
            .catch(error => console.error('Error clearing backend cart:', error));
    }
};


