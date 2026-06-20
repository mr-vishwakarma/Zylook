import imagekit from '../config/imagekit.js';
import { ApiError } from './apiError.js';

/**
 * Uploads a file buffer to ImageKit
 * @param {Buffer} fileBuffer - The file buffer from Multer
 * @param {string} fileName - Name to assign to the uploaded file
 * @param {string} folder - Folder name in ImageKit dashboard
 * @returns {Promise<object>} ImageKit upload response containing url, fileId, etc.
 */
export const uploadToImageKit = (fileBuffer, fileName, folder = '/zylook') => {
  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file: fileBuffer,
        fileName: fileName,
        folder: folder,
      },
      (error, result) => {
        if (error) {
          reject(new ApiError(error.message || 'Image upload failed', 500));
        } else {
          resolve(result);
        }
      }
    );
  });
};
