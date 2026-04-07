import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Watchlist from "../pages/Watchlist";
import Login from "../pages/Login";
import Layout from "./layouts/Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Route>
    </Routes>
  );
}
