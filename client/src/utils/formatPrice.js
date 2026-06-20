/**
 * Format price in Indian Rupees
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Calculate savings percentage
 */
export const calcSavingsPercent = (original, discounted) => {
  if (!original || original === 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
};
