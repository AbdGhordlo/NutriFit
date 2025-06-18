import React from "react";

export type ButtonProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "primary" | "secondary" | "danger" | "warning";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

const Button: React.FC<ButtonProps> = React.memo(
  ({ variant = "primary", disabled = false, children, className, ...args }) => {
    let classNames = "min-w-24 px-6 py-2 rounded-lg flex items-center justify-center cursor-pointer ";

    if (variant === "primary") {
      classNames += "bg-primary-green text-white hover:bg-primary-hover";
    } else if (variant === "secondary") {
      classNames +=
        "border border-gray-300 text-quaternary-text hover:bg-gray-100";
    } else if (variant === "danger") {
      classNames += "bg-red-400 text-white hover:bg-red-200";
    } else if (variant === "warning") {
      classNames += "bg-yellow-400 text-white hover:bg-yellow-500";
    }

    if (disabled) {
      classNames += "opacity-50 cursor-not-allowed pointer-events-none";
    }

    return (
      <div className={classNames} {...args}>
        {children}
      </div>
    );
  }
);

export default Button;
