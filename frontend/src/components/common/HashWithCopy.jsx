import { Copy } from "lucide-react";

export default function HashWithCopy({ value, onClick, color = "orange" }) {
  const str = value === null || value === undefined ? "" : String(value);

  if (!str) {
    return <span className="text-gray-500 text-sm font-mono">—</span>;
  }

  const short =
    str.length > 16 ? `${str.slice(0, 6)}…${str.slice(-6)}` : str;

  function copy(e) {
    e.stopPropagation();
    navigator.clipboard.writeText(str);
  }

  const clickable = typeof onClick === "function";

  const linkClass =
    color === "orange"
      ? "text-orange-400 hover:underline"
      : "text-blue-400 hover:underline";

  return (
    <span className="inline-flex items-center gap-2 font-mono text-sm">
      <span
        onClick={clickable ? onClick : undefined}
        className={
          clickable
            ? `cursor-pointer ${linkClass}`
            : "text-gray-300"
        }
      >
        {short}
      </span>

      <button
        type="button"
        onClick={copy}
        className="text-gray-500 hover:text-orange-400 transition"
        title="Copy"
      >
        <Copy size={14} />
      </button>
    </span>
  );
}
