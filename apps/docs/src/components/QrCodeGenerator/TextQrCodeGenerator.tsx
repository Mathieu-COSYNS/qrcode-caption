import { type UseFormReturn } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

import { FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { QrCodeGenerator } from "./QrCodeGenerator";

const formSchema = z
  .object({
    text: z.string(),
    caption: z.string(),
  })
  .transform((values) => ({
    data: values.text,
    caption: values.caption,
  }));

const defaultValues = { text: "", caption: "" };

const TextQrCodeGeneratorForm = ({
  form,
}: {
  form: UseFormReturn<z.input<typeof formSchema>, unknown, z.output<typeof formSchema>>;
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="text"
        label="Text"
        render={<Input render={<TextareaAutosize className="resize-y" rows={5} minRows={5} />} />}
      />
      <FormField control={form.control} name="caption" label="Caption" />
    </>
  );
};

export const TextQrCodeGenerator = () => {
  return (
    <QrCodeGenerator
      formSchema={formSchema}
      formDefaultValues={defaultValues}
      formContent={(form) => <TextQrCodeGeneratorForm form={form} />}
    />
  );
};
