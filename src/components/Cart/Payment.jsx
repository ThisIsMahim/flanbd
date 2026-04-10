import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { emptyCart, clearCoupon, applyCoupon } from "../../actions/cartAction";
import { clearErrors, newOrder } from "../../actions/orderAction";
import { LanguageContext } from "../../utils/LanguageContext";
import { post } from "../../utils/paytmForm";
import MetaData from "../Layouts/MetaData";
import PriceSidebar from "./PriceSidebar";
import Stepper from "./Stepper";
// import { LanguageContext } from '../../../utils/LanguageContext';

const Payment = () => {
  const { language } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [bKashNumber, setBKashNumber] = useState("");
  const [bKashTrxId, setBKashTrxId] = useState("");
  const [nagadNumber, setNagadNumber] = useState("");
  const [nagadTrxId, setNagadTrxId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const { shippingInfo, cartItems, coupon } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  // Delivery charge logic (aligned with Shipping selection)
  let deliveryCharge = 0;
  if (shippingInfo) {
    deliveryCharge = shippingInfo.deliveryArea === "inside" ? 70 : 130;
  }

  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  // Gold discount (10%) on items only, then add delivery, then coupon
  // We need myOrdersSummary state; but to avoid duplicating logic, mirror sidebar without fetching again here
  const goldSummary = useSelector((state) => state.myOrdersSummary?.summary);
  const isGold = !!goldSummary?.isGold;
  const goldDiscount = isGold ? Math.round(itemsSubtotal * 0.10) : 0;
  const amountAfterGold = Math.max(0, (itemsSubtotal - goldDiscount) + (deliveryCharge || 0));
  const couponDiscount = coupon?.type === 'percent'
    ? Math.round((amountAfterGold * (coupon?.value || 0)) / 100)
    : (coupon?.value || 0);
  const grandTotal = Math.max(0, amountAfterGold - (couponDiscount || 0));

  // Translations
  const translations = {
    title: language === "english" ? "Secure Payment" : "নিরাপদ পেমেন্ট",
    payWith: language === "english" ? "Pay with" : "পেমেন্ট করুন",
    paymentMethod: language === "english" ? "Payment Method" : "পেমেন্ট পদ্ধতি",
    sendAmount: (amount, method, number) =>
      language === "english"
        ? `Send ৳${amount} to ${method}: ${number}`
        : `${method} এ ${amount} টাকা পাঠান: ${number}`,
    yourNumber: (method) =>
      language === "english"
        ? `Your ${method} Number`
        : `আপনার ${method} নাম্বার`,
    transactionId:
      language === "english" ? "Transaction ID" : "ট্রানজেকশন আইডি",
    confirmPayment: (method) =>
      language === "english"
        ? `Confirm ${method} Payment`
        : `${method} পেমেন্ট নিশ্চিত করুন`,
    verifyPayment:
      language === "english"
        ? "Verify Your Payment"
        : "আপনার পেমেন্ট যাচাই করুন",
    verifyAddress:
      language === "english"
        ? "Verify Your Address"
        : "আপনার ঠিকানা যাচাই করুন",
    paymentConfirmation:
      language === "english"
        ? "Please confirm you've completed the payment:"
        : "অনুগ্রহ করে নিশ্চিত করুন যে আপনি পেমেন্ট সম্পন্ন করেছেন:",
    addressConfirmation:
      language === "english"
        ? "Please confirm your delivery address:"
        : "অনুগ্রহ করে আপনার ডেলিভারি ঠিকানা নিশ্চিত করুন:",
    amount: language === "english" ? "Amount" : "পরিমাণ",
    deliveryAddress:
      language === "english" ? "Delivery Address" : "ডেলিভারি ঠিকানা",
    phoneNumber: language === "english" ? "Phone Number" : "ফোন নম্বর",
    from: language === "english" ? "From" : "থেকে",
    cancel: language === "english" ? "Cancel" : "বাতিল",
    processing:
      language === "english" ? "Processing..." : "প্রক্রিয়াকরণ চলছে...",
    orderSuccess:
      language === "english"
        ? "Order placed successfully!"
        : "অর্ডার সফলভাবে দেওয়া হয়েছে!",
    paymentFailed:
      language === "english"
        ? "Payment processing failed"
        : "পেমেন্ট প্রক্রিয়াকরণ ব্যর্থ হয়েছে",
    missingInfo: (method) =>
      language === "english"
        ? `Please enter ${method} number and transaction ID`
        : `অনুগ্রহ করে ${method} নাম্বার এবং ট্রানজেকশন আইডি লিখুন`,
    payAmount: (amount) =>
      language === "english" ? `Pay ৳${amount}` : `পেমেন্ট করুন ৳${amount}`,
    confirmCOD:
      language === "english"
        ? "Confirm Cash On Delivery"
        : "ক্যাশ অন ডেলিভারি নিশ্চিত করুন",
    placeOrder: language === "english" ? "Place Order" : "অর্ডার করুন",
    orderSummary: language === "english" ? "Order Summary" : "অর্ডার সারসংক্ষেপ",
    itemsSubtotal: language === "english" ? "Items Subtotal" : "আইটেম উপমোট",
    goldDiscount: language === "english" ? "Gold Discount" : "গোল্ড ছাড়",
    deliveryCharge: language === "english" ? "Delivery Charge" : "ডেলিভারি চার্জ",
    couponDiscount: language === "english" ? "Coupon Discount" : "কুপন ছাড়",
    total: language === "english" ? "Total" : "মোট",
    youSave: language === "english" ? "You will save" : "আপনি সাশ্রয় করবেন",
    onThisOrder: language === "english" ? "on this order" : "এই অর্ডারে",
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    try {
      const amountAfterGold = Math.max(0, (itemsSubtotal - goldDiscount) + (deliveryCharge || 0));
      await dispatch(applyCoupon(couponCode, amountAfterGold));
      setCouponCode("");
      enqueueSnackbar("Coupon applied successfully!", { variant: "success" });
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to apply coupon";
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleVerifyPayment = async () => {
    setIsProcessing(true);

    try {
      const paymentInfo = {
        id: uuidv4(),
        method: paymentMethod,
        status: paymentMethod === "cod" ? "pending" : "completed",
        transactionId:
          paymentMethod === "bkash"
            ? bKashTrxId
            : paymentMethod === "nagad"
              ? nagadTrxId
              : uuidv4(),
        amount: grandTotal,
        phoneNumber:
          paymentMethod === "bkash"
            ? bKashNumber
            : paymentMethod === "nagad"
              ? nagadNumber
              : shippingInfo.phoneNo,
        timestamp: new Date().toISOString(),
      };

      await dispatch(
        newOrder({
          shippingInfo,
          orderItems: cartItems,
          totalPrice: grandTotal,
          paymentInfo,
          couponCode: coupon?.code,
        })
      );

      dispatch(clearCoupon());
      dispatch(emptyCart());
      enqueueSnackbar(translations.orderSuccess, { variant: "success" });
      navigate("/order/success");
    } catch (error) {
      enqueueSnackbar(error.message || translations.paymentFailed, {
        variant: "error",
      });
    } finally {
      setIsProcessing(false);
      setOpenDialog(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (paymentMethod === "bkash" || paymentMethod === "nagad") {
        if (
          (paymentMethod === "bkash" && (!bKashNumber || !bKashTrxId)) ||
          (paymentMethod === "nagad" && (!nagadNumber || !nagadTrxId))
        ) {
          enqueueSnackbar(translations.missingInfo(paymentMethod), {
            variant: "error",
          });
          return;
        }

        setOpenDialog(true);
      } else if (paymentMethod === "cod") {
        setOpenDialog(true);
      }
    } catch (error) {
      enqueueSnackbar(error.message || translations.paymentFailed, {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
      enqueueSnackbar(error, { variant: "error" });
    }
  }, [dispatch, error, enqueueSnackbar]);

  // Format the address for display
  const formattedAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}`;

  return (
    <>
      <MetaData title={translations.title} />

      <main className="w-full mt-32">
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">
          <div className="flex-1">
            <Stepper activeStep={3}>
              <div className="w-full bg-white md:p-8 p-4 rounded-b-xl shadow-sm border-x border-b border-gray-100 text-gray-900">
                <form onSubmit={submitHandler} className="flex flex-col gap-4">
                  <FormControl component="fieldset">
                    <h2 className="text-lg font-medium mb-4">
                      {translations.paymentMethod}
                    </h2>
                    <RadioGroup
                      aria-label="payment method"
                      name="paymentMethod"
                      value={paymentMethod}
                      onChange={handlePaymentMethodChange}
                    >
                      {/* Cash On Delivery Option */}
                      <FormControlLabel
                        value="cod"
                        control={<Radio color="primary" />}
                        label={
                          <div className="flex items-center gap-3">
                            <img
                              src="/money.png"
                              alt="Cash On Delivery"
                              className="h-6 w-6"
                            />
                            <span>Cash On Delivery</span>
                          </div>
                        }
                      />

                      {/* bKash Option */}
                      <FormControlLabel
                        value="bkash"
                        control={<Radio color="primary" />}
                        label={
                          <div className="flex items-center gap-3">
                            <img
                              src="/bkash.png"
                              alt="bKash"
                              className="h-6 w-6"
                            />
                            <span>bKash</span>
                          </div>
                        }
                      />
                      {paymentMethod === "bkash" && (
                        <div className="ml-8 mt-2 space-y-3">
                          <div className="text-sm text-gray-600">
                            {translations.sendAmount(
                              itemsSubtotal.toFixed(2),
                              "bKash",
                              "017XX-XXXXXX"
                            )}
                          </div>
                          <TextField
                            label={translations.yourNumber("bKash")}
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={bKashNumber}
                            onChange={(e) => setBKashNumber(e.target.value)}
                            required
                          />
                          <TextField
                            label={translations.transactionId}
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={bKashTrxId}
                            onChange={(e) => setBKashTrxId(e.target.value)}
                            required
                          />
                        </div>
                      )}

                      {/* Nagad Option */}
                      <FormControlLabel
                        value="nagad"
                        control={<Radio color="primary" />}
                        label={
                          <div className="flex items-center gap-3">
                            <img
                              src="/Nagad.png"
                              alt="Nagad"
                              className="h-6 w-6"
                            />
                            <span>Nagad</span>
                          </div>
                        }
                      />
                      {paymentMethod === "nagad" && (
                        <div className="ml-8 mt-2 space-y-3">
                          <div className="text-sm text-gray-600">
                            {translations.sendAmount(
                              itemsSubtotal.toFixed(2),
                              "Nagad",
                              "017XX-XXXXXX"
                            )}
                          </div>
                          <TextField
                            label={translations.yourNumber("Nagad")}
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={nagadNumber}
                            onChange={(e) => setNagadNumber(e.target.value)}
                            required
                          />
                          <TextField
                            label={translations.transactionId}
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={nagadTrxId}
                            onChange={(e) => setNagadTrxId(e.target.value)}
                            required
                          />
                        </div>
                      )}
                    </RadioGroup>
                  </FormControl>

                  {/* Mobile Order Summary - Only visible on mobile */}
                  <div className="block sm:hidden bg-white rounded-lg shadow mb-4">
                    <h1 className="px-6 py-3 border-b font-medium text-[var(--primary-blue-dark)] text-lg">
                      PRICE DETAILS
                    </h1>

                    <div className="flex flex-col gap-4 p-6 pb-3 text-[var(--primary-blue-dark)]">
                      {/* Price (items) */}
                      <p className="flex justify-between">
                        <span>Price ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                        <span>৳{cartItems.reduce((sum, item) => sum + item.cuttedPrice * item.quantity, 0).toLocaleString()}</span>
                      </p>

                      {/* Discount */}
                      <p className="flex justify-between">
                        <span>Discount</span>
                        <span className="text-[#118c4f] font-medium">
                          - ৳{cartItems.reduce((sum, item) => sum + (item.cuttedPrice * item.quantity - item.price * item.quantity), 0).toLocaleString()}
                        </span>
                      </p>

                      {/* Delivery Charges */}
                      <p className="flex justify-between">
                        <span>Delivery Charges</span>
                        <span className="text-[#118c4f] font-medium">
                          ৳{deliveryCharge}{shippingInfo?.deliveryArea === 'inside' ? ' (inside Dhaka)' : shippingInfo?.deliveryArea === 'outside' ? ' (outside Dhaka)' : ''}
                        </span>
                      </p>

                      {/* Gold User Additional Discount */}
                      {isGold && (
                        <p className="flex justify-between">
                          <span>Gold User Additional Discount (10%)</span>
                          <span className="text-[#118c4f] font-medium">- ৳{goldDiscount.toLocaleString()}</span>
                        </p>
                      )}

                      {/* Coupon Discount */}
                      {coupon && (
                        <p className="flex justify-between">
                          <span>Coupon ({coupon.code})</span>
                          <span className="text-[#118c4f] font-medium">- ৳{(couponDiscount || 0).toLocaleString()}</span>
                        </p>
                      )}

                      <div className="border border-dashed"></div>

                      {/* Coupon Code Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Coupon code"
                          className="flex-1 px-3 py-2 border rounded text-sm"
                          value={couponCode || ''}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={applyingCoupon}
                          className="px-4 py-2 rounded text-sm font-medium"
                          style={{
                            backgroundColor: 'rgb(243,233,85)',
                            color: '#0f172a',
                            border: '2px solid rgb(243,233,85)'
                          }}
                        >
                          Apply
                        </button>
                        {coupon && (
                          <button
                            onClick={() => dispatch(clearCoupon())}
                            className="px-3 py-2 rounded border text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="border border-dashed"></div>

                      {/* Total Amount */}
                      <p className="flex justify-between text-lg font-medium">
                        <span>Total Amount</span>
                        <span>৳{grandTotal.toLocaleString()}</span>
                      </p>

                      <div className="border border-dashed"></div>

                      {/* Savings Message */}
                      <p className="font-medium text-[#118c4f] text-sm">
                        You will save ৳{((cartItems.reduce((sum, item) => sum + (item.cuttedPrice * item.quantity - item.price * item.quantity), 0)) + (goldDiscount || 0) + (couponDiscount || 0)).toLocaleString()} on this order
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-6 w-full py-3 bg-[#111827] hover:bg-[#ff0022] text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-all outline-none rounded shadow-sm hover:shadow-md"
                  >
                    {paymentMethod === "cod"
                      ? translations.placeOrder
                      : translations.confirmPayment(
                        paymentMethod === "bkash" ? "bKash" : "Nagad"
                      )}
                  </button>
                </form>
              </div>
            </Stepper>
          </div>

          <PriceSidebar cartItems={cartItems} />
        </div>
      </main>

      {/* Payment/Address Verification Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => !isProcessing && setOpenDialog(false)}
      >
        <DialogTitle>
          {paymentMethod === "cod"
            ? translations.verifyAddress
            : translations.verifyPayment}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className="space-y-2">
              {paymentMethod === "cod" ? (
                <p>{translations.addressConfirmation}</p>
              ) : (
                <p>{translations.paymentConfirmation}</p>
              )}
              <div className="font-semibold">
                <p>
                  {translations.amount}: ৳{grandTotal.toFixed(2)}
                </p>
                {paymentMethod === "cod" ? (
                  <>
                    <p>
                      {translations.deliveryAddress}: {formattedAddress}
                    </p>
                    <p>
                      {translations.phoneNumber}: {shippingInfo.phoneNo}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      {translations.transactionId}:{" "}
                      {paymentMethod === "bkash" ? bKashTrxId : nagadTrxId}
                    </p>
                    <p>
                      {translations.from}:{" "}
                      {paymentMethod === "bkash" ? bKashNumber : nagadNumber}
                    </p>
                  </>
                )}
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            disabled={isProcessing}
            color="inherit"
          >
            {translations.cancel}
          </Button>
          <Button
            onClick={handleVerifyPayment}
            variant="contained"
            sx={{
              backgroundColor: "#111827",
              "&:hover": {
                backgroundColor: "#ff0022",
              },
            }}
            disabled={isProcessing}
            startIcon={
              isProcessing ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isProcessing
              ? translations.processing
              : paymentMethod === "cod"
                ? translations.confirmCOD
                : translations.confirmPayment("")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Payment;
