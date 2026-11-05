import Sidebar from "../components/Sidebar";
import Resumen from "./Resumen";
import "../css/layout.css";

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />

      <main className="layout-content">
        <Resumen />
      </main>
    </div>
  );
}