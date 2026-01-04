import { Copy } from "lucide-react";

export default function HashWithCopy({
  value,
  onClick,
  linkable = false,
}) {
  const short =
    value.slice(0, 6) + "…" + value.slice(-6);

  function copy() {
    navigator.clipboard.writeText(value);
  }

  return (
    <span className="inline-flex items-center gap-2 font-mono text-sm">
      <span
        onClick={linkable ? onClick : undefined}
        className={
          linkable
            ? "cursor-pointer text-orange-400 hover:underline"
            : "text-gray-300"
        }
      >
        {short}
      </span>
      <button
        onClick={copy}
        className="text-gray-500 hover:text-orange-400 transition"
        title="Copy"
      >
        <Copy size={14} />
      </button>
    </span>
  );
}
