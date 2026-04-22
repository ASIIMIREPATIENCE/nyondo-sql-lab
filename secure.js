const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// SECURE - using ? placeholders
function searchProductSafe(name) {
    const query = `SELECT * FROM products WHERE name LIKE '%' || ? || '%'`;
    console.log('Query (safe):', query);
    const rows = db.prepare(query).all(name);
    return rows;
}

// SECURE - using ? placeholders
function loginSafe(username, password) {
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    console.log('Query (safe):', query);
    const row = db.prepare(query).get(username, password);
    return row;
}

// Test attacks - all should return empty results
console.log('Test 1 (OR 1=1):', searchProductSafe("' OR 1=1--"));
console.log('\nTest 2 (UNION attack):', searchProductSafe("' UNION SELECT id,username,password,role FROM users--"));
console.log('\nTest 3 (admin bypass):', loginSafe("admin'--", 'anything'));
console.log('\nTest 4 (always true):', loginSafe("' OR '1'='1", "' OR '1'='1"));