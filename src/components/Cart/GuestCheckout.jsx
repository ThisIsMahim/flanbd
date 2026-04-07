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
  Typography,
  Box,
  Paper,
  Grid,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { emptyCart, clearCoupon } from "../../actions/cartAction";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";
import PriceSidebar from "./PriceSidebar";

const GuestCheckout = () => {
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

  // Guest user information
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Shipping information for guest users
  const [guestShippingInfo, setGuestShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "Bangladesh",
    pincode: "",
    phoneNo: "",
    deliveryArea: "inside",
  });

  const { shippingInfo: cartShippingInfo, cartItems, coupon } = useSelector((state) => state.cart);
  const { error } = useSelector((state) => state.newOrder);

  // Delivery charge logic
  let deliveryCharge = 0;
  if (guestShippingInfo.deliveryArea) {
    deliveryCharge = guestShippingInfo.deliveryArea === "inside" ? 70 : 130;
  }

  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Guest users don't get gold discount
  const goldDiscount = 0;
  const amountAfterGold = Math.max(0, (itemsSubtotal - goldDiscount) + (deliveryCharge || 0));
  const couponDiscount = coupon?.type === 'percent'
    ? Math.round((amountAfterGold * (coupon?.value || 0)) / 100)
    : (coupon?.value || 0);
  const grandTotal = Math.max(0, amountAfterGold - (couponDiscount || 0));

  // Translations
  const translations = {
    title: language === "english" ? "Guest Checkout" : "অতিথি চেকআউট",
    subtitle: language === "english" ? "Complete your purchase without creating an account" : "অ্যাকাউন্ট তৈরি না করে আপনার কেনাকাটা সম্পূর্ণ করুন",
    guestInfo: language === "english" ? "Guest Information" : "অতিথি তথ্য",
    name: language === "english" ? "Full Name" : "পূর্ণ নাম",
    email: language === "english" ? "Email Address" : "ইমেইল ঠিকানা",
    phone: language === "english" ? "Phone Number" : "ফোন নম্বর",
    paymentMethod: language === "english" ? "Payment Method" : "পেমেন্ট পদ্ধতি",
    cod: language === "english" ? "Cash on Delivery" : "ক্যাশ অন ডেলিভারি",
    bkash: language === "english" ? "bKash" : "বিকাশ",
    nagad: language === "english" ? "Nagad" : "নগদ",
    bkashNumber: language === "english" ? "bKash Number" : "বিকাশ নম্বর",
    bkashTrxId: language === "english" ? "bKash Transaction ID" : "বিকাশ লেনদেন আইডি",
    nagadNumber: language === "english" ? "Nagad Number" : "নগদ নম্বর",
    nagadTrxId: language === "english" ? "Nagad Transaction ID" : "নগদ লেনদেন আইডি",
    placeOrder: language === "english" ? "PLACE ORDER" : "অর্ডার করুন",
    orderSuccess: language === "english" ? "Order placed successfully!" : "অর্ডার সফলভাবে দেওয়া হয়েছে!",
    paymentFailed: language === "english" ? "Payment failed!" : "পেমেন্ট ব্যর্থ হয়েছে!",
    missingInfo: (method) => language === "english" 
      ? `Please provide ${method} number and transaction ID` 
      : `${method} নম্বর এবং লেনদেন আইডি প্রদান করুন`,
    confirmOrder: language === "english" ? "Confirm Order" : "অর্ডার নিশ্চিত করুন",
    confirmMessage: language === "english" 
      ? "Are you sure you want to place this order?" 
      : "আপনি কি এই অর্ডারটি দিতে নিশ্চিত?",
    cancel: language === "english" ? "Cancel" : "বাতিল করুন",
    confirm: language === "english" ? "Confirm" : "নিশ্চিত করুন",
  };

  // Bangladesh Districts List
  const districts = [
    "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh",
    "Cumilla", "Noakhali", "Chandpur", "Lakshmipur", "Feni", "Brahmanbaria", "Kishoreganj", "Netrokona",
    "Jamalpur", "Sherpur", "Tangail", "Gazipur", "Narayanganj", "Manikganj", "Munshiganj",
    "Faridpur", "Gopalganj", "Madaripur", "Shariatpur", "Rajbari", "Pabna", "Natore", "Sirajganj",
    "Bogra", "Joypurhat", "Naogaon", "Chapainawabganj", "Jessore", "Jhenaidah", "Magura", "Narail",
    "Kushtia", "Meherpur", "Chuadanga", "Satkhira", "Bagerhat", "Jhalokati",
    "Pirojpur", "Barguna", "Patuakhali", "Bhola", "Bandarban", "Rangamati", "Khagrachhari", "Cox's Bazar"
  ];

  const handleGuestInfoChange = (field, value) => {
    setGuestInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShippingInfoChange = (field, value) => {
    setGuestShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const validateGuestInfo = () => {
    if (!guestInfo.name.trim()) {
      enqueueSnackbar(translations.name + " is required", { variant: "error" });
      return false;
    }
    if (!guestInfo.email.trim()) {
      enqueueSnackbar(translations.email + " is required", { variant: "error" });
      return false;
    }
    if (!guestInfo.phone.trim()) {
      enqueueSnackbar(translations.phone + " is required", { variant: "error" });
      return false;
    }
    if (!guestShippingInfo.address.trim()) {
      enqueueSnackbar("Address is required", { variant: "error" });
      return false;
    }
    if (!guestShippingInfo.city.trim()) {
      enqueueSnackbar("City is required", { variant: "error" });
      return false;
    }
    if (!guestShippingInfo.state.trim()) {
      enqueueSnackbar("District is required", { variant: "error" });
      return false;
    }
    if (!guestShippingInfo.phoneNo.trim()) {
      enqueueSnackbar("Phone number is required", { variant: "error" });
      return false;
    }
    return true;
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
            : guestShippingInfo.phoneNo || guestInfo.phone,
        timestamp: new Date().toISOString(),
      };

      const orderData = {
        shippingInfo: { 
          ...guestShippingInfo,
          pincode: guestShippingInfo.pincode || "0000",
        },
        orderItems: cartItems,
        totalPrice: grandTotal,
        paymentInfo,
        couponCode: coupon?.code,
        guestUser: guestInfo,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post('/api/v1/order/guest/new', orderData, config);

      dispatch(clearCoupon());
      dispatch(emptyCart());
      enqueueSnackbar(translations.orderSuccess, { variant: "success" });
      navigate("/guest-order-tracking", {
        state: {
          order: data?.order,
          email: guestInfo.email,
          phone: guestInfo.phone,
        },
        replace: true,
      });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || translations.paymentFailed, {
        variant: "error",
      });
    } finally {
      setIsProcessing(false);
      setOpenDialog(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateGuestInfo()) {
      return;
    }

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
      }
      setOpenDialog(true);
    } catch (error) {
      enqueueSnackbar(error.message || translations.paymentFailed, {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  }, [error, enqueueSnackbar]);

  // Redirect to cart if no items, but avoid redirecting during processing/confirmation
  // useEffect(() => {
  //   if (cartItems.length === 0 && !isProcessing && !openDialog) {
  //     navigate("/cart");
  //   }
  // }, [cartItems.length, isProcessing, openDialog, navigate]);

  return (
    <>
      <MetaData title="Guest Checkout" />
      <main className="w-full mt-20 md:mt-24 mb-16">
        <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <Typography variant="h4" component="h1" gutterBottom className="font-bold text-[var(--primary-blue-dark)]">
            {translations.title}
          </Typography>
          <Typography variant="body1" className="mb-6 text-gray-500">
            {translations.subtitle}
          </Typography>

          <div className="flex flex-col lg:flex-row gap-8 w-full">
            <div className="flex-1">
                <form onSubmit={submitHandler} className="space-y-8">
                  {/* Guest Information */}
                  <Box mb={4}>
                    <Typography variant="h6" gutterBottom className="font-semibold text-gray-800 border-b pb-2 mb-4">
                      {translations.guestInfo}
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label={translations.name}
                          value={guestInfo.name}
                          onChange={(e) => handleGuestInfoChange('name', e.target.value)}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={translations.email}
                          type="email"
                          value={guestInfo.email}
                          onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={translations.phone}
                          value={guestInfo.phone}
                          onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                          required
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Shipping Information */}
                  <Box mb={4}>
                    <Typography variant="h6" gutterBottom className="font-semibold text-gray-800 border-b pb-2 mb-4">
                      {language === "english" ? "Shipping Information" : "শিপিং তথ্য"}
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label={language === "english" ? "Address" : "ঠিকানা"}
                          value={guestShippingInfo.address}
                          onChange={(e) => handleShippingInfoChange('address', e.target.value)}
                          required
                          variant="outlined"
                          multiline
                          rows={2}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={language === "english" ? "City" : "শহর"}
                          value={guestShippingInfo.city}
                          onChange={(e) => handleShippingInfoChange('city', e.target.value)}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required variant="outlined">
                          <InputLabel>{language === "english" ? "District" : "জেলা"}</InputLabel>
                          <Select
                          value={guestShippingInfo.state}
                          onChange={(e) => handleShippingInfoChange('state', e.target.value)}
                            label={language === "english" ? "District" : "জেলা"}
                          >
                            {districts.map((district) => (
                              <MenuItem key={district} value={district}>
                                {district}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      {/* <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={language === "english" ? "Pincode (Optional)" : "পিনকোড (ঐচ্ছিক)"}
                          value={guestShippingInfo.pincode}
                          onChange={(e) => handleShippingInfoChange('pincode', e.target.value)}
                          variant="outlined"
                        />
                      </Grid> */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label={language === "english" ? "Phone Number" : "ফোন নম্বর"}
                          value={guestShippingInfo.phoneNo}
                          onChange={(e) => handleShippingInfoChange('phoneNo', e.target.value)}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <Typography variant="subtitle2" gutterBottom>
                            {language === "english" ? "Delivery Area" : "ডেলিভারি এলাকা"}
                          </Typography>
                          <RadioGroup
                            value={guestShippingInfo.deliveryArea}
                            onChange={(e) => handleShippingInfoChange('deliveryArea', e.target.value)}
                            row
                          >
                            <FormControlLabel
                              value="inside"
                              control={<Radio />}
                              label={language === "english" ? "Inside Dhaka (৳70)" : "ঢাকার ভিতরে (৳৭০)"}
                            />
                            <FormControlLabel
                              value="outside"
                              control={<Radio />}
                              label={language === "english" ? "Outside Dhaka (৳130)" : "ঢাকার বাইরে (৳১৩০)"}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Items In Your Order */}
                  <Box mb={4}>
                    <Typography variant="h6" gutterBottom className="font-semibold text-gray-800 border-b pb-2 mb-4">
                      {language === "english" ? "Items In Your Order" : "আপনার অর্ডারের আইটেম"}
                    </Typography>
                    <div className="bg-gray-50 rounded border divide-y">
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3">
                          <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-[var(--primary-blue-dark)]">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity} × ৳{item.price}</p>
                          </div>
                          <div className="font-semibold">৳{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </Box>

                  {/* Payment Method */}
                  <Box mb={4}>
                    <Typography variant="h6" gutterBottom className="font-semibold text-gray-800 border-b pb-2 mb-4">
                      {translations.paymentMethod}
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={paymentMethod}
                        onChange={handlePaymentMethodChange}
                      >
                        <FormControlLabel
                          value="cod"
                          control={<Radio />}
                          label={translations.cod}
                        />
                        <FormControlLabel
                          value="bkash"
                          control={<Radio />}
                          label={translations.bkash}
                        />
                        <FormControlLabel
                          value="nagad"
                          control={<Radio />}
                          label={translations.nagad}
                        />
                      </RadioGroup>
                    </FormControl>

                    {/* Payment Details */}
                    {paymentMethod === "bkash" && (
                      <Box mt={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label={translations.bkashNumber}
                              value={bKashNumber}
                              onChange={(e) => setBKashNumber(e.target.value)}
                              required
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label={translations.bkashTrxId}
                              value={bKashTrxId}
                              onChange={(e) => setBKashTrxId(e.target.value)}
                              required
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {paymentMethod === "nagad" && (
                      <Box mt={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label={translations.nagadNumber}
                              value={nagadNumber}
                              onChange={(e) => setNagadNumber(e.target.value)}
                              required
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label={translations.nagadTrxId}
                              value={nagadTrxId}
                              onChange={(e) => setNagadTrxId(e.target.value)}
                              required
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>

                </form>
            </div>

            <div className="w-full lg:w-[400px]">
              <div className="sticky top-24">
                <PriceSidebar 
                  cartItems={cartItems} 
                  guestShippingInfo={guestShippingInfo}
                  onSubmit={submitHandler}
                  isProcessing={isProcessing}
                  translations={translations}
                  btnText={translations.placeOrder}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{translations.confirmOrder}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText className="mb-3">
            {translations.confirmMessage}
          </DialogContentText>

          {/* Guest & Shipping Summary */}
          <Box className="space-y-3">
            <Box className="bg-gray-50 p-3 rounded">
              <Typography variant="subtitle2" gutterBottom>
                {language === "english" ? "Guest Information" : "অতিথি তথ্য"}
              </Typography>
              <Typography variant="body2"><strong>Name:</strong> {guestInfo.name || "-"}</Typography>
              <Typography variant="body2"><strong>Email:</strong> {guestInfo.email || "-"}</Typography>
              <Typography variant="body2"><strong>Phone:</strong> {guestInfo.phone || "-"}</Typography>
            </Box>

            <Box className="bg-gray-50 p-3 rounded">
              <Typography variant="subtitle2" gutterBottom>
                {language === "english" ? "Delivery Address" : "ডেলিভারি ঠিকানা"}
              </Typography>
              <Typography variant="body2">{guestShippingInfo.address}</Typography>
              <Typography variant="body2">{guestShippingInfo.city}, {guestShippingInfo.state}</Typography>
              <Typography variant="body2">{guestShippingInfo.country} - {(guestShippingInfo.pincode || "0000")}</Typography>
              <Typography variant="body2">{language === "english" ? "Phone:" : "ফোন:"} {guestShippingInfo.phoneNo}</Typography>
              <Typography variant="body2">
                {language === "english" ? "Area:" : "এলাকা:"} {guestShippingInfo.deliveryArea === "inside" ? (language === "english" ? "Inside Dhaka" : "ঢাকার ভিতরে") : (language === "english" ? "Outside Dhaka" : "ঢাকার বাইরে")} (৳{deliveryCharge})
              </Typography>
            </Box>

            {/* Items brief */}
            <Box className="bg-gray-50 p-3 rounded">
              <Typography variant="subtitle2" gutterBottom>
                {language === "english" ? "Items" : "আইটেম"}
              </Typography>
              <div className="divide-y">
                {cartItems.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1">
                    <span className="truncate mr-2">{item.name}</span>
                    <span>×{item.quantity}</span>
                    <span>৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <Typography variant="caption" color="textSecondary">
                    +{cartItems.length - 3} more
                  </Typography>
                )}
              </div>
            </Box>

            {/* Payment & Totals */}
            <Box className="bg-gray-50 p-3 rounded">
              <Typography variant="subtitle2" gutterBottom>
                {language === "english" ? "Payment & Total" : "পেমেন্ট ও মোট"}
              </Typography>
              <Typography variant="body2">
                <strong>{language === "english" ? "Method:" : "পদ্ধতি:"}</strong> {paymentMethod === "cod" ? translations.cod : paymentMethod === "bkash" ? translations.bkash : translations.nagad}
              </Typography>
              <div className="flex justify-between text-sm mt-1">
                <span>{language === "english" ? "Items Subtotal" : "আইটেম উপমোট"}</span>
                <span>৳{itemsSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{language === "english" ? "Delivery" : "ডেলিভারি"}</span>
                <span>৳{deliveryCharge.toLocaleString()}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{language === "english" ? "Coupon" : "কুপন"}</span>
                  <span>-৳{(couponDiscount || 0).toLocaleString()}</span>
                </div>
              )}
              <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                <span>{language === "english" ? "Total" : "মোট"}</span>
                <span>৳{grandTotal.toLocaleString()}</span>
              </div>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {translations.cancel}
          </Button>
          <Button onClick={handleVerifyPayment} color="primary" disabled={isProcessing}>
            {isProcessing ? (
              <CircularProgress size={20} />
            ) : (
              translations.confirm
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GuestCheckout;
