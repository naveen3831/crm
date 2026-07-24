const { execSync } = require("child_process");
const path = require("path");

const backendDir = path.resolve(__dirname);
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

try {
  console.log("Installing nodemailer via npm.cmd...");
  const out = execSync(`${npmCmd} install nodemailer --save`, { cwd: backendDir, stdio: "pipe" });
  console.log("Nodemailer installation SUCCESS:", out.toString().slice(0, 200));
} catch (err) {
  console.error("Install Error:", err.stderr ? err.stderr.toString() : err.message);
}
