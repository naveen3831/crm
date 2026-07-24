try { require("../install-nodemailer"); } catch(e) {}
const path = require("path");
const fs = require("fs");

// Load backend/.env if present, otherwise load root .env
const backendEnvPath = path.resolve(__dirname, "../.env");
const rootEnvPath = path.resolve(__dirname, "../../.env");

if (fs.existsSync(backendEnvPath)) {
  require("dotenv").config({ path: backendEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  require("dotenv").config({ path: rootEnvPath });
} else {
  require("dotenv").config();
}

const app = require("./app");
const connectDatabase = require("./config/database");

const startServer = async () => {
  // 1. Connection to the MongoDB Atlas database cluster
  await connectDatabase();

  // 2. Seed Build Your Thoughts records
  try {
    const { seedBuildYourThoughtsRecords } = require("./modules/crm/crm.controller");
    await seedBuildYourThoughtsRecords();
  } catch (seedErr) {
    console.error("[Startup Seed Error]", seedErr);
  }

  // 2. Set port and start TCP listener
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`[Server] CRM API listening on port ${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
    
    // Trigger native TLS email dispatch on startup
    try {
      const { handleSendEmail } = require("./modules/crm/email.service");
      console.log("[Native TLS SMTP Test] Dispatching live test email to naveenkumar970100@gmail.com...");
      handleSendEmail({
        body: {
          type: "PROPOSAL",
          clientEmail: "naveenkumar970100@gmail.com",
          clientName: "Naveen Kumar",
          companyName: "Speshway CRM Test",
          projectName: "Hospital Management System (HMS)",
          proposalType: "Website + Mobile App Complete Ecosystem",
          proposalTier: "Plan B (Professional Recommended)",
          amount: 185000,
          proposalId: "PROP-7001"
        }
      }, {
        status: (code) => ({
          json: (d) => console.log(`[NODEMAILER RESULT ${code}]`, d)
        })
      }, () => {});
    } catch (e) {
      console.error("[Nodemailer Test Error]", e);
    }
  });

  // Handle unhandled promise rejections safely
  process.on("unhandledRejection", (err) => {
    console.error(`[Fatal Error] Unhandled rejection: ${err.message}`);
    // Graceful shutdown on fatal errors
    server.close(() => process.exit(1));
  });
};

startServer();
