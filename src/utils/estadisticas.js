// src/utils/estadisticas.js
// src/utils/estadisticas.js

import { 
  obtenerTodosLosControles, 
  obtenerControlesPorProceso, 
  obtenerProcesos 
} from "../data/procesos";

// Calcular estadísticas generales del sistema
export const calcularEstadisticasGenerales = async () => {
  const [todosLosControles, todosLosProcesos] = await Promise.all([
    obtenerTodosLosControles(),
    obtenerProcesos(),
  ]);

  const procesosActivos = todosLosProcesos.filter((proceso) => proceso.estado === "Activo");

  return {
    totalProcesos: todosLosProcesos.length,
    procesosActivos: procesosActivos.length,
    totalControles: todosLosControles.length,
    controlesPorEstado: {
      cumpliendo: todosLosControles.filter((c) => c.estado === "Cumpliendo").length,
      atencion: todosLosControles.filter((c) => c.estado === "Atención").length,
      critico: todosLosControles.filter((c) => c.estado === "Crítico").length,
    },
  };
};

// Calcular estadísticas para un proceso específico
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

// Obtener lista de procesos con cantidad de controles asociados
export const obtenerProcesosConEstadisticas = async () => {
  const procesos = await obtenerProcesos();

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
