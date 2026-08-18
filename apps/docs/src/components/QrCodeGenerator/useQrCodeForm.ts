import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { useAsyncDebouncedCallback } from "@tanstack/react-pacer";
import type { QRCodeOptions } from "qrcode-caption";
import { useForm, type DefaultValues, type FieldValues, type UseFormReturn } from "react-hook-form";

export type QRCodeCaption = {
  data: string;
  caption?: string | undefined;
  options?: QRCodeOptions | undefined;
};

export const useQrCodeForm = <
  TSchema extends StandardSchemaV1<FieldValues, QRCodeCaption> = StandardSchemaV1<FieldValues, QRCodeCaption>,
>(
  schema: TSchema,
  defaultValues: DefaultValues<StandardSchemaV1.InferInput<TSchema>>,
): {
  form: UseFormReturn<StandardSchemaV1.InferInput<TSchema>, unknown, StandardSchemaV1.InferOutput<TSchema>>;
  formElementRef: React.RefObject<HTMLFormElement | null>;
  qrcodeCaption: QRCodeCaption;
} => {
  const form = useForm({
    mode: "onTouched",
    shouldFocusError: false,
    resolver: standardSchemaResolver(schema),
    defaultValues,
  });

  // Used to get the data inserted before Hydration
  const hydrated = useRef(false);
  const formElementRef = useRef<HTMLFormElement>(null);
  useLayoutEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const element = formElementRef.current;
    if (!element) return;

    const nextValues = Object.fromEntries(
      Array.from(element.elements)
        .filter((el): el is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement => "name" in el && !!el.name)
        .map((el) => [el.name, el.value])
        .filter(([name]) => name in defaultValues),
    );

    const newDefaultValues = { ...defaultValues, ...nextValues };

    form.reset(newDefaultValues);
    debouncedSetQrcodeCaption({ values: newDefaultValues });
  }, [form]);

  const [qrcodeCaption, setQrcodeCaption] = useState<QRCodeCaption>({ data: "qrcode-caption" });

  const debouncedSetQrcodeCaption = useAsyncDebouncedCallback(
    async ({ values }: { values: StandardSchemaV1.InferInput<TSchema> }) => {
      console.log("debouncedSetQrcodeCaption called with values:", values);
      const result = await schema["~standard"].validate(values);
      if (!result.issues) {
        const { data, ...rest } = result.value;
        setQrcodeCaption({ data: data || "qrcode-caption", ...rest });
      } else {
        console.error("Validation issues:", result.issues);
      }
    },
    { wait: 100 },
  );

  useEffect(() => {
    const unsubscribe = form.subscribe({
      formState: {
        values: true,
      },
      callback: debouncedSetQrcodeCaption,
    });

    return () => unsubscribe();
  }, [form]);

  return {
    form,
    formElementRef,
    qrcodeCaption,
  };
};
