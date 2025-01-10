import mongoose from 'mongoose';

const { MONGODB_URI } = process.env

mongoose.connection.on('error', err => {
  console.log('Error de conexión', err);
});

/**
 * Connect to MongoDB
 * @returns {mongoose} mongoose
 */
export default function connectMongoose() {
  return mongoose.connect(MONGODB_URI)
}