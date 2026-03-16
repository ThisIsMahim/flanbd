import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../../utils/LanguageContext";
import MetaData from "../MetaData";
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const translations = {
    english: {
      header: "Get in Touch",
      tagline: "Have questions? We'd love to hear from you.",
      infoLoc: "Our Location",
      infoAddr: "Dhaka, Bangladesh",
      infoPhone: "01845556566",
      infoEmail: "support@flanbd.store",
      formTitle: "Send a Message",
      formTag: "Fill out the form below and we'll get back to you within 24 hours.",
      labelName: "Full Name",
      labelPhone: "Phone Number",
      labelEmail: "Email Address",
      labelSub: "Subject",
      labelMsg: "Your Message",
      btnSend: "Send Message",
      btnSending: "Sending...",
      success: "Message sent! We'll be in touch soon.",
      error: "Something went wrong. Please try again.",
    },
    bangla: {
      header: "যোগাযোগ করুন",
      tagline: "আপনার কোনো প্রশ্ন থাকলে আমাদের জানান।",
      infoLoc: "আমাদের অবস্থান",
      infoAddr: "ঢাকা, বাংলাদেশ",
      infoPhone: "01845556566",
      infoEmail: "support@flanbd.store",
      formTitle: "বার্তা পাঠান",
      formTag: "নিচের ফর্মটি পূরণ করুন, আমরা আপনার সাথে যোগাযোগ করব।",
      labelName: "পুরো নাম",
      labelPhone: "ফোন নম্বর",
      labelEmail: "ইমেইল",
      labelSub: "বিষয়",
      labelMsg: "আপনার বার্তা",
      btnSend: "বার্তা পাঠান",
      btnSending: "পাঠানো হচ্ছে...",
      success: "বার্তা পাঠানো হয়েছে!",
      error: "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।",
    }
  };

  const t = translations[language] || translations.english;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", msg: "" });

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/usermessages`,
        formData
      );
      if (data.success) {
        setStatus({ type: "success", msg: t.success });
        setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      setStatus({ type: "error", msg: t.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="contact-page-wrapper">
      <MetaData title="Contact Us | Flan" />
      
      <header className="contact-hero">
        <h1>{t.header}</h1>
        <p>{t.tagline}</p>
      </header>

      <main className="contact-grid">
        {/* Info Panel */}
        <section className="contact-info-panel">
          <div className="info-card">
            <div className="info-icon-box"><LocationOnIcon /></div>
            <div className="info-content">
              <h3>{t.infoLoc}</h3>
              <p>{t.infoAddr}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon-box"><PhoneIcon /></div>
            <div className="info-content">
              <h3>Phone</h3>
              <a href={`tel:${t.infoPhone}`}>{t.infoPhone}</a>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon-box"><EmailIcon /></div>
            <div className="info-content">
              <h3>Email</h3>
              <a href={`mailto:${t.infoEmail}`}>{t.infoEmail}</a>
            </div>
          </div>
        </section>

        {/* Form Panel */}
        <section className="contact-form-panel">
          <h2>{t.formTitle}</h2>
          <p>{t.formTag}</p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="input-field-group">
                <label>{t.labelName}</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="contact-input" 
                />
              </div>
              <div className="input-field-group">
                <label>{t.labelPhone}</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="contact-input" 
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>{t.labelEmail}</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="contact-input" 
              />
            </div>

            <div className="input-field-group">
              <label>{t.labelSub}</label>
              <input 
                type="text" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                required 
                className="contact-input" 
              />
            </div>

            <div className="input-field-group">
              <label>{t.labelMsg}</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                rows="5" 
                className="contact-textarea" 
              />
            </div>

            {status.msg && (
              <div className={`status-msg ${status.type}`} style={{ 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '1.5rem',
                backgroundColor: status.type === 'success' ? '#e6fffa' : '#fff5f5',
                color: status.type === 'success' ? '#2c7a7b' : '#c53030',
                fontSize: 'var(--text-sm)',
                fontWeight: 600
              }}>
                {status.msg}
              </div>
            )}

            <button type="submit" className="btn-submit-contact" disabled={isSubmitting}>
              {isSubmitting ? t.btnSending : (
                <>
                  <SendIcon fontSize="small" />
                  {t.btnSend}
                </>
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ContactUs;
