#!/usr/bin/env node

/**
 * Password Verification Test
 * 
 * Usage: node scripts/verify-password.js <password> <hash>
 * 
 * This script tests if a password matches a given hash
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];
const hash = process.argv[3];

if (!password || !hash) {
  console.error('\n❌ Error: Both password and hash are required\n');
  console.log('Usage: node scripts/verify-password.js <password> <hash>\n');
  console.log('Example: node scripts/verify-password.js admin123 "$2b$12$..."');
  console.log('\nOr test with current .env.local:');
  console.log('node scripts/verify-password.js admin123\n');
  process.exit(1);
}

console.log('\n🔐 Verifying password...\n');
console.log('Password:', password);
console.log('Hash:', hash.substring(0, 20) + '...\n');

bcrypt.compare(password, hash, (err, result) => {
  if (err) {
    console.error('❌ Error verifying password:', err);
    process.exit(1);
  }

  if (result) {
    console.log('✅ SUCCESS! Password matches the hash\n');
  } else {
    console.log('❌ FAILED! Password does not match the hash\n');
  }
});
