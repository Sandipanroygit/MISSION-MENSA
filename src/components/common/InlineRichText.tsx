import React from "react";

const MARKDOWN_RUN_PATTERN = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g;
const URL_PATTERN = /(https?:\/\/[^\s)]+)/g;
const URL_EXACT_PATTERN = /^https?:\/\/[^\s)]+$/;

interface InlineRichTextProps {
  text: string;
}

export default function InlineRichText({ text }: InlineRichTextProps) {
  const renderTextWithLinks = (value: string, keyPrefix: string) =>
    value.split(URL_PATTERN).map((segment, segmentIndex) => {
      if (!segment) return null;
      if (URL_EXACT_PATTERN.test(segment)) {
        return (
          <a
            key={`${keyPrefix}-link-${segmentIndex}`}
            href={segment}
            target="_blank"
            rel="noreferrer"
            className="text-[#0f766e] underline"
          >
            {segment}
          </a>
        );
      }
      return (
        <React.Fragment key={`${keyPrefix}-text-${segmentIndex}`}>
          {segment}
        </React.Fragment>
      );
    });

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

        return (
          <React.Fragment key={`${part}-${index}`}>
            {renderTextWithLinks(part, `${part}-${index}`)}
          </React.Fragment>
        );
      })}
    </>
  );
}
