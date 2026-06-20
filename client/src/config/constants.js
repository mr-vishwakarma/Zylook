export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Zylook';
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

export const OUTFIT_CATEGORIES = [
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'ethnic', label: 'Ethnic' },
  { value: 'party', label: 'Party / Occasion' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'streetwear', label: 'Streetwear' },
];

export const GENDERS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
