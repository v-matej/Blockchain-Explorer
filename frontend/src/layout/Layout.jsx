import { Outlet, useNavigate } from "react-router-dom";
import { Home as HomeIcon } from "lucide-react";
import TopBar from "./TopBar";

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-black text-neutral-100">
      {/* Sidebar */}
      <aside className="w-56 border-r border-neutral-800 bg-neutral-950 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-black font-bold">
            ₿
          </div>

          <h1 className="text-lg font-bold">OSS Explorer</h1>
        </div>

        
        <br></br>
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer
                     text-orange-400 hover:bg-neutral-900 transition"
        >
          <HomeIcon size={18} />
          <span className="font-medium">Home</span>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
