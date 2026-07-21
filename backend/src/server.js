const path = require("path");
// Configure dotenv to read the environment variables from the project root
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const app = require("./app");
const connectDatabase = require("./config/database");

const startServer = async () => {
  // 1. Connection to the MongoDB Atlas database cluster
  await connectDatabase();

  // 2. Set port and start TCP listener
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`[Server] CRM API listening on port ${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });

  // Handle unhandled promise rejections safely
  process.on("unhandledRejection", (err) => {
    console.error(`[Fatal Error] Unhandled rejection: ${err.message}`);
    // Graceful shutdown on fatal errors
    server.close(() => process.exit(1));
  });
};

startServer();
