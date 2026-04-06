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
      .then((data) => setCompanies(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader title="Loading Companies..." />;

  return (
    <section className="trusted-companies-section">
      <div className="home-section-header" ref={titleRef}>
        <span className="section-subtitle">Official Partners</span>
        <h2 className="section-title">Brands We Provide</h2>
      </div>

      <div className="container">
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
