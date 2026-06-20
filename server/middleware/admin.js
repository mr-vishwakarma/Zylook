import { ApiError } from '../utils/apiError.js';

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(new ApiError('Access denied — admin only', 403));
  }
};

export const creator = (req, res, next) => {
  if (req.user && (req.user.role === 'creator' || req.user.role === 'admin')) {
    next();
  } else {
    next(new ApiError('Access denied — creator or admin only', 403));
  }
};
