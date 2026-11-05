// Datos de ejemplo tomados de la maqueta (02 · Dashboard y resumen).
// Cuando el backend esté listo (RQ-11), solo se cambia el cuerpo de esta función por algo como:
//   const r = await fetch('/api/resumen', { headers: { Authorization: `Bearer ${token}` } });
//   if (!r.ok) throw new Error('No se pudo cargar el resumen');
//   return r.json();
// La pantalla Resumen no necesita cambios mientras el backend devuelva esta misma forma.

export async function obtenerResumen() {
  await new Promise((resolve) => setTimeout(resolve, 150)); // simula la espera de la red

  return {
    kpis: {
      productosActivos: { valor: 1284, variacion: 8.2 },
      valorInventario: { valor: 48620, variacion: 4.6 },
      ventasMes: { valor: 12840, variacion: 12.4 },
      stockBajo: 18,
    },
    // Ventas de los últimos 7 días, en soles
    ventasSemana: [
      { dia: 'Lun', monto: 840 },
      { dia: 'Mar', monto: 1140 },
      { dia: 'Mié', monto: 660 },
      { dia: 'Jue', monto: 1440 },
      { dia: 'Vie', monto: 1056 },
      { dia: 'Sáb', monto: 1740 },
      { dia: 'Dom', monto: 1320 },
    ],
    // tono: ok (verde), aviso (naranja), peligro (rojo)
    distribucionStock: [
      { estado: 'Disponible', porcentaje: 72, tono: 'ok' },
      { estado: 'Stock bajo', porcentaje: 18, tono: 'aviso' },
      { estado: 'Agotado', porcentaje: 10, tono: 'peligro' },
    ],
    actividad: [
      {
        id: 1,
        movimiento: 'Entrada de mercadería',
        referencia: 'OC-1048',
        fecha: 'Hoy, 09:42',
        responsable: 'María P.',
        estado: 'Completado',
      },
      {
        id: 2,
        movimiento: 'Venta registrada',
        referencia: 'VT-2831',
        fecha: 'Hoy, 09:18',
        responsable: 'Carlos R.',
        estado: 'Completado',
      },
      {
        id: 3,
        movimiento: 'Ajuste de inventario',
        referencia: 'AJ-0086',
        fecha: 'Ayer, 16:30',
        responsable: 'María P.',
        estado: 'Pendiente',
      },
    ],
  };
}
