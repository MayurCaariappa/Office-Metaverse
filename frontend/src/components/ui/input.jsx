"use client";

import React, { useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "../lib/utils";
import PropTypes from "prop-types";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const radius = 100; // Change this to increase the radius of the hover effect
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${
              visible ? `${radius}px` : "0px"
            } circle at ${mouseX}px ${mouseY}px,
            hsl(var(--primary)),
            transparent 80%
          )
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="p-[2px] rounded-md transition duration-300 group/input"
    >
      <input
        type={type}
        className={cn(
          `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base 
          ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium 
          file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:opacity-50 md:text-sm group-hover/input:shadow-none transition duration-300`,
          className
        )}
        ref={ref}
        {...props}
      />
    </motion.div>
  );
});

Input.displayName = "Input";

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
};

export { Input };
