require("dotenv/config");

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("trust proxy", 1);

const resend = new Resend(process.env.RESEND_API_KEY);

const CSRF_SECRET =
  process.env.CSRF_SECRET || crypto.randomBytes(32).toString("hex");

const rateLimit = new Map();

const escapeHtml = (text = "") => {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return String(text).replace(/[&<>"']/g, (m) => map[m]);
};

const validateEmail = (email = "") => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validateInput = (value, maxLength = 500) => {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
};

const checkRateLimit = (ip) => {
  const now = Date.now();
  const limit = rateLimit.get(ip);

  if (!limit || limit.resetTime < now) {
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + 60_000,
    });

    return true;
  }

  if (limit.count >= 5) {
    return false;
  }

  limit.count += 1;
  return true;
};

const generateCsrfToken = () => {
  const timestamp = Date.now().toString();

  const signature = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(timestamp)
    .digest("hex");

  return `${timestamp}.${signature}`;
};

const validateCsrfToken = (token) => {
  if (typeof token !== "string") {
    return false;
  }

  const [timestamp, signature] = token.split(".");

  if (!timestamp || !signature) {
    return false;
  }

  const timestampNumber = Number(timestamp);

  if (!Number.isFinite(timestampNumber)) {
    return false;
  }

  const tokenAge = Date.now() - timestampNumber;
  const maxAge = 30 * 60 * 1000;

  if (tokenAge < 0 || tokenAge > maxAge) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(timestamp)
    .digest("hex");

  if (signature.length !== expectedSignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token"],
  })
);

app.use(
  express.json({
    limit: "50kb",
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "tautling",
  });
});

app.get("/api/csrf-token", (req, res) => {
  const token = generateCsrfToken();

  res.json({
    token,
  });
});

app.post("/api/contact", async (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
    req.ip ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      error: "Too many requests. Please try again later.",
    });
  }

  const csrfToken = req.headers["x-csrf-token"];

  if (!validateCsrfToken(csrfToken)) {
    return res.status(403).json({
      error: "Invalid CSRF token",
    });
  }

  const { name, email, message } = req.body || {};

  if (
    !validateInput(name, 100) ||
    !validateInput(email, 254) ||
    !validateInput(message, 5000)
  ) {
    return res.status(400).json({
      error: "Invalid input fields",
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanMessage = message.trim();

  if (!validateEmail(cleanEmail)) {
    return res.status(400).json({
      error: "Invalid email address",
    });
  }

  const escapedName = escapeHtml(cleanName);
  const escapedEmail = escapeHtml(cleanEmail);
  const escapedMessage = escapeHtml(cleanMessage);

  try {
    const result = await resend.emails.send({
      from: "Tuan Tling <onboarding@resend.dev>",
      to: "tuantling899@gmail.com",
      replyTo: cleanEmail,
      subject: `New Contact Request from ${escapedName}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${escapedName}</p>
        <p><strong>Email:</strong> ${escapedEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${escapedMessage.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (result.error) {
      console.error("Resend error:", result.error);

      return res.status(500).json({
        error: "Failed to send email",
      });
    }

    return res.json({
      success: true,
      id: result.data?.id,
    });
  } catch (error) {
    console.error("Email error:", error);

    return res.status(500).json({
      error: "Failed to send email",
    });
  }
});

const distPath = path.join(__dirname, "dist");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.use((req, res) => {
  if (req.method !== "GET") {
    return res.status(404).json({
      error: "Not found",
    });
  }

  const indexPath = path.join(distPath, "index.html");

  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  return res.status(404).send('Application not built. Please run "npm run build".');
});

const PORT = Number(process.env.PORT) || 8080;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});