import  {addProduct}  from "../js/api.js";

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    // Input validations
    const name = document.querySelector('#product-name').value.trim();
    const price = document.querySelector('#price').value;
    const image = document.querySelector('#image').value.trim(); // Get URL directly as text
    const description = document.querySelector('#description').value.trim();
    const categoryName = document.querySelector('#categoryName').value;

    if (!name || name.length < 3) {
        alert('Product name must be at least 3 characters long.');
        return;
    }
    
    if (!price || price <= 0) {
        alert('Price must be a positive number.');
        return;
    }

    if (!image || !isValidURL(image)) {
        alert('Please enter a valid image URL.');
        return;
    }
    
    const validCategories = ['Plants', 'Accessories', 'Seeds', 'Soil & Fertilizers', 'Featured Plants'];
    if (!validCategories.includes(categoryName)) {
        alert('Invalid category selected.');
        return;
    }

    const productData = {
        name,
        price,
        image,
        description,
        categoryName
    };

    try {
        const response = await addProduct(productData);

        if (response) {
            alert('Product added successfully!');
            document.querySelector('form').reset();
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Failed to add product.');
    }
});

// URL validation function
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cancel-btn').addEventListener('click', () => {
        window.location.href = '/Frontend/pages/dashboard.html';    });
});
