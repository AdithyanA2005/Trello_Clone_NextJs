"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";
import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { FormErrors } from "@/components/form/form-errors";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends TextareaProps {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ id, label, errors, disabled, className, ...props }, ref) => {
    const { pending } = useFormStatus();

    return (
      <div className="w-full space-y-2">
        <div className="w-full space-y-1">
          {label ? (
            <Label htmlFor={id} className="text-sm font-semibold text-neutral-700">
              {label}
            </Label>
          ) : null}

          <Textarea
            ref={ref}
            id={id}
            name={id}
            disabled={pending || disabled}
            aria-describedby={`${id}-error`}
            className={cn(
              "resize-none shadow-sm outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              className,
            )}
            {...props}
          />
        </div>

        <FormErrors id={id} errors={errors} />
      </div>
    );
  },
);

FormTextarea.displayName = "FormTextarea";
