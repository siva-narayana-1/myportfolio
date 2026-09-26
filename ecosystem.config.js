require("dotenv").config();

const BACKEND_PORT = process.env.BACKEND_PORT || 5430;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3004;
const API_URL = process.env.NEXT_PUBLIC_API_URL || `http://localhost:${BACKEND_PORT}`;
const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:${FRONTEND_PORT}`;

module.exports = {
  apps: [
    {
      name: "portfolio-backend",
      script: "./backend/api.js",
      instances: process.env.NODE_ENV === "production" ? 2 : 1,
      exec_mode: process.env.NODE_ENV === "production" ? "cluster" : "fork",
      env: {
        NODE_ENV: process.env.NODE_ENV || "development",
        PORT: BACKEND_PORT,
        BACKEND_PORT: BACKEND_PORT,
        FRONTEND_URL: FRONTEND_URL,
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
      },
      error_file: "./logs/backend-error.log",
      out_file: "./logs/backend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
    {
      name: "portfolio-frontend",
      script: "npm",
      args: "start --prefix ./frontend",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: process.env.NODE_ENV || "development",
        FRONTEND_PORT: FRONTEND_PORT,
        NEXT_PUBLIC_API_URL: API_URL,
      },
      error_file: "./logs/frontend-error.log",
      out_file: "./logs/frontend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
