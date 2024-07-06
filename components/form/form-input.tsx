"use client";

import React, { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, errors, disabled, className, ...props }, ref) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          {label ? (
            <Label htmlFor={id} className="font-semimedium text-xs text-neutral-700">
              {label}
            </Label>
          ) : null}

          <Input
            ref={ref}
            id={id}
            disabled={pending || disabled}
            className={cn(className)}
            name={id}
            aria-describedby={`${id}-error`}
            {...props}
          />
        </div>

        <FormErrors id={id} errors={errors} />
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
