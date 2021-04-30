const mongoose = require("mongoose");
const { Schema } = mongoose;

const PhotoSchema = new Schema({
  key: String,
  likes: {
    type: Number,
    default: 0,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

module.exports = mongoose.model("Photo", PhotoSchema);
