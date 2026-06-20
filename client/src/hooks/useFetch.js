import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Generic data-fetching hook
 * @param {string} url - API endpoint
 * @param {object} options - { params, immediate }
 */
export const useFetch = (url, options = {}) => {
  const { params = {}, immediate = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (overrideParams) => {
    setLoading(true);
    setError(null);
    try {
      const { data: response } = await api.get(url, {
        params: overrideParams || params,
      });
      setData(response);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
