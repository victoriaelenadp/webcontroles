import { Link } from "react-router-dom"
import { ShoppingCart, FileText, Users, Settings } from "lucide-react"
import Card from "./ui/Card"
import Badge from "./ui/Badge"

const HomePage = () => {
    const procesos = [
        {
            id: "compra",
            titulo: "Proceso de Compra",
            descripcion: "Gestión completa del proceso de adquisiciones y compras corporativas",
            icono: ShoppingCart,
            estado: "Activo",
            controles: 8,
            color: "blue",
        },
        {
            id: "ventas",
            titulo: "Proceso de Ventas",
            descripcion: "Control y seguimiento del proceso comercial y ventas",
            icono: FileText,
            estado: "Próximamente",
            controles: 0,
            color: "green",
        },
        {
            id: "rrhh",
            titulo: "Recursos Humanos",
            descripcion: "Gestión de personal y procesos administrativos de RRHH",
            icono: Users,
            estado: "Próximamente",
            controles: 0,
            color: "purple",
        },
        {
            id: "operaciones",
            titulo: "Operaciones",
            descripcion: "Control de procesos operativos y de producción",
            icono: Settings,
            estado: "Próximamente",
            controles: 0,
            color: "orange",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient">
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <div>
                            <h1 className="main-title">Procesos Corporativos</h1>
                            <p className="subtitle">Sistema de Control y Auditoría</p>
                        </div>
                        <div className="last-update">Última actualización: {new Date().toLocaleDateString("es-ES")}</div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container main-content">
                {/* Stats Overview */}
                <div className="stats-grid">
                    <Card>
                        <div className="stat-item">
                            <div className="stat-icon blue">
                                <FileText size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Procesos</p>
                                <p className="stat-value">4</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="stat-item">
                            <div className="stat-icon green">
                                <Settings size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Procesos Activos</p>
                                <p className="stat-value">1</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="stat-item">
                            <div className="stat-icon purple">
                                <ShoppingCart size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Controles Totales</p>
                                <p className="stat-value">8</p>
                            </div>
                        </div>
                    </Card>
                </div>

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
                                            Ver Controles de Auditoría
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