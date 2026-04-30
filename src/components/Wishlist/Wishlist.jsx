import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";
import Sidebar, { OrdersCTACard } from "../User/Sidebar";
import Product from "./Product";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link } from "react-router-dom";
// Use mostly Tailwind, import kept if Product card needs it:
import "./Wishlist.css";

const Wishlist = () => {
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { language } = useContext(LanguageContext);

  const t = (eng, ben) => (language === "english" ? eng : ben);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <MetaData title={t("My Wishlist | Flan", "ইচ্ছেতালিকা | Flan")} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        <Sidebar activeTab="wishlist" />

        <main className="flex-1 w-full flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <header className="px-6 py-8 sm:px-8 bg-black text-white">
              <h1 className="text-2xl font-black tracking-tight mb-2">
                {t("My Wishlist", "আমার ইচ্ছেতালিকা")} ({wishlistItems.length})
              </h1>
              <p className="text-sm font-medium text-gray-400">
                {t("View and manage your saved products", "আপনার সংরক্ষিত পণ্যগুলো দেখুন এবং পরিচালনা করুন")}
              </p>
            </header>

            <div className="p-0 sm:p-6 pb-6">
              <div className="wishlist-container">
                {wishlistItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                      <FavoriteBorderIcon sx={{ fontSize: 40 }} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {t("Your wishlist is empty", "আপনার ইচ্ছেতালিকা খালি")}
                    </h2>
                    <p className="text-gray-500 mb-8 max-w-sm">
                      {t("You haven't saved anything yet. Start exploring and save your favorites!", "আপনি এখনও কিছু সংরক্ষণ করেননি। কেনাকাটা শুরু করুন এবং আপনার প্রিয় পণ্য সংরক্ষণ করুন!")}
                    </p>
                    <Link
                      to="/products"
                      className="bg-black hover:bg-[#FF1837] text-white py-3 px-8 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm"
                    >
                      {t("Start Shopping", "কেনাকাটা শুরু করুন")}
                    </Link>
                  </div>
                ) : (
                  [...wishlistItems].reverse().map((item) => (
                    <Product key={item.product} {...item} />
                  ))
                )}
              </div>
            </div>
          </div>

          <OrdersCTACard className="block md:hidden" />
        </main>
      </div>
    </div>
  );
};

export default Wishlist;
