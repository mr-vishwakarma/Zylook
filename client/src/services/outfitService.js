import api from './api';

// TODO: Implement in Step 3
export const outfitService = {
  getOutfits: (params) => api.get('/outfits', { params }),
  getFeatured: () => api.get('/outfits/featured'),
  search: (query) => api.get('/outfits/search', { params: { q: query } }),
  getById: (id) => api.get(`/outfits/${id}`),
};

export default outfitService;
