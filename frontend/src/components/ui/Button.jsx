import React from "react";
import PropTypes from "prop-types";
import { cn } from "../lib/utils"; // Utility for merging Tailwind classes

export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Button;
