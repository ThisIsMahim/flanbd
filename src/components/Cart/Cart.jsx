import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import PriceSidebar from "./PriceSidebar";
import SaveForLaterItem from "./SaveForLaterItem";
import "./Cart.css";

const Cart = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { saveForLaterItems } = useSelector((state) => state.saveForLater);
  const { isAuthenticated } = useSelector((state) => state.user);

  const t = (eng, ben) => (language === "english" ? eng : ben);

  return (
    <div className="cart-page-wrapper">
      <MetaData title={t("Your Cart | Flan", "আপনার কার্ট | Flan")} />

      <div className="cart-container">
        <div className="cart-main-col">
          {/* Main Cart */}
          <div className="cart-card">
            <div className="cart-card-header">
              <h2>{t("Shopping Cart", "শপিং কার্ট")} ({cartItems.length})</h2>
            </div>

            <div className="cart-items-list">
              {cartItems.length === 0 ? (
                <EmptyCart />
              ) : (
                cartItems.map((item) => (
                  <CartItem key={item.product} {...item} inCart={true} />
                ))
              )}
            </div>
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
            <PriceSidebar cartItems={cartItems} />

            {!isAuthenticated && (
              <p className="text-sm text-center text-muted" style={{ marginTop: '0.5rem' }}>
                {t("Sign in to save your cart for later", "আপনার কার্ট সংরক্ষণ করতে সাইন ইন করুন")}
              </p>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};

export default Cart;
