import { startTransition, useMemo, useRef, useState, type ReactNode } from "react";
import { Form } from "@base-ui/react/form";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { Code2Icon, FormInputIcon } from "lucide-react";
import { toDataURL } from "qrcode-caption";
import type { DefaultValues, FieldValues, UseFormReturn } from "react-hook-form";

import { FlipCardButton, FlipCardContent } from "~/components/ui/FlipCard";
import { Skeleton } from "../ui/Skeleton";
import { SuspenseClientOnly } from "../ui/SuspenseClientOnly";
import { ImplementationCode } from "./ImplementationCode";
import { QrCodePreview } from "./QrCodePreview";
import { useQrCodeForm, type QRCodeCaption } from "./useQrCodeForm";

export const QrCodeGenerator = <
  TSchema extends StandardSchemaV1<FieldValues, QRCodeCaption> = StandardSchemaV1<FieldValues, QRCodeCaption>,
>({
  formSchema,
  formDefaultValues,
  formContent,
}: {
  formSchema: TSchema;
  formDefaultValues: DefaultValues<StandardSchemaV1.InferInput<TSchema>>;
  formContent: (
    form: UseFormReturn<StandardSchemaV1.InferInput<TSchema>, unknown, StandardSchemaV1.InferOutput<TSchema>>,
  ) => ReactNode;
}) => {
  const [showCode, setShowCode] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const { form, formElementRef, qrcodeCaption } = useQrCodeForm(formSchema, formDefaultValues);

  const qrcodeSvgOrError = useMemo(() => {
    try {
      return qrcodeCaption.data ? toDataURL(qrcodeCaption.data, qrcodeCaption.caption, qrcodeCaption.options) : null;
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
    }
  }, [qrcodeCaption]);

  return (
    <div className="px-4">
      <div className="mx-auto mb-1 flex max-w-(--sl-content-width) justify-end xl:max-w-6xl">
        <FlipCardButton
          className=""
          goToFront={
            <>
              <FormInputIcon className="mr-2 h-4 w-4" /> View form
            </>
          }
          goToBack={
            <>
              <Code2Icon className="mr-2 h-4 w-4" /> View code
            </>
          }
          showBack={showCode}
          onClick={() => {
            startTransition(() => {
              setShowCode((show) => !show);
            });
          }}
        />
      </div>
      <div className="mx-auto flex max-w-6xl items-start gap-6 max-xl:flex-col">
        <div className="mx-auto w-full max-w-(--sl-content-width) grow self-stretch">
          <FlipCardContent
            front={
              <Form ref={formElementRef}>
                <div className="space-y-4 p-6">{formContent(form)}</div>
              </Form>
            }
            back={<ImplementationCode className="absolute inset-2" qrcodeCaption={qrcodeCaption} update={showCode} />}
            showBack={showCode}
          />
        </div>
        <div className="sticky top-[calc(var(--sl-nav-height)+1.5rem)] mx-auto w-full max-w-lg">
          <QrCodePreview
            ref={imageRef}
            qrcodeSvgDataURL={typeof qrcodeSvgOrError === "string" ? qrcodeSvgOrError : null}
            error={qrcodeSvgOrError instanceof Error ? qrcodeSvgOrError.message : undefined}
          />
          <SuspenseClientOnly
            fallback={<Skeleton className="col-span-2 mt-6 h-21 rounded-3xl" />}
            factory={() => import("./SaveButtons")}
            props={{ imageRef, qrcodeSvgDataURL: typeof qrcodeSvgOrError === "string" ? qrcodeSvgOrError : null }}
          />
        </div>
      </div>
    </div>
  );
};
