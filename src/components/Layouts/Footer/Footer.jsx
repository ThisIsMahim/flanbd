import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Footer.css";

const TikTokIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M16.154 3.5c.563 1.266 1.538 2.33 2.79 3.01.726.39 1.54.62 2.377.67v3.06c-1.57-.06-3.08-.51-4.4-1.29v6.6c0 3.6-2.92 6.5-6.52 6.45-1.06-.01-2.1-.28-3.02-.8-1.5-.86-2.62-2.26-3.1-3.94-.2-.7-.28-1.44-.23-2.18.2-3.02 2.68-5.41 5.72-5.41.46 0 .92.06 1.35.17v3.23c-.44-.23-.95-.33-1.46-.28-1.35.12-2.42 1.24-2.5 2.6-.06 1.54 1.14 2.84 2.67 2.84 1.49 0 2.7-1.21 2.7-2.7V3.5h3.55z" />
  </svg>
);

const Footer = () => {
  const location = useLocation();
  const [adminRoute, setAdminRoute] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    setAdminRoute(location.pathname.split("/", 2).includes("admin"));
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Shop All", redirect: "/products" },
        { name: "About Us", redirect: "/about" },
        { name: "Contact Us", redirect: "/contact" },
        { name: "Stories", redirect: "/stories" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Order Tracking", redirect: "/guest-order-tracking" },
        { name: "Shipping Policies", redirect: "/shipping-policies" },
        { name: "Cancellation & Return", redirect: "/cancellation-return" },
        { name: "Terms & Conditions", redirect: "/terms-conditions" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Facebook", icon: <FacebookIcon fontSize="small" />, redirect: "https://www.facebook.com/FlanBDbd" },
    { name: "Instagram", icon: <InstagramIcon fontSize="small" />, redirect: "https://www.instagram.com/paper_man_official/" },
    { name: "TikTok", icon: <TikTokIcon />, redirect: "https://www.tiktok.com/@FlanBD_?_t=ZS-8zSuo0qsf9m&_r=1" },
  ];

  if (adminRoute) return null;

  return (
    <footer className="footer-main">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              FLAN<span>.</span>
            </Link>
            <p className="footer-tagline">
              Your premium destination for high-quality anime merchandise and collectibles.
            </p>
            <div className="footer-socials">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.redirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section, i) => (
            <div key={i} className="footer-col">
              <h4 className="footer-col-title">{section.title}</h4>
              <ul className="footer-links">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link to={link.redirect} className="footer-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-col">
            <h4 className="footer-col-title">Newsletter</h4>
            <p className="footer-tagline mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm flex-1 focus:outline-none focus:border-accent"
              />
              <button className="btn btn-primary py-2 px-6 text-xs">Join</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} FlanBD. All Rights Reserved.
          </p>
          <div className="footer-payments">
            <img src="/bkash.png" alt="bkash" />
            <img src="/Nagad.png" alt="Nagad" />
          </div>
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-bold uppercase tracking-widest">Powered by</span>
            <a href="https://softenginelab.com/" target="_blank" rel="noopener noreferrer">
              <img src="/softEngineLab.png" alt="SoftEngineLab" className="h-4" />
            </a>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        aria-label="Back to top"
      >
        <ArrowUpwardIcon />
      </button>
    </footer>
  );
};

export default Footer;
