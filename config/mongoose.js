const mongoose = require('mongoose');
const env = require('./environment');

main().catch(err => console.log("The error is showing you are not connected to server",err));

async function main() {
  await mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);
  console.log("Your database is now connected");
  
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}