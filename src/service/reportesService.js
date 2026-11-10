export async function getReporte() {
  await new Promise((r) => setTimeout(r, 300))

  return {
    periodo: 'Octubre 2026',
    indicadores: [
      { id: 1, nombre: 'Ingresos totales', actual: 'S/ 32.480', anterior: 'S/ 29.310', variacion: '+10,8%', tono: 'positivo' },
      { id: 2, nombre: 'Costo de ventas', actual: 'S/ 21.140', anterior: 'S/ 19.900', variacion: '+6,2%', tono: 'alerta' },
      { id: 3, nombre: 'Margen bruto', actual: '34,9%', anterior: '32,8%', variacion: '+2,1 pts', tono: 'positivo' },
      { id: 4, nombre: 'Productos vendidos', actual: '2.840', anterior: '2.620', variacion: '+8,4%', tono: 'positivo' },
    ],
  }
}