// server.js
require("dotenv").config();
console.log("Loaded OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY);

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const sendEmail = require("./sendEmail");
const fetch = require("node-fetch"); // v2 import for CommonJS

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// ✉️ Email Report Endpoint
app.post("/send-report", upload.single("report"), async (req, res) => {
  const filePath = req.file.path;
  const filename = req.file.originalname;

  try {
    await sendEmail(filePath, filename);
    fs.unlinkSync(filePath);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// 🤖 AI Agent Response Endpoint
app.post("/agent-response", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a refugee education policymaker in a serious deliberation exercise." },
          { role: "user", content: prompt }
        ],
        max_tokens: 350,
        temperature: 0.7
      })
    });

    // 1) Log HTTP status
    console.log("🔍 OpenRouter HTTP status:", response.status, response.statusText);

    // 2) Parse & log full body
    const data = await response.json();
    console.log("🔍 OpenRouter response body:", JSON.stringify(data, null, 2));

    // 3) Guard against missing or malformed choices
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      const errMsg = data.error?.message || "No choices returned";
      console.error("⚠️ OpenRouter error or empty choices:", errMsg);
      return res.status(502).json({ reply: `⚠️ OpenRouter error: ${errMsg}` });
    }

    // 4) Extract and return the assistant’s reply
    const reply = data.choices[0].message.content.trim();
    res.json({ reply });

  } catch (error) {
    console.error("Error in /agent-response:", error);
    res.status(500).json({ reply: "⚠️ Failed to contact the AI server." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
