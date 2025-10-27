#!/usr/bin/env node

/**
 * Password Hash Generator
 * 
 * Usage: node scripts/generate-password-hash.js <your-password>
 * 
 * This script generates a bcrypt hash for your password that can be used
 * in the .env.local file for the ADMIN_PASSWORD_HASH variable.
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('\n❌ Error: Password is required\n');
  console.log('Usage: node scripts/generate-password-hash.js <your-password>\n');
  console.log('Example: node scripts/generate-password-hash.js MySecurePassword123!\n');
  process.exit(1);
}

if (password.length < 8) {
  console.error('\n⚠️  Warning: Password should be at least 8 characters long for security\n');
}

console.log('\n🔐 Generating password hash...\n');

bcrypt.hash(password, 12, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }

  console.log('✅ Password hash generated successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\nAdd this to your .env.local file:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('⚠️  Important Security Notes:');
  console.log('  • Never commit your .env.local file to version control');
  console.log('  • Change the default password immediately in production');
  console.log('  • Use a strong, unique password (min 12 characters recommended)');
  console.log('  • Consider using a password manager\n');
});
