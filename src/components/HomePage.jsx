// src/components/HomePage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Settings, BookAlert, Loader2 } from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

import {
    obtenerProcesosConEstadisticas,
    calcularEstadisticasGenerales,
} from "../utils/estadisticas";

const HomePage = () => {
    const [procesos, setProcesos] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        totalProcesos: 0,
        procesosActivos: 0,
        totalControles: 0,
        controlesPorEstado: {},
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            const procesosData = await obtenerProcesosConEstadisticas();
            const stats = await calcularEstadisticasGenerales();
            setProcesos(procesosData);
            setEstadisticas(stats);
            setLoading(false);
        };
        cargarDatos();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient flex items-center justify-center">
                <Card className="p-8 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                    <h2 className="text-xl font-bold text-gray-900 mt-4">Cargando...</h2>
                </Card>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient">
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <div>
                            <h1 className="main-title">Procesos</h1>
                            <p className="subtitle">Sistema de Monitoreo Continuo</p>
                            <div className="header-stats">
                                <div className="header-stat">
                                    <FileText size={16} />
                                    <span>{estadisticas.totalProcesos} Procesos</span>
                                </div>
                                <div className="header-stat">
                                    <Settings size={16} />
                                    <span>{estadisticas.procesosActivos} Activos</span>
                                </div>
                                <div className="header-stat">
                                    <BookAlert size={16} />
                                    <span>{estadisticas.totalControles} Controles</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </header>

            <main className="container main-content">
                <div className="processes-grid">
                    {procesos.map((proceso) => {
                        const IconComponent = proceso.icono || FileText;
                        const isActive = proceso.estado === "Activo";

                        return (
                            <Card key={proceso.id} className="process-card">
                                <div className="card-header">
                                    <div className="process-info">
                                        <div className={`process-icon ${proceso.color || ""}`}>
                                            <IconComponent size={24} />
                                        </div>
                                        <div>
                                            <h3 className="process-title">{proceso.titulo}</h3>
                                            <div className="badges">
                                                <Badge variant={isActive ? "active" : "inactive"}>
                                                    {proceso.estado}
                                                </Badge>
                                                {isActive && (
                                                    <Badge variant="outline">
                                                        {proceso.controles} controles
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-content">
                                    <p className="process-description">{proceso.descripcion}</p>
                                    {isActive ? (
                                        <Link to={`/proceso/${proceso.id}`} className="btn-primary">
                                            Ver Detalle
                                        </Link>
                                    ) : (
                                        <button disabled className="btn-disabled">
                                            Próximamente
                                        </button>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default HomePage;
