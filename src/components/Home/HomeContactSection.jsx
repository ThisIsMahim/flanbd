import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PhoneIcon from "@mui/icons-material/Phone";
import axios from "axios";
import React, { useContext, useState } from "react";
import { LanguageContext } from "../../utils/LanguageContext";

const HomeContactSection = () => {
  const { language } = useContext(LanguageContext) || { language: "english" };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Translations
  const translations = {
    english: {
      title: "Get in Touch",
      subtitle:
        "We're here to answer your questions about premium sunglasses and optical solutions",
      contactInfo: "Contact Information",
      address: "Dhaka, Bangladesh",
      phone: "+8801845-556566",
      email: "support@eyegearsbd.com",
      formName: "Your Name",
      formEmail: "Your Email",
      formSubject: "Subject",
      formMessage: "Your Message",
      sendButton: "Send Message",
      sending: "Sending...",
      successMessage: "Thank you! We'll get back to you soon.",
      errorMessage: "Failed to send message. Please try again later.",
      requiredFields: "Please fill in all required fields",
    },
    bangla: {
      title: "যোগাযোগ করুন",
      subtitle:
        "আমরা আপনার প্রিমিয়াম সানগ্লাস এবং অপটিক্যাল সমাধান সম্পর্কে প্রশ্নের উত্তর দিতে এখানে আছি",
      contactInfo: "যোগাযোগের তথ্য",
      address: "Dhaka, Bangladesh",
      phone: "+১ (৫৫৫) ১২৩-৪৫৬৭",
      email: "support@eyegearsbd.com",
      formName: "আপনার নাম",
      formEmail: "আপনার ইমেইল",
      formSubject: "বিষয়",
      formMessage: "আপনার বার্তা",
      sendButton: "বার্তা পাঠান",
      sending: "পাঠানো হচ্ছে...",
      successMessage: "ধন্যবাদ! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
      errorMessage: "বার্তা পাঠাতে ব্যর্থ হয়েছে। পরে আবার চেষ্টা করুন।",
      requiredFields: "অনুগ্রহ করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন",
    },
  };

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
    if (!formData.email || !formData.name || !formData.message) {
      showToastMessage(t.requiredFields, false);
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
        showToastMessage(t.successMessage, true);
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showToastMessage(error.response?.data?.message || t.errorMessage, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <section className="py-10 relative overflow-hidden">
      <div className="container mx-auto z-10 relative">
        <div className="text-center mb-12 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {/* <MenuBookIcon
              style={{ fontSize: 36, color: "var(--primary-blue-dark)" }}
            />
            <EditIcon
              style={{ fontSize: 30, color: "var(--primary-blue-light)" }}
            /> */}
          </div>
          <h2 className="text-3xl font-bold text-red-500 mb-2">
            {t.title}
          </h2>
          <p className="text-lg text-primary-blue-light max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 px-4">
          {/* Contact Info */}
          <div className="col-span-2 lg:col-span-1">
            <div className="glass-card p-6 h-full contact-info-card">
              <h3 className="text-xl font-semibold text-red-500 mb-5">
                {t.contactInfo}
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <LocationOnIcon className="text-primary-blue-light mr-2 mt-1" />
                  <p className="text-base text-gray-700">{t.address}</p>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="text-primary-blue-light mr-2" />
                  <p className="text-base text-gray-700">{t.phone}</p>
                </div>
                <div className="flex items-center">
                  <EmailIcon className="text-primary-blue-light mr-2" />
                  <p className="text-base text-gray-700">{t.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-span-2">
            <div className="glass-card p-6 contact-form-card">
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.formName}
                      required
                      className="contact-input"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.formEmail}
                      required
                      className="contact-input"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t.formSubject}
                    className="contact-input"
                  />
                </div>
                <div className="mb-6">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t.formMessage}
                    required
                    rows="4"
                    className="contact-input"
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="glass-button px-8 py-3 font-semibold"
                  >
                    <EditIcon style={{ marginRight: 8, fontSize: 22 }} />
                    {isSubmitting ? t.sending : t.sendButton}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg ${
            showToast === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <div className="flex items-center">
            <span>{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 text-lg font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeContactSection;

