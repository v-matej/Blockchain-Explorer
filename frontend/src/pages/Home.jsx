import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

export default function Home() {
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
    <div className="max-w-3xl mx-auto py-20 px-6">
      
    </div>
  );
}
