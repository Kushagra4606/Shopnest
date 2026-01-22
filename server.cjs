const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Use the new DB Adapter
const db = require('./db.cjs');

const app = express();
const PORT = process.env.PORT || 4242;
const SECRET_KEY = process.env.SECRET_KEY || 'dev_secret';

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Initialize Database Tables
db.init();

// --- Middleware ---
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, async () => {
        try {
            const user = await db.get("SELECT role FROM users WHERE id = ?", [req.user.id]);
            if (!user || user.role !== 'admin') return res.status(403).json({ error: "Admin access required" });
            next();
        } catch (e) {
            res.sendStatus(500);
        }
    });
};

// --- API Routes ---

// Register
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    // Special Check: First admin
    const role = email.includes('admin') ? 'admin' : 'user';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, role]
        );
        const token = jwt.sign({ id: result.lastID, email, role }, SECRET_KEY, { expiresIn: '24h' });
        res.status(201).json({
            token,
            user: { id: result.lastID, name, email, role }
        });
    } catch (e) {
        console.error("Registration Error:", e);
        if (e.message && e.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Server error: ' + e.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (e) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Get Products (Public)
app.get('/api/products', async (req, res) => {
    try {
        const rows = await db.all(`SELECT * FROM products`);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- ADMIN PRODUCTS APIs ---

// Create Product
app.post('/api/products', verifyAdmin, async (req, res) => {
    const { name, description, price, image } = req.body;
    try {
        const result = await db.run(
            `INSERT INTO products (name, description, price, reviews, image) VALUES (?, ?, ?, 0, ?)`,
            [name, description, price, image]
        );
        res.json({ success: true, id: result.lastID });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update Product
app.put('/api/products/:id', verifyAdmin, async (req, res) => {
    const { name, description, price, image } = req.body;
    try {
        await db.run(
            `UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?`,
            [name, description, price, image, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Delete Product
app.delete('/api/products/:id', verifyAdmin, async (req, res) => {
    try {
        await db.run(`DELETE FROM products WHERE id = ?`, [req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get User Profile (Protected)
app.get('/api/me', verifyToken, async (req, res) => {
    try {
        const row = await db.get(`SELECT id, name, email, role FROM users WHERE id = ?`, [req.user.id]);
        if (!row) return res.sendStatus(404);
        res.json(row);
    } catch (e) {
        res.sendStatus(500);
    }
});

// --- Wishlist APIs ---

// Get Wishlist
app.get('/api/wishlist', verifyToken, async (req, res) => {
    try {
        const rows = await db.all(`
            SELECT p.*, w.id as wishlist_id 
            FROM wishlist_items w 
            JOIN products p ON w.product_id = p.id 
            WHERE w.user_id = ?
        `, [req.user.id]);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Add to Wishlist
app.post('/api/wishlist', verifyToken, async (req, res) => {
    const { productId } = req.body;
    try {
        const result = await db.run(`INSERT OR IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)`,
            [req.user.id, productId]
        );
        res.json({ success: true, id: result.lastID });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Remove from Wishlist
app.delete('/api/wishlist/:productId', verifyToken, async (req, res) => {
    const { productId } = req.params;
    try {
        await db.run(`DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?`,
            [req.user.id, productId]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- Cart APIs ---

// Get Cart
app.get('/api/cart', verifyToken, async (req, res) => {
    try {
        const rows = await db.all(`
            SELECT p.*, c.quantity, c.id as cart_item_id 
            FROM cart_items c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = ?
        `, [req.user.id]);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Add/Update Cart Item
app.post('/api/cart', verifyToken, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const row = await db.get(`SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?`, [req.user.id, productId]);

        if (row) {
            const newQuantity = row.quantity + quantity;
            await db.run(`UPDATE cart_items SET quantity = ? WHERE id = ?`, [newQuantity, row.id]);
        } else {
            await db.run(`INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`,
                [req.user.id, productId, quantity]
            );
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Update Cart Quantity (Set exact)
app.put('/api/cart/:productId', verifyToken, async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    try {
        await db.run(`UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?`,
            [quantity, req.user.id, productId]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Remove from Cart
app.delete('/api/cart/:productId', verifyToken, async (req, res) => {
    const { productId } = req.params;
    try {
        await db.run(`DELETE FROM cart_items WHERE user_id = ? AND product_id = ?`,
            [req.user.id, productId]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

if (process.env.VERCEL) {
    // When deployed on Vercel, export the app as a serverless function
    module.exports = app;
} else {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
