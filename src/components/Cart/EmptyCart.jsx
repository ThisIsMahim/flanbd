import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { LanguageContext } from "../../utils/LanguageContext";

const EmptyCart = () => {
  const { language } = useContext(LanguageContext);
  const t = (eng, ben) => (language === "english" ? eng : ben);

  return (
    <div className="empty-cart-container">
      <div className="empty-cart-icon">
        <ShoppingBagOutlinedIcon sx={{ fontSize: 48 }} />
      </div>

      <h2>{t("Your cart is empty!", "আপনার কার্ট খালি!")}</h2>
      <p>{t(
        "You haven't added anything yet. Explore our latest collections and find something you love.",
        "আপনি এখনও কিছু যোগ করেননি। আমাদের নতুন কালেকশনগুলো দেখুন এবং আপনার পছন্দের কিছু খুঁজে নিন।"
      )}</p>

      <Link to="/products" className="btn-shop-now">
        {t("Shop Now", "কেনাকাটা করুন")}
      </Link>
    </div>
  );
};

export default EmptyCart;
