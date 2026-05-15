import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import crypto from 'crypto';

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex');
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validateInput = (value: string, maxLength: number = 500): boolean => {
  return value && value.length > 0 && value.length <= maxLength;
};

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const limit = rateLimit.get(ip);

  if (!limit || limit.resetTime < now) {
    rateLimit.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (limit.count >= 5) {
    return false;
  }

  limit.count++;
  return true;
};

const generateCsrfToken = (): string => {
  return crypto.createHash('sha256').update(CSRF_SECRET + Date.now()).digest('hex');
};

const validateCsrfToken = (token: string): boolean => {
  return token && token.length === 64;
};

app.use(cors());
app.use(express.json());

app.get('/api/csrf-token', (req: Request, res: Response) => {
  const token = generateCsrfToken();
  res.json({ token });
});

app.post('/api/contact', async (req: Request, res: Response) => {
  const ip = req.ip || 'unknown';

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const csrfToken = req.headers['x-csrf-token'] as string;
  if (!validateCsrfToken(csrfToken)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  const { name, email, message } = req.body;

  if (!validateInput(name, 100) || !validateInput(email, 254) || !validateInput(message, 5000)) {
    return res.status(400).json({ error: 'Invalid input fields' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const escapedName = escapeHtml(name.trim());
  const escapedEmail = email.trim().toLowerCase();
  const escapedMessage = escapeHtml(message.trim());

  try {
    const result = await resend.emails.send({
      from: 'Tuan Tling <onboarding@resend.dev>',
      to: 'tuantling899@gmail.com',
      replyTo: escapedEmail,
      subject: `New Contact Request from ${escapedName}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${escapedName}</p>
        <p><strong>Email:</strong> ${escapedEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${escapedMessage.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
