// @ts-check
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import starlightChangelogs, { makeChangelogsSidebarLinks } from "starlight-changelogs";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc";

// https://astro.build/config
export default defineConfig({
  site: "https://mathieu-cosyns.github.io",
  base: "/qrcode-caption",
  integrations: [
    starlight({
      title: "QR Code Caption",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Mathieu-COSYNS/qrcode-caption",
        },
      ],

      editLink: {
        baseUrl: "https://github.com/Mathieu-COSYNS/qrcode-caption/edit/main/app/docs/",
      },

      lastUpdated: true,

      sidebar: [
        {
          label: "Generate QR codes",
          autogenerate: { directory: "generate" },
        },
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        typeDocSidebarGroup,
        ...makeChangelogsSidebarLinks([
          {
            type: "all",
            base: "changelog",
            label: "Changelog",
          },
        ]),
      ],

      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
        // fr: {
        //   label: "Français",
        //   lang: "fr",
        // },
      },

      plugins: [
        starlightChangelogs(),
        starlightTypeDoc({
          entryPoints: ["../../packages/core/src/index.ts"],
          tsconfig: "../../packages/core/tsconfig.json",
        }),
      ],
      customCss: ["./src/styles/global.css"],
      // head: [
      //   {
      //     tag: "script",
      //     attrs: {
      //       src: "https://unpkg.com/react-scan/dist/auto.global.js",
      //     },
      //   },
      // ],
      components: {
        Hero: "./src/components/starlight/Hero.astro",
        TwoColumnContent: "./src/components/starlight/TwoColumnContent.astro",
      },
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
