const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  mood: String,
  audioUrl: String,
  duration: String,
  durationSeconds: Number,
});

const song = mongoose.model("song", songSchema);

module.exports = song;
