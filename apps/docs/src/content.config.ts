import { docsLoader, i18nLoader } from "@astrojs/starlight/loaders";
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";
import { defineCollection, z } from "astro:content";
import { changelogsLoader } from "starlight-changelogs/loader";

import { QrCodeGeneratorTypesSchema } from "./components/QrCodeGenerator";

const extendedSchema = z.object({
  icon: z.enum(["Phone", "TextAlignStart", "Euro", "Link"]).optional(),
  hero: z
    .object({
      placement: z.enum(["initial", "above-two-column-content"]).optional().default("initial"),
      generatorType: QrCodeGeneratorTypesSchema.optional(),
    })
    .optional(),
});

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: extendedSchema,
    }),
  }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
  changelogs: defineCollection({
    loader: changelogsLoader([
      {
        provider: "changeset",
        base: "changelog",
        changelog: "../../packages/core/CHANGELOG.md",
      },
    ]),
  }),
};
