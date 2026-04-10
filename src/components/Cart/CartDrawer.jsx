import React, { useContext, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../../utils/LanguageContext";
import { addItemsToCart, removeItemsFromCart, applyCoupon, clearCoupon } from "../../actions/cartAction";
import { saveForLater, removeFromSaveForLater } from "../../actions/saveForLaterAction";
import { myOrdersSummary } from "../../actions/orderAction";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LoopIcon from "@mui/icons-material/Loop";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import { CircularProgress } from "@mui/material";
import "./CartDrawer.css";

const CartDrawer = ({ open, onClose }) => {
    const { language } = useContext(LanguageContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const drawerRef = useRef(null);

    const { cartItems, shippingInfo, coupon } = useSelector((state) => state.cart);
    const { saveForLaterItems } = useSelector((state) => state.saveForLater);
    const { isAuthenticated } = useSelector((state) => state.user);
    const { summary } = useSelector((state) => state.myOrdersSummary) || {};

    const [codeInput, setCodeInput] = React.useState("");
    const [applying, setApplying] = React.useState(false);

    const t = (eng, ben) => (language === "english" ? eng : ben);

    // Pricing logic (same as PriceSidebar)
    let deliveryCharge = 0;
    if (shippingInfo) {
        if (shippingInfo.deliveryArea === "inside") deliveryCharge = 70;
        else if (shippingInfo.deliveryArea === "outside") deliveryCharge = 130;
    }

    const totalItems = cartItems.length;
    const totalPrice = cartItems.reduce((s, i) => s + i.cuttedPrice * i.quantity, 0);
    const totalDiscount = cartItems.reduce((s, i) => s + (i.cuttedPrice - i.price) * i.quantity, 0);
    const itemsSubtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const isGold = !!summary?.isGold;
    const goldDiscount = isGold ? Math.round(itemsSubtotal * 0.1) : 0;
    const amountAfterGold = Math.max(0, itemsSubtotal - goldDiscount + (deliveryCharge || 0));
    const couponDiscount =
        coupon?.type === "percent"
            ? Math.round((amountAfterGold * (coupon?.value || 0)) / 100)
            : coupon?.value || 0;
    const grandTotal = Math.max(0, amountAfterGold - (couponDiscount || 0));
    const totalSavings = (totalDiscount || 0) + (goldDiscount || 0) + (couponDiscount || 0);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(myOrdersSummary());
        }
    }, [dispatch, isAuthenticated]);

    // Close on backdrop click
    useEffect(() => {
        const handleKey = (e) => { if (e.key === "Escape") onClose(); };
        if (open) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const handleCheckout = () => {
        onClose();
        if (isAuthenticated) navigate("/shipping");
        else navigate("/login?redirect=shipping");
    };

    // Cart item handlers
    const handleQtyChange = (product, quantity, stock, newQty) => {
        if (newQty > stock) return;
        if (newQty < 1) { dispatch(removeItemsFromCart(product)); return; }
        dispatch(addItemsToCart(product, newQty));
    };

    const removeHandler = (product) => {
        dispatch(removeItemsFromCart(product));
        enqueueSnackbar(t("Product removed", "পণ্য সরানো হয়েছে"), { variant: "info" });
    };

    const saveLaterHandler = (product) => {
        dispatch(saveForLater(product));
        dispatch(removeItemsFromCart(product));
        enqueueSnackbar(t("Saved for later", "পরে কেনার জন্য সংরক্ষিত"), { variant: "success" });
    };

    const moveToCartHandler = (product) => {
        dispatch(addItemsToCart(product, 1));
        dispatch(removeFromSaveForLater(product));
        enqueueSnackbar(t("Moved to cart", "কার্টে সরানো হয়েছে"), { variant: "success" });
    };

    const removeSavedHandler = (product) => {
        dispatch(removeFromSaveForLater(product));
        enqueueSnackbar(t("Removed from saved", "সংরক্ষণ তালিকা থেকে সরানো হয়েছে"), { variant: "info" });
    };

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

    return (
        <>
            {/* Backdrop */}
            <div
                className={`cd-backdrop ${open ? "cd-backdrop--open" : ""}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer Panel */}
            <div
                ref={drawerRef}
                className={`cd-drawer ${open ? "cd-drawer--open" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-label={t("Shopping Cart", "শপিং কার্ট")}
            >
                {/* Header */}
                <div className="cd-header">
                    <div className="cd-header-title">
                        <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
                        <span>{t("Your Cart", "আপনার কার্ট")}</span>
                        {cartItems.length > 0 && (
                            <span className="cd-count-badge">{cartItems.length}</span>
                        )}
                    </div>
                    <button className="cd-close-btn" onClick={onClose} aria-label="Close cart">
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </button>
                </div>

                {/* Body */}
                <div className="cd-body">
                    {cartItems.length === 0 && saveForLaterItems.length === 0 ? (
                        /* Empty state */
                        <div className="cd-empty">
                            <div className="cd-empty-icon">
                                <ShoppingBagOutlinedIcon sx={{ fontSize: 40 }} />
                            </div>
                            <p className="cd-empty-title">{t("Your cart is empty!", "আপনার কার্ট খালি!")}</p>
                            <p className="cd-empty-sub">
                                {t(
                                    "Explore our collections and find something you love.",
                                    "আমাদের কালেকশন দেখুন।"
                                )}
                            </p>
                            <Link to="/products" className="cd-shop-btn" onClick={onClose}>
                                {t("Shop Now", "কেনাকাটা করুন")}
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Cart Items */}
                            {cartItems.length > 0 && (
                                <div className="cd-section">
                                    <p className="cd-section-label">{t("Items", "পণ্যসমূহ")}</p>
                                    <div className="cd-items-list">
                                        {cartItems.map((item) => (
                                            <div key={item.product} className="cd-item">
                                                <Link to={`/product/${item.product}`} onClick={onClose} className="cd-item-img-wrap">
                                                    <img src={item.image} alt={item.name} className="cd-item-img" />
                                                </Link>
                                                <div className="cd-item-info">
                                                    <Link to={`/product/${item.product}`} onClick={onClose} className="cd-item-name">
                                                        {item.name}
                                                    </Link>
                                                    <div className="cd-item-price-row">
                                                        <span className="cd-item-price">৳{(item.price * item.quantity).toLocaleString()}</span>
                                                        {item.cuttedPrice > item.price && (
                                                            <span className="cd-item-og-price">৳{(item.cuttedPrice * item.quantity).toLocaleString()}</span>
                                                        )}
                                                    </div>
                                                    {item.stock < 5 && (
                                                        <span className="cd-item-low-stock">
                                                            {t(`Only ${item.stock} left`, `মাত্র ${item.stock}টি বাকি`)}
                                                        </span>
                                                    )}
                                                    <div className="cd-item-controls">
                                                        <div className="cd-qty">
                                                            <button
                                                                className="cd-qty-btn"
                                                                onClick={() => handleQtyChange(item.product, item.quantity, item.stock, item.quantity - 1)}
                                                            >−</button>
                                                            <span className="cd-qty-val">{item.quantity}</span>
                                                            <button
                                                                className="cd-qty-btn"
                                                                onClick={() => handleQtyChange(item.product, item.quantity, item.stock, item.quantity + 1)}
                                                                disabled={item.quantity >= item.stock}
                                                            >+</button>
                                                        </div>
                                                        <div className="cd-item-actions">
                                                            <button className="cd-action-btn cd-save-btn" onClick={() => saveLaterHandler(item.product)}>
                                                                <FavoriteBorderIcon sx={{ fontSize: 12 }} />
                                                                {t("Save", "সেভ")}
                                                            </button>
                                                            <button className="cd-action-btn cd-remove-btn" onClick={() => removeHandler(item.product)}>
                                                                <DeleteOutlineIcon sx={{ fontSize: 12 }} />
                                                                {t("Remove", "সরান")}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Saved For Later */}
                            {saveForLaterItems.length > 0 && (
                                <div className="cd-section">
                                    <p className="cd-section-label">
                                        {t("Saved For Later", "পরে কেনার জন্য")} ({saveForLaterItems.length})
                                    </p>
                                    <div className="cd-items-list">
                                        {saveForLaterItems.map((item) => (
                                            <div key={item.product} className="cd-item cd-item--saved">
                                                <Link to={`/product/${item.product}`} onClick={onClose} className="cd-item-img-wrap">
                                                    <img src={item.image} alt={item.name} className="cd-item-img" />
                                                </Link>
                                                <div className="cd-item-info">
                                                    <Link to={`/product/${item.product}`} onClick={onClose} className="cd-item-name">
                                                        {item.name}
                                                    </Link>
                                                    <div className="cd-item-price-row">
                                                        <span className="cd-item-price">৳{item.price.toLocaleString()}</span>
                                                        {item.cuttedPrice > item.price && (
                                                            <span className="cd-item-og-price">৳{item.cuttedPrice.toLocaleString()}</span>
                                                        )}
                                                    </div>
                                                    <div className="cd-item-actions" style={{ marginTop: '0.4rem' }}>
                                                        <button className="cd-action-btn cd-save-btn" onClick={() => moveToCartHandler(item.product)}>
                                                            <ShoppingCartOutlinedIcon sx={{ fontSize: 12 }} />
                                                            {t("Add to cart", "কার্টে নিন")}
                                                        </button>
                                                        <button className="cd-action-btn cd-remove-btn" onClick={() => removeSavedHandler(item.product)}>
                                                            <DeleteOutlineIcon sx={{ fontSize: 12 }} />
                                                            {t("Remove", "সরান")}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer — Pricing + Checkout */}
                {cartItems.length > 0 && (
                    <div className="cd-footer">
                        {/* Coupon */}
                        <div className="cd-coupon">
                            <div className="cd-coupon-label">
                                <LocalOfferOutlinedIcon sx={{ fontSize: 12 }} />
                                {t("Have a coupon?", "কুপন আছে?")}
                            </div>
                            <div className="cd-coupon-row">
                                <input
                                    type="text"
                                    placeholder={t("Enter code", "কোড লিখুন")}
                                    value={codeInput}
                                    onChange={(e) => setCodeInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && onApply()}
                                    className="cd-coupon-input"
                                />
                                <button onClick={onApply} disabled={applying} className="cd-coupon-apply">
                                    {applying ? "..." : t("Apply", "প্রয়োগ")}
                                </button>
                            </div>
                            {coupon && (
                                <div className="cd-coupon-applied">
                                    <span>{coupon.code} ✓</span>
                                    <button onClick={() => dispatch(clearCoupon())}>{t("Remove", "সরান")}</button>
                                </div>
                            )}
                        </div>

                        {/* Summary rows */}
                        <div className="cd-summary">
                            <div className="cd-summary-row">
                                <span>{t(`Subtotal (${totalItems})`, `মূল্য (${totalItems}টি)`)}</span>
                                <span>৳{totalPrice.toLocaleString()}</span>
                            </div>
                            {totalDiscount > 0 && (
                                <div className="cd-summary-row cd-summary-row--discount">
                                    <span>{t("Discount", "ডিসকাউন্ট")}</span>
                                    <span>-৳{totalDiscount.toLocaleString()}</span>
                                </div>
                            )}
                            {isGold && goldDiscount > 0 && (
                                <div className="cd-summary-row cd-summary-row--discount">
                                    <span>Gold (10%)</span>
                                    <span>-৳{goldDiscount.toLocaleString()}</span>
                                </div>
                            )}
                            {coupon && couponDiscount > 0 && (
                                <div className="cd-summary-row cd-summary-row--discount">
                                    <span>{t("Coupon", "কুপন")}</span>
                                    <span>-৳{couponDiscount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="cd-summary-row">
                                <span>{t("Delivery", "ডেলিভারি")}</span>
                                <span style={{ color: deliveryCharge > 0 ? 'var(--text-primary)' : '#2f855a' }}>
                                    {deliveryCharge > 0 ? `৳${deliveryCharge}` : t("Free", "ফ্রি")}
                                </span>
                            </div>
                            <div className="cd-summary-row cd-summary-row--total">
                                <span>{t("Total", "মোট")}</span>
                                <span>৳{grandTotal.toLocaleString()}</span>
                            </div>
                            {totalSavings > 0 && (
                                <div className="cd-savings">
                                    {t(`You save ৳${totalSavings.toLocaleString()}`, `আপনি ৳${totalSavings.toLocaleString()} সাশ্রয়`)}
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <button className="cd-checkout-btn" onClick={handleCheckout}>
                            {t("Proceed to Checkout", "চেকআউটে যান")}
                        </button>

                        {!isAuthenticated && (
                            <Link
                                to="/guest-checkout"
                                className="cd-guest-btn"
                                onClick={onClose}
                            >
                                {t("Continue as Guest", "গেস্ট হিসেবে")}
                            </Link>
                        )}

                        {/* Trust badges */}
                        <div className="cd-trust">
                            <div className="cd-trust-item">
                                <LocalShippingOutlinedIcon sx={{ fontSize: 14 }} />
                                <span>{t("Free Shipping", "ফ্রি শিপিং")}</span>
                            </div>
                            <div className="cd-trust-item">
                                <VerifiedUserOutlinedIcon sx={{ fontSize: 14 }} />
                                <span>{t("Secure Payment", "নিরাপদ")}</span>
                            </div>
                            <div className="cd-trust-item">
                                <LoopIcon sx={{ fontSize: 14 }} />
                                <span>{t("Easy Returns", "রিটার্ন")}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
