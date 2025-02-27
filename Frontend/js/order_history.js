import { getOrderHistory } from "./api.js";
document.addEventListener("DOMContentLoaded", async function () {
    const orderHistoryList = document.getElementById("orderHistoryList");
    orderHistoryList.innerHTML = "<p>Loading...</p>";

    try {
        // Get order history from the API
        console.log('Fetching order history...');
        const user = JSON.parse(localStorage.getItem("user")); // Example check
        const orderHistory = await getOrderHistory(user._id);
        console.log('Order History:', orderHistory);

        orderHistoryList.innerHTML = ""; // Clear loading text

        if (!orderHistory || orderHistory.length === 0) {
            orderHistoryList.innerHTML = "<p>No orders found.</p>";
            return;
        }

        // Display each order
// Display each order
orderHistory.forEach((order, index) => {
    const orderElement = document.createElement("div");
    orderElement.classList.add("order");
    orderElement.innerHTML = `
        <h3>Order #${index + 1}</h3>
        <p><strong>Name:</strong> ${order.fullName}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
        <p><strong>Total Items:</strong> ${order.totalItems}</p>
        <p><strong>Total Price:</strong> ₹${order.totalPrice.toFixed(2)}</p>
        <p><strong>Discount:</strong> ₹${order.discount.toFixed(2)}</p>
        <p><strong>Platform Fee:</strong> ₹${order.platformFee}</p>
        <p><strong>Delivery Charges:</strong> ₹${order.deliveryCharges}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount.toFixed(2)}</p>
        <h4>Items Purchased:</h4>
        <ul>
            ${order.items.map((item,i) => `
                <li>
                    <strong>Product${i+1}:</strong> ${item.productId.name} <br>
                    <strong>Quantity:</strong> ${item.quantity}
                </li>
            `).join('')}
        </ul>
    `;
    orderHistoryList.appendChild(orderElement);
});

    } catch (error) {
        orderHistoryList.innerHTML = "<p>Failed to load order history.</p>";
        console.error('Error fetching order history:', error);
    }
});
