import type { ReactNode } from "react";
import { Field as FieldPrimitive, type FieldControlProps } from "@base-ui/react/field";
import { Controller, type ControllerProps, type FieldPath, type FieldValues } from "react-hook-form";

import { Input } from "./input";
import { Label } from "./label";

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  label,
  description,
  render,
  ...props
}: Omit<ControllerProps<TFieldValues, TName, TTransformedValues>, "render"> &
  Pick<FieldControlProps, "render"> & { label: ReactNode; description?: string }) => {
  return (
    <Controller
      render={({
        field: { ref, name, value, onBlur, onChange },
        fieldState: { invalid, isTouched, isDirty, error },
      }) => (
        <FieldPrimitive.Root name={name} invalid={invalid} touched={isTouched} dirty={isDirty} className="space-y-3">
          {typeof label === "string" ? <Label>{label}</Label> : label}
          <FieldPrimitive.Control
            ref={ref}
            value={value}
            onBlur={onBlur}
            onValueChange={onChange}
            render={render ?? Input}
          />
          {description && (
            <FieldPrimitive.Description className="text-sm leading-normal font-normal text-gray-600 dark:text-gray-300">
              {description}
            </FieldPrimitive.Description>
          )}
          <FieldPrimitive.Error
            match={!!error}
            className="text-sm leading-normal font-normal text-red-600 dark:text-red-300"
          >
            {error?.message}
          </FieldPrimitive.Error>
        </FieldPrimitive.Root>
      )}
      {...props}
    />
  );
};

export { FormField };
