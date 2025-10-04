import { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";
import PriceSidebar from "./PriceSidebar";
import SaveForLaterItem from "./SaveForLaterItem";
// import { LanguageContext } from '../../../utils/LanguageContext';

const Cart = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { saveForLaterItems } = useSelector((state) => state.saveForLater);
  const { isAuthenticated } = useSelector((state) => state.user);

  const placeOrderHandler = () => {
    if (isAuthenticated) {
      navigate("/shipping");
    } else {
      navigate("/guest-checkout");
    }
  };

  const translations = {
    myCart: language === "english" ? `My Cart (${cartItems.length})` : `আমার কার্ট (${cartItems.length})`,
    savedForLater: language === "english" 
      ? `Saved For Later (${saveForLaterItems.length})` 
      : `পরে কেনার জন্য সংরক্ষিত (${saveForLaterItems.length})`,
    placeOrder: language === "english" ? "PLACE ORDER" : "অর্ডার করুন",
    guestCheckout: language === "english" ? "GUEST CHECKOUT" : "অতিথি চেকআউট",
    loginToOrder: language === "english" ? "LOGIN TO ORDER" : "অর্ডার করতে লগইন করুন",
    guestCheckoutNote: language === "english" 
      ? "Don't have an account? Checkout as guest" 
      : "অ্যাকাউন্ট নেই? অতিথি হিসাবে চেকআউট করুন",
  };

  return (
    <>
      <MetaData
        title={
          language === "bangla"
                    ? "শপিং কার্ট | Flanbd"
        : "Shopping Cart | FlanBD"
        }
      />
      <main className="w-full mt-20">
        {/* <!-- row --> */}
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">
          {/* <!-- cart column --> */}
          <div className="flex-1">
            {/* <!-- cart items container --> */}
            <div className="flex flex-col shadow bg-white">
              <span className="font-medium text-lg px-2 sm:px-8 py-4 border-b">
                {translations.myCart}
              </span>

              {cartItems && cartItems.length === 0 && <EmptyCart />}

              {cartItems &&
                cartItems.map((item, index) => (
                  <CartItem key={index} {...item} inCart={true} />
                ))}

              {/* <!-- place order btn --> */}
              <div className="flex flex-col gap-2 px-2 sm:px-6 my-4">
                {cartItems.length > 0 && (
                  <>
                    <button
                      onClick={placeOrderHandler}
                      disabled={cartItems.length < 1}
                      className={`${
                        cartItems.length < 1
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-[var(--button-bg)] hover:bg-[var(--button-hover)]"
                      } w-full py-3 font-medium text-white shadow hover:shadow-lg rounded-sm transition-colors duration-300`}
                    >
                      {isAuthenticated ? translations.placeOrder : translations.guestCheckout}
                    </button>
                    
                    {!isAuthenticated && (
                      <>
                        <div className="text-center text-sm text-gray-600 py-2">
                          {translations.guestCheckoutNote}
                        </div>
                        <button
                          onClick={() => navigate("/login")}
                          className="w-full py-3 font-medium text-[var(--button-bg)] border-2 border-[var(--button-bg)] hover:bg-[var(--button-bg)] hover:text-white shadow hover:shadow-lg rounded-sm transition-colors duration-300"
                        >
                          {translations.loginToOrder}
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
              {/* <!-- place order btn --> */}
            </div>
            {/* <!-- cart items container --> */}

            {/* <!-- saved for later items container --> */}
            <div className="flex flex-col mt-5 shadow bg-white">
              <span className="font-medium text-lg px-2 sm:px-8 py-4 border-b">
                {translations.savedForLater}
              </span>
              {saveForLaterItems &&
                saveForLaterItems.map((item, index) => (
                  <SaveForLaterItem key={index} {...item} />
                ))}
            </div>
            {/* <!-- saved for later container --> */}
          </div>
          {/* <!-- cart column --> */}

          <PriceSidebar cartItems={cartItems} />
        </div>
        {/* <!-- row --> */}
      </main>
    </>
  );
};

export default Cart;
