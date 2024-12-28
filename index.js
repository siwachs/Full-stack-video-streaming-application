import fs from "fs";
import path from "path";

import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = process.env.PORT ?? 8000;

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

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
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow only known origin
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

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file)
      return res.status(404).send({
        message: "No file selected",
      });

    return res.status(200).json({ message: "File Uploaded", file: req.file });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.use("/uploads", express.static("uploads"));

app.listen(port, () => console.log(`Server connected on PORT ${port}`));
