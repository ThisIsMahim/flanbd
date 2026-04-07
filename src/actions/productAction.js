import axios from "axios";
import {
    ADMIN_PRODUCTS_FAIL,
    ADMIN_PRODUCTS_REQUEST,
    ADMIN_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_REVIEWS_FAIL,
    ALL_REVIEWS_REQUEST,
    ALL_REVIEWS_SUCCESS,
    CLEAR_ERRORS,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_REVIEW_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    NEW_PRODUCT_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    SLIDER_PRODUCTS_FAIL,
    SLIDER_PRODUCTS_REQUEST,
    SLIDER_PRODUCTS_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
} from "../constants/productConstants";

// Get All Products --- Filter/Search/Sort
export const getProducts =
  (
    keyword = "",
    category,
    price = [0, 200000],
    ratings = 0,
    currentPage = 1,
    rentOnly = false,
    brand
  ) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCTS_REQUEST });

      // Validate and sanitize parameters
      const validKeyword = keyword ? encodeURIComponent(keyword.trim()) : "";
      const validCategory = category && category.trim() ? encodeURIComponent(category.trim()) : "";
      const validBrand = brand && brand.trim() ? encodeURIComponent(brand.trim()) : "";
      const validPrice = Array.isArray(price) && price.length === 2 ? price : [0, 200000];
      const validRatings = typeof ratings === 'number' ? ratings : 0;
      const validCurrentPage = typeof currentPage === 'number' && currentPage > 0 ? currentPage : 1;

      let url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/products?keyword=${validKeyword}&price[gte]=${validPrice[0]}&price[lte]=${validPrice[1]}&ratings[gte]=${validRatings}&page=${validCurrentPage}`;

      if (validCategory) {
        url += `&category=${validCategory}`;
      }
      if (rentOnly) {
        url += `&rentOnly=true`;
      }
      if (validBrand) {
        url += `&brand=${validBrand}`;
      }

      const { data } = await axios.get(url);

      dispatch({
        type: ALL_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      dispatch({
        type: ALL_PRODUCTS_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

// Get All Products Of Same Category
export const getSimilarProducts = (category) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PRODUCTS_REQUEST });

    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/products?category=${category}`
    );

    dispatch({
      type: ALL_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Product Details
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// New/Update Review
export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });
    const config = { 
      headers: { "Content-Type": "application/json" },
      withCredentials: true 
    };
    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/review`,
      reviewData,
      config
    );

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get All Products ---PRODUCT SLIDER
export const getSliderProducts = () => async (dispatch) => {
  try {
    dispatch({ type: SLIDER_PRODUCTS_REQUEST });

    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/products/all`
    );

    dispatch({
      type: SLIDER_PRODUCTS_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: SLIDER_PRODUCTS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get All Products ---ADMIN
export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_PRODUCTS_REQUEST });

    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/products`
    );

    dispatch({
      type: ADMIN_PRODUCTS_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_PRODUCTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Bulk update product sort order ---ADMIN
export const bulkUpdateProductSort = (orders) => async (dispatch) => {
  try {
    await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/products/sort-order`,
      { orders },
      { withCredentials: true }
    );
  } catch (error) {
    // Optional: surface error via snackbar in caller
    throw error;
  }
};

// New Product ---ADMIN
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PRODUCT_REQUEST });
    const config = { header: { "Content-Type": "application/json" } };
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/product/new`,
      productData,
      config
    );

    dispatch({
      type: NEW_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// actions/productActions.js
export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/product/${id}`,
      productData,
      config
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete Product ---ADMIN
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    // First get the product details to get the public_id
    const { data: productData } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/product/${id}`,
      { withCredentials: true }
    );

    // Extract public_ids from the product images
    let public_ids = [];
    if (productData.product && productData.product.images) {
      public_ids = productData.product.images
        .filter((img) => img && img.public_id)
        .map((img) => img.public_id);
    }

    if (public_ids.length === 0) {
      throw new Error("No public_ids found for product images");
    }

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      data: { public_ids },
    };

    const { data } = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/product/${id}`,
      config
    );

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get Product Reviews ---ADMIN
export const getAllReviews = (id) => async (dispatch) => {
  try {
    dispatch({ type: ALL_REVIEWS_REQUEST });
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/reviews?id=${id}`
    );

    dispatch({
      type: ALL_REVIEWS_SUCCESS,
      payload: data.reviews,
    });
  } catch (error) {
    dispatch({
      type: ALL_REVIEWS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete Product Review ---ADMIN
export const deleteReview = (reviewId, productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REVIEW_REQUEST });
    const { data } = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/reviews?id=${reviewId}&productId=${productId}`,
      { withCredentials: true }
    );

    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
// Clear All Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

// Get All Brands
export const getAllBrands = () => async () => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/brands`
    );
    return data.brands;
  } catch (error) {
    return [];
  }
};
