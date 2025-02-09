const API_BASE_URL = "http://localhost:3000";

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  return response.json();
}

export async function fetchProducts() {
  console.log("REACH")
  const response = await fetch(`${API_BASE_URL}/products`);
  return response.json();
}

export async function fetchCart() {
  const response = await fetch(`${API_BASE_URL}/cart`);
  return response.json();
}

export async function fetchOrders() {
  const response = await fetch(`${API_BASE_URL}/orders`);
  return response.json();
}
