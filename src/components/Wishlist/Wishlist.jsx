import { useContext } from "react";
import { useSelector } from "react-redux";
import { LanguageContext } from "../../utils/LanguageContext";
import Breadcrumb from "../Layouts/Breadcrumb";
import MetaData from "../Layouts/MetaData";
import Sidebar from "../User/Sidebar";
import Product from "./Product";

const Wishlist = () => {
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { language } = useContext(LanguageContext);

  // Translations
  const translations = {
    english: {
      title: "Wishlist | FlanBD",
      myWishlist: "My Wishlist",
      emptyWishlist: "Empty Wishlist",
      emptyWishlistMsg: "You have no items in your wishlist. Start adding!",
    },
    bangla: {
      title: "ইচ্ছেতালিকা | ডাঃ ওয়াটার",
      myWishlist: "আমার ইচ্ছেতালিকা",
      emptyWishlist: "খালি ইচ্ছেতালিকা",
      emptyWishlistMsg: "আপনার ইচ্ছেতালিকায় কোন আইটেম নেই। যোগ করা শুরু করুন!",
    },
  };

  const t = translations[language];

  return (
    <>
      <MetaData
        title={"Wishlist | FlanBD"}
      />

      <Breadcrumb />
      <main className="w-full mt-12 sm:mt-0">
        <div className="flex gap-3.5 sm:w-11/12 sm:mt-4 m-auto mb-7">
          <Sidebar activeTab={"wishlist"} />

          <div className="flex-1 shadow bg-white">
            {/* <!-- wishlist container --> */}
            <div className="flex flex-col">
              <span className="font-medium text-lg px-4 sm:px-8 py-4 border-b">
                {t.myWishlist} ({wishlistItems.length})
              </span>

              {wishlistItems.length === 0 && (
                <div className="flex items-center flex-col gap-2 m-6">
                  <div className="animate-pulse duration-[2s] text-blue-400 w-48 h-48 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-full h-full transition-transform hover:scale-105"
                    >
                      <path d="M12 3.77l.75-.71c.06-.06.12-.11.19-.16a3.58 3.58 0 0 1 4.12 0c.07.05.13.1.19.16a3.58 3.58 0 0 1 0 4.94L12 13.25 6.75 8a3.58 3.58 0 0 1 0-4.94c.06-.06.12-.11.19-.16a3.58 3.58 0 0 1 4.12 0c.07.05.13.1.19.16l.75.71z" />
                      <path d="M3.93 10.77a1 1 0 0 1 1.41 0L12 17.44l6.66-6.67a1 1 0 0 1 1.41 1.41l-7.37 7.37a1 1 0 0 1-1.41 0l-7.37-7.37a1 1 0 0 1 0-1.41z" />
                      <path d="M3.93 15.77a1 1 0 0 1 1.41 0L12 22.44l6.66-6.67a1 1 0 0 1 1.41 1.41l-7.37 7.37a1 1 0 0 1-1.41 0l-7.37-7.37a1 1 0 0 1 0-1.41z" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium mt-6">
                    {t.emptyWishlist}
                  </span>
                  <p>{t.emptyWishlistMsg}</p>
                </div>
              )}

              {wishlistItems
                .map((item, index) => <Product {...item} key={index} />)
                .reverse()}
            </div>
            {/* <!-- wishlist container --> */}
          </div>
        </div>
      </main>
    </>
  );
};

export default Wishlist;
