import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '', block = false }) => {
  if (!content) return null;

  // Xử lý chuỗi có chứa $...$ hoặc $$...$$
  const renderFormattedText = (text: string) => {
    // Regex tìm $...$ (inline) hoặc $$...$$ (block)
    const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(formula, { displayMode: true, throwOnError: false });
          return (
            <span
              key={index}
              className="my-2 block text-center overflow-x-auto text-cyan-300"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={index} className="text-cyan-300 font-mono">{part}</span>;
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const formula = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(formula, { displayMode: false, throwOnError: false });
          return (
            <span
              key={index}
              className="inline-block text-cyan-300 font-medium px-0.5"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={index} className="text-cyan-300 font-mono">{part}</span>;
        }
      }

      // Plain text (xử lý xuống dòng)
      return <span key={index}>{part}</span>;
    });
  };

  if (block) {
    return <div className={`leading-relaxed ${className}`}>{renderFormattedText(content)}</div>;
  }

  return <span className={`leading-relaxed ${className}`}>{renderFormattedText(content)}</span>;
};
