const mongoose = require('mongoose');
const config = require('config');
// take the mongoURI value fron config folder
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    // connect the database
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    console.log('MongoDB Connectet....');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
