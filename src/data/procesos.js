import { ShoppingCart, FileText, Users, Settings, ChartNoAxesCombined, ShieldAlert  } from "lucide-react"

// Datos centralizados de procesos y controles
export const procesos = [
  {
    id: "compra",
    titulo: "Proceso de Compra",
    descripcion: " ",
    icono: ShoppingCart,
    estado: "Activo",
    color: "blue",
  },
  {
    id: "fraude",
    titulo: "Fraude",
    descripcion: "",
    icono: ShieldAlert,
    estado: "Activo",
    color: "green",
  },
  {
    id: "estadosfinancieros",
    titulo: "Estados Financieros",
    descripcion: " ",
    icono: ChartNoAxesCombined,
    estado: "Activo",
    color: "purple",
  },
  {
    id: "accesos",
    titulo: "Accesos",
    descripcion: " ",
    icono: Settings,
    estado: "Activo",
    color: "orange",
  },
]

export const obtenerProceso = (id) => {
  return procesos.find((p) => p.id === id);
};


// src/data/procesos.js
// Esta función hace el fetch desde el backend y estructura los controles como antes
const API_BASE_URL = "http://localhost:8000"; // Ajusta si usas otro puerto o dominio

// Obtener todos los controles desde el backend
export const obtenerTodosLosControles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/controles`);
    if (!response.ok) throw new Error("Error al obtener controles");
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerTodosLosControles:", error);
    return [];
  }
};

// Obtener controles por proceso (asume que existe el campo proceso_id en DB)
export const obtenerControlesPorProceso = async (procesoId) => {
  const controles = await obtenerTodosLosControles();
  return controles.filter((control) => control.proceso_id === procesoId);
};

// Obtener control específico
export const obtenerControl = async (procesoId, controlId) => {
  const controles = await obtenerControlesPorProceso(procesoId);
  return controles.find((control) => control.id === parseInt(controlId));
};



/* 
// Controles por proceso
export const controlesPorProceso = {
 compra: [
  {
    id: 1,
    procesoId: "compra",
    nombre: "Pago sin factura",
    descripcion: "Pagos registrados sin una factura asociada en el sistema.",
    estado: "Crítico",
    criticidad: "Alta",
    accionRequerida: "Revisar pagos y exigir facturación correspondiente",
    ultimaActualizacion: "2024-01-15",
    powerBiUrl: "https://via.placeholder.com/800x600/fecaca/dc2626?text=Pago+sin+Factura",
    detalles: "Este control detecta pagos efectuados sin respaldo de una factura registrada, lo que puede indicar incumplimiento del proceso o errores contables."
  },
  {
    id: 2,
    procesoId: "compra",
    nombre: "Proveedor no homologado",
    descripcion: "Transacciones con proveedores que no han sido homologados.",
    estado: "Cumpliendo",
    criticidad: "Media",
    accionRequerida: "Validar listado de proveedores activos y aplicar proceso de homologación",
    ultimaActualizacion: "2024-01-15",
    powerBiUrl: "https://via.placeholder.com/800x600/fef3c7/d97706?text=Proveedor+No+Homologado",
    detalles: "Verifica que las compras y pagos se realicen exclusivamente a proveedores homologados según los estándares de la organización."
  },
  {
    id: 3,
    procesoId: "compra",
    nombre: "Pedido sin solicitud de gasto",
    descripcion: "Órdenes de compra generadas sin solicitud previa.",
    estado: "Crítico",
    criticidad: "Alta",
    accionRequerida: "Investigar pedidos sin trazabilidad previa",
    ultimaActualizacion: "2024-01-14",
    powerBiUrl: "https://via.placeholder.com/800x600/fee2e2/b91c1c?text=Pedido+sin+Solicitud",
    detalles: "Este control identifica órdenes de compra que fueron generadas sin una solicitud de gasto registrada, lo cual compromete el control presupuestario."
  },
  {
    id: 4,
    procesoId: "compra",
    nombre: "Factura sin pedido asociado",
    descripcion: "Facturas registradas sin relación con una orden de compra.",
    estado: "Cumpliendo",
    criticidad: "Media",
    accionRequerida: "Conciliar facturas con sus respectivos pedidos",
    ultimaActualizacion: "2024-01-14",
    powerBiUrl: "https://via.placeholder.com/800x600/fef9c3/eab308?text=Factura+sin+Pedido",
    detalles: "Detecta facturas ingresadas al sistema que no están asociadas a un pedido previo, generando riesgo de pagos no controlados."
  },
  {
    id: 5,
    procesoId: "compra",
    nombre: "Monto del pago mayor al monto de la factura",
    descripcion: "Pagos que exceden el valor facturado por el proveedor.",
    estado: "Crítico",
    criticidad: "Alta",
    accionRequerida: "Revisar pagos y emitir notas de crédito si corresponde",
    ultimaActualizacion: "2024-01-13",
    powerBiUrl: "https://via.placeholder.com/800x600/fee2e2/b91c1c?text=Pago+Mayor+a+Factura",
    detalles: "Control que verifica que los pagos no superen el monto indicado en la factura, evitando salidas indebidas de dinero."
  },
  {
    id: 6,
    procesoId: "compra",
    nombre: "Monto del pedido mayor al monto solicitado",
    descripcion: "Órdenes de compra con montos superiores a lo solicitado.",
    estado: "Cumpliendo",
    criticidad: "Media",
    accionRequerida: "Revisar desvíos entre solicitudes y pedidos",
    ultimaActualizacion: "2024-01-13",
    powerBiUrl: "https://via.placeholder.com/800x600/e0f2fe/0284c7?text=Pedido+Mayor+a+Solicitud",
    detalles: "Evalúa discrepancias entre los montos solicitados y los aprobados en los pedidos de compra."
  },
  {
    id: 7,
    procesoId: "compra",
    nombre: "Solicitud aprobada pero sin pedido después de 15 días",
    descripcion: "Solicitudes aprobadas sin convertirse en pedidos oportunamente.",
    estado: "Atención",
    criticidad: "Media",
    accionRequerida: "Investigar retrasos en generación de pedidos",
    ultimaActualizacion: "2024-01-12",
    powerBiUrl: "https://via.placeholder.com/800x600/f0fdf4/22c55e?text=Solicitud+sin+Pedido+15d",
    detalles: "Control que detecta solicitudes aprobadas que no derivaron en pedidos de compra en un plazo razonable, afectando la eficiencia del proceso."
  },
  {
    id: 8,
    procesoId: "compra",
    nombre: "Factura emitida sin que el proveedor esté homologado",
    descripcion: "Facturas emitidas por proveedores no homologados.",
    estado: "Crítico",
    criticidad: "Alta",
    accionRequerida: "Bloquear pagos a proveedores no homologados",
    ultimaActualizacion: "2024-01-12",
    powerBiUrl: "https://via.placeholder.com/800x600/ffe4e6/be123c?text=Factura+Proveedor+No+Homologado",
    detalles: "Detecta facturas que fueron registradas por proveedores sin pasar por el proceso de homologación, lo que representa un riesgo para la organización."
  },
  {
    id: 9,
    procesoId: "compra",
    nombre: "Pagos duplicados mismo monto y proveedor en el mismo mes",
    descripcion: "Detección de pagos duplicados en un mismo período.",
    estado: "Crítico",
    criticidad: "Alta",
    accionRequerida: "Auditar registros de pago duplicados",
    ultimaActualizacion: "2024-01-12",
    powerBiUrl: "https://via.placeholder.com/800x600/fde68a/f59e0b?text=Pagos+Duplicados",
    detalles: "Control para evitar duplicación de pagos por el mismo monto a un proveedor en el mismo mes, lo cual puede indicar errores o fraude."
  }


  ],
  // Aquí se pueden agregar controles para otros procesos cuando estén activos
    fraude: [],
  estadosfinancieros: [],
  accesos: [],
}
*/