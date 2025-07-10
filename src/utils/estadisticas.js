import { procesos, controlesPorProceso } from "../data/procesos"

// Obtener todos los controles de todos los procesos
export const obtenerTodosLosControles = () => {
  return Object.values(controlesPorProceso).flat()
}

// Obtener controles por proceso específico
export const obtenerControlesPorProceso = (procesoId) => {
  return controlesPorProceso[procesoId] || []
}

// Obtener control específico
export const obtenerControl = (procesoId, controlId) => {
  const controles = obtenerControlesPorProceso(procesoId)
  return controles.find((control) => control.id === Number.parseInt(controlId))
}

// Obtener proceso específico
export const obtenerProceso = (procesoId) => {
  return procesos.find((proceso) => proceso.id === procesoId)
}

// Calcular estadísticas generales
export const calcularEstadisticasGenerales = () => {
  const todosLosControles = obtenerTodosLosControles()
  const procesosActivos = procesos.filter((proceso) => proceso.estado === "Activo")

  return {
    totalProcesos: procesos.length,
    procesosActivos: procesosActivos.length,
    totalControles: todosLosControles.length,
    controlesPorEstado: {
      cumpliendo: todosLosControles.filter((control) => control.estado === "Cumpliendo").length,
      atencion: todosLosControles.filter((control) => control.estado === "Atención").length,
      critico: todosLosControles.filter((control) => control.estado === "Crítico").length,
    },
  }
}

// Calcular estadísticas por proceso
export const calcularEstadisticasProceso = (procesoId) => {
  const controles = obtenerControlesPorProceso(procesoId)

  const estadisticas = {
    totalControles: controles.length,
    cumpliendo: controles.filter((control) => control.estado === "Cumpliendo").length,
    atencion: controles.filter((control) => control.estado === "Atención").length,
    critico: controles.filter((control) => control.estado === "Crítico").length,
  }

  // Calcular eficiencia (porcentaje de controles cumpliendo)
  estadisticas.eficiencia = controles.length > 0 ? Math.round((estadisticas.cumpliendo / controles.length) * 100) : 0

  return estadisticas
}

// Obtener procesos con sus estadísticas
export const obtenerProcesosConEstadisticas = () => {
  return procesos.map((proceso) => {
    const controles = obtenerControlesPorProceso(proceso.id)
    return {
      ...proceso,
      controles: controles.length,
    }
  })
}
