import { Link } from "react-router-dom"
import { ShoppingCart, FileText, Users, Settings, BookAlert } from "lucide-react"
import Card from "./ui/Card"
import Badge from "./ui/Badge"

import { obtenerProcesosConEstadisticas, calcularEstadisticasGenerales } from "../utils/estadisticas"


const HomePage = () => {
    const procesos = obtenerProcesosConEstadisticas()
    const estadisticas = calcularEstadisticasGenerales()


    return (
        <div className="min-h-screen bg-gradient">
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <div>
                            <h1 className="main-title">Procesos</h1>
                            <p className="subtitle">Sistema de Monitarización Contínua</p>
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
                        <div className="last-update">Última actualización: {new Date().toLocaleDateString("es-ES")}</div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container main-content">
                {/* Processes Grid */}
                <div className="processes-grid">
                    {procesos.map((proceso) => {
                        const IconComponent = proceso.icono
                        const isActive = proceso.estado === "Activo"

                        return (
                            <Card key={proceso.id} className="process-card">
                                <div className="card-header">
                                    <div className="process-info">
                                        <div className={`process-icon ${proceso.color}`}>
                                            <IconComponent size={24} />
                                        </div>
                                        <div>
                                            <h3 className="process-title">{proceso.titulo}</h3>
                                            <div className="badges">
                                                <Badge variant={isActive ? "active" : "inactive"}>{proceso.estado}</Badge>
                                                {isActive && <Badge variant="outline">{proceso.controles} controles</Badge>}
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
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
export default HomePage
