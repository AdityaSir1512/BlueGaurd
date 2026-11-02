const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const email = process.argv[2]?.trim().toLowerCase();

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  role: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema, 'users');

async function promoteAdmin() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is required in backend/.env');
  if (!email) throw new Error('Usage: npm run admin:promote --prefix backend -- user@example.com');

  await mongoose.connect(MONGODB_URI);
  const user = await User.findOneAndUpdate({ email }, { $set: { role: 'ADMIN' } }, { new: true });
  if (!user) throw new Error(`No user found for ${email}. Register the account first.`);

  console.log(`Promoted ${user.email} to ADMIN`);
  await mongoose.disconnect();
}

promoteAdmin().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
