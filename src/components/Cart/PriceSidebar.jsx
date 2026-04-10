import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, clearCoupon } from "../../actions/cartAction";
import { LanguageContext } from "../../utils/LanguageContext";
import { myOrdersSummary } from "../../actions/orderAction";
import { CircularProgress } from "@mui/material";
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

const PriceSidebar = ({ cartItems, guestShippingInfo, onSubmit, isProcessing, btnText, paymentMethod }) => {
  const dispatch = useDispatch();
  const { language } = useContext(LanguageContext);
  const { shippingInfo: cartShippingInfo } = useSelector((state) => state.cart) || {};
  const { summary } = useSelector((state) => state.myOrdersSummary) || {};
  const { coupon } = useSelector((state) => state.cart) || {};

  const t = (eng, ben) => (language === "english" ? eng : ben);

  // Delivery charge logic
  let deliveryCharge = 0;
  const effectiveShipping = guestShippingInfo || cartShippingInfo;

  if (effectiveShipping) {
    if (effectiveShipping.deliveryArea === "inside") deliveryCharge = 70;
    else if (effectiveShipping.deliveryArea === "outside") deliveryCharge = 130;
  }

  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce((sum, item) => sum + item.cuttedPrice * item.quantity, 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + (item.cuttedPrice * item.quantity - item.price * item.quantity), 0);
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isGold = !!summary?.isGold;
  const goldDiscount = isGold ? Math.round(itemsSubtotal * 0.10) : 0;
  const amountAfterGold = Math.max(0, (itemsSubtotal - goldDiscount) + (deliveryCharge || 0));

  const couponDiscount = coupon?.type === 'percent'
    ? Math.round((amountAfterGold * (coupon?.value || 0)) / 100)
    : (coupon?.value || 0);

  const paymentMethodDiscount = (paymentMethod === "bkash" || paymentMethod === "nagad")
    ? Math.round((itemsSubtotal - goldDiscount) * 0.05)
    : 0;

  const grandTotal = Math.max(0, amountAfterGold - (couponDiscount || 0) - paymentMethodDiscount);
  const totalSavings = (totalDiscount || 0) + (goldDiscount || 0) + (couponDiscount || 0) + paymentMethodDiscount;

  const [codeInput, setCodeInput] = useState("");
  const [applying, setApplying] = useState(false);

  const onApply = async () => {
    if (!codeInput) return;
    setApplying(true);
    try {
      await dispatch(applyCoupon(codeInput, amountAfterGold));
      setCodeInput("");
    } catch (e) {
      window.alert(e?.response?.data?.message || "Failed to apply coupon");
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    if (!guestShippingInfo) dispatch(myOrdersSummary());
  }, [dispatch, guestShippingInfo]);

  return (
    <div className="summary-card">
      <h2>{t("Order Summary", "মূল্যের বিবরণ")}</h2>

      <div className="summary-row">
        <span>{t(`Subtotal (${totalItems} items)`, `মূল্য (${totalItems}টি আইটেম)`)}</span>
        <span>৳{totalPrice.toLocaleString()}</span>
      </div>

      {totalDiscount > 0 && (
        <div className="summary-row">
          <span>{t("Discount", "ডিসকাউন্ট")}</span>
          <span style={{ color: 'var(--accent)' }}>-৳{totalDiscount.toLocaleString()}</span>
        </div>
      )}

      <div className="summary-row">
        <span>{t("Delivery", "ডেলিভারি চার্জ")}</span>
        <span style={{ color: deliveryCharge > 0 ? 'var(--text-primary)' : '#2f855a' }}>
          {deliveryCharge > 0 ? `৳${deliveryCharge}` : t("Free", "ফ্রি")}
        </span>
      </div>

      {isGold && (
        <div className="summary-row">
          <span>Gold Discount (10%)</span>
          <span style={{ color: 'var(--accent)' }}>-৳{goldDiscount.toLocaleString()}</span>
        </div>
      )}

      {/* Coupon Field */}
      <div className="coupon-box">
        <div className="coupon-label">
          <LocalOfferOutlinedIcon sx={{ fontSize: 14 }} />
          <span>{t("Have a coupon?", "কুপন আছে?")}</span>
        </div>
        <div className="coupon-input-row">
          <input
            type="text"
            placeholder={t("Enter code", "কোড লিখুন")}
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onApply()}
          />
          <button onClick={onApply} disabled={applying}>
            {applying ? "..." : t("Apply", "প্রয়োগ")}
          </button>
        </div>
        {coupon && (
          <div className="coupon-applied">
            <span>{coupon.code} ✓</span>
            <button onClick={() => dispatch(clearCoupon())}>{t("Remove", "সরান")}</button>
          </div>
        )}
      </div>

      {coupon && (
        <div className="summary-row" style={{ marginTop: '0.75rem' }}>
          <span>{t("Coupon Discount", "কুপন ডিসকাউন্ট")}</span>
          <span style={{ color: 'var(--accent)' }}>-৳{(couponDiscount || 0).toLocaleString()}</span>
        </div>
      )}

      {paymentMethodDiscount > 0 && (
        <div className="summary-row" style={{ marginTop: '0.75rem' }}>
          <span>{t("Payment Discount (5%)", "পেমেন্ট ডিসকাউন্ট (৫%)")}</span>
          <span style={{ color: 'var(--accent)' }}>-৳{paymentMethodDiscount.toLocaleString()}</span>
        </div>
      )}

      <div className="summary-row total">
        <span>{t("Total", "মোট")}</span>
        <span>৳{grandTotal.toLocaleString()}</span>
      </div>

      {totalSavings > 0 && (
        <div className="summary-row savings" style={{ marginTop: '1rem' }}>
          {t(`You save ৳${totalSavings.toLocaleString()}`, `আপনি ৳${totalSavings.toLocaleString()} সাশ্রয় করছেন`)}
        </div>
      )}

      {onSubmit && (
        <button
          onClick={onSubmit}
          disabled={isProcessing}
          className="btn-checkout"
        >
          <span>
            {isProcessing ? <CircularProgress size={18} color="inherit" /> : (btnText || t("Proceed to Checkout", "চেকআউটে যান"))}
          </span>
        </button>
      )}
    </div>
  );
};

export default PriceSidebar;
