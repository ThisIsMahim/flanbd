import MenuBookIcon from "@mui/icons-material/MenuBook";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import SchoolIcon from "@mui/icons-material/School";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EditIcon from "@mui/icons-material/Edit";
import { motion } from "framer-motion";
import React, { useRef, useEffect, useState } from "react";
import "./ExplorePage.css";
import gsap from "gsap";
import DealSlider from "../../Home/DealSlider/DealSlider";
import ServiceBookingModal from "../servicesPage/ServiceBookingModal";

const ExplorePage = () => {
  const containerRef = useRef(null);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      );
    }
  }, []);

  // EyeGears Company Services
  const services = [
    {
      id: 1,
      title: "Custom Sunglasses Manufacturing",
      description:
        "Tailored sunglasses for brands, events, and organizations with full customization options.",
      icon: (
        <BusinessCenterIcon
          fontSize="large"
          style={{ color: "var(--primary-blue-dark)" }}
        />
      ),
    },
    {
      id: 2,
      title: "Bulk & Corporate Orders",
      description:
        "Special pricing and dedicated support for large quantity and corporate clients.",
      icon: (
        <GroupWorkIcon
          fontSize="large"
          style={{ color: "var(--primary-blue-light)" }}
        />
      ),
    },
    {
      id: 3,
      title: "Eco-Friendly Solutions",
      description:
        "Sustainable eyewear, recycled materials, and eco-friendly frames for responsible vision care.",
      icon: (
        <EmojiNatureIcon
          fontSize="large"
          style={{ color: "var(--primary-blue-dark)" }}
        />
      ),
    },
    {
      id: 4,
      title: "Educational Partnerships",
      description:
        "Collaborations with schools, colleges, and universities for custom stationery needs.",
      icon: (
        <SchoolIcon
          fontSize="large"
          style={{ color: "var(--primary-blue-light)" }}
        />
      ),
    },
    {
      id: 5,
      title: "Fast & Reliable Delivery",
      description:
        "Nationwide shipping with a focus on timely and safe delivery of your orders.",
      icon: (
        <LocalShippingIcon
          fontSize="large"
          style={{ color: "var(--primary-blue-dark)" }}
        />
      ),
    },
    {
      id: 6,
      title: "Premium Quality Assurance",
      description:
        "Strict quality control at every step to ensure the best products for our clients.",
      icon: (
        <MenuBookIcon
          fontSize="large"
          style={{ color: "var(--primary-blue-light)" }}
        />
      ),
    },
  ];

  return (
    <div className="aboutus-main-container min-h-screen py-10 px-2 flex flex-col items-center justify-center bg-gradient-to-b from-[#fefae0] to-[#f6faff]">
      <div
        ref={containerRef}
        className="max-w-5xl w-full mx-auto glass-container p-6 md:p-12 rounded-2xl shadow-lg"
      >
        {/* Hero Section */}
        <div className="section-header flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BusinessCenterIcon
              style={{ fontSize: 44, color: "var(--primary-blue-dark)" }}
            />
            <GroupWorkIcon
              style={{ fontSize: 36, color: "var(--primary-blue-light)" }}
            />
          </div>
          <h1 className="text-3xl font-bold text-red-500 mb-1">
            Explore FlanBD Services
          </h1>
          <p className="text-lg text-primary-blue-light">
            Comprehensive Solutions for All Your Stationery Needs
          </p>
        </div>

        {/* Customization Focus Section */}
        <section className="mb-12">
          <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 flex flex-col items-center md:items-start">
              <h2 className="text-2xl font-bold text-primary-blue-dark mb-2">
                Customize Your Sunglasses
              </h2>
              <p className="text-base text-primary-blue-light mb-3">
                Choose from a variety of frames, lens types, sizes, and
                branding options. Perfect for gifts, events, or your unique
                style!
              </p>
              <ul className="list-disc pl-5 text-gray-700 mb-2">
                <li>Custom cover design (logo, name, artwork)</li>
                <li>Personalized pages and layouts</li>
                <li>Bulk order discounts</li>
                <li>Premium packaging options</li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button px-8 py-3 font-semibold mt-2"
                style={{ fontSize: "1.1rem" }}
                onClick={() => setIsCustomizeModalOpen(true)}
              >
                <EditIcon style={{ marginRight: 8, fontSize: 22 }} />
                Start Customizing
              </motion.button>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <img
                src="/custom-notebook.png"
                alt="Custom Sunglasses"
                className="max-w-xs w-full rounded-xl shadow-lg border border-primary-blue-light"
                style={{ background: "#f6faff" }}
              />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary-blue-dark mb-6 text-center">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="glass-card p-6 flex flex-col items-center text-center"
              >
                <div className="mb-3">{service.icon}</div>
                <h3 className="font-semibold text-lg text-primary-blue-dark mb-1">
                  {service.title}
                </h3>
                <p className="text-base text-gray-700">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Deal Slider: Top Selling/Discounted Products */}
        <section className="mb-12 w-full">
          <DealSlider />
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="glass-card p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-primary-blue-dark mb-2 flex items-center gap-2 justify-center">
              <BusinessCenterIcon
                style={{ fontSize: 28, color: "var(--primary-blue-dark)" }}
              />
              Partner with FlanBD for Your Next Project!
            </h2>
            <p className="text-base text-primary-blue-light mb-4">
              Contact us today to discuss your custom requirements.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button px-8 py-3 font-semibold"
              style={{ fontSize: "1.1rem" }}
              onClick={() => (window.location.href = "/contactus")}
            >
              <GroupWorkIcon style={{ marginRight: 8, fontSize: 22 }} />
              Get in Touch
            </motion.button>
          </div>
        </section>
      </div>
      {/* ServiceBookingModal for Custom Notebook */}
      <ServiceBookingModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        modalTitle="Customize Your Sunglasses"
        modalSubtitle="Tell us your requirements for a personalized sunglasses. We'll get in touch to make it happen!"
        buttonText="Send Customization Request"
        formSubject="Custom Notebook Inquiry"
      />
    </div>
  );
};

export default ExplorePage;

