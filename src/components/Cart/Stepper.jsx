import CheckIcon from "@mui/icons-material/Check";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { LanguageContext } from "../../utils/LanguageContext";

const Stepper = ({ activeStep, children }) => {
  const { language } = useContext(LanguageContext);
  const { user } = useSelector((state) => state.user);
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  // Handle null/undefined values for guest users
  const address = shippingInfo
    ? `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}`
    : "Address not provided";

  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "guest@example.com";

  const steps = [
    {
      label: {
        english: user ? "LOGIN" : "GUEST INFO",
        bangla: user ? "লগইন" : "অতিথি তথ্য",
      },
      desc: {
        english: (
          <p className="font-medium text-sm">
            {userName}{" "}
            <span className="text-sm font-normal">{userEmail}</span>
          </p>
        ),
        bangla: (
          <p className="font-medium text-sm">
            {userName}{" "}
            <span className="text-sm font-normal">{userEmail}</span>
          </p>
        ),
      },
    },
    {
      label: {
        english: "DELIVERY ADDRESS",
        bangla: "ডেলিভারি ঠিকানা",
      },
      desc: {
        english: (
          <p className="font-medium text-sm">
            {userName} <span className="text-sm font-normal">{address}</span>
          </p>
        ),
        bangla: (
          <p className="font-medium text-sm">
            {userName} <span className="text-sm font-normal">{address}</span>
          </p>
        ),
      },
    },
    {
      label: {
        english: "ORDER SUMMARY",
        bangla: "অর্ডার সারাংশ",
      },
      desc: {
        english: <p className="font-medium text-sm">{cartItems.length} Item</p>,
        bangla: <p className="font-medium text-sm">{cartItems.length} আইটেম</p>,
      },
    },
    {
      label: {
        english: "PAYMENT OPTIONS",
        bangla: "পেমেন্ট অপশন",
      },
      desc: {
        english: <p className="font-medium text-sm">Paytm</p>,
        bangla: <p className="font-medium text-sm">পেটিএম</p>,
      },
    },
  ];

  const getLabel = (step) => {
    return language === "bangla" ? step.label.bangla : step.label.english;
  };

  const getDesc = (step) => {
    return language === "bangla" ? step.desc.bangla : step.desc.english;
  };

  return (
    <div className="flex flex-col gap-4">
      {steps.map((step, index) => {
        return (
          <>
            {activeStep === index ? (
              <div className="flex flex-col shadow-sm rounded-xl overflow-hidden">
                <div className="flex items-center rounded-t-xl bg-[#0A0A0A] px-6 py-4 gap-4 border border-b-0 border-[#0A0A0A]">
                  <span className="h-6 w-6 shrink-0 flex items-center justify-center text-xs font-bold bg-[var(--accent)] rounded-full text-white shadow-sm">
                    {index + 1}
                  </span>
                  <h2 className="font-bold text-white tracking-[0.1em] uppercase text-sm">{getLabel(step)}</h2>
                </div>
                {children}
              </div>
            ) : (
              <>
                {activeStep > index ? (
                  <Step
                    isDesc={true}
                    label={getLabel(step)}
                    desc={getDesc(step)}
                    index={index}
                  />
                ) : (
                  <Step isDesc={false} label={getLabel(step)} index={index} />
                )}
              </>
            )}
          </>
        );
      })}
    </div>
  );
};

const Step = ({ isDesc, label, desc, index }) => {
  return (
    <div className="flex bg-white shadow-sm border border-gray-100 px-5 py-4 rounded-xl items-start transition-all hover:border-gray-200">
      <span className="mt-0.5 mr-4 shrink-0 h-6 w-6 flex items-center justify-center text-xs font-bold bg-gray-100 rounded-full text-gray-500">
        {index + 1}
      </span>
      <div className="flex flex-col gap-1 w-full">
        <h2 className="font-bold text-gray-400 flex items-center gap-2 tracking-widest uppercase text-xs">
          {label}
          {isDesc && (
            <span className="text-[var(--accent)] ml-auto">
              <CheckIcon sx={{ fontSize: "16px" }} />
            </span>
          )}
        </h2>
        {isDesc && <div className="text-gray-900 text-sm mt-1">{desc}</div>}
      </div>
    </div>
  );
};

export default Stepper;
