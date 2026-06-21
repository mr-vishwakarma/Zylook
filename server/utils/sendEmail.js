import createTransporter from '../config/email.js';

/**
 * Send an email using the configured transporter
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `Zylook <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
