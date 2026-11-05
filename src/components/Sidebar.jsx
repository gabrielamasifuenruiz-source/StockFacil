
import "../css/layout.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="brand">
        <span className="brand-icon">SF</span>
        <span>StockFácil</span>
      </div>

      <nav className="menu">
        <a href="#" className="menu-item active">⌂ Resumen</a>
        <a href="#" className="menu-item">▦ Productos</a>
        <a href="#" className="menu-item">▤ Inventario</a>
        <a href="#" className="menu-item">▧ Categorías</a>
        <a href="#" className="menu-item">♧ Proveedores</a>
        <a href="#" className="menu-item">↗ Ventas</a>
        <a href="#" className="menu-item">↙ Compras</a>
        <a href="#" className="menu-item">▥ Reportes</a>
        <a href="#" className="menu-item">⚙ Configuración</a>
      </nav>

      <div className="sidebar-footer">
        <span>Plan de equipo</span>
        <strong>Gestión de inventario</strong>
      </div>

    </aside>
  );
}

