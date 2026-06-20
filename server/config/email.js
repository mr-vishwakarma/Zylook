// Email configuration using Nodemailer
// Supports SMTP (development) and AWS SES (production)

import nodemailer from 'nodemailer';

const createTransporter = () => {
  // Use Mailtrap or similar for development
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Production — AWS SES or other SMTP provider
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export default createTransporter;
