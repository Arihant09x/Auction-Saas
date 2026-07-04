"use client";

import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ children, className, href, ...props }, ref) => {
    if (href) {
      return (
        <a
          href={href}
          className={className + "text-center justify-start text-white text-base font-semibold  leading-6"}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        className={className}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

