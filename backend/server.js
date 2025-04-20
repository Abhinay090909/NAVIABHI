// backend/server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sendEmail = require("./sendEmail");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/send-report", upload.single("report"), async (req, res) => {
  const filePath = req.file.path;
  const filename = req.file.originalname;

  try {
    await sendEmail(filePath, filename);
    fs.unlinkSync(filePath); // delete temp file
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
