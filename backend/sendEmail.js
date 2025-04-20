// backend/sendEmail.js
const nodemailer = require("nodemailer");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "challengegame320@gmail.com",       // Replace with sender email
    pass: "djyfdrplqqjmepya"           // Replace with App Password
  }
});

async function sendEmail(filePath, filename) {
  const fileBuffer = fs.readFileSync(filePath);

  const mailOptions = {
    from: "challengegame320@gmail.com",
    to: ["aturan@asu.edu", "JANEL.WHITE@asu.edu", "agorla2@asu.edu", "nganguma@asu.edu"],
    subject: "CHALLENGE Evaluation Report",
    text: "Please find the attached evaluation report PDF.",
    attachments: [
      {
        filename,
        content: fileBuffer
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
