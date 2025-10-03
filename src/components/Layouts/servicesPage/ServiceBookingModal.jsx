import MenuBookIcon from "@mui/icons-material/MenuBook";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import React, { useContext, useState, useEffect } from "react";
import { LanguageContext } from "../../../utils/LanguageContext";
import axios from "axios";

const ServiceBookingModal = ({
  isOpen,
  onClose,
  modalTitle,
  modalSubtitle,
  buttonText,
  formSubject = "Booking Consultant",
}) => {
  const { language } = useContext(LanguageContext) || { language: "english" };
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: formSubject,
    message: `I want to book a ${formSubject.toLowerCase()}`,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Translations
  const translations = {
    english: {
      title: modalTitle || "Book a Consultation",
      subtitle:
        modalSubtitle ||
        "Fill in your details and we'll contact you to schedule your consultation",
      nameLabel: "Full Name *",
      phoneLabel: "Phone Number",
      emailLabel: "Email *",
      messageLabel: "Additional Information",
      buttonText: buttonText || "Book Consultation",
      sendingText: "Booking...",
      successMessage:
        "Consultation booked successfully! We'll contact you soon.",
      errorMessage: "Failed to book consultation. Please try again later.",
      requiredFields: "Please fill in all required fields",
      invalidEmail: "Please enter a valid email address",
    },
    bangla: {
      title: modalTitle || "পরামর্শ বুক করুন",
      subtitle:
        modalSubtitle ||
        "আপনার বিবরণ পূরণ করুন এবং আমরা আপনার পরামর্শ সময়সূচি করতে আপনার সাথে যোগাযোগ করব",
      nameLabel: "পূর্ণ নাম *",
      phoneLabel: "ফোন নম্বর",
      emailLabel: "ইমেইল *",
      messageLabel: "অতিরিক্ত তথ্য",
      buttonText: buttonText || "পরামর্শ বুক করুন",
      sendingText: "বুকিং...",
      successMessage:
        "পরামর্শ সফলভাবে বুক করা হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
      errorMessage: "পরামর্শ বুক করতে ব্যর্থ হয়েছে। পরে আবার চেষ্টা করুন।",
      requiredFields: "অনুগ্রহ করে সমস্ত প্রয়োজনীয় তথ্য প্রদান করুন",
      invalidEmail: "অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা লিখুন",
    },
  };

  // Set initial form data when props change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      subject: formSubject,
      message: `I want to book a ${formSubject.toLowerCase()}`,
    }));
  }, [formSubject]);

  const t = translations[language];

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

    // Validate required fields
    if (!formData.email || !formData.name) {
      showToastMessage(t.requiredFields, false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToastMessage(t.invalidEmail, false);
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
        // Show toast and delay modal close
        showToastMessage(t.successMessage, true);

        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          subject: formSubject,
          message: `I want to book a ${formSubject.toLowerCase()}`,
        });

        // Close modal after 3 seconds to ensure toast is visible
        setTimeout(() => onClose(), 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showToastMessage(error.response?.data?.message || t.errorMessage, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-[#5f6f52]/30 backdrop-blur-sm z-40 flex items-center justify-center"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={onClose}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="glass-card rounded-xl overflow-hidden p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                style={{
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid var(--primary-blue-light)",
                  boxShadow: "0 8px 32px rgba(35, 38, 43, 0.10)",
                }}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <MenuBookIcon
                      className="mr-2"
                      style={{
                        fontSize: 30,
                        color: "var(--primary-blue-dark)",
                      }}
                    />
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: "var(--primary-blue-dark)" }}
                    >
                      {t.title}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-[#a9b388] hover:text-[#5f6f52] transition-colors rounded-full p-1"
                    aria-label={language === "bangla" ? "বন্ধ করুন" : "Close"}
                  >
                    <CloseIcon />
                  </button>
                </div>

                <p
                  className="mb-6"
                  style={{ color: "var(--primary-blue-light)" }}
                >
                  {t.subtitle}
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 font-medium"
                        style={{ color: "var(--primary-blue-dark)" }}
                      >
                        {t.nameLabel}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[#a9b388] focus:border-[#5f6f52] focus:ring-2 focus:ring-[#a9b388] transition-all"
                        placeholder={
                          language === "bangla" ? "আপনার নাম" : "John Doe"
                        }
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block mb-2 font-medium"
                        style={{ color: "var(--primary-blue-dark)" }}
                      >
                        {t.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 rounded-lg border border-[#a9b388] focus:border-[#5f6f52] focus:ring-2 focus:ring-[#a9b388] transition-all"
                        placeholder={
                          language === "bangla"
                            ? "০১৭১১১২৩৪৫৬"
                            : "+880 1711 123456"
                        }
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 font-medium"
                        style={{ color: "var(--primary-blue-dark)" }}
                      >
                        {t.emailLabel}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[#a9b388] focus:border-[#5f6f52] focus:ring-2 focus:ring-[#a9b388] transition-all"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block mb-2 font-medium"
                        style={{ color: "var(--primary-blue-dark)" }}
                      >
                        {t.messageLabel}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className="w-full px-4 py-3 rounded-lg border border-[#a9b388] focus:border-[#5f6f52] focus:ring-2 focus:ring-[#a9b388] transition-all min-h-[100px]"
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <motion.button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-[var(--primary-blue-dark)] hover:bg-[var(--primary-blue-light)] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {t.sendingText}
                        </>
                      ) : (
                        <>
                          <MenuBookIcon
                            style={{ fontSize: 20, color: "#fff" }}
                          />
                          {t.buttonText}
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification - Moved outside modal conditions so it remains visible even when modal closes */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-[2000] ${
              showToast === "success"
                ? "bg-[var(--glass-bg)] text-[var(--primary-blue-dark)] border border-[var(--primary-blue-light)]"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <MenuBookIcon style={{ color: "var(--primary-blue-dark)" }} />
            <span>{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-2 text-lg font-bold"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServiceBookingModal;
