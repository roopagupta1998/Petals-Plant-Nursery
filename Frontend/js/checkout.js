import { placeOrder} from "../js/api.js";

document.addEventListener("DOMContentLoaded", function () {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
        alert("You are not logged in.");
        return; // Exit if not logged in
    }
    const userId = user._id;

    // Get cart for the logged-in user
    const cartKey = `cart_${user._id}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    console.log("cartcartcartcart", cart);

    // Initialize variables
    let totalItems = 0;
    let totalPrice = 0;
    let discount = 0;
    let platformFee = 3;
    let deliveryCharges = 30;

    // Calculate Total Items and Total Price
    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    // Calculate Discount as 5%
    discount = totalPrice * 0.05;

    // Calculate Total Amount
    let totalAmount = totalPrice - discount + platformFee + deliveryCharges;

    // Update UI
    document.getElementById("totalItems").textContent = totalItems;
    document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);
    document.getElementById("discount").textContent = discount.toFixed(2);
    document.getElementById("platformFee").textContent = platformFee;
    document.getElementById("deliveryCharges").textContent = deliveryCharges;
    document.getElementById("totalAmount").textContent = totalAmount.toFixed(2);

    // Place Order Button Click
    document.getElementById("placeOrderBtn").addEventListener("click", async function () {
        const fullName = document.getElementById("fullName").value.trim();
        const address = document.getElementById("address").value.trim();
        const shippingAddress = document.getElementById("shippingAddress").value.trim();

        // Check for required fields
        if (!fullName || !address || !shippingAddress) {
            alert("Please fill out all the required fields.");
            return;
        }

        if (confirm("Are you sure you want to place the order?")) {
            // Create order details object
            const orderDetails = {
                userId,
                fullName,
                address,
                shippingAddress,
                totalItems,
                totalPrice,
                discount,
                platformFee,
                deliveryCharges,
                totalAmount,
                items: cart
            };

            // Call the backend API to place the order
            try {
                const result = await placeOrder(orderDetails);
                if (result) {
                    // Get existing order history or initialize as empty array
                    let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
                    
                    // Add new order to history
                    orderHistory.push(orderDetails);
                    
                    // Save updated order history to localStorage
                    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
                    
                    // Clear the cart
                    localStorage.removeItem(cartKey);
            
                    // Redirect to Order Confirmation Page
                    window.location.href = "order-confirmation.html";
                } else {
                    alert("Failed to place order. Please try again.");
                }
            } catch (error) {
                console.error("Error placing order:", error);
                alert("An error occurred. Please try again later.");
            }
            
        
        }
    });
});

