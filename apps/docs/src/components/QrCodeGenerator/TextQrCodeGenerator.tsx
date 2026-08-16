import { useLayoutEffect, useMemo, useRef } from "react";
import { Form } from "@base-ui/react/form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

import { Input } from "~/components/ui/input";
import { FormField } from "../ui/form";
import { QrCodeGenerator } from "./QrCodeGenerator";

const formSchema = z.object({
  text: z.string(),
  caption: z.string(),
});

const TextQrCodeGeneratorForm = () => {
  const form = useFormContext<z.input<typeof formSchema>, unknown, z.output<typeof formSchema>>();

  return (
    <div className="space-y-4 p-6">
      <FormField
        control={form.control}
        name="text"
        label="Text"
        render={<Input render={<TextareaAutosize className="resize-y" rows={5} minRows={5} />} />}
      />
      <FormField control={form.control} name="caption" label="Caption" />
    </div>
  );
};

export const TextQrCodeGenerator = () => {
  const form = useForm({
    mode: "onTouched",
    shouldFocusError: false,
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      text: "",
      caption: "",
    },
  });

  // Used to get the data inserted before Hydration
  const hydrated = useRef(false);
  const formElementRef = useRef<HTMLFormElement>(null);
  useLayoutEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const element = formElementRef.current;
    if (!element) return;

    form.reset({
      text: (element.elements.namedItem("text") as HTMLTextAreaElement)?.value ?? "",
      caption: (element.elements.namedItem("caption") as HTMLInputElement)?.value ?? "",
    });
  }, [form]);

  const values = form.watch();

  const qrcodeCaption = useMemo(
    () => ({
      data: values.text || "qrcode-caption",
      caption: values.caption,
    }),
    [values],
  );

  return (
    <QrCodeGenerator
      form={
        <FormProvider {...form}>
          <Form ref={formElementRef}>
            <TextQrCodeGeneratorForm />
          </Form>
        </FormProvider>
      }
      qrcodeCaption={qrcodeCaption}
    />
  );
};
