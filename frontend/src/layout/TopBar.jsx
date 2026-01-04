import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

export default function TopBar() {
  const navigate = useNavigate();

  function handleSearch(value) {
    const q = value.trim();
    if (!q) return;

    if (/^\d+$/.test(q)) {
      navigate(`/block/${q}`);
      return;
    }

    if (q.length === 64) {
      navigate(`/tx/${q}`);
      return;
    }
  }

  return (
    <div className="border-b border-neutral-800 bg-neutral-950 px-6 py-4">
      <div className="max-w-[1600px] mx-auto">
        <SearchBar onSearch={handleSearch} />
      </div>
    </div>
  );
}
