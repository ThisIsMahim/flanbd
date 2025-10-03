import React from "react";

/**
 * ScrollContainer - Simple container for scrollable content
 * This component now uses the elegant blue scrollbar styling
 */
const ScrollContainer = ({ children, className = "" }) => {
  return <div className={`scrollable-content ${className}`}>{children}</div>;
};

export default ScrollContainer;
