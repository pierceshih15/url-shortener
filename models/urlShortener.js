const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlShortenSchema = new Schema({
  originalUrl: String,
  shortId: String,
  createdAt: String
});

module.exports = mongoose.model('UrlShorten', urlShortenSchema);