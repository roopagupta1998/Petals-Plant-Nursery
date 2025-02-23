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
      return res.status(400).json({ message: 'Invalid credentials',data:{...req.body} });
    }

    res.status(200).json({ message: 'Login successful' });
  });
  

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

// ================== Start Server ==================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})