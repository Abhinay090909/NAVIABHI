// pages/api/send-report.js
import fs from "fs";
import formidable from "formidable";
import sendEmail from "../../src/utils/sendEmail"; // We'll move your email code here in Step 3

// Required for file upload parsing
export const config = {
  api: {
    bodyParser: false, // Disable default Next.js body parsing
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const form = new formidable.IncomingForm({ uploadDir: "/tmp", keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Form parse error:", err);
      return res.status(500).json({ message: "File upload failed." });
    }

    const file = files.report;
    if (!file) return res.status(400).json({ message: "No file uploaded." });

    try {
      await sendEmail(file.filepath, file.originalFilename);
      fs.unlinkSync(file.filepath); // Clean up file
      return res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("❌ Email sending error:", error);
      return res.status(500).json({ message: "Failed to send email." });
    }
  });
}
