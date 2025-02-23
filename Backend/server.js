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

  app.post('/addToCart', async (req, res) => {
    const { productId, quantity,userId } = req.body;
    // Check if required fields are present
    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Product ID and quantity are required.' });
    }

    try {
        // Find cart for the user
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Check if product already exists in the cart
            const existingItem = cart.items.find(item => item.productId.toString() === productId);

            if (existingItem) {
                // Update quantity
                existingItem.quantity += quantity;
            } else {
                // Add new product to cart
                cart.items.push({ productId, quantity });
            }

            await cart.save();
            res.status(200).json(cart);
        } else {
            // Create new cart
            const newCart = new Cart({
                userId,
                items: [{ productId, quantity }]
            });

            await newCart.save();
            res.status(201).json(newCart);
        }
    } catch (error) {
        console.error('Error in addToCart:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// // Fetch Cart API
app.post('/fetchCart', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
      // Fetch cart from MongoDB by userId
      const cart = await Cart.findOne({ userId }).populate('items.productId', 'name price image');
      
      if (cart) {
          res.status(200).json({ cart });
      } else {
          res.status(404).json({ message: 'Cart not found.' });
      }
  } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});


app.post('/clearCart', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        // Find the cart by userId and clear items
        const cart = await Cart.findOne({ userId });

        if (cart) {
            cart.items = []; // Clear all items
            await cart.save();
            res.status(200).json({ message: 'Cart cleared successfully.' });
        } else {
            res.status(404).json({ message: 'Cart not found.' });
        }
    } catch (error) {
        console.error('Error in clearCart:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Adjust Quantity API
app.post('/adjustQuantity', async (req, res) => {
    const { userId, productId, change } = req.body;

    if (!userId || !productId || !change) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        // Find cart by userId
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        // Find the product in cart
        const item = cart.items.find(item => item.productId.toString() === productId);

        if (!item) {
            return res.status(404).json({ message: 'Product not found in cart.' });
        }

        // Adjust quantity
        item.quantity += change;

        // Remove item if quantity <= 0
        if (item.quantity <= 0) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        }

        await cart.save();
        res.status(200).json({ message: 'Quantity updated.', cart });
    } catch (error) {
        console.error('Error adjusting quantity:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

app.get('/products/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/order', async (req, res) => {
    const { userId, fullName, address, shippingAddress } = req.body;

    try {
        // Check if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID' });
        }

        // 1. Fetch Cart Details
        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) })
                               .populate('items.productId');
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // 2. Calculate Order Details
        let totalItems = 0;
        let totalPrice = 0;
        const platformFee = 3;
        const deliveryCharges = 30;
        const discountRate = 0.05;

        cart.items.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.productId.price * item.quantity;
        });

        const discount = totalPrice * discountRate;
        const totalAmount = totalPrice - discount + platformFee + deliveryCharges;

        // 3. Create Order
        const newOrder = new Order({
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
            items: cart.items
        });

        await newOrder.save();

        // 4. Clear Cart
        await Cart.findOneAndDelete({ userId: new mongoose.Types.ObjectId(userId) });

        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Order Placement Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ================== Start Server ==================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})