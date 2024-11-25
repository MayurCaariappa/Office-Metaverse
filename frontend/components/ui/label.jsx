import React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../lib/utils"; // Adjust path based on your project structure
import PropTypes from "prop-types";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

Label.propTypes = {
    className: PropTypes.func.isRequired,
  };