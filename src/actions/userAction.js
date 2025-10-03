import axios from 'axios';
import {
    ALL_USERS_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    CLEAR_ERRORS,
    DELETE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    LOAD_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGOUT_USER_FAIL,
    LOGOUT_USER_SUCCESS,
    REGISTER_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_USER_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    CHECK_GOLD_STATUS_REQUEST,
    CHECK_GOLD_STATUS_SUCCESS,
    CHECK_GOLD_STATUS_FAIL,
    UPDATE_TOTAL_SPENT_REQUEST,
    UPDATE_TOTAL_SPENT_SUCCESS,
    UPDATE_TOTAL_SPENT_FAIL,
} from '../constants/userConstants';

export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_USER_REQUEST });

        // Use environment variable for API base URL
        const baseURL = process.env.REACT_APP_BACKEND_URL || '';

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            // Important for CORS cookies
            crossDomain: true,
            // Optional: Add timeout
            timeout: 10000
        };

        const { data } = await axios.post(
            `${baseURL}/api/v1/login`,
            { email, password },
            config
        );

        dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: data.user
        });

    } catch (error) {
        let errorMessage = "Login failed";
        
        if (error.response) {
            // Server responded with error status
            errorMessage = error.response.data?.message || error.response.statusText;
            
            // Special handling for 401 (Unauthorized)
            if (error.response.status === 401) {
                errorMessage = "Invalid email or password";
            }
        } else if (error.request) {
            // Request was made but no response
            errorMessage = "No response from server";
        } else {
            // Something else happened
            errorMessage = error.message;
        }

        dispatch({
            type: LOGIN_USER_FAIL,
            payload: errorMessage
        });
    }
};

export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });

        const { data } = await axios.get('/api/v1/me', {
            withCredentials: true
        });

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user
        });

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response?.data?.message || "Failed to load user"
        });
    }
};

// Register User
export const registerUser = (userData) => async (dispatch) => {
    try {

        dispatch({ type: REGISTER_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }

        const { data } = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/register`,
            userData,
            config
        );

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Load User


// Logout User
export const logoutUser = () => async (dispatch) => {
    try {
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/logout`);
        dispatch({ type: LOGOUT_USER_SUCCESS });
    } catch (error) {
        dispatch({
            type: LOGOUT_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Update User
export const updateProfile = (userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PROFILE_REQUEST });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }

        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/me/update`,
            userData,
            config
        );

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Update User Password
export const updatePassword = (passwords) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PASSWORD_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }

        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/password/update`,
            passwords,
            config
        );

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message,
        });
    }
};


// actions/userAction.js
// [Keep all other actions the same, just update forgotPassword]

// Forgot Password
export const forgotPassword = (emailData) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post(
            '/api/v1/password/forgot',
            emailData,
            config
        );

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message,
        });

    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response?.data?.message || error.message,
        });
    }
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {

        dispatch({ type: RESET_PASSWORD_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }

        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/password/reset/${token}`,
            passwords,
            config
        );

        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: RESET_PASSWORD_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Get All Users ---ADMIN
export const getAllUsers = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_USERS_REQUEST });
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/users`);
        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users,
        });

    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Get User Details ---ADMIN
export const getUserDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: USER_DETAILS_REQUEST });
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/user/${id}`);

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user,
        });

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Update User Details ---ADMIN
export const updateUser = (id, userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_USER_REQUEST });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }

        const { data } = await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/user/${id}`,
            userData,
            config
        );

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Delete User ---ADMIN
export const deleteUser = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_USER_REQUEST });
        const { data } = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/user/${id}`);

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success,
        });

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Clear All Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};

// Check Gold User Status
export const checkGoldUserStatus = () => async (dispatch) => {
  try {
    dispatch({ type: CHECK_GOLD_STATUS_REQUEST });

    const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/user/gold-status`, {
      withCredentials: true,
    });

    dispatch({
      type: CHECK_GOLD_STATUS_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    dispatch({
      type: CHECK_GOLD_STATUS_FAIL,
      payload: error.response?.data?.message || "Error checking Gold User status",
    });
    throw error;
  }
};

// Update Total Spent
export const updateTotalSpent = (amount) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TOTAL_SPENT_REQUEST });

    const { data } = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/update-spent`,
      { amount },
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: UPDATE_TOTAL_SPENT_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    dispatch({
      type: UPDATE_TOTAL_SPENT_FAIL,
      payload: error.response?.data?.message || "Error updating total spent",
    });
    throw error;
  }
};