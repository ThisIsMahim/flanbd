import { useContext, useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";

import SearchIcon from "@mui/icons-material/Search";
import ShippingIcon from "@mui/icons-material/LocalShipping";
import DeliveredIcon from "@mui/icons-material/CheckCircle";
import ProcessingIcon from "@mui/icons-material/Schedule";
import CancelledIcon from "@mui/icons-material/Cancel";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CircularProgress from "@mui/material/CircularProgress";

const GuestOrderTracking = () => {
  const { language } = useContext(LanguageContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.user || {});

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const state = location?.state;
    if (state?.order) setOrder(state.order);
    if (state?.email) setEmail(state.email);
    if (state?.phone) setPhone(state.phone);
  }, [location?.state]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "processing": return <ProcessingIcon sx={{ fontSize: 18 }} className="text-yellow-500" />;
      case "shipped": return <ShippingIcon sx={{ fontSize: 18 }} className="text-blue-500" />;
      case "delivered": return <DeliveredIcon sx={{ fontSize: 18 }} className="text-green-500" />;
      case "cancelled": return <CancelledIcon sx={{ fontSize: 18 }} className="text-red-500" />;
      default: return <ProcessingIcon sx={{ fontSize: 18 }} className="text-yellow-500" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "processing": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "shipped": return "bg-blue-50 text-blue-700 border-blue-200";
      case "delivered": return "bg-green-50 text-green-700 border-green-200";
      case "cancelled": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const t = (eng, ben) => language === "english" ? eng : ben;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim() || !phone.trim()) {
      setError(t("Please enter both email and phone number", "অনুগ্রহ করে ইমেইল এবং ফোন নম্বর উভয়ই দিন"));
      return;
    }
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const { data } = await axios.post('/api/v1/order/guest/find', {
        email: email.trim(),
        phone: phone.trim()
      });
      setOrder(data.order);
    } catch (err) {
      setError(err.response?.data?.message || t("Order not found", "অর্ডার পাওয়া যায়নি"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-40 pb-10">
      <MetaData title={t("Track Order | Flan", "অর্ডার ট্র্যাক | Flan")} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-3">
            {t("Track Your Order", "আপনার অর্ডার ট্র্যাক করুন")}
          </h1>
          <p className="text-sm font-medium text-gray-500">
            {t("Enter your email and phone number to track your guest order", "আপনার অতিথি অর্ডার ট্র্যাক করতে আপনার ইমেইল এবং ফোন নম্বর দিন")}
          </p>
        </header>

        {/* Search Box */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">{t("Email Address", "ইমেইল ঠিকানা")}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: user@example.com"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">{t("Phone Number", "ফোন নম্বর")}</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 01xxxxxxxxx"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 outline-none transition-colors"
              />
            </div>
            <div className="sm:self-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto h-[46px] px-8 bg-black hover:bg-[#FF1837] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : <><SearchIcon fontSize="small" className="mr-2" /> {t("Search", "খুঁজুন")}</>}
              </button>
            </div>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-8 text-sm text-red-800 border border-red-200 rounded-xl bg-red-50">
            <ErrorOutlineIcon fontSize="small" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8 animate-fade-in">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">
                  {t("Order ID", "অর্ডার আইডি")} <span className="text-gray-500 font-normal tracking-normal lowercase ml-2">#{order._id}</span>
                </h2>
                <p className="text-xs text-gray-500 font-medium">{formatDate(order.createdAt || order.paidAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-black tracking-widest text-[#ff1837]">৳{order.totalPrice?.toLocaleString()}</span>
                <span className={`px-3 py-1.5 border rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${getStatusStyle(order.orderStatus)}`}>
                  {getStatusIcon(order.orderStatus)}
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="p-6 border-b md:border-r border-gray-100">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">{t("Guest Information", "অতিথি তথ্য")}</h3>
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2 shadow-inner border border-gray-100">
                  <p className="text-sm text-gray-900"><span className="font-bold mr-2 text-gray-500">Name:</span> {order.guestUser.name}</p>
                  <p className="text-sm text-gray-900"><span className="font-bold mr-2 text-gray-500">Email:</span> {order.guestUser.email}</p>
                  <p className="text-sm text-gray-900"><span className="font-bold mr-2 text-gray-500">Phone:</span> {order.guestUser.phone}</p>
                </div>
              </div>

              <div className="p-6 border-b border-gray-100">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">{t("Payment Information", "পেমেন্ট তথ্য")}</h3>
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2 shadow-inner border border-gray-100">
                  <p className="text-sm text-gray-900"><span className="font-bold mr-2 text-gray-500">Method:</span> <span className="uppercase">{order.paymentInfo.method}</span></p>
                  <p className="text-sm text-gray-900"><span className="font-bold mr-2 text-gray-500">Status:</span> <span className="capitalize">{order.paymentInfo.status}</span></p>
                  {order.paymentInfo.transactionId && (
                    <p className="text-sm text-gray-900 break-all"><span className="font-bold mr-2 text-gray-500">TXN ID:</span> {order.paymentInfo.transactionId}</p>
                  )}
                </div>
              </div>

              <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">{t("Shipping Address", "শিপিং তথ্য")}</h3>
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-1 shadow-inner border border-gray-100 leading-relaxed text-sm text-gray-900">
                  <p>{order.shippingInfo.address}</p>
                  <p>{order.shippingInfo.city}, {order.shippingInfo.state}</p>
                  <p>{order.shippingInfo.country} - {order.shippingInfo.pincode}</p>
                  <p className="mt-2 text-gray-500 font-medium">Contact: {order.shippingInfo.phoneNo}</p>
                </div>
              </div>

              <div className="p-6 flex flex-col">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">{t("Need Help?", "সাহায্য প্রয়োজন?")}</h3>
                <div className="bg-gray-50 rounded-lg p-4 shadow-inner border border-gray-100 flex-1 flex flex-col justify-between gap-4">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {t("If you have any questions or issues with your order, our support team is here to help.", "আপনার অর্ডার সম্পর্কে কোন প্রশ্ন বা সমস্যায় আমাদের সাপোর্ট টিম সাহায্য করতে প্রস্তুত।")}
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex self-start sm:self-auto justify-center items-center gap-2 bg-black hover:bg-[#FF1837] text-white py-2 px-6 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors duration-300"
                  >
                    {t("Contact Support", "সাপোর্টে যোগাযোগ")}
                  </Link>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/30">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">{t("Order Items", "অর্ডার আইটেম")}</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t("Product", "পণ্য")}</th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t("Qty", "পরিমাণ")}</th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t("Price", "মূল্য")}</th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t("Total", "মোট")}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {order.orderItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-600">৳{item.price?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold text-[#ff1837]">৳{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic CTA at Bottom */}
        {!isAuthenticated ? (
          <div className="mt-4 p-8 rounded-xl border border-gray-200 bg-white text-center shadow-sm relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>

            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900 mb-2">
                {t("Unlock Exclusive Benefits", "এক্সক্লুসিভ বেনিফিট আনলক করুন")}
              </h3>
              <p className="text-sm font-medium text-gray-500 mb-6 max-w-lg mx-auto leading-relaxed">
                {t("Register now for faster checkout, exclusive members-only deals, and simplified one-click order tracking.", "দ্রুত চেকআউট, এক্সক্লুসিভ অফার এবং সহজ ট্র্যাকিংয়ের জন্য এখনই নিবন্ধন করুন।")}
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-[#FF1837] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {t("Create an Account", "অ্যাকাউন্ট তৈরি করুন")} <ArrowRightAltIcon fontSize="small" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-8 rounded-xl border border-gray-200 bg-white text-center shadow-sm relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -mr-16 -mt-16 z-0 border-l border-b border-gray-100"></div>

            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900 mb-2">
                {t("Track All Your Orders", "আপনার সমস্ত অর্ডার ট্র্যাক করুন")}
              </h3>
              <p className="text-sm font-medium text-gray-500 mb-6 max-w-lg mx-auto leading-relaxed">
                {t("You are logged in! Easily manage and view all your past and active orders from your dashboard.", "আপনি লগইন করেছেন! আপনার ড্যাশবোর্ড থেকে সহজেই সব অর্ডার পরিচালনা করুন।")}
              </p>
              <Link
                to="/orders"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-[#FF1837] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {t("Go to My Orders", "আমার অর্ডারে যান")} <ArrowRightAltIcon fontSize="small" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GuestOrderTracking;
