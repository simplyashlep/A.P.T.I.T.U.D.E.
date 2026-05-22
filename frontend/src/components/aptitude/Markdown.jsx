import React from "react";

const renderInline = (text) => {
  const nodes = [];
  let key = 0;
  const boldSplit = text.split(/(\*\*[^*]+\*\*)/g);
  boldSplit.forEach((chunk) => {
    if (/^\*\*[^*]+\*\*$/.test(chunk)) {
      nodes.push(
        <strong key={key++} className="text-ivory font-medium tracking-[0.02em]">
          {chunk.slice(2, -2)}
        </strong>
      );
    } else {
      const itSplit = chunk.split(/(\*[^*]+\*|_[^_]+_)/g);
      itSplit.forEach((c) => {
        if (/^(\*[^*]+\*|_[^_]+_)$/.test(c)) {
          nodes.push(
            <em key={key++} className="font-serif-h italic text-ivory-dim">
              {c.slice(1, -1)}
            </em>
          );
        } else if (c) {
          nodes.push(<span key={key++}>{c}</span>);
        }
      });
    }
  });
  return nodes;
};

export const Markdown = ({ text }) => {
  const blocks = (text || "").split(/\n{2,}/);
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => l.startsWith("- ") || l.startsWith("* "));
        if (isList) {
          return (
            <ul key={i} className="space-y-2 pl-1">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3 text-[15px] leading-relaxed">
                  <span className="text-gold mt-[0.55em] w-3 h-px bg-[var(--apt-gold)] flex-shrink-0" />
                  <span>{renderInline(l.replace(/^[-*]\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-[15px] leading-relaxed">
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
};
