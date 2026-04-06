import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import PriceSidebar from "./PriceSidebar";
import SaveForLaterItem from "./SaveForLaterItem";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import "./Cart.css";

const Cart = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { saveForLaterItems } = useSelector((state) => state.saveForLater);
  const { isAuthenticated } = useSelector((state) => state.user);

  const t = (eng, ben) => (language === "english" ? eng : ben);

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=shipping");
    }
  };

  return (
    <div className="cart-page-wrapper">
      <MetaData title={t("Your Cart | Flan", "আপনার কার্ট | Flan")} />

      {/* Page Header */}
      <div className="cart-page-header">
        <div className="cart-breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <span>{t("Cart", "কার্ট")}</span>
        </div>
        <h1 className="cart-page-title">
          {t("Your Cart", "আপনার কার্ট")}
          {cartItems.length > 0 && <span>({cartItems.length} {t("items", "আইটেম")})</span>}
        </h1>
      </div>

      <div className="cart-container">
        <div className="cart-main-col">
          {/* Main Cart */}
          <div className="cart-card">
            {cartItems.length === 0 ? (
              <EmptyCart />
            ) : (
              <>
                <div className="cart-card-header">
                  <h2>{t("Items", "পণ্যসমূহ")}</h2>
                </div>
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <CartItem key={item.product} {...item} inCart={true} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Saved For Later */}
          {saveForLaterItems.length > 0 && (
            <div className="cart-card">
              <div className="cart-card-header">
                <h2>{t("Saved For Later", "পরে কেনার জন্য সংরক্ষিত")} ({saveForLaterItems.length})</h2>
              </div>
              <div className="cart-items-list">
                {saveForLaterItems.map((item) => (
                  <SaveForLaterItem key={item.product} {...item} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {cartItems.length > 0 && (
          <aside className="cart-sidebar">
            <PriceSidebar cartItems={cartItems} onSubmit={handleCheckout} />

            {!isAuthenticated && (
              <div className="guest-checkout-row">
                <Link to="/guest-checkout" className="btn-guest-checkout">
                  {t("Continue as Guest", "গেস্ট হিসেবে চালিয়ে যান")}
                </Link>
              </div>
            )}

            {/* Trust Badges */}
            <div className="cart-trust-badges">
              <div className="trust-badge">
                <LocalShippingOutlinedIcon className="trust-badge-icon" sx={{ fontSize: 18 }} />
                <span>{t("Free Shipping", "ফ্রি শিপিং")}</span>
              </div>
              <div className="trust-badge">
                <VerifiedUserOutlinedIcon className="trust-badge-icon" sx={{ fontSize: 18 }} />
                <span>{t("Secure Payment", "নিরাপদ পেমেন্ট")}</span>
              </div>
              <div className="trust-badge">
                <LoopIcon className="trust-badge-icon" sx={{ fontSize: 18 }} />
                <span>{t("Easy Returns", "সহজ রিটার্ন")}</span>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Cart;
