const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./.env" });

const user = (process.env.SMTP_USER || "naveenkumar970100@gmail.com").trim();
const pass = (process.env.SMTP_PASS || "bzhrewmmaqzdnlrs").replace(/\s+/g, "");

console.log("Testing Nodemailer with user:", user);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: user,
    pass: pass
  }
});

async function sendTest() {
  try {
    const info = await transporter.sendMail({
      from: `"CRM Test" <${user}>`,
      to: "naveenkumar970100@gmail.com",
      subject: "CRM Test Email Notification",
      html: "<h1>CRM Email Test Success!</h1><p>Nodemailer is working properly!</p>"
    });
    console.log("SUCCESS! Message ID:", info.messageId);
    console.log("Response:", info.response);
  } catch (err) {
    console.error("ERROR SENDING EMAIL:", err);
  }
}

sendTest();
