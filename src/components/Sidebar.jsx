import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded ${pathname === path ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-700"}`;

  return (
    <div className="flex flex-col justify-between text-white bg-gray-900 w-60">
      <div>
        <h1 className="p-4 text-xl font-bold">NGX Stocks</h1>
        <nav className="px-2 space-y-2">
          <Link to="/" className={linkClass("/")}>
            Dashboard
          </Link>
          <Link to="/watchlist" className={linkClass("/watchlist")}>
            Watchlist
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button className="w-full text-left text-red-400">Logout</button>
      </div>
    </div>
  );
}
