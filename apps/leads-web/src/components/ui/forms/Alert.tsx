interface AlertProps {
  variant: "success" | "error";
  children: React.ReactNode;
}

const variants = {
  success: "border border-success/20 bg-success/10 text-success",
  error: "border border-danger/20 bg-danger/10 text-danger",
};

export function Alert({ variant, children }: AlertProps) {
  return (
    <div className={`rounded-xl p-3 text-sm ${variants[variant]}`}>
      {children}
    </div>
  );
}
