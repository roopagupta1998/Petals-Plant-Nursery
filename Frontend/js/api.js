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