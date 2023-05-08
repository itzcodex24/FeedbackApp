import React from "react";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}

const Button: React.FC<Props> = (props) => {
  const {
    children,
    onClick,
    disabled = false,
    loading = false,
    className = "",
    type = "submit",
  } = props;
  return (
    <button
      className={`w-full rounded-md py-2 ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Loading..." : <>{children}</>}
    </button>
  );
};

export default Button;
