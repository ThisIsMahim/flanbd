import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import { useState } from "react";

const FilterButton = ({ onFilterOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterClick = () => {
    setIsOpen(!isOpen);
    if (onFilterOpen) {
      onFilterOpen(!isOpen);
    }
  };

  return (
    <button
      onClick={handleFilterClick}
      className="sm:hidden fixed bottom-5 right-5 z-50 bg-primary-blue-dark text-white rounded-full p-3 shadow-lg hover:bg-button-hover transition-all duration-300 flex items-center justify-center"
      aria-label="Filter"
    >
      {isOpen ? <CloseIcon /> : <TuneIcon />}
    </button>
  );
};

export default FilterButton;
