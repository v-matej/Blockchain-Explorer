import { Outlet, NavLink } from "react-router-dom";
import { Home as HomeIcon, BarChart3, ArrowLeftRight  } from "lucide-react";
import TopBar from "./TopBar";
import bitcoinLogo from "../assets/bitcoin.png";

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-3 py-2 rounded-md transition
        ${
          isActive
            ? "bg-neutral-900 text-orange-400"
            : "text-gray-200 hover:bg-neutral-900 hover:text-orange-400"
        }
        `
      }
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}

export default function Layout() {
  return (
    <div className="h-screen flex bg-black text-neutral-100">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-neutral-800 bg-neutral-950 p-4">
        <div className="flex items-center gap-3 mb-6">
          <img
            src={bitcoinLogo}
            alt="Bitcoin logo"
            className="w-10 h-10 rounded-full"
          />
          <h1 className="text-lg font-bold">OSS Explorer</h1>
        </div>

        <nav className="space-y-1">
          <NavItem to="/" icon={HomeIcon} label="Home" />
          <NavItem to="/analytics" icon={BarChart3} label="Analytics" />
          <NavItem to="/mempool" icon={ArrowLeftRight} label="Mempool" />
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col h-full">
        {/* Fixed TopBar */}
        <div className="shrink-0">
          <TopBar />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
