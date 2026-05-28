export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const styles = {
    primary: "bg-royal-700 text-white hover:bg-royal-600",
    secondary: "bg-white text-royal-900 border border-slate-200 hover:bg-slate-50",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    warning: "bg-amber-500 text-white hover:bg-amber-600"
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
