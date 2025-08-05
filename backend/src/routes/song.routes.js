const express = require("express");
const multer = require("multer");
const { parseBuffer } = require("music-metadata");
const uploadFile = require("../services/storage.service");
const songModel = require("../models/song.model");

const songRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

songRouter.post("/songs", upload.single("audio"), async (req, res) => {
  try {
    const { title, artist, mood } = req.body;
    const fileBuffer = req.file.buffer;

    // extracting audio duration using metadata
    const metadata = await parseBuffer(fileBuffer, req.file.mimetype);
    const durationSeconds = metadata.format.duration;
    const durationFormatted = formatDuration(durationSeconds);

    //uploading song to imagekit via imagekit service
    const fileData = await uploadFile(req.file);

    // adding song to database
    const song = await songModel.create({
      title,
      artist,
      mood,
      audioUrl: fileData.url,
      duration: durationFormatted,
      durationSeconds,
    });

    res.status(201).json({
      message: "song uploaded successfully",
      song,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to upload song",
      error: err.message,
    });
  }
});

songRouter.get("/songs", async (req, res) => {
  try {
    const { mood } = req.query;
    const songs = await songModel.find({
      mood: mood,
    });
    if (!songs.length)
      throw new Error(
        `No Songs found for this mood or Invalid mood parameter: ${mood}`
      );

    res.status(200).json({
      message: "Songs fetched Succcesfully",
      songs,
    });
  } catch (err) {
    res.status(400).json({
      message: "Cannot fetch songs",
      error: err.message,
    });
  }
});

module.exports = songRouter;
