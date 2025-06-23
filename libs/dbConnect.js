const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) throw new Error('MONGODB_URL is missing');

mongoose.connect(MONGODB_URL, {
  dbName: 'finly-db',
  bufferCommands: false,
});

console.log('Connected to MongoDB');