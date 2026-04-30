import React, { useEffect, useRef, useState } from "react";
import "./TrustedCompaniesCarousel.css";
import Loader from "../Layouts/Loader";
import useScrollReveal from "./hooks/useScrollReveal";

const TrustedCompaniesCarousel = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const titleRef = useRef(null);
  useScrollReveal(titleRef);

  useEffect(() => {
    const baseUrl = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
    fetch(`${baseUrl}/api/trusted-companies`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setCompanies(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching trusted companies:", err);
        setCompanies([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader title="Loading Companies..." />;

  return (
    <section className="bg-white py-10 md:py-14 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16" ref={titleRef}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#ff1837]"></span>
            <span className="text-[10px] text-[#ff1837] font-black uppercase tracking-[0.25em]">Official Partners</span>
            <span className="w-8 h-[2px] bg-[#ff1837]"></span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f0f0f] tracking-tighter uppercase leading-[1.1]">
            Brands We <span className="text-gray-400">Trust</span>
          </h2>
        </div>

        <div className="trusted-grid">
          {companies.map((company, idx) => {
            const content = (
              <div className="trusted-grid-logo" key={idx} title={company.name}>
                <img src={company.logo} alt={company.name} />
              </div>
            );
            return company.websiteUrl ? (
              <a
                key={`grid-link-${idx}`}
                href={company.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                {content}
              </a>
            ) : (
              content
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompaniesCarousel;
