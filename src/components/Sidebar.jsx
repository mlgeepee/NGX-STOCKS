import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useAuthStore } from "../../store/useAuthStore";

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const clearUser = useAuthStore((state) => state.clearUser);

  const linkClass = (path) =>
    `block px-4 py-2 rounded ${pathname === path ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-700"}`;

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    clearUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex flex-col justify-between text-white bg-gray-900 w-60">
      <div>
        <h1 className="p-4 text-xl font-bold">NGX Stocks</h1>
        <nav className="px-2 space-y-2">
          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>
          <Link
            to="/dashboard/watchlist"
            className={linkClass("/dashboard/watchlist")}
          >
            Watchlist
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left text-red-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
