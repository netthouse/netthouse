"use client";

import { useState } from "react";

export default function CopyButton({
  value,
  locale = "en",
  className = "",
}: {
  value: string;
  locale?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const label = locale === "ru" ? "Копировать" : "Copy";
  const copiedLabel = locale === "ru" ? "Скопировано" : "Copied";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? copiedLabel : label}
      aria-label={copied ? copiedLabel : label}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${className}`}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
