import { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";
import CartItem from "./CartItem";
import PriceSidebar from "./PriceSidebar";
import Stepper from "./Stepper";

const OrderConfirm = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { language } = useContext(LanguageContext);

  return (
    <>
      <MetaData
        title={
          language === "english"
            ? "eyegears: Order Confirmation"
            : "পেপার ম্যান: অর্ডার নিশ্চিতকরণ"
        }
      />

      <main className="w-full mt-20">
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7">
          <div className="flex-1">
            <Stepper activeStep={2}>
              <div className="w-full bg-white">
                {cartItems?.map((item, i) => (
                  <CartItem {...item} inCart={false} key={i} />
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 bg-white px-6 py-3 rounded-b-sm text-[var(--primary-blue-dark)]">
                <p className="text-sm">
                  {language === "english"
                    ? "Order processing email will be sent to"
                    : "অর্ডার প্রসেসিং ইমেইল পাঠানো হবে"}{" "}
                  <span className="font-medium">{user.email}</span>
                </p>
                <button
                  onClick={() => navigate("/process/payment")}
                  className="bg-[var(--button-bg)] hover:bg-[var(--button-hover)] px-6 py-2 text-white font-medium rounded-sm shadow hover:shadow-lg uppercase transition-colors duration-300"
                >
                  {language === "english" ? "CONTINUE" : "চালিয়ে যান"}
                </button>
              </div>
            </Stepper>
          </div>

          <PriceSidebar cartItems={cartItems} />
        </div>
      </main>
    </>
  );
};

export default OrderConfirm;
