import { connect, connection } from 'mongoose';
import { config } from 'dotenv';
import { genSalt, hash } from 'bcryptjs';
import User, { deleteMany } from './models/User';

config();

connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log(err));

const seedDB = async () => {
  // 1. Clear existing users
  await deleteMany({});

  // 2. Create Admin User
  const salt = await genSalt(10);
  const passwordHash = await hash('admin123', salt);

  const admin = new User({
    email: 'admin@skillverse.com',
    passwordHash,
    role: 'ADMIN',
    status: 'ACTIVE'
  });

  await admin.save();
  console.log('✅ Admin User Created: admin@skillverse.com / admin123');
  
  connection.close();
};

seedDB();