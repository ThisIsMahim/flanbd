import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";
import Sidebar from "../User/Sidebar";
import Product from "./Product";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link } from "react-router-dom";
import "./Wishlist.css";
import "../User/Account.css";

const Wishlist = () => {
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { language } = useContext(LanguageContext);

  const t = (eng, ben) => (language === "english" ? eng : ben);

  return (
    <div className="account-page-wrapper bg-[var(--bg-primary)] min-h-screen">
      <MetaData title={t("My Wishlist | Flan", "ইচ্ছেতালিকা | Flan")} />

      <div className="account-page-container">
        <Sidebar activeTab="wishlist" />

        <main className="account-main-card" style={{ padding: 0 }}>
          <header className="account-section-title" style={{ padding: '2rem 3rem', marginBottom: 0 }}>
            <h1>{t("My Wishlist", "আমার ইচ্ছেতালিকা")} ({wishlistItems.length})</h1>
          </header>

          <div className="wishlist-container">
            {wishlistItems.length === 0 ? (
              <div className="wishlist-empty">
                <div className="wish-empty-icon">
                  <FavoriteBorderIcon sx={{ fontSize: 40 }} />
                </div>
                <h2>{t("Your wishlist is empty", "আপনার ইচ্ছেতালিকা খালি")}</h2>
                <p>{t("You haven't saved anything yet. Start exploring and save your favorites!", "আপনি এখনও কিছু সংরক্ষণ করেননি। কেনাকাটা শুরু করুন এবং আপনার প্রিয় পণ্য সংরক্ষণ করুন!")}</p>
                <Link to="/products" className="btn-account-link primary inline-block">
                  {t("Start Shopping", "কেনাকাটা শুরু করুন")}
                </Link>
              </div>
            ) : (
              [...wishlistItems].reverse().map((item) => (
                <Product key={item.product} {...item} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Wishlist;
