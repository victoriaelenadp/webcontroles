
import { ShoppingCart, Settings, BarChartIcon as ChartNoAxesCombined, ShieldAlert } from "lucide-react"


const API_BASE_URL = "https://backendwebcontroles.onrender.com"


export const obtenerNormativas = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/normativas`)
    if (!res.ok) throw new Error("Error al obtener normativas")
    return await res.json()
  } catch (e) {
    console.error("Error obteniendo normativas:", e)
    return []
  }
}

export const obtenerProcesos = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/procesos`)
    if (!res.ok) throw new Error("Error al obtener procesos")
    return await res.json()
  } catch (e) {
    console.error("Error obteniendo procesos:", e)
    return []
  }
}

export const obtenerProceso = async (id) => {
  const procesos = await obtenerProcesos()
  return procesos.find((p) => p.id === id)
}

export const obtenerNormativa = async (id) => {
  const normativas = await obtenerNormativas()
  return normativas.find((n) => n.id === id)
}

export const obtenerProcesosPorNormativa = async (normativaId) => {
  const procesos = await obtenerProcesos()
  return procesos.filter((p) => p.normativas.includes(normativaId))
}

export const obtenerNormativasPorControl = async (controlId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/controles/${controlId}/normativas`)
    if (!res.ok) throw new Error("Error al obtener normativas del control")
    return await res.json()
  } catch (e) {
    console.error("Error obteniendo normativas del control:", e)
    return []
  }
}




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
