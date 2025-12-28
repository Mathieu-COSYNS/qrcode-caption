import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const highlighter = await createHighlighterCore({
  themes: [import("shiki/themes/github-light.mjs"), import("shiki/themes/github-dark.mjs")],
  langs: [import("shiki/langs/javascript.mjs")],
  engine: createJavaScriptRegexEngine(),
});

export const HighlightedCode = ({ code }: { code: string }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: highlighter.codeToHtml(code, {
          lang: "javascript",
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        }),
      }}
    />
  );
};

export default HighlightedCode;
