import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Slider navigation buttons
export const PreviousBtn = ({ className, onClick }) => {
  return (
    <button
      type="button"
      className={`${className} slider-nav-btn prev-btn glass-card border border-[var(--primary-blue-light)] shadow-lg flex items-center justify-center !w-12 !h-12 rounded-full bg-white/80 hover:bg-[var(--primary-blue-light)] hover:text-white transition-all duration-200`}
      onClick={onClick}
      aria-label="Previous slide"
      style={{ outline: "none", border: "none", marginLeft: 0, marginRight: 8 }}
    >
      <ArrowBackIosIcon
        style={{ fontSize: "1.5rem", color: "var(--primary-blue-dark)" }}
      />
    </button>
  );
};

export const NextBtn = ({ className, onClick }) => {
  return (
    <button
      type="button"
      className={`${className} slider-nav-btn next-btn glass-card border border-[var(--primary-blue-light)] shadow-lg flex items-center justify-center !w-12 !h-12 rounded-full bg-white/80 hover:bg-[var(--primary-blue-light)] hover:text-white transition-all duration-200`}
      onClick={onClick}
      aria-label="Next slide"
      style={{ outline: "none", border: "none", marginRight: 0, marginLeft: 8 }}
    >
      <ArrowForwardIosIcon
        style={{ fontSize: "1.5rem", color: "var(--primary-blue-dark)" }}
      />
    </button>
  );
};
