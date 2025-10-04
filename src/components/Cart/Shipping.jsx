import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
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
            className="flex items-center text-[var(--button-bg)] hover:text-[var(--button-hover)] transition-colors font-medium"
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
              <div className="w-full bg-white">
                <form
                  onSubmit={shippingSubmit}
                  autoComplete="off"
                  className="flex flex-col justify-start gap-3 w-full sm:w-3/4 mx-1 sm:mx-8 my-4"
                >
                  <TextField
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    fullWidth
                    label={t("address", "label")}
                    placeholder={t("address", "placeholder")}
                    variant="outlined"
                    required
                  />

                  <div className="flex gap-6">
                    <TextField
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      type="number"
                      label={t("pincode", "label")}
                      placeholder={t("pincode", "placeholder")}
                      fullWidth
                      variant="outlined"
                      required
                    />
                    <TextField
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      type="number"
                      label={t("phoneNo", "label")}
                      placeholder={t("phoneNo", "placeholder")}
                      fullWidth
                      variant="outlined"
                      required
                    />
                  </div>

                  <div className="flex gap-6">
                    <TextField
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      label={t("city", "label")}
                      placeholder={t("city", "placeholder")}
                      fullWidth
                      variant="outlined"
                      required
                    />
                    <TextField
                      label={t("landmark", "label")}
                      placeholder={t("landmark", "placeholder")}
                      fullWidth
                      variant="outlined"
                    />
                  </div>

                  <div className="flex gap-6">
                    <FormControl fullWidth>
                      <InputLabel id="country-select">
                        {t("country", "label")}
                      </InputLabel>
                      <Select
                        labelId="country-select"
                        id="country-select"
                        defaultValue={country}
                        disabled
                        label={t("country", "label")}
                      >
                        <MenuItem value={"IN"}>
                          {language === "english" ? "Bangladesh" : "Bangladesh"}
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth disabled={!country}>
                      <InputLabel id="state-select">
                        {t("district", "label")}
                      </InputLabel>
                      <Select
                        labelId="state-select"
                        id="state-select"
                        value={state}
                        label={t("district", "label")}
                        onChange={(e) => setState(e.target.value)}
                        required
                      >
                        {states.map((item) => (
                          <MenuItem key={item.code} value={item.code}>
                            {language === "bangla"
                              ? item.bangla_name || item.name
                              : item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* Delivery Area Selection */}
                  <div className="flex gap-6 items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryArea"
                        value="inside"
                        checked={deliveryArea === "inside"}
                        onChange={(e) => setDeliveryArea(e.target.value)}
                      />
                      <span>Inside Dhaka (৳70)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="deliveryArea"
                        value="outside"
                        checked={deliveryArea === "outside"}
                        onChange={(e) => setDeliveryArea(e.target.value)}
                      />
                      <span>Outside Dhaka (৳130)</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="bg-[var(--button-bg)] hover:bg-[var(--button-hover)] w-full sm:w-1/3 my-2 py-3.5 text-sm font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none transition-colors duration-300"
                  >
                    {language === "bangla"
                      ? translations.saveButton.bangla
                      : translations.saveButton.english}
                  </button>
                </form>
              </div>
            </Stepper>
          </div>

          <PriceSidebar cartItems={cartItems} />
        </div>
      </main>
    </>
  );
};

export default Shipping;
