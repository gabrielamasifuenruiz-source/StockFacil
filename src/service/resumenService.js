export async function getResumen() {
  await new Promise((r) => setTimeout(r, 300))

  return {
    usuario: { nombre: 'Admin', rol: 'Administrador' },
    tarjetas: [
      { titulo: 'Productos activos', valor: '1.284', nota: '+8,2% vs. mes anterior' },
      { titulo: 'Valor de inventario', valor: 'S/ 48.620', nota: '+4,6% vs. mes anterior' },
      { titulo: 'Ventas del mes', valor: 'S/ 12.840', nota: '+12,4% vs. mes anterior' },
      { titulo: 'Stock bajo', valor: '18 productos', nota: 'Requieren atención', alerta: true },
    ],
    ventas: [
      { dia: 'Lun', altura: 48 },
      { dia: 'Mar', altura: 66 },
      { dia: 'Mié', altura: 38 },
      { dia: 'Jue', altura: 83 },
      { dia: 'Vie', altura: 61 },
      { dia: 'Sáb', altura: 100 },
      { dia: 'Dom', altura: 76 },
    ],
    stock: [
      { nombre: 'Disponible', porcentaje: 72, color: '#6f9f98' },
      { nombre: 'Stock bajo', porcentaje: 18, color: '#d9a05b' },
      { nombre: 'Agotado', porcentaje: 10, color: '#c95d5d' },
    ],
    actividad: [
      { movimiento: 'Entrada de mercadería', referencia: 'OC-1048', fecha: 'Hoy, 09:42', responsable: 'María P.', estado: 'Completado' },
      { movimiento: 'Venta registrada', referencia: 'VT-2831', fecha: 'Hoy, 09:18', responsable: 'Carlos R.', estado: 'Completado' },
      { movimiento: 'Ajuste de inventario', referencia: 'AJ-0086', fecha: 'Ayer, 16:30', responsable: 'María P.', estado: 'Pendiente' },
    ],
  }
}