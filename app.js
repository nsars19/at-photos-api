require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { getFileStream } = require("./s3");
const Photo = require("./models/photo");

// Setup MongoDB & Mongoose
const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_URI;
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((err) => console.log(err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res, next) => {
  next();
});

// Pipe image from S3
app.get("/images/:key", (req, res) => {
  const { key } = req.params;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

// The 'index' route for the app. Uses photos as a URI to be RESTful
app.get("/photos", async (req, res) => {
  const photos = await Photo.find({});
  res.send(photos);
});

app.get("/photos/:id", async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(id).populate("comments", { text: 1 });
  res.send(photo);
});

app.get("/photos/like/:id", async (req, res) => {
  const { id } = req.params;
  const photo = await Photo.findById(id);
  photo.likes = photo.likes + 1;
  photo.save();

  res.send(photo);
});

app.get("/photos/unlike/:id", async (req, res) => {
  const { id } = req.params;
  const photo = await Photo.findById(id);
  photo.likes = photo.likes - 1;
  photo.save();

  res.send(photo);
});

module.exports = app;
