// queries.js
const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

console.log('=== Query A: Get every column of every product ===');
const queryA = db.prepare('SELECT * FROM products').all();
console.table(queryA);

console.log('\n=== Query B: Get only name and price ===');
const queryB = db.prepare('SELECT name, price FROM products').all();
console.table(queryB);

console.log('\n=== Query C: Get product with id = 3 ===');
const queryC = db.prepare('SELECT * FROM products WHERE id = ?').get(3);
console.table(queryC);

console.log('\n=== Query D: Products containing "sheet" ===');
const queryD = db.prepare('SELECT * FROM products WHERE name LIKE ?').all('%sheet%');
console.table(queryD);

console.log('\n=== Query E: Products sorted by price highest first ===');
const queryE = db.prepare('SELECT * FROM products ORDER BY price DESC').all();
console.table(queryE);

console.log('\n=== Query F: 2 most expensive products ===');
const queryF = db.prepare('SELECT * FROM products ORDER BY price DESC LIMIT 2').all();
console.table(queryF);

console.log('\n=== Query G: Update Cement price to 38,000 ===');
db.prepare('UPDATE products SET price = ? WHERE id = ?').run(38000, 1);
const queryG = db.prepare('SELECT * FROM products').all();
console.table(queryG);