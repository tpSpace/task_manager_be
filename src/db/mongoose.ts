import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export async function connectDatabase() {
  return mongoose.connect(String(process.env.DATABASE_URL))
  .then(() => {
    console.log('Connected to database');
    })
  .catch((error) => {
    console.log('Error connecting to database: ', error);
  });
}