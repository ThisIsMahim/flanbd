import { useSnackbar } from "notistack";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { emptyCart } from "../../actions/cartAction";
import {
  clearErrors,
  getPaymentStatus,
  newOrder,
} from "../../actions/orderAction";
import { LanguageContext } from "../../utils/LanguageContext";
import Loader from "../Layouts/Loader";
// import { LanguageContext } from '../../../utils/LanguageContext';

const OrderStatus = () => {
  const { language } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { loading, txn, error } = useSelector((state) => state.paymentStatus);
  const {
    loading: orderLoading,
    order,
    error: orderError,
  } = useSelector((state) => state.newOrder);

  // Delivery charge logic
  let deliveryCharge = 0;
  if (shippingInfo && shippingInfo.state) {
    deliveryCharge = shippingInfo.state === "BD-01" ? 80 : 120;
  }
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const grandTotal = totalPrice + (deliveryCharge || 0);

  const orderData = {
    shippingInfo,
    orderItems: cartItems,
    totalPrice: grandTotal,
  };

  useEffect(() => {
    if (loading === false) {
      if (txn) {
        if (txn.status === "TXN_SUCCESS") {
          orderData.paymentInfo = {
            id: txn.id,
            status: txn.status,
          };

          dispatch(newOrder(orderData));
        } else {
          enqueueSnackbar(
            language === "english"
              ? "Processing Payment Failed!"
              : "পেমেন্ট প্রক্রিয়াকরণ ব্যর্থ হয়েছে!",
            { variant: "error" }
          );
          navigate("/orders/failed");
        }
      } else {
        navigate("/cart");
      }
    }
    // eslint-disable-next-line
  }, [loading]);

  useEffect(() => {
    if (orderLoading === false) {
      if (order) {
        enqueueSnackbar(
          language === "english" ? "Order Placed" : "অর্ডার দেওয়া হয়েছে",
          { variant: "success" }
        );
        dispatch(emptyCart());
        navigate("/orders/success");
      } else {
        navigate("/orders");
      }
    }
    // eslint-disable-next-line
  }, [orderLoading]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(
        language === "english"
          ? error
          : "পেমেন্ট স্ট্যাটাস চেক করতে সমস্যা হয়েছে",
        { variant: "error" }
      );
      dispatch(clearErrors());
    }
    if (orderError) {
      enqueueSnackbar(
        language === "english" ? orderError : "অর্ডার তৈরি করতে সমস্যা হয়েছে",
        { variant: "error" }
      );
      dispatch(clearErrors());
    }
    dispatch(getPaymentStatus(params.id));
  }, [dispatch, error, orderError, params.id, enqueueSnackbar, language]);

  return <Loader />;
};

export default OrderStatus;
