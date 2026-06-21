// Email configuration using Nodemailer
// Supports SMTP (development) and AWS SES (production)

import nodemailer from 'nodemailer';

const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io';
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587 or 2525
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export default createTransporter;
