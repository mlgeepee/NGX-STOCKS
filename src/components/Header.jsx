export default function Header() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white shadow">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="flex items-center gap-3">
        <span className="text-sm">User</span>
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
      </div>
    </header>
  );
}
