import api from './api';

const outfitService = {
  // Public
  getOutfits: (params = {}) => api.get('/outfits', { params }),
  getFeatured: (limit = 8) => api.get(`/outfits/featured?limit=${limit}`),
  search: (query, params = {}) => api.get('/outfits/search', { params: { q: query, ...params } }),
  getById: (id) => api.get(`/outfits/${id}`),

  // Admin / Creator — supports multipart for coverImage
  createOutfit: (formData) =>
    api.post('/outfits', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateOutfit: (id, formData) =>
    api.put(`/outfits/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteOutfit: (id) => api.delete(`/outfits/${id}`),
};

export default outfitService;
