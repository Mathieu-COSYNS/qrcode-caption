import { useMemo } from "react";
import { Form } from "@base-ui/react/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "astro/zod";
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { useDebounce } from "use-debounce";

import { Input } from "~/components/ui/input";
import { FormField } from "../ui/form";
import { QrCodeGenerator } from "./QrCodeGenerator";

const formSchema = z.object({
  text: z.string(),
  caption: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const TextQrCodeGeneratorForm = () => {
  const value = useWatch();
  const form = useFormContext<FormValues>();

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
  const form = useForm<FormValues>({
    mode: "onTouched",
    shouldFocusError: false,
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      caption: "",
    },
  });

  const values = form.watch();

  const qrcodeCaption = useMemo(
    () => ({
      data: values.text || "qrcode-caption",
      caption: values.caption,
    }),
    [values],
  );
  const [qrcodeCaptionDebounced] = useDebounce(qrcodeCaption, 100, {
    equalityFn: (a, b) => a.data === b.data && a.caption === b.caption,
  });

  return (
    <QrCodeGenerator
      form={
        <FormProvider {...form}>
          <Form>
            <TextQrCodeGeneratorForm />
          </Form>
        </FormProvider>
      }
      qrcodeCaption={qrcodeCaptionDebounced}
    />
  );
};
