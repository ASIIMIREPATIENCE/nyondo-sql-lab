const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// ========== VALIDATION FUNCTIONS ==========

function validateName(name) {
    if (typeof name !== 'string') return false;
    if (name.length < 2) return false;
    if (/[<>;]/.test(name)) return false;
    return true;
}

function validatePrice(price) {
    if (typeof price !== 'number') return false;
    if (price <= 0) return false;
    return true;
}

function validateUsername(username) {
    if (typeof username !== 'string') return false;
    if (username.length === 0) return false;
    if (/\s/.test(username)) return false; // no spaces
    return true;
}

function validatePassword(password) {
    if (typeof password !== 'string') return false;
    if (password.length < 6) return false;
    return true;
}

// ========== SECURE FUNCTIONS WITH PARAMETERISED QUERIES ==========

// SECURE search with validation
function searchProductSafe(name) {
    console.log(`\nSearching for: "${name}"`);
    
    // Input validation first
    if (!validateName(name)) {
        console.log('Validation failed: Invalid product name (min 2 chars, no < > ;)');
        return [];
    }
    
    const query = `SELECT * FROM products WHERE name LIKE '%' || ? || '%'`;
    const rows = db.prepare(query).all(name);
    console.log(`Found ${rows.length} products`);
    return rows;
}

// SECURE login with validation
function loginSafe(username, password) {
    console.log(`\nLogin attempt - Username: "${username}", Password: "${password}"`);
    
    // Input validation first
    if (!validateUsername(username)) {
        console.log('Validation failed: Invalid username (no spaces, not empty)');
        return null;
    }
    
    if (!validatePassword(password)) {
        console.log('Validation failed: Password must be at least 6 characters');
        return null;
    }
    
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    const row = db.prepare(query).get(username, password);
    console.log(row ? 'Login successful!' : 'Login failed');
    return row;
}

// ========== TESTING THE SECURE FUNCTIONS ==========

console.log('=== TESTING THAT ATTACKS NO LONGER WORK ===');

console.log('\nTest 1 (OR 1=1 attack):', searchProductSafe("' OR 1=1--"));
console.log('\nTest 2 (UNION attack):', searchProductSafe("' UNION SELECT id,username,password,role FROM users--"));
console.log('\nTest 3 (admin bypass):', loginSafe("admin'--", 'anything'));
console.log('\nTest 4 (always true):', loginSafe("' OR '1'='1", "' OR '1'='1"));

console.log('\n\n=== TESTING INPUT VALIDATION ===');

console.log('\n1. searchProductSafe("cement"):');
searchProductSafe('cement');

console.log('\n2. searchProductSafe(""):');
searchProductSafe('');

console.log('\n3. searchProductSafe("<script>"):');
searchProductSafe('<script>');

console.log('\n4. loginSafe("admin", "admin123"):');
loginSafe('admin', 'admin123');

console.log('\n5. loginSafe("admin", "ab"):');
loginSafe('admin', 'ab');

console.log('\n6. loginSafe("ad min", "pass123"):');
loginSafe('ad min', 'pass123');