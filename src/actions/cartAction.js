import axios from "axios"
import { ADD_TO_CART, EMPTY_CART, REMOVE_FROM_CART, SAVE_SHIPPING_INFO, APPLY_COUPON, CLEAR_COUPON } from "../constants/cartConstants";

// add to cart
export const addItemsToCart = (id, quantity = 1, selectedImageUrl) => async (dispatch, getState) => {
    const apiBase = process.env.REACT_APP_BACKEND_URL || "";
    const { data } = await axios.get(`${apiBase}/api/v1/product/${id}`);

    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id,
            name: data.product.name,
            seller: data.product.brand.name,
            price: data.product.price,
            cuttedPrice: data.product.cuttedPrice,
            image: selectedImageUrl || data.product.images[0].url,
            stock: data.product.stock,
            quantity,
            selectedImageUrl: selectedImageUrl || data.product.images[0].url,
        },
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    
    // Dispatch custom event to open CartDrawer only on desktop
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
        window.dispatchEvent(new CustomEvent('openCartDrawer'));
    }
}

// remove cart item
export const removeItemsFromCart = (id) => async (dispatch, getState) => {

    dispatch({
        type: REMOVE_FROM_CART,
        payload: id,
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

// empty cart
export const emptyCart = () => async (dispatch, getState) => {

    dispatch({ type: EMPTY_CART });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

// save shipping info
export const saveShippingInfo = (data) => async (dispatch) => {

    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data,
    });

    localStorage.setItem('shippingInfo', JSON.stringify(data));
}

// apply coupon (validate via backend)
export const applyCoupon = (code, amount) => async (dispatch, getState) => {
    try {
        const { data } = await axios.get(`/api/v1/coupons/validate?code=${encodeURIComponent(code)}&amount=${amount}`);
        const coupon = { code: data.coupon.code, type: data.coupon.type, value: data.coupon.value };
        dispatch({ type: APPLY_COUPON, payload: coupon });
        localStorage.setItem('coupon', JSON.stringify(coupon));
        return coupon;
    } catch (error) {
        // Bubble up error so UI can show message
        throw error;
    }
}

export const clearCoupon = () => async (dispatch) => {
    dispatch({ type: CLEAR_COUPON });
    localStorage.removeItem('coupon');
}