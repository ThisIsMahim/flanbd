import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { saveShippingInfo, clearCoupon } from "../../actions/cartAction";
import { LanguageContext } from "../../utils/LanguageContext";
import states from "../../utils/states";
import MetaData from "../Layouts/MetaData";
import PriceSidebar from "./PriceSidebar";
import Stepper from "./Stepper";

const Shipping = () => {
  const { language = "en" } = useContext(LanguageContext) || {}; // Default to 'en' if context is missing
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { cartItems } = useSelector((state) => state.cart);
  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [country, setCountry] = useState("IN");
  const [state, setState] = useState(shippingInfo.state || "");
  const [pincode, setPincode] = useState(shippingInfo.pincode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
  const [deliveryArea, setDeliveryArea] = useState(shippingInfo.deliveryArea || "inside");

  // Enhanced translations with fallbacks
  const translations = {
    metaTitle: {
      english: "FlanBD: Shipping Details",
      bangla: "ডাঃ ওয়াটার: শিপিং বিবরণ",
    },
    address: {
      label: {
        english: "Address",
        bangla: "ঠিকানা",
      },
      placeholder: {
        english: "Enter your full address",
        bangla: "আপনার সম্পূর্ণ ঠিকানা লিখুন",
      },
    },
    pincode: {
      label: {
        english: "Postal Code",
        bangla: "পোস্টাল কোড",
      },
      placeholder: {
        english: "6-digit ",
        bangla: "৬-অঙ্কের পিনকোড",
      },
    },
    phoneNo: {
      label: {
        english: "Phone No",
        bangla: "ফোন নম্বর",
      },
      placeholder: {
        english: "11-digit mobile number",
        bangla: "১১-অঙ্কের মোবাইল নম্বর",
      },
    },
    city: {
      label: {
        english: "City",
        bangla: "শহর",
      },
      placeholder: {
        english: "Enter your city",
        bangla: "আপনার শহরের নাম লিখুন",
      },
    },
    landmark: {
      label: {
        english: "Landmark (Optional)",
        bangla: "ল্যান্ডমার্ক (ঐচ্ছিক)",
      },
      placeholder: {
        english: "Nearby famous place",
        bangla: "কাছাকাছি বিখ্যাত স্থান",
      },
    },
    country: {
      label: {
        english: "Country",
        bangla: "দেশ",
      },
    },
    district: {
      label: {
        english: "District",
        bangla: "জেলা",
      },
    },
    saveButton: {
      english: "SAVE AND DELIVER HERE",
      bangla: "সংরক্ষণ করুন এবং এখানে ডেলিভারি করুন",
    },
    invalidPhone: {
      english: "Invalid Phone Number",
      bangla: "অবৈধ ফোন নম্বর",
    },
  };

  // Helper function to safely get translations
  const t = (key, subKey) => {
    try {
      return (
        translations[key][subKey][language] || translations[key][subKey]["en"]
      );
    } catch {
      return key; // fallback to the key name if translation is missing
    }
  };

  const shippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length < 11 || phoneNo.length > 11) {
      enqueueSnackbar(
        language === "bangla"
          ? translations.invalidPhone.bangla
          : translations.invalidPhone.english,
        { variant: "error" }
      );
      return;
    }
    dispatch(
      saveShippingInfo({ address, city, country, state, pincode, phoneNo, deliveryArea })
    );
    navigate("/order/confirm");
  };

  // Ensure no stale coupon auto-applies on Shipping page
  // Gold discount will still show; coupon must be applied explicitly by user
  useEffect(() => {
    dispatch(clearCoupon());
  }, [dispatch]);

  return (
    <>
      <MetaData
        title={
          language === "bangla"
            ? translations.metaTitle.bangla
            : translations.metaTitle.english
        }
      />
      <main className="w-full mt-20">
        <div className="w-full sm:w-11/12 mx-auto mb-4">
          <Link
            to="/cart"
            className="flex items-center text-gray-500 hover:text-[#FF1837] transition-colors font-bold uppercase text-xs tracking-widest"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            {language === "bangla" ? "কার্টে ফিরে যান" : "Back to Cart"}
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 mt-0 sm:mt-4 m-auto sm:mb-7 overflow-hidden">
          <div className="flex-1">
            <Stepper activeStep={1} language={language}>
              <div className="w-full bg-white md:p-6 p-4 rounded-b-lg shadow-sm border-x border-b border-gray-200 text-gray-900">
                <form
                  onSubmit={shippingSubmit}
                  autoComplete="off"
                  className="flex flex-col gap-4 w-full"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                      {t("address", "label")}
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t("address", "placeholder")}
                      required
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-100 text-gray-900 focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-xs"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                        {t("city", "label")}
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={t("city", "placeholder")}
                        required
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 text-gray-900 focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-xs"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                        {t("district", "label")}
                      </label>
                      <div className="relative">
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-100 text-gray-900 appearance-none focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-xs pr-8"
                        >
                          <option value="" disabled>Select District</option>
                          {states.map((item) => (
                            <option key={item.code} value={item.code}>
                              {language === "bangla"
                                ? item.bangla_name || item.name
                                : item.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                        {t("phoneNo", "label")}
                      </label>
                      <input
                        type="tel"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        placeholder={t("phoneNo", "placeholder")}
                        required
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 text-gray-900 focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-xs"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                        {t("pincode", "label")} <span className="text-gray-400 font-normal opacity-70 ml-1 lowercase tracking-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder={t("pincode", "placeholder")}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 text-gray-900 focus:bg-white focus:outline-none focus:border-[var(--accent)] transition-all text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 mt-1">
                    <label className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">
                      Delivery Area
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        className={`flex items-center p-3 border cursor-pointer transition-all ${deliveryArea === "inside"
                          ? "border-gray-900 ring-1 ring-gray-900 bg-gray-50/30"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                      >
                        <div className={`flex items-center justify-center w-4 h-4 rounded-full border mr-2 shrink-0 bg-white ${deliveryArea === "inside" ? "border-gray-900" : "border-gray-300"}`}>
                          {deliveryArea === "inside" && <div className="w-2 h-2 rounded-full bg-gray-900 block" style={{ backgroundColor: '#111827' }}></div>}
                        </div>
                        <input
                          type="radio"
                          name="deliveryArea"
                          value="inside"
                          checked={deliveryArea === "inside"}
                          onChange={(e) => setDeliveryArea(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-gray-900">
                            Inside Dhaka
                          </span>
                          <span className="text-[10px] text-gray-500">Delivery fee: ৳70</span>
                        </div>
                      </label>

                      <label
                        className={`flex items-center p-3 border cursor-pointer transition-all ${deliveryArea === "outside"
                          ? "border-gray-900 ring-1 ring-gray-900 bg-gray-50/30"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                      >
                        <div className={`flex items-center justify-center w-4 h-4 rounded-full border mr-2 shrink-0 bg-white ${deliveryArea === "outside" ? "border-gray-900" : "border-gray-300"}`}>
                          {deliveryArea === "outside" && <div className="w-2 h-2 rounded-full bg-gray-900 block" style={{ backgroundColor: '#111827' }}></div>}
                        </div>
                        <input
                          type="radio"
                          name="deliveryArea"
                          value="outside"
                          checked={deliveryArea === "outside"}
                          onChange={(e) => setDeliveryArea(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-gray-900">
                            Outside Dhaka
                          </span>
                          <span className="text-[10px] text-gray-500">Delivery fee: ৳130</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-6 w-full py-3 bg-[#111827] hover:bg-[#ff0022] text-white text-[11px] font-bold uppercase tracking-[0.15em] transition-all outline-none rounded"
                  >
                    {language === "bangla"
                      ? translations.saveButton.bangla
                      : translations.saveButton.english}
                  </button>
                </form>
              </div>
            </Stepper>
          </div>

          <div className="w-full lg:w-[380px]">
            <div className="sticky top-24 space-y-6">
              <PriceSidebar cartItems={cartItems} />

              <div className="bg-white border border-gray-200 p-5 pt-4 rounded">
                <h2 className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-5">
                  {language === "english" ? "Items In Your Order" : "আপনার অর্ডারের আইটেম"}
                </h2>
                <div className="flex flex-col gap-4">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="w-14 h-14 shrink-0 bg-white border border-gray-100 rounded overflow-hidden flex items-center justify-center p-1">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="font-bold text-gray-900 truncate text-[11px] leading-tight mb-1">{item.name}</p>
                        <p className="text-[10px] font-medium text-gray-400">Qty: {item.quantity} <span className="mx-1">•</span> ৳{item.price}</p>
                      </div>
                      <div className="font-bold text-gray-900 text-xs tracking-wide">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Shipping;
