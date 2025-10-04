import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const TikTokIcon = (props) => (
  <svg
    width="24"
    height="24"
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

  const footerLinks = [
    {
      title: "about",
      links: [
        { name: "Contact Us", redirect: "/contact" },
        { name: "About Us", redirect: "/about" },
      ],
    },
    {
      title: "help",
      links: [
        { name: "Guest Order Tracking", redirect: "/guest-order-tracking" },
        { name: "Shipping Policies", redirect: "/shipping-policies" },
        { name: "Cancellation & Return", redirect: "/cancellation-return" },
        // { name: "Terms & Conditions", redirect: "/terms-conditions" },
      ],
    },
    {
      title: "social",
      links: [
        {
          name: "Facebook",
          redirect: "https://www.facebook.com/FlanBDbd",
        },
        {
          name: "Instagram",
          redirect: "https://www.instagram.com/paper_man_official/",
        },
        {
          name: "TikTok",
          redirect: "https://www.tiktok.com/@FlanBD_?_t=ZS-8zSuo0qsf9m&_r=1",
        },
      ],
    },
  ];

  const addressContent = {
    mailUs: "More Than Sunglasses",
    mailAddress: `FlanBD\n Dhaka, Bangladesh`,
    registeredOffice: "Registered Office Address:",
    officeAddress: `FlanBD\n Dhaka, Bangladesh`,
    telephone: "+8801845-556566",
    copyright: `© 2024-${new Date().getFullYear()} flanbd.store`,
    sell: "Sell On FLanBD",
    advertise: "Advertise",
    giftCards: "Gift Cards",
    helpCenter: "Help Center",
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FacebookIcon />,
      redirect: "https://www.facebook.com/FlanBDbd",
    },
    {
      name: "Instagram",
      icon: <InstagramIcon />,
      redirect: "https://www.instagram.com/paper_man_official/",
    },
    {
      name: "TikTok",
      icon: <TikTokIcon />, // TikTok icon
      redirect: "https://www.tiktok.com/@FlanBD_?_t=ZS-8zSuo0qsf9m&_r=1",
    },
  ];

  useEffect(() => {
    setAdminRoute(location.pathname.split("/", 2).includes("admin"));
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {!adminRoute && (
        <>
          <div
            className="relative overflow-hidden"
            style={{
              minHeight: "320px",
              color: "var(--text-dark)",
              background:
                "linear-gradient(135deg, var(--primary-blue-dark) 0%, #0f0f0f 50%, var(--primary-blue-dark) 100%)",
              borderTop: "2px solid var(--primary-blue-light)",
              position: "relative",
            }}
          >
            {/* Subtle pattern overlay for texture */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, var(--primary-blue-light) 0%, transparent 50%), 
                                radial-gradient(circle at 75% 75%, var(--primary-blue-light) 0%, transparent 50%)`,
                backgroundSize: "60px 60px",
                backgroundPosition: "0 0, 30px 30px",
              }}
            />
            {/* Gradient overlay for depth */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(26, 26, 26, 0.8) 0%, rgba(15, 15, 15, 0.9) 100%)",
              }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 backdrop-blur-[2px]">
              <div className="py-8">
                {/* Mobile: Stack all content vertically */}
                <div className="md:hidden flex flex-col space-y-8">
                  <div className="flex flex-col space-y-4">
                    <Link to="/">
                      <img
                        src="/logo.png"
                        alt="Flan"
                        className="h-14 w-auto max-w-48 md:max-w-64 p-2 rounded transition-all duration-300 hover:shadow-2xl hover:scale-105 object-contain"
                      />
                    </Link>
                    <div className="text-sm">
                      <p
                        className="font-bold"
                        style={{ color: "var(--primary-blue-light)" }}
                      >
                        {addressContent.mailUs}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    {footerLinks
                      .filter((section) => section.title !== "social")
                      .map((section, i) => (
                        <div key={i} className="space-y-4">
                          <h3 className="footer-section-title">
                            {section.title}
                          </h3>
                          <ul className="space-y-2">
                            {section.links.map((link, j) => (
                              <li key={j}>
                                {link.redirect.startsWith("/") ? (
                                  <Link
                                    to={link.redirect}
                                    className="footer-link text-sm transition-all duration-300"
                                    style={{ color: "var(--text-dark)" }}
                                  >
                                    {link.name}
                                  </Link>
                                ) : (
                                  <a
                                    href={link.redirect}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="footer-link text-sm transition-all duration-300"
                                    style={{ color: "var(--text-dark)" }}
                                  >
                                    {link.name}
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                  <div className="flex items-center justify-center space-x-6 pt-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.redirect}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:scale-110 transition-colors duration-300"
                        aria-label={social.name}
                        style={{ color: "var(--text-dark)" }}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
                {/* Desktop: Grid layout */}
                <div className="hidden md:grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <Link to="/">
                      <img
                        src="/logo.png"
                        alt="Flan"
                        className="h-16 w-auto max-w-48 md:max-w-64 p-2 rounded transition-all duration-300 hover:shadow-2xl hover:scale-105 object-contain"
                      />
                    </Link>
                    <div className="text-sm">
                      <p
                        className="font-bold"
                        style={{ color: "var(--primary-blue-light)" }}
                      >
                        {addressContent.mailUs}
                      </p>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.redirect}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:scale-110 transition-colors duration-300"
                          aria-label={social.name}
                          style={{ color: "var(--text-dark)" }}
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                  {footerLinks
                    .filter((section) => section.title !== "social")
                    .map((section, i) => (
                      <div key={i} className="space-y-4">
                        <h3 className="footer-section-title">
                          {section.title}
                        </h3>
                        <ul className="space-y-2">
                          {section.links.map((link, j) => (
                            <li key={j}>
                              {link.redirect.startsWith("/") ? (
                                <Link
                                  to={link.redirect}
                                  className="footer-link text-sm transition-all duration-300"
                                  style={{ color: "var(--text-dark)" }}
                                >
                                  {link.name}
                                </Link>
                              ) : (
                                <a
                                  href={link.redirect}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="footer-link text-sm transition-all duration-300"
                                  style={{ color: "var(--text-dark)" }}
                                >
                                  {link.name}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
                <div
                  className="mt-8 pt-8 border-t"
                  style={{ borderColor: "var(--primary-blue-light)" }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <span
                        className="text-sm"
                        style={{ color: "var(--primary-blue-light)" }}
                      >
                        {addressContent.copyright}
                      </span>
                      <div className="flex items-center gap-2">
                        <img src="/bkash.png" alt="bkash" className="w-6" />
                        <img src="/Nagad.png" alt="Nagad" className="w-6" />
                      </div>
                    </div>
                    {/* Developer Plate - Bottom Center (White Theme) */}
                    <div className="w-full flex justify-center mb-10 md:mb-0">
                      <div
                        className="flex flex-col md:flex-row items-center gap-2 px-5 py-2 rounded-lg md:rounded-full shadow-sm"
                        style={{
                          minHeight: "44px",
                          background: "var(--section-bg)",
                          border: "1px solid var(--border-light)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                      >
                        <span
                          className="font-semibold text-base mr-2"
                          style={{ color: "var(--text-light)" }}
                        >
                          Developed by:
                        </span>
                        <a
                          href="https://softenginelab.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                          tabIndex={-1}
                          aria-label="SoftEngineLab Website"
                        >
                          <img
                            src={"/softEngineLab.png"}
                            alt="SoftEngineLab Logo"
                            className="h-7 w-auto mx-1"
                          />
                        </a>
                        <a
                          href="tel:01571-048971"
                          className="font-bold text-base ml-2 hover:underline"
                          style={{ color: "var(--text-light)" }}
                        >
                          01571-048971
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={scrollToTop}
            className={`fixed bottom-8 md:bottom-16 left-8 z-20 p-3 rounded-full shadow-lg transition-all duration-300 transform footer-backtotop hover:scale-110 ${showBackToTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            style={{
              background: "var(--primary-blue-light)",
              color: "#ffffff",
            }}
            aria-label="Back to top"
          >
            <ArrowUpwardIcon />
          </button>
        </>
      )}
    </>
  );
};

export default Footer;
