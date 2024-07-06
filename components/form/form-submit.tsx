"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormSubmitProps extends ButtonProps {
  asChild?: never;
  type?: "submit";
}

export function FormSubmit({
  asChild,
  type,
  children,
  disabled,
  variant = "primary",
  size = "sm",
  className,
  ...props
}: FormSubmitProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      disabled={pending || disabled}
      size={size}
      className={cn(className)}
      {...props}
    >
      {children}
    </Button>
  );
}
