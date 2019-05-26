const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const db = mongoose.connection;
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const HomeRouter = require('./routes/home');

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/urlShortener', {
  useNewUrlParser: true,
  useCreateIndex: true,
})

db.on('error', () => {
  console.log('mongodb error!')
});

db.once('open', () => {
  console.log('mongodb connected!')
});

app.use('/', HomeRouter);

// 設定 express port
app.listen(process.env.PORT || port, () => {
  console.log('App is running')
});