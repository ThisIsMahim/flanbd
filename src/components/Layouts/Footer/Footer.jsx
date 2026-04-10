import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const location = useLocation();
  const [adminRoute, setAdminRoute] = useState(false);

  useEffect(() => {
    setAdminRoute(location.pathname.split("/", 2).includes("admin"));
  }, [location]);

  if (adminRoute) return null;

  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Column 1: Support */}
          <div className="footer-col support-col">
            <h4 className="footer-col-title">SUPPORT</h4>
            <div className="support-buttons">
              <a href="tel:+8801845556566" className="support-btn">
                <LocalPhoneIcon sx={{ fontSize: 18 }} />
                <span>+880 1845-556566</span>
              </a>
              <Link to="/guest-order-tracking" className="support-btn">
                <LocationOnIcon sx={{ fontSize: 18 }} />
                <span>Track My Order</span>
              </Link>
            </div>
            <div className="footer-socials">
              <a href="https://www.facebook.com/FlanBDbd" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                <FacebookIcon sx={{ fontSize: 20 }} />
              </a>
              <a href="https://www.instagram.com/paper_man_official/" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                <InstagramIcon sx={{ fontSize: 20 }} />
              </a>
              <a href="https://wa.me/8801845556566" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">
                <WhatsAppIcon sx={{ fontSize: 20 }} />
              </a>
            </div>
          </div>

          {/* Column 2: About Us */}
          <div className="footer-col">
            <h4 className="footer-col-title">About Us</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
              <li><Link to="/guest-order-tracking">Track Order</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/stories">Stories</Link></li>
            </ul>
          </div>

          {/* Column 3: Policy */}
          <div className="footer-col">
            <h4 className="footer-col-title">Policy</h4>
            <ul className="footer-links">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/shipping-policies">Shipping Policy</Link></li>
              <li><Link to="/cancellation-return">Refund Policy</Link></li>
              <li><Link to="/cancellation-return">Return Policy</Link></li>
              <li><Link to="/warranty-policy">Warranty Policy</Link></li>
              <li><Link to="/shipping-policies">Delivery Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="footer-col stay-connected">
            <h4 className="footer-col-title">Stay Connected</h4>
            <div className="connection-info">
              <p className="brand-name">FlanBD</p>
              <p className="warehouse-info">
                <strong>Warehouse Address —</strong><br />
                Mymensingh, Bangladesh
              </p>
              <p className="note">
                <strong>Kindly note</strong> that this location does not serve as our sales outlet or pickup point.
              </p>
              <p className="email-info">
                Email: <a href="mailto:support@flanbd.store">support@flanbd.store</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p className="copyright-text">
          © {new Date().getFullYear()} FLANBD. ALL RIGHTS RESERVED.
        </p>
        <div className="footer-bottom-credits">
           <span className="by">Developed by </span>
          <a href="https://skybridgesystems.xyz" target="_blank" rel="noopener noreferrer" className="soft-engine-link">
            Skybridge systems
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
