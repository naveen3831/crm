const tls = require("tls");
const fs = require("fs");

/**
 * Native TLS SMTP Client for Node.js (Zero external dependencies)
 * Connects to Gmail / SMTP SSL port 465 and delivers real HTML emails.
 */
function sendNativeSmtpEmail({ host = "smtp.gmail.com", port = 465, user, pass, to, subject, html }) {
  return new Promise((resolve, reject) => {
    const cleanUser = (user || process.env.SMTP_USER || "naveenkumar970100@gmail.com").trim();
    const cleanPass = (pass || process.env.SMTP_PASS || "bzhrewmmaqzdnlrs").replace(/\s+/g, "");

    console.log(`[Native TLS SMTP] Connecting to ${host}:${port} for recipient: ${to}`);

    const socket = tls.connect(port, host, { rejectUnauthorized: false }, () => {
      console.log(`[Native TLS SMTP] Connected securely to ${host}:${port}`);
    });

    socket.setEncoding("utf8");

    let step = 0;

    socket.on("data", (data) => {
      const response = data.toString();
      console.log(`[SMTP Server Response] ${response.trim()}`);

      if (step === 0 && response.startsWith("220")) {
        step = 1;
        socket.write(`EHLO ${host}\r\n`);
      } else if (step === 1 && response.startsWith("250")) {
        step = 2;
        socket.write("AUTH LOGIN\r\n");
      } else if (step === 2 && response.startsWith("334")) {
        step = 3;
        socket.write(Buffer.from(cleanUser).toString("base64") + "\r\n");
      } else if (step === 3 && response.startsWith("334")) {
        step = 4;
        socket.write(Buffer.from(cleanPass).toString("base64") + "\r\n");
      } else if (step === 4 && response.startsWith("235")) {
        step = 5;
        socket.write(`MAIL FROM: <${cleanUser}>\r\n`);
      } else if (step === 5 && response.startsWith("250")) {
        step = 6;
        socket.write(`RCPT TO: <${to}>\r\n`);
      } else if (step === 6 && response.startsWith("250")) {
        step = 7;
        socket.write("DATA\r\n");
      } else if (step === 7 && response.startsWith("354")) {
        step = 8;
        const mimeMessage = [
          `From: "CRM Platform" <${cleanUser}>`,
          `To: <${to}>`,
          `Subject: ${subject}`,
          `MIME-Version: 1.0`,
          `Content-Type: text/html; charset=UTF-8`,
          ``,
          html,
          `\r\n.`
        ].join("\r\n");

        socket.write(mimeMessage + "\r\n");
      } else if (step === 8 && response.startsWith("250")) {
        step = 9;
        socket.write("QUIT\r\n");
        console.log(`[Native TLS SMTP] Email delivered successfully to ${to}`);
        resolve({ success: true, messageId: `NATIVE-TLS-${Date.now()}` });
      } else if (response.startsWith("5") || response.startsWith("4")) {
        console.error(`[Native TLS SMTP ERROR] Server returned error: ${response}`);
        reject(new Error(`SMTP Error: ${response.trim()}`));
        socket.end();
      }
    });

    socket.on("error", (err) => {
      console.error("[Native TLS SMTP Socket Error]", err);
      reject(err);
    });

    socket.on("end", () => {
      console.log("[Native TLS SMTP] Socket connection closed");
    });
  });
}

module.exports = { sendNativeSmtpEmail };
