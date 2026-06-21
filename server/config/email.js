// Email configuration using Nodemailer
// Uses Gmail service for sending verification and notification emails

import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export default createTransporter;
