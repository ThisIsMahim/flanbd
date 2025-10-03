import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PhoneIcon from "@mui/icons-material/Phone";
import axios from "axios";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useContext, useEffect, useRef, useState } from "react";
import { LanguageContext } from "../../../utils/LanguageContext";
import "./ContactUs.css";

const ContactUs = () => {
  const { language } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef(null);

  // Translations
  const translations = {
    english: {
              header: "Contact Flan",
              tagline: "Thoughtful products start with a conversation",
      location: "Our Location",
      address: {
        line1: "Dhaka, Bangladesh",
        // line2: "New York",
        // line3: "NY 10001",
      },
      contactDetails: "Contact Details",
      phone1: "01845556566",
              email: "support@eyegearsbd.com",
      serviceHours: "Service Hours",
      schedule: {
        saturday: "Available 24 hours",
      },
      formHeader: "Get in Touch",
      formTagline:
        "Have questions about an order or our products? We're here to help.",
      fullName: "Full Name",
      phoneNumber: "Phone Number",
      emailLabel: "Email",
      subjectLabel: "Subject",
      yourMessage: "Your Message",
      sendMessage: "Send Message",
      sending: "Sending...",
      promiseHeader: "The Flan Promise",
      promiseText:
        "At Flan, we're committed to exceptional quality and warm, human support. Every message helps us serve you better.",
      requiredFields: "Please fill in all required fields",
      successMessage: "Message sent successfully! We'll contact you soon.",
      errorMessage: "Failed to send message. Please try again later.",
      placeholders: {
        name: "Your name",
        phone: "01845556566",
        email: "your@email.com",
        subject: "Order or product inquiry",
        message: "Tell us how we can help...",
      },
    },
    bangla: {
      header: "ফ্ল্যানের সাথে যোগাযোগ করুন",
      tagline: "আন্তরিক পণ্য, আন্তরিক আলাপচারিতার মাধ্যমে শুরু",
      location: "আমাদের অবস্থান",
      address: {
        line1: "Dhaka, Bangladesh",
        // line2: "Dhaka",
        line3: "Bangladesh",
      },
      contactDetails: "যোগাযোগের বিবরণ",
      phone1: "01845556566",
              email: "support@eyegearsbd.com",
      serviceHours: "সেবার সময়",
      schedule: {
        saturday: "২৪ ঘণ্টা খোলা",
      },
      formHeader: "যোগাযোগ করুন",
      formTagline:
        "আপনার অর্ডার বা পণ্য নিয়ে প্রশ্ন আছে? আমরা সাহায্য করতে প্রস্তুত।",
      fullName: "পুরো নাম",
      phoneNumber: "ফোন নম্বর",
      emailLabel: "ইমেইল",
      subjectLabel: "বিষয়",
      yourMessage: "আপনার বার্তা",
      sendMessage: "বার্তা পাঠান",
      sending: "পাঠানো হচ্ছে...",
      promiseHeader: "ফ্ল্যান প্রমিজ",
      promiseText:
        "ফ্ল্যান-এ আমরা মানের সাথে আপস করি না এবং আন্তরিক সাপোর্টে বিশ্বাস করি। আপনার বার্তা আমাদের সেবাকে আরও উন্নত করে।",
      requiredFields: "অনুগ্রহ করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন",
      successMessage:
        "বার্তা সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
      errorMessage:
        "বার্তা পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
      placeholders: {
        name: "আপনার নাম",
        phone: "01845556566",
        email: "your@email.com",
        subject: "অর্ডার বা পণ্যের জিজ্ঞাসা",
        message: "আমরা কীভাবে সাহায্য করতে পারি লিখুন...",
      },
    },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToastMessage = (message, isSuccess = true) => {
    setToastMessage(message);
    setShowToast(isSuccess ? "success" : "error");
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.name ||
      !formData.message ||
      !formData.subject
    ) {
      showToastMessage(translations[language].requiredFields, false);
      return;
    }
    setIsSubmitting(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/usermessages`,
        formData,
        config
      );
      if (data.success) {
        showToastMessage(translations[language].successMessage, true);
        setFormData({
          name: "",
          phone: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      showToastMessage(
        error.response?.data?.message || translations[language].errorMessage,
        false
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div className="min-h-screen py-10 px-2 flex flex-col items-center justify-center bg-primary-bg bg-gradient-to-br from-primary-bg to-yellow-50">
      <div
        ref={containerRef}
        className="max-w-4xl w-full mx-auto glass-container p-6 md:p-10 rounded-2xl shadow-lg bg-white/70 backdrop-blur-md border border-white/40"
      >
        {/* Header Section */}
        <div className="section-header flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <MenuBookIcon
              style={{ fontSize: 40, color: "#5F6F52" }}
            />
            <EditIcon
              style={{ fontSize: 32, color: "#A9B388" }}
            />
          </div>
          <h1 className="text-3xl font-bold text-accent mb-1">
            {translations[language].header}
          </h1>
          <p className="text-lg text-primary-text/80">
            {translations[language].tagline}
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Contact Information Cards */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="glass-card p-5 flex flex-col items-center text-center rounded-xl bg-white/70 backdrop-blur border border-white/40 shadow">
              <LocationOnIcon
                style={{ fontSize: 32, color: "#5F6F52" }}
              />
              <h3 className="font-semibold text-lg mt-2 mb-1 text-primary-text">
                {translations[language].location}
              </h3>
              {translations[language].address.line1 && (
                <p className="text-sm text-gray-700">
                  {translations[language].address.line1}
                </p>
              )}
              {translations[language].address.line2 && (
                <p className="text-sm text-gray-700">
                  {translations[language].address.line2}
                </p>
              )}
              {translations[language].address.line3 && (
                <p className="text-sm text-gray-700">
                  {translations[language].address.line3}
                </p>
              )}
            </div>
            <div className="glass-card p-5 flex flex-col items-center text-center rounded-xl bg-white/70 backdrop-blur border border-white/40 shadow">
              <PhoneIcon
                style={{ fontSize: 32, color: "#5F6F52" }}
              />
              <h3 className="font-semibold text-lg mt-2 mb-1 text-primary-text">
                {translations[language].contactDetails}
              </h3>
              <a
                href={`tel:${translations[language].phone1.replace(
                  /[^+\d]/g,
                  ""
                )}`}
                className="text-sm text-gray-700 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-blue-light rounded"
                aria-label="Call us"
              >
                {translations[language].phone1}
              </a>
              <a
                href={`mailto:${translations[language].email}`}
                className="text-sm text-gray-700 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-blue-light rounded"
                aria-label="Email us"
              >
                {translations[language].email}
              </a>
            </div>
            <div className="glass-card p-5 flex flex-col items-center text-center rounded-xl bg-white/70 backdrop-blur border border-white/40 shadow">
              <CollectionsBookmarkIcon
                style={{ fontSize: 32, color: "#5F6F52" }}
              />
              <h3 className="font-semibold text-lg mt-2 mb-1 text-primary-text">
                {translations[language].serviceHours}
              </h3>
              {translations[language].schedule.saturday && (
                <p className="text-sm text-gray-700">
                  {translations[language].schedule.saturday}
                </p>
              )}
              {translations[language].schedule.sunday && (
                <p className="text-sm text-gray-700">
                  {translations[language].schedule.sunday}
                </p>
              )}
            </div>
            {/* Social Media Links */}
            <div className="glass-card p-5 flex flex-col items-center text-center rounded-xl bg-white/70 backdrop-blur border border-white/40 shadow">
              <h3 className="font-semibold text-lg mb-2 text-primary-text">
                Connect with us
              </h3>
              <div className="flex flex-row gap-6 justify-center items-center">
                {/* Facebook */}
                <a
                  href="https://web.facebook.com/people/eyegears/61566909456150/?mibextid=wwXIfr&rdid=OmbCnN1X0Zt95GoY&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1F345SPNys%2F%3Fmibextid%3DwwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="transition-transform hover:scale-110"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="16" cy="16" r="16" fill="#1877F2" />
                    <path
                      d="M21 16.5H17.5V25H14.5V16.5H13V14H14.5V12.75C14.5 11.2312 15.2312 10 17.25 10H21V12.5H18.5C18.2239 12.5 18 12.7239 18 13V14H21L20.5 16.5Z"
                      fill="white"
                    />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/eyegears_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transition-transform hover:scale-110"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="16" cy="16" r="16" fill="#E1306C" />
                    <rect
                      x="10"
                      y="10"
                      width="12"
                      height="12"
                      rx="4"
                      fill="white"
                    />
                    <circle cx="16" cy="16" r="3" fill="#E1306C" />
                    <circle cx="21" cy="11" r="1" fill="#E1306C" />
                  </svg>
                </a>
                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@eyegears_?_r=1&_d=secCgYIASAHKAESPgo8tqYT4f4zCP9pM3qqXu%2Bzi6EVQ5P%2BeTiO1iOHlvDcMcx%2B6E29Yr4oBWC6hoCc%2FwU9GIoerCrgXa2pNcQdGgA%3D&_svg=1&checksum=03da4e2a321aeae5b21bdef87713e6c0c7598eab7522187cc5562360e2698cb1&sec_uid=MS4wLjABAAAAPN0RHlmo2WWEEQsK3GU1LXvzxqmno8CfhX7J9nXyZurBZaItU3Y0kuJ87Aa825bS&sec_user_id=MS4wLjABAAAAPN0RHlmo2WWEEQsK3GU1LXvzxqmno8CfhX7J9nXyZurBZaItU3Y0kuJ87Aa825bS&share_app_id=1233&share_author_id=7420095559338378245&share_link_id=7D759DBC-0516-4998-97EB-21453BF22C02&share_scene=1&sharer_language=en&social_share_type=4&source=h5_m&timestamp=1749364306&tt_from=copy&u_code=egddf563f8d0ma&ug_btm=b8727%2Cb0&user_id=7420095559338378245&utm_campaign=client_share&utm_medium=ios&utm_source=copy"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="transition-transform hover:scale-110"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="16" cy="16" r="16" fill="#000" />
                    <path
                      d="M22 14.5c-1.38 0-2.5-1.12-2.5-2.5V10h-2v8.5a2 2 0 11-2-2v-2h-2v2a4 4 0 104 4V14.5c.73.47 1.6.75 2.5.75V14.5z"
                      fill="#fff"
                    />
                    <path
                      d="M22 14.5c-1.38 0-2.5-1.12-2.5-2.5V10h-2v8.5a2 2 0 11-2-2v-2h-2v2a4 4 0 104 4V14.5c.73.47 1.6.75 2.5.75V14.5z"
                      fill="#25F4EE"
                      fill-opacity=".5"
                    />
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${translations[language].phone1.replace(/[^+\d]/g, "")}?text=Hello! I'm interested in Flan products. Can you help me?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="transition-transform hover:scale-110"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="16" cy="16" r="16" fill="#25D366" />
                    <path
                      d="M8 24l2.5-2.5c-1.5-1.5-2.5-3.5-2.5-5.5C8 10.5 12.5 6 18 6s10 4.5 10 10-4.5 10-10 10c-2 0-4-.5-5.5-1.5L8 24z"
                      fill="white"
                    />
                    <path
                      d="M13 12c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1zm5 0c-.5 0-1 .5-1 1s.5 1 1 1 1-.5 1-1-.5-1-1-1z"
                      fill="#25D366"
                    />
                    <path
                      d="M18 14c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex-1">
            <div className="form-header mb-4">
              <h3 className="text-4xl font-bold text-primary-text mb-1">
                {translations[language].formHeader}
              </h3>
              <p className="text-base text-primary-text/70">
                {translations[language].formTagline}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="font-medium text-primary-text"
                >
                  {translations[language].fullName}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={translations[language].placeholders.name}
                  className="contact-input px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="phone"
                  className="font-medium text-primary-text"
                >
                  {translations[language].phoneNumber}
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={translations[language].placeholders.phone}
                  className="contact-input px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="font-medium text-primary-text"
                >
                  {translations[language].emailLabel}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={translations[language].placeholders.email}
                  className="contact-input px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="subject"
                  className="font-medium text-primary-text"
                >
                  {translations[language].subjectLabel}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder={translations[language].placeholders.subject}
                  className="contact-input px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="font-medium text-primary-text"
                >
                  {translations[language].yourMessage}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder={translations[language].placeholders.message}
                  rows="5"
                  className="contact-input px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                ></textarea>
              </div>
              <button
                type="submit"
                className="glass-button mt-2 flex items-center justify-center gap-2 bg-accent text-white px-5 py-2 rounded-lg hover:bg-accent-support transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    {translations[language].sending}
                  </>
                ) : (
                  <>
                    <EditIcon style={{ fontSize: 20 }} />
                    {translations[language].sendMessage}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Quality Promise Section */}
        <div className="mt-10 text-center">
          <h3 className="text-xl font-semibold text-primary-text mb-2 flex items-center justify-center gap-2">
            <CollectionsBookmarkIcon
              style={{ fontSize: 28, color: "#5F6F52" }}
            />
            {translations[language].promiseHeader}
          </h3>
          <p className="text-base text-primary-text/70 max-w-xl mx-auto">
            {translations[language].promiseText}
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <motion.div
          className={`glass-card fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 flex items-center gap-3 z-50 ${showToast}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <MenuBookIcon
            style={{ fontSize: 24, color: "#5F6F52" }}
          />
          <span className="font-medium text-primary-text">
            {toastMessage}
          </span>
          <button
            onClick={() => setShowToast(false)}
            className="ml-2 text-lg font-bold text-gray-400 hover:text-red-500"
          >
            &times;
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ContactUs;
