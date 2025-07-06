const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend-domain.com"],
}));
app.use(express.json());

// POST /contact
app.post("/contact", async (req, res) => {
  const { name, email, contact, company, hearAboutUs, message } = req.body;

  console.log("📥 Data from form:", req.body);
  console.log("📧 Using SMTP_EMAIL:", process.env.SMTP_EMAIL);
  console.log("📧 Sending to:", process.env.RECEIVER_EMAIL);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.RECEIVER_EMAIL,
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h3>Contact Details</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Contact:</strong> ${contact}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Source:</strong> ${hearAboutUs}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  try {
    console.log("📤 Sending email...");
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent");
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ ERROR SENDING EMAIL:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
