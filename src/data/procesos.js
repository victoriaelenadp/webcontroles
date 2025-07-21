
import { ShoppingCart, Settings, BarChartIcon as ChartNoAxesCombined, ShieldAlert } from "lucide-react"

// Normativas disponibles
export const normativas = [
  {
    id: "sox",
    nombre: "SOX (Sarbanes-Oxley)",
    descripcion: "Ley de protección al inversionista",
    color: "blue",
  },
  {
    id: "coso",
    nombre: "COSO",
    descripcion: "Committee of Sponsoring Organizations",
    color: "green",
  },
  {
    id: "iso27001",
    nombre: "ISO 27001",
    descripcion: "Gestión de Seguridad de la Información",
    color: "purple",
  },
  {
    id: "pci",
    nombre: "PCI DSS",
    descripcion: "Payment Card Industry Data Security Standard",
    color: "orange",
  },
]

// Datos centralizados de procesos y controles
export const procesos = [
  {
    id: "compra",
    titulo: "Proceso de Compra",
    descripcion: "Gestión y control del proceso de adquisiciones",
    icono: ShoppingCart,
    estado: "Activo",
    color: "blue",
    normativas: ["sox", "coso"], // Array de IDs de normativas
  },
  {
    id: "fraude",
    titulo: "Fraude",
    descripcion: "Detección y prevención de actividades fraudulentas",
    icono: ShieldAlert,
    estado: "Activo",
    color: "green",
    normativas: ["sox", "coso", "iso27001"],
  },
  {
    id: "estadosfinancieros",
    titulo: "Estados Financieros",
    descripcion: "Control y validación de reportes financieros",
    icono: ChartNoAxesCombined,
    estado: "Activo",
    color: "purple",
    normativas: ["sox"],
  },
  {
    id: "accesos",
    titulo: "Accesos",
    descripcion: "Control de accesos y permisos del sistema",
    icono: Settings,
    estado: "Activo",
    color: "orange",
    normativas: ["iso27001", "pci"],
  },
]

export const obtenerProceso = (id) => {
  return procesos.find((p) => p.id === id)
}

export const obtenerNormativa = (id) => {
  return normativas.find((n) => n.id === id)
}

export const obtenerProcesosPorNormativa = (normativaId) => {
  if (!normativaId) return procesos
  return procesos.filter((proceso) => proceso.normativas.includes(normativaId))
}

// Esta función hace el fetch desde el backend y estructura los controles como antes
const API_BASE_URL = "http://localhost:8000" // Ajusta si usas otro puerto o dominio

// Obtener todos los controles desde el backend
export const obtenerTodosLosControles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/controles`)
    if (!response.ok) throw new Error("Error al obtener controles")
    return await response.json()
  } catch (error) {
    console.error("Error en obtenerTodosLosControles:", error)
    return []
  }
}

// Obtener controles por proceso (asume que existe el campo proceso_id en DB)
export const obtenerControlesPorProceso = async (procesoId) => {
  const controles = await obtenerTodosLosControles()
  return controles.filter((control) => control.proceso_id === procesoId)
}

// Obtener control específico
export const obtenerControl = async (procesoId, controlId) => {
  const controles = await obtenerControlesPorProceso(procesoId)
  return controles.find((control) => control.id === Number.parseInt(controlId))
}
