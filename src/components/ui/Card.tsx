import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "shadow" | "bordered";
}

export default function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl overflow-hidden bg-white",
        {
          "shadow-md hover:shadow-lg transition-shadow": variant === "shadow",
          "border border-gray-200": variant === "bordered",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
