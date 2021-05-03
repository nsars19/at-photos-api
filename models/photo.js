const mongoose = require("mongoose");
const { Schema } = mongoose;

const PhotoSchema = new Schema({
  key: String,
  likes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Photo", PhotoSchema);
