// src/utils/estadisticas.js
import { obtenerTodosLosControles, obtenerControlesPorProceso } from "../data/procesos";
import { procesos } from "../data/procesos"; // Esto sigue hardcodeado por ahora

export const calcularEstadisticasGenerales = async () => {
  const todosLosControles = await obtenerTodosLosControles();
  const procesosActivos = procesos.filter((proceso) => proceso.estado === "Activo");

  return {
    totalProcesos: procesos.length,
    procesosActivos: procesosActivos.length,
    totalControles: todosLosControles.length,
    controlesPorEstado: {
      cumpliendo: todosLosControles.filter((c) => c.estado === "Cumpliendo").length,
      atencion: todosLosControles.filter((c) => c.estado === "Atención").length,
      critico: todosLosControles.filter((c) => c.estado === "Crítico").length,
    },
  };
};

export const calcularEstadisticasProceso = async (procesoId) => {
  const controles = await obtenerControlesPorProceso(procesoId);

  const estadisticas = {
    totalControles: controles.length,
    cumpliendo: controles.filter((c) => c.estado === "Cumpliendo").length,
    atencion: controles.filter((c) => c.estado === "Atención").length,
    critico: controles.filter((c) => c.estado === "Crítico").length,
  };

  estadisticas.eficiencia = controles.length > 0
    ? Math.round((estadisticas.cumpliendo / controles.length) * 100)
    : 0;

  return estadisticas;
};

export const obtenerProcesosConEstadisticas = async () => {
  const result = await Promise.all(
    procesos.map(async (proceso) => {
      const controles = await obtenerControlesPorProceso(proceso.id);
      return {
        ...proceso,
        controles: controles.length,
      };
    })
  );
  return result;
};
