import api, { v1 } from './api';

// Get all products with filters
export const getAllProducts = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.keyword) queryParams.append('keyword', params.keyword);
  if (params.page) queryParams.append('page', params.page);
  if (params.category) queryParams.append('category', params.category);
  if (params.priceMin) queryParams.append('price[gte]', params.priceMin);
  if (params.priceMax) queryParams.append('price[lte]', params.priceMax);
  if (params.ratings) queryParams.append('ratings[gte]', params.ratings);
  
  const query = queryParams.toString();
  const response = await api.get(v1(`/products${query ? `?${query}` : ''}`));
  return response.data;
};

// Get single product details
export const getProductDetails = async (id) => {
  const response = await api.get(v1(`/product/${id}`));
  return response.data;
};

// Get price range
export const getPriceRange = async () => {
  const response = await api.get(v1('/products/price-range'));
  return response.data;
};

// Get all brands
export const getAllBrands = async () => {
  const response = await api.get('/brands');
  return response.data;
};

// Create product review
export const createReview = async (reviewData) => {
  const response = await api.put(v1('/review'), reviewData);
  return response.data;
};

// Validate coupon
export const validateCoupon = async (code) => {
  const response = await api.get(v1(`/coupons/validate?code=${code}`));
  return response.data;
};

// Admin: Get all products
export const getAdminProducts = async () => {
  const response = await api.get(v1('/admin/products'));
  return response.data;
};

// Admin: Create product
export const createProduct = async (productData) => {
  const response = await api.post(v1('/admin/product/new'), productData);
  return response.data;
};

// Admin: Update product
export const updateProduct = async (id, productData) => {
  const response = await api.put(v1(`/admin/product/${id}`), productData);
  return response.data;
};

// Admin: Delete product
export const deleteProduct = async (id) => {
  const response = await api.delete(v1(`/admin/product/${id}`));
  return response.data;
};

export default {
  getAllProducts,
  getProductDetails,
  getPriceRange,
  getAllBrands,
  createReview,
  validateCoupon,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
