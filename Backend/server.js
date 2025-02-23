const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');


// Initialize App
const app = express();
// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://172.17.0.2:27017/PetalsPlants')
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB Connection Failed:', err));

// Import Models
const User = require('./models/user');
const Category = require('./models/category');
const Product = require('./models/product');
const Cart = require('./models/cart');
const Order = require('./models/order');

// Signup Route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
  
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Create new User
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
  
    res.status(201).json({ message: 'User created successfully' });
  });

  // Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  
    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ 
      message: 'Login successful',
      data: { 
          _id: user._id, // Assuming MongoDB is used
          email: email,
          name:user.name 
      } 
  });  });
  

  // Get All Products
app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add New Product
app.post('/products', async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });


  app.post('/add-to-cart', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Verify if user exists using _id from MongoDB
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'Invalid user' });
        }

        // Verify if product exists using its _id
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ message: 'Invalid product' });
        }

        // Check if the cart for the user already exists
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // If product already exists in cart, update the quantity
            let existingProduct = cart.items.find(item => item.productId.toString() === productId);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                // If product doesn't exist, add new item to the cart
                cart.items.push({ productId, quantity });
            }
            await cart.save();
        } else {
            // Create a new cart for the user
            cart = new Cart({
                userId,
                items: [{ productId, quantity }]
            });
            await cart.save();
        }

        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// ================== Start Server ==================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})