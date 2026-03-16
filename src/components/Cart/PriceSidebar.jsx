import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, clearCoupon } from "../../actions/cartAction";
import { LanguageContext } from "../../utils/LanguageContext";
import { myOrdersSummary } from "../../actions/orderAction";
import { CircularProgress } from "@mui/material";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const PriceSidebar = ({ cartItems, guestShippingInfo, onSubmit, isProcessing }) => {
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

  const grandTotal = Math.max(0, amountAfterGold - (couponDiscount || 0));
  const totalSavings = (totalDiscount || 0) + (goldDiscount || 0) + (couponDiscount || 0);

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
        <span>{t(`Price (${totalItems} items)`, `মূল্য (${totalItems}টি আইটেম)`)}</span>
        <span>৳{totalPrice.toLocaleString()}</span>
      </div>

      <div className="summary-row">
        <span>{t("Discount", "ডিসকাউন্ট")}</span>
        <span className="text-accent">-৳{totalDiscount.toLocaleString()}</span>
      </div>

      <div className="summary-row">
        <span>{t("Delivery", "ডেলিভারি চার্জ")}</span>
        <span className={deliveryCharge > 0 ? "text-primary" : "text-accent"}>
          {deliveryCharge > 0 ? `৳${deliveryCharge}` : t("Free", "ফ্রি")}
        </span>
      </div>

      {isGold && (
        <div className="summary-row">
          <span>Gold Discount (10%)</span>
          <span className="text-accent">-৳{goldDiscount.toLocaleString()}</span>
        </div>
      )}

      {/* Coupon Field */}
      <div className="coupon-box mt-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <LocalOfferIcon sx={{ fontSize: 16, color: 'var(--accent)' }} />
          <span className="text-xs font-bold uppercase tracking-wider text-muted">Have a coupon?</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Code"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-subtle rounded-md text-sm outline-none focus:border-accent"
          />
          <button
            onClick={onApply}
            disabled={applying}
            className="px-4 py-2 bg-text-primary text-inverse rounded-md text-xs font-bold uppercase hover:bg-accent transition-colors disabled:opacity-50"
          >
            {applying ? "..." : "Apply"}
          </button>
        </div>
        {coupon && (
          <div className="flex justify-between items-center mt-3 p-2 bg-accent-subtle rounded border border-accent border-dashed">
            <span className="text-xs font-bold text-accent">{coupon.code} Applied!</span>
            <button onClick={() => dispatch(clearCoupon())} className="text-xs text-muted hover:text-accent underline">Remove</button>
          </div>
        )}
      </div>

      {coupon && (
        <div className="summary-row">
          <span>{t("Coupon Discount", "কুপন ডিসকাউন্ট")}</span>
          <span className="text-accent">-৳{(couponDiscount || 0).toLocaleString()}</span>
        </div>
      )}

      <div className="summary-row total">
        <span>{t("Grand Total", "মোট মূল্য")}</span>
        <span>৳{grandTotal.toLocaleString()}</span>
      </div>

      <div className="summary-row savings mt-4 text-center block w-full">
        {t(`You save ৳${totalSavings.toLocaleString()} on this order`, `আপনি এই অর্ডারে ৳${totalSavings.toLocaleString()} সাশ্রয় করছেন`)}
      </div>

      {onSubmit && (
        <button
          onClick={onSubmit}
          disabled={isProcessing}
          className="btn-checkout mt-6"
        >
          {isProcessing ? <CircularProgress size={20} color="inherit" /> : t("Proceed to Checkout", "চালিয়ে যান")}
        </button>
      )}
    </div>
  );
};

export default PriceSidebar;
