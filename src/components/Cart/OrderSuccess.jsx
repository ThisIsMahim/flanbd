import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import failed from "../../assets/images/Transaction/failed.png";
import successfull from "../../assets/images/Transaction/success.png";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";
// import { LanguageContext } from '../../../utils/LanguageContext';

const OrderSuccess = ({ success }) => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [time, setTime] = useState(3);

  useEffect(() => {
    if (time === 0) {
      if (success) {
        // For authenticated users, go to orders page; for guests, go to home
        navigate(isAuthenticated ? "/orders" : "/");
      } else {
        navigate("/cart");
      }
      return;
    }
    const intervalId = setInterval(() => {
      setTime(time - 1);
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [time, success, isAuthenticated]);

  // Translation strings
  const translations = {
    title: success
      ? language === "english"
        ? "Transaction Successful"
        : "ট্রানজেকশন সফল"
      : language === "english"
        ? "Transaction Failed"
        : "ট্রানজেকশন ব্যর্থ",
    heading: success
      ? language === "english"
        ? "Transaction Successful"
        : "লেনদেন সফল হয়েছে"
      : language === "english"
        ? "Transaction Failed"
        : "লেনদেন ব্যর্থ হয়েছে",
    redirectText:
      language === "english"
        ? `Redirecting to ${success ? (isAuthenticated ? "orders" : "home") : "cart"} in ${time} sec`
        : `${time} সেকেন্ডে ${success ? (isAuthenticated ? "অর্ডারসমূহ" : "হোম") : "কার্ট"
        }-এ রিডাইরেক্ট করা হচ্ছে`,
    buttonText:
      language === "english"
        ? `go to ${success ? (isAuthenticated ? "orders" : "home") : "cart"}`
        : `${success ? (isAuthenticated ? "অর্ডারসমূহ" : "হোম") : "কার্ট"}-এ যান`,
    altText: language === "english" ? "Transaction Status" : "লেনদেনের অবস্থা",
  };

  return (
    <>
      <MetaData title={translations.title} />

      <main className="w-full mt-20">
        {/* <!-- row --> */}
        <div className="flex flex-col gap-2 items-center justify-center sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow rounded p-6 pb-12">
          <img
            draggable="false"
            className="w-1/2 h-60 object-contain"
            src={success ? successfull : failed}
            alt={translations.altText}
          />
          <h1 className="text-2xl font-semibold">{translations.heading}</h1>
          <p className="mt-4 text-lg text-gray-800">
            {translations.redirectText}
          </p>
          <Link
            to={success ? (isAuthenticated ? "/orders" : "/") : "/cart"}
            className="bg-[#111827] hover:bg-[#ff0022] mt-2 py-2.5 px-6 text-white uppercase shadow hover:shadow-lg rounded-sm transition-colors duration-300"
          >
            {translations.buttonText}
          </Link>
        </div>
        {/* <!-- row --> */}
      </main>
    </>
  );
};

export default OrderSuccess;
