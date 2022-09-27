const app = require('./app');
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_DB_URL || 'mongodb://localhost/digitech';
mongoose.connect(mongoURL);


app.listen(port, _ => {
  console.log(`Server ON!\nServer Port is ${port}`);
});