const API_BASE_URL = "http://localhost:3000";

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  return response.json();
}

export async function fetchProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  return response.json();
}

export async function fetchCart() {
  const response = await fetch(`${API_BASE_URL}/cart`);
  return response.json();
}

export async function addToCart(productId, quantity,userId) {
  const response = await fetch(`${API_BASE_URL}/addToCart`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity,userId })
  });
  if (!response.ok) {
    console.error("❌ Failed to sync with backend:",response);
}
  return response.json();
}

// In api.js
export async function clearCartFromBackend(userId) {
  await fetch(`${API_BASE_URL}/clearCart`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId: userId })
});

}
export async function fetchCartFromBackend(userId) {
  const response = await fetch(`${API_BASE_URL}/fetchCart`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
  });

  if (!response.ok) {
      console.error('Error fetching cart:', response.statusText);
      return [];
  }

  return await response.json();
}

export async function fetchOrders() {
  const response = await fetch(`${API_BASE_URL}/orders`);
  return response.json();
}

export async function adjustCartQuantity(userId, productId, change) {
  const response = await fetch(`${API_BASE_URL}/adjustQuantity`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          userId,
          productId,
          change
      })
  });
  if (!response.ok) {
      throw new Error('Failed to adjust quantity.');
  }
  return response.json();
}

export async function fetchProductById(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

export async function placeOrder(orderDetails) {
  const response = await fetch(`${API_BASE_URL}/order`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderDetails)
  });
  if (!response.ok) {
    console.error("❌ n error occurred while placing the order",response);
}
  return response.json();
}

export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/users`);
  return response.json();
}

export async function addUser(userDetails) {
  const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails)
  });
  const data = await response.json();
  if (!response.ok) {
    console.error("❌ n error occurred while adding user",response);
    alert(data.message || "Failed to register user.");
}
  return data;
}

export async function deleteUser(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      }
  });
  const data = await response.json();

  if (!response.ok) {
      console.error("❌ An error occurred while deleting the user", response);
      alert(data.message || "Failed to register user.");
  }

  return data;
}

export async function updateUser(userId, userDetails) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails)
  });
  const data = await response.json();
  debugger
  if (!response.ok) {
      console.error("❌ An error occurred while updating the user", response);
      alert(data.message || "Failed to register user.");
  }

  return data;
}
export async function getOrderHistory (userId) {
  const response = await fetch(`${API_BASE_URL}/order_history/${userId}`);
  return response.json();
}

export async function addProduct(productData) {
  const response = await fetch(`${API_BASE_URL}/add_products`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
  });

  if (!response.ok) {
      console.error("❌ An error occurred while adding the product", response);
      throw new Error('Failed to add product');
  }

  return response.json();
}

