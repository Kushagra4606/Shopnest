const sqlite3 = require('sqlite3').verbose();
const { createClient } = require('@libsql/client');
require('dotenv').config();

const isCloud = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;

let db;
let client;

if (isCloud) {
    console.log("Using Cloud Database (Turso)");
    client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });
} else {
    console.log("Using Local Database (SQLite)");
    db = new sqlite3.Database('./ecommerce.db', (err) => {
        if (err) console.error('DB Connection Error:', err.message);
    });
}

function normalizeRows(rows) {
    // sqlite3 returns array of products
    // libsql returns { rows: [...] } but the rows might be objects or arrays depending on config.
    // By default libsql http returns rows as objects if using standard client?
    // Actually, standard libsql client returns { columns, rows, ... }. Rows are objects if using ResultSet?
    // Let's ensure we return array of objects.
    return rows;
}

const dbAdapter = {
    // Initialize Tables
    init: async () => {
        const queries = [
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT,
                role TEXT DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                description TEXT,
                price INTEGER,
                reviews INTEGER,
                image TEXT
            )`,
            `CREATE TABLE IF NOT EXISTS wishlist_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                product_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, product_id)
            )`,
            `CREATE TABLE IF NOT EXISTS cart_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                product_id INTEGER,
                quantity INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, product_id)
            )`
        ];

        for (const query of queries) {
            await dbAdapter.run(query);
        }

        // Migration logic for 'role'
        try {
            const rows = await dbAdapter.all("PRAGMA table_info(users)");
            const hasRole = rows.some(r => r.name === 'role');
            if (!hasRole) {
                await dbAdapter.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
                console.log("Migrated users table: added role column");
            }
        } catch (e) {
            console.log("Migration check failed or not needed:", e.message);
        }
    },

    // Get all rows
    all: (sql, params = []) => {
        return new Promise(async (resolve, reject) => {
            if (isCloud) {
                try {
                    const rs = await client.execute({ sql, args: params });
                    resolve(rs.rows);
                } catch (e) { reject(e); }
            } else {
                db.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            }
        });
    },

    // Get single row
    get: (sql, params = []) => {
        return new Promise(async (resolve, reject) => {
            if (isCloud) {
                try {
                    const rs = await client.execute({ sql, args: params });
                    resolve(rs.rows[0]);
                } catch (e) { reject(e); }
            } else {
                db.get(sql, params, (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            }
        });
    },

    // Execute (Insert/Update/Delete)
    run: (sql, params = []) => {
        return new Promise(async (resolve, reject) => {
            if (isCloud) {
                try {
                    const rs = await client.execute({ sql, args: params });
                    // Simulate `this.lastID` for inserts
                    const result = { lastID: Number(rs.lastInsertRowid), changes: rs.rowsAffected };
                    // If callback expects `this` context with lastID, we return specific obj
                    resolve(result);
                } catch (e) { reject(e); }
            } else {
                db.run(sql, params, function (err) {
                    if (err) reject(err);
                    else resolve({ lastID: this.lastID, changes: this.changes });
                });
            }
        });
    }
};

module.exports = dbAdapter;
