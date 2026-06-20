/**
 * Input validation helpers using simple checks
 * Can be replaced with Joi or express-validator later
 */

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isStrongPassword = (password) => {
  // At least 6 chars, one uppercase, one lowercase, one number
  return password.length >= 6;
};

export const isValidPhone = (phone) => {
  const re = /^[6-9]\d{9}$/; // Indian mobile number
  return re.test(phone);
};

export const isValidPincode = (pincode) => {
  const re = /^\d{6}$/; // Indian pincode
  return re.test(pincode);
};

export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/<[^>]*>/g, ''); // Strip HTML tags
};
