import { highlight } from "sugar-high";

export const HighlightedCode = ({ code }: { code: string }) => {
  return (
    <pre>
      <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
    </pre>
  );
};

export default HighlightedCode;
