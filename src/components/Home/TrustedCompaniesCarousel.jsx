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
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/trusted-companies`)
      .then((res) => res.json())
      .then(setCompanies)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader title="Loading Companies..." />;

  return (
    <section className="trusted-companies-section">
      <div className="trusted-companies-header">
        <div ref={titleRef} className="trusted-companies-title !text-3xl" style={{ color: 'var(--primary-blue-dark)' }}>
          Brands We Provide
        </div>
        <div className="trusted-title-decoration"></div>
      </div>

      <div className="trusted-grid">
        {companies.map((company, idx) => {
          const content = (
            <div className="trusted-grid-logo glass-card" key={idx} title={company.name}>
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
    </section>
  );
};

export default TrustedCompaniesCarousel;
