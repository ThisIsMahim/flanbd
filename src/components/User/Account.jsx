import MenuIcon from "@mui/icons-material/Menu";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../../utils/LanguageContext";
import Breadcrumb from "../Layouts/Breadcrumb";
import GoldUserBadge from "../common/GoldUserBadge";
import Loader from "../Layouts/Loader";
import MetaData from "../Layouts/MetaData";
import Sidebar from "./Sidebar";
import { myOrdersSummary } from "../../actions/orderAction";

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { language } = useContext(LanguageContext);

  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const { summary } = useSelector((state) => state.myOrdersSummary || {});

  // Translations
  const translations = {
    english: {
      myProfile: "My Profile",
      personalInformation: "Personal Information",
      editProfile: "Edit Profile",
      firstName: "First Name",
      lastName: "Last Name",
      emailAddress: "Email Address",
      mobileNumber: "Mobile Number",
      yourGender: "Your Gender",
      male: "Male",
      female: "Female",
      accountActions: "Account Actions",
      changePassword: "Change Password",
      updateProfile: "Update Profile",
      deactivateAccount: "Deactivate Account",
      accountSecurity: "Account Security",
      securityMessage:
        "We recommend changing your password regularly and ensuring it's unique from passwords you use on other websites. If you notice any suspicious activity on your account, please contact customer support immediately.",
      lastLogin: "Last login:",
    },
    bangla: {
      myProfile: "আমার প্রোফাইল",
      personalInformation: "ব্যক্তিগত তথ্য",
      editProfile: "প্রোফাইল সম্পাদনা করুন",
      firstName: "নামের প্রথম অংশ",
      lastName: "নামের শেষ অংশ",
      emailAddress: "ইমেইল ঠিকানা",
      mobileNumber: "মোবাইল নম্বর",
      yourGender: "আপনার লিঙ্গ",
      male: "পুরুষ",
      female: "মহিলা",
      accountActions: "অ্যাকাউন্ট পদক্ষেপ",
      changePassword: "পাসওয়ার্ড পরিবর্তন করুন",
      updateProfile: "প্রোফাইল আপডেট করুন",
      deactivateAccount: "অ্যাকাউন্ট নিষ্ক্রিয় করুন",
      accountSecurity: "অ্যাকাউন্ট নিরাপত্তা",
      securityMessage:
        "আমরা নিয়মিত আপনার পাসওয়ার্ড পরিবর্তন করার পরামর্শ দিই এবং নিশ্চিত করি যে এটি অন্য ওয়েবসাইটে ব্যবহৃত পাসওয়ার্ড থেকে আলাদা। আপনি যদি আপনার অ্যাকাউন্টে কোনো সন্দেহজনক কার্যকলাপ লক্ষ্য করেন, অনুগ্রহ করে অবিলম্বে গ্রাহক সহায়তার সাথে যোগাযোগ করুন।",
      lastLogin: "সর্বশেষ লগইন:",
    },
  };

  const t = translations[language];

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Ensure the latest membership status is available (used on My Orders page)
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(myOrdersSummary());
    }
  }, [dispatch, isAuthenticated]);

  const getLastName = () => {
    const nameArray = user.name.split(" ");
    return nameArray[nameArray.length - 1];
  };

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  return (
    <>
      <MetaData title={t.myProfile} />

      {loading ? (
        <Loader />
      ) : (
        <>
          <Breadcrumb />
          <main className="w-full  sm:mt-0">
            <div className="flex gap-3.5 sm:w-11/12 sm:mt-4 m-auto mb-7">
              <Sidebar
                activeTab={"profile"}
                isOpen={showMobileSidebar}
                onClose={toggleMobileSidebar}
              />

              <div className="flex-1 overflow-hidden shadow bg-white rounded-sm">
                <div className="flex flex-col gap-8 m-4 sm:mx-8 sm:my-6">
                  {/* Personal Information Section */}
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          className="sm:hidden text-gray-700 p-1 rounded-sm border hover:bg-gray-100"
                          onClick={toggleMobileSidebar}
                        >
                          <MenuIcon />
                        </button>
                        <span className="font-medium text-lg">
                          {t.personalInformation}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-800 font-bold uppercase">
                          {user?.name?.[0] || "U"}
                        </span>
                        {(user?.isGoldUser || summary?.isGold) ? (
                          <GoldUserBadge size="small" showAnimation={false} />
                        ) : (
                          <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-[var(--primary-blue-light)] text-white">Standard</span>
                        )}
                      </div>
                      <Link
                        to="/account/update"
                        className="text-sm text-primary-blue font-medium hover:text-primary-blue/80 transition"
                      >
                        {t.editProfile}
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 p-3 rounded-sm border bg-blue-50 focus-within:border-primary-blue">
                        <label className="text-xs text-gray-500">
                          {t.firstName}
                        </label>
                        <input
                          type="text"
                          value={user.name.split(" ", 1)}
                          className="text-sm outline-none border-none bg-transparent cursor-not-allowed text-gray-700"
                          disabled
                        />
                      </div>
                      <div className="flex flex-col gap-1 p-3 rounded-sm border bg-blue-50 focus-within:border-primary-blue">
                        <label className="text-xs text-gray-500">
                          {t.lastName}
                        </label>
                        <input
                          type="text"
                          value={getLastName()}
                          className="text-sm outline-none border-none bg-transparent cursor-not-allowed text-gray-700"
                          disabled
                        />
                      </div>

                      <div className="flex flex-col gap-1 p-3 rounded-sm border bg-blue-50 focus-within:border-primary-blue">
                        <label className="text-xs text-gray-500">
                          {t.emailAddress}
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          className="text-sm outline-none border-none bg-transparent cursor-not-allowed text-gray-700"
                          disabled
                        />
                      </div>

                      <div className="flex flex-col gap-1 p-3 rounded-sm border bg-blue-50 focus-within:border-primary-blue">
                        <label className="text-xs text-gray-500">
                          {t.mobileNumber}
                        </label>
                        <input
                          type="tel"
                          value="+88015-7104****"
                          className="text-sm outline-none border-none bg-transparent cursor-not-allowed text-gray-700"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                      <h2 className="text-sm font-medium">{t.yourGender}</h2>
                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="gender"
                            checked={user.gender === "male"}
                            id="male"
                            className="h-4 w-4 cursor-not-allowed accent-primary-blue"
                            disabled
                          />
                          <label
                            htmlFor="male"
                            className="cursor-not-allowed text-gray-700"
                          >
                            {t.male}
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="gender"
                            checked={user.gender === "female"}
                            id="female"
                            className="h-4 w-4 cursor-not-allowed accent-primary-blue"
                            disabled
                          />
                          <label
                            htmlFor="female"
                            className="cursor-not-allowed text-gray-700"
                          >
                            {t.female}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="flex flex-col gap-4 border-t pt-6">
                    <h2 className="font-medium text-lg">{t.accountActions}</h2>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to="/password/update"
                        className="flex items-center justify-center px-4 py-2 bg-white text-black rounded-sm hover:bg-green-200 border transition"
                      >
                        {t.changePassword}
                      </Link>

                      <Link
                        to="/account/update"
                        className="flex items-center justify-center px-4 py-2 border border-primary-blue text-primary-blue rounded-sm hover:bg-blue-50 transition"
                      >
                        {t.updateProfile}
                      </Link>

                      {/* <Link
                        to="/"
                        className="flex items-center justify-center px-4 py-2 border border-red-500 text-red-500 rounded-sm hover:bg-red-50 transition"
                      >
                        {t.deactivateAccount}
                      </Link> */}
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="flex flex-col gap-4 border-t pt-6">
                    <h2 className="font-medium text-lg">{t.accountSecurity}</h2>
                    <p className="text-sm text-gray-600">{t.securityMessage}</p>

                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-blue-50 p-3 rounded-sm">
                      <span className="font-medium">{t.lastLogin}</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default Account;
