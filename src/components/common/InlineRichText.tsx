import React from "react";

const MARKDOWN_RUN_PATTERN = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g;

interface InlineRichTextProps {
  text: string;
}

export default function InlineRichText({ text }: InlineRichTextProps) {
  return (
    <>
      {text.split(MARKDOWN_RUN_PATTERN).map((part, index) => {
        if (!part) return null;

        if (part.startsWith("***") && part.endsWith("***")) {
          return (
            <strong key={`${part}-${index}`}>
              <em>{part.slice(3, -3)}</em>
            </strong>
          );
        }

        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
        }

        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={`${part}-${index}`}>{part.slice(1, -1)}</em>;
        }

        return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
      })}
    </>
  );
}
