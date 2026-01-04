import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[900px] gap-3"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Block height, block hash or txid"
        className="
          w-full
          rounded-lg
          px-4 py-3
          bg-neutral-900
          text-neutral-100
          placeholder-gray-500
          border border-neutral-700
          focus:outline-none
          focus:ring-2
          focus:ring-orange-400
        "
      />

      <button
        type="submit"
        className="
          rounded-lg
          px-5
          py-3
          bg-orange-400
          text-white
          font-medium
          hover:bg-orange-700
          transition
        "
      >
        Search
      </button>
    </form>
  );
}
