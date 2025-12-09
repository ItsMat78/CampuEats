require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- FIX: SERVE STATIC FILES EXPLICITLY ---
// This forces Node to look in the exact folder where server.js is located
app.use(express.static(__dirname)); 
app.use('/public', express.static(path.join(__dirname, 'public')));

// --- DATABASE CONNECTION ---
// REPLACE 'YOUR_PASSWORD' WITH YOUR ACTUAL PASSWORD
// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err.stack);
        return;
    }
    console.log('✅ Connected to MySQL Database');
});

// --- API ROUTES ---

// 1. Get Menu (Forgiving Join)
app.get('/api/menu', (req, res) => {
    const { search } = req.query;
    let sql = `
        SELECT m.*, c.name as category_name, COALESCE(i.stock_qty, 0) as stock_qty 
        FROM menu_items m
        LEFT JOIN categories c ON m.category_id = c.id
        LEFT JOIN inventory i ON m.id = i.item_id
        WHERE m.id IS NOT NULL
    `;
    const params = [];

    if (search) {
        sql += " AND m.name LIKE ?";
        params.push(`%${search}%`);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 2. Place Order
app.post('/api/orders', (req, res) => {
    const { userName, total, items } = req.body;
    
    // Note: In production, use a Transaction for data integrity
    const sql = "INSERT INTO orders (user_id, total_amount, status) VALUES ((SELECT id FROM users WHERE username = ? LIMIT 1), ?, 'new')";
    
    db.query(sql, [userName, total], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Order failed. Does user exist?" });
        }
        res.json({ message: "Order Placed", orderId: result.insertId });
    });
});

// 3. Get Orders
app.get('/api/orders', (req, res) => {
    const sql = `
        SELECT o.id, o.total_amount, o.status, o.created_at, u.username as user_name 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC`;
        
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 4. Update Status
app.put('/api/orders/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Status Updated" });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});