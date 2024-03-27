const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  tokenNumber: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
