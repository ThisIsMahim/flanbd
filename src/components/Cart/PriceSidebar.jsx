import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, clearCoupon } from "../../actions/cartAction";
import axios from "axios";
import { LanguageContext } from "../../utils/LanguageContext";
import { myOrdersSummary } from "../../actions/orderAction";
import { Button, CircularProgress } from "@mui/material";

const PriceSidebar = ({ cartItems, guestShippingInfo, onSubmit, isProcessing, translations: guestTranslations }) => {
  const dispatch = useDispatch();
  const { language = "en" } = useContext(LanguageContext) || {}; // Default to 'en' if context fails
  const { shippingInfo: cartShippingInfo } = useSelector((state) => state.cart) || {};
  const { summary } = useSelector((state) => state.myOrdersSummary) || {};

  // Delivery charge logic
  let deliveryCharge = 0;
  let deliveryLabel = "";
  // Prefer guestShippingInfo when provided (guest checkout), otherwise fall back to cart shipping info
  const effectiveShipping = guestShippingInfo || cartShippingInfo;

  if (effectiveShipping) {
    if (effectiveShipping.deliveryArea === "inside") {
      deliveryCharge = 70;
      deliveryLabel = " (inside Dhaka)";
    } else if (effectiveShipping.deliveryArea === "outside") {
      deliveryCharge = 130;
      deliveryLabel = " (outside Dhaka)";
    }
  }

  // Translations with proper fallbacks
  const translations = {
    priceDetails: {
      english: "PRICE DETAILS",
      bangla: "মূল্যের বিবরণ",
    },
    priceLabel: {
      english: {
        single: "Price (1 item)",
        plural: (count) => `Price (${count} items)`,
      },
      bangla: {
        single: "মূল্য (১ আইটেম)",
        plural: (count) => `মূল্য (${count} আইটেম)`,
      },
    },
    discount: {
      english: "Discount",
      bangla: "ডিসকাউন্ট",
    },
    deliveryCharges: {
      english: "Delivery Charges",
      bangla: "ডেলিভারি চার্জ",
    },
    free: {
      english: "Select District",
      bangla: "ফ্রি",
    },
    totalAmount: {
      english: "Total Amount",
      bangla: "মোট মূল্য",
    },
    savings: {
      english: (amount) => `You will save ৳${amount} on this order`,
      bangla: (amount) => `আপনি এই অর্ডারে ৳${amount} সাশ্রয় করবেন`,
    },
  };

  // Safe getter for translations with fallback to English
  const t = (key, ...args) => {
    const translation = translations[key]?.[language] || translations[key]?.en;

    if (typeof translation === "function") {
      return translation(...args);
    }
    return translation;
  };

  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.cuttedPrice * item.quantity,
    0
  );
  const totalDiscount = cartItems.reduce(
    (sum, item) =>
      sum + (item.cuttedPrice * item.quantity - item.price * item.quantity),
    0
  );
  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const isGold = !!summary?.isGold;
  const goldDiscount = isGold ? Math.round(itemsSubtotal * 0.10) : 0; // 10% on items only
  const amountAfterGold = Math.max(0, (itemsSubtotal - goldDiscount) + (deliveryCharge || 0));
  // Coupon state is passed via Redux cart.coupon perhaps; read optional
  const { coupon } = useSelector((state) => state.cart) || {};
  const couponDiscount = coupon?.type === 'percent'
    ? Math.round((amountAfterGold * (coupon?.value || 0)) / 100)
    : (coupon?.value || 0);
  const grandTotal = Math.max(0, amountAfterGold - (couponDiscount || 0));

  useEffect(() => {
    // Skip fetching user order summary during guest checkout
    if (!guestShippingInfo) {
      dispatch(myOrdersSummary());
    }
  }, [dispatch, guestShippingInfo]);

  const getPriceLabel = () => {
    if (totalItems === 1) {
      return t("priceLabel")?.single || `Price (1 item)`;
    }
    const pluralFn = t("priceLabel")?.plural;
    return typeof pluralFn === "function"
      ? pluralFn(totalItems)
      : `Price (${totalItems} items)`;
  };

  const [codeInput, setCodeInput] = useState("");
  const [applying, setApplying] = useState(false);

  const onApply = async () => {
    if (!codeInput) return;
    setApplying(true);
    try {
      // Validate coupon against amount AFTER gold discount, BEFORE coupon
      await dispatch(applyCoupon(codeInput, amountAfterGold));
      setCodeInput("");
    } catch (e) {
      // Show backend error message if available
      const msg = e?.response?.data?.message || "Failed to apply coupon";
      // Lazy import notistack isn't available here; rely on alert for now or lift to parent
      // If you prefer using snackbar here, refactor this sidebar to receive enqueueSnackbar from parent
      window.alert(msg);
    } finally {
      setApplying(false);
    }
  };

  const totalSavings = (totalDiscount || 0) + (goldDiscount || 0) + (couponDiscount || 0);

  return (
    <div className="flex sticky top-16 sm:h-screen flex-col sm:w-4/12 sm:px-1">
      <div className="flex flex-col bg-white rounded-sm shadow">
        <h1 className="px-6 py-3 border-b font-medium text-[var(--primary-blue-dark)]">
          {t("priceDetails")}
        </h1>

        <div className="flex flex-col gap-4 p-6 pb-3 text-[var(--primary-blue-dark)]">
          <p className="flex justify-between">
            {getPriceLabel()}
            <span>৳{totalPrice.toLocaleString()}</span>
          </p>
          <p className="flex justify-between">
            {t("discount")}
            <span className="text-[#118c4f] font-medium">
              - ৳{totalDiscount.toLocaleString()}
            </span>
          </p>
          <p className="flex justify-between">
            {t("deliveryCharges")}
            <span className="text-[#118c4f] font-medium">
              {deliveryCharge > 0
                ? `৳${deliveryCharge}${deliveryLabel}`
                : t("free")}
            </span>
          </p>
          {isGold && (
            <p className="flex justify-between">
              <span>Gold User Additional Discount (10%)</span>
              <span className="text-[#118c4f] font-medium">- ৳{goldDiscount.toLocaleString()}</span>
            </p>
          )}
          {coupon && (
            <p className="flex justify-between">
              Coupon ({coupon.code})
              <span className="text-[#118c4f] font-medium">- ৳{(couponDiscount || 0).toLocaleString()}</span>
            </p>
          )}

          <div className="border border-dashed"></div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Coupon code"
              className="flex-1 px-3 py-2 border rounded"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
            />
            <button
              onClick={onApply}
              disabled={applying}
              className="px-4 py-2 rounded nav-button"
            >
              Apply
            </button>
            {coupon && (
              <button onClick={() => dispatch(clearCoupon())} className="px-3 py-2 rounded border">Remove</button>
            )}
          </div>
          <div className="border border-dashed"></div>
          <p className="flex justify-between text-lg font-medium">
            {t("totalAmount")}
            <span>৳{grandTotal.toLocaleString()}</span>
          </p>
          <div className="border border-dashed"></div>

          <p className="font-medium text-[#118c4f]">
            {typeof t("savings") === "function"
              ? t("savings")(totalSavings.toLocaleString())
              : `You will save ৳${totalSavings.toLocaleString()} on this order`}
          </p>
          
          {/* Place Order Button - only show for guest checkout */}
          {onSubmit && (
            <div className="mt-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isProcessing}
                onClick={onSubmit}
                className="bg-[var(--button-bg)] hover:bg-[var(--button-hover)]"
              >
                {isProcessing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  guestTranslations?.placeOrder || "PLACE ORDER"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceSidebar;
