// src/utils/sendEmail.js
import nodemailer from "nodemailer";
import fs from "fs";

export default async function sendEmail(filePath, filename) {
  const fileBuffer = fs.readFileSync(filePath);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,  // ENV VAR instead of hardcoded
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
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
