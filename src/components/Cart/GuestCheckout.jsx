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

  const paymentMethodDiscount = (paymentMethod === "bkash" || paymentMethod === "nagad")
    ? Math.round((itemsSubtotal - goldDiscount) * 0.05)
    : 0;

  const grandTotal = Math.max(0, amountAfterGold - (couponDiscount || 0) - paymentMethodDiscount);

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
      <main className="w-full mt-36 md:mt-32 mb-16">
        <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="flex flex-col items-center text-center w-full ">
            <h1 className="text-3xl md:text-4xl font-display font-medium text-gray-900 mb-3 uppercase tracking-[0.1em]">
              {translations.title}
            </h1>
            <p className="text-gray-500 max-w-md text-sm mx-auto">
              {translations.subtitle}
            </p>
            <div className="w-10 h-[2px] bg-[var(--accent)] mt-5"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <div className="flex-1">
              <form onSubmit={submitHandler} className="flex flex-col gap-6 w-full">
                {/* Guest Information */}
                <div className="bg-white border border-gray-200 p-5 pt-4">
                  <h2 className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-5">
                    {translations.guestInfo}
                  </h2>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                        {translations.name}
                      </label>
                      <input
                        type="text"
                        value={guestInfo.name}
                        onChange={(e) => handleGuestInfoChange('name', e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 text-gray-900 focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-xs"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="space-y-1 flex-1">
                        <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                          {translations.email}
                        </label>
                        <input
                          type="email"
                          value={guestInfo.email}
                          onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-100 text-gray-900 focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-xs"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                          {translations.phone}
                        </label>
                        <input
                          type="tel"
                          value={guestInfo.phone}
                          onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-100 text-gray-900 focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white border border-gray-200 p-5 pt-4">
                  <h2 className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-5">
                    {language === "english" ? "Shipping Information" : "শিপিং তথ্য"}
                  </h2>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                        {language === "english" ? "Address" : "ঠিকানা"}
                      </label>
                      <input
                        type="text"
                        value={guestShippingInfo.address}
                        onChange={(e) => handleShippingInfoChange('address', e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 text-gray-900 focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-xs"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="space-y-1 flex-1">
                        <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                          {language === "english" ? "City" : "শহর"}
                        </label>
                        <input
                          type="text"
                          value={guestShippingInfo.city}
                          onChange={(e) => handleShippingInfoChange('city', e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-100 text-gray-900 focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-xs"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                          {language === "english" ? "District" : "জেলা"}
                        </label>
                        <div className="relative">
                          <select
                            value={guestShippingInfo.state}
                            onChange={(e) => handleShippingInfoChange('state', e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-100 text-gray-900 appearance-none focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-xs pr-8"
                          >
                            <option value="" disabled>Select District</option>
                            {districts.map((district) => (
                              <option key={district} value={district}>{district}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 w-full sm:w-[calc(50%-8px)]">
                      <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                        {language === "english" ? "Phone Number" : "ফোন নম্বর"}
                      </label>
                      <input
                        type="tel"
                        value={guestShippingInfo.phoneNo}
                        onChange={(e) => handleShippingInfoChange('phoneNo', e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 text-gray-900 focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-xs"
                      />
                    </div>

                    <div className="space-y-1 mt-1">
                      <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                        {language === "english" ? "Delivery Area" : "ডেলিভারি এলাকা"}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label
                          className={`flex items-center p-3 border cursor-pointer transition-all ${guestShippingInfo.deliveryArea === "inside"
                            ? "border-gray-900 ring-1 ring-gray-900 bg-gray-50/30"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                        >
                          <div className={`flex items-center justify-center w-4 h-4 rounded-full border mr-2 shrink-0 bg-white ${guestShippingInfo.deliveryArea === "inside" ? "border-gray-900" : "border-gray-300"}`}>
                            {guestShippingInfo.deliveryArea === "inside" && <div className="w-2 h-2 rounded-full bg-gray-900 block" style={{ backgroundColor: '#111827' }}></div>}
                          </div>
                          <input
                            type="radio"
                            name="deliveryArea"
                            value="inside"
                            checked={guestShippingInfo.deliveryArea === "inside"}
                            onChange={(e) => handleShippingInfoChange('deliveryArea', e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-xs text-gray-900">
                              {language === "english" ? "Inside Dhaka" : "ঢাকার ভিতরে"}
                            </span>
                            <span className="text-[10px] text-gray-500">৳70</span>
                          </div>
                        </label>

                        <label
                          className={`flex items-center p-3 border cursor-pointer transition-all ${guestShippingInfo.deliveryArea === "outside"
                            ? "border-gray-900 ring-1 ring-gray-900 bg-gray-50/30"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                        >
                          <div className={`flex items-center justify-center w-4 h-4 rounded-full border mr-2 shrink-0 bg-white ${guestShippingInfo.deliveryArea === "outside" ? "border-gray-900" : "border-gray-300"}`}>
                            {guestShippingInfo.deliveryArea === "outside" && <div className="w-2 h-2 rounded-full bg-gray-900 block" style={{ backgroundColor: '#111827' }}></div>}
                          </div>
                          <input
                            type="radio"
                            name="deliveryArea"
                            value="outside"
                            checked={guestShippingInfo.deliveryArea === "outside"}
                            onChange={(e) => handleShippingInfoChange('deliveryArea', e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-xs text-gray-900">
                              {language === "english" ? "Outside Dhaka" : "ঢাকার বাইরে"}
                            </span>
                            <span className="text-[10px] text-gray-500">৳130</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white border border-gray-200 p-5 pt-4">
                  <h2 className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-5">
                    {translations.paymentMethod}
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {[
                      { id: "cod", label: translations.cod, icon: "/money.png" },
                      { id: "bkash", label: translations.bkash, icon: "/bkash.png" },
                      { id: "nagad", label: translations.nagad, icon: "/Nagad.png" }
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex-1 flex items-center p-3 border cursor-pointer transition-all ${paymentMethod === method.id
                          ? "border-gray-900 ring-1 ring-gray-900 bg-gray-50/30"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                      >
                        <div className={`flex items-center justify-center w-4 h-4 rounded-full border mr-2 shrink-0 bg-white ${paymentMethod === method.id ? "border-gray-900" : "border-gray-300"}`}>
                          {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-gray-900 block" style={{ backgroundColor: '#111827' }}></div>}
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={handlePaymentMethodChange}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-2">
                          <img src={method.icon} alt={method.label} className="h-5 w-5 object-contain" />
                          <span className="font-bold text-xs whitespace-nowrap text-gray-900">
                            {method.label}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === "bkash" && (
                    <div className="bg-gray-50 p-4 border border-gray-200 mt-4 animate-fade-in-up">
                      <div className="flex flex-col gap-4">
                        <p className="text-xs font-semibold text-gray-800">
                          Send <span className="text-sm font-bold mx-1 text-[#E2136E]">৳{grandTotal.toLocaleString()}</span> to bKash Personal Number: <span className="font-bold tracking-wider ml-1 text-black">01912244011</span>
                        </p>
                        <p className="text-xs text-red-500 font-medium">
                          *You get a 5% discount for paying with bKash. Please enter the transaction number after sending the money.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="space-y-1 flex-1">
                            <label className="text-[10px] font-bold tracking-widest text-[#E2136E] uppercase">
                              {translations.bkashNumber}
                            </label>
                            <input
                              type="tel"
                              value={bKashNumber}
                              onChange={(e) => setBKashNumber(e.target.value)}
                              required
                              className="w-full px-3 py-2 bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#E2136E] transition-all text-xs"
                            />
                          </div>
                          <div className="space-y-1 flex-1">
                            <label className="text-[10px] font-bold tracking-widest text-[#E2136E] uppercase">
                              {translations.bkashTrxId}
                            </label>
                            <input
                              type="text"
                              value={bKashTrxId}
                              onChange={(e) => setBKashTrxId(e.target.value)}
                              required
                              className="w-full px-3 py-2 bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#E2136E] transition-all text-xs uppercase"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "nagad" && (
                    <div className="bg-gray-50 p-4 border border-gray-200 mt-4 animate-fade-in-up">
                      <div className="flex flex-col gap-4">
                        <p className="text-xs font-semibold text-gray-800">
                          Send <span className="text-sm font-bold mx-1 text-[#ED1C24]">৳{grandTotal.toLocaleString()}</span> to Nagad Personal Number: <span className="font-bold tracking-wider ml-1 text-black">01912244011</span>
                        </p>
                        <p className="text-xs text-red-500 font-medium">
                          *You get a 5% discount for paying with Nagad. Please enter the transaction number after sending the money.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="space-y-1 flex-1">
                            <label className="text-[10px] font-bold tracking-widest text-[#ED1C24] uppercase">
                              {translations.nagadNumber}
                            </label>
                            <input
                              type="tel"
                              value={nagadNumber}
                              onChange={(e) => setNagadNumber(e.target.value)}
                              required
                              className="w-full px-3 py-2 bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#ED1C24] transition-all text-xs"
                            />
                          </div>
                          <div className="space-y-1 flex-1">
                            <label className="text-[10px] font-bold tracking-widest text-[#ED1C24] uppercase">
                              {translations.nagadTrxId}
                            </label>
                            <input
                              type="text"
                              value={nagadTrxId}
                              onChange={(e) => setNagadTrxId(e.target.value)}
                              required
                              className="w-full px-3 py-2 bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#ED1C24] transition-all text-xs uppercase"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="w-full lg:w-[380px]">
              <div className="sticky top-24 space-y-6">
                <PriceSidebar
                  cartItems={cartItems}
                  guestShippingInfo={guestShippingInfo}
                  onSubmit={submitHandler}
                  isProcessing={isProcessing}
                  translations={translations}
                  btnText={translations.placeOrder}
                  paymentMethod={paymentMethod}
                />

                {/* Items In Your Order (Moved to Right Sidebar) */}
                <div className="bg-white border border-gray-200 p-5 pt-4">
                  <h2 className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-5">
                    {language === "english" ? "Items In Your Order" : "আপনার অর্ডারের আইটেম"}
                  </h2>
                  <div className="flex flex-col gap-4">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <div className="w-14 h-14 shrink-0 bg-white border border-gray-100 rounded overflow-hidden flex items-center justify-center p-1">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="font-bold text-gray-900 truncate text-[11px] leading-tight mb-1">{item.name}</p>
                          <p className="text-[10px] font-medium text-gray-400">Qty: {item.quantity} <span className="mx-1">•</span> ৳{item.price}</p>
                        </div>
                        <div className="font-bold text-gray-900 text-xs tracking-wide">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
              {paymentMethodDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{language === "english" ? "Payment Discount (5%)" : "পেমেন্ট ডিসকাউন্ট (৫%)"}</span>
                  <span>-৳{paymentMethodDiscount.toLocaleString()}</span>
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
