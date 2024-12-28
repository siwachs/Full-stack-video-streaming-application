import fs from "fs";
import path from "path";
import { exec } from "child_process"; // Do not directly run this on Server

import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = process.env.PORT ?? 8000;

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const uploadDir = "./uploads";
ensureDirectoryExists(uploadDir);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

// Multer Middleware: For Multipart formdate ie. to POST images, videos and documents ... from POST
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`);
  },
});

// Multer Config
const upload = multer({
  storage: storage,
});

// Middleware for whitelist content types (For Video Streaming)
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:3000, http://localhost:5173"
  ); // Allow only known origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "API is Live", status: 200 });
});

// In realworld the file store on S3 or Drive and then it send to queue for output
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file)
      return res.status(404).send({
        message: "No file selected",
      });

    const videoId = uuidv4();
    const videoPath = req.file.path;
    const outputPath = `${uploadDir}/videos/${videoId}`;

    const hlsPath = `${outputPath}/index.m3u8`;
    console.log(`"HLS Path: ${hlsPath}`);

    ensureDirectoryExists(outputPath);

    // ffmpeg processing
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

    // no queue based implementation (In production must run in background on machine clusters)
    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(`Exec Error: ${error.message}`);
        return res.status(500).json({ message: "Exec Error" });
      }

      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

      const videoUrl = `http://localhost:${port}/uploads/videos/${videoId}/index.m3u8`;

      res
        .status(200)
        .json({ message: "Video converted to HLS", videoUrl, videoId });
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.use("/uploads", express.static("uploads"));

app.listen(port, () => console.log(`Server connected on PORT ${port}`));
