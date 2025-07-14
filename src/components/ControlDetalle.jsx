"use client"
import { Link, useParams, useNavigate } from "react-router-dom"
import {
    ArrowLeft,
    BarChart3,
    CheckCircle,
    AlertCircle,
    TriangleIcon as ExclamationTriangle,
    Clock,
    Loader2,
} from "lucide-react"
import Card from "./ui/Card"
import Badge from "./ui/Badge"
import { useEffect, useState } from "react"
import { obtenerControl, obtenerProceso } from "../data/procesos"

const ControlDetalle = () => {
    const { procesoId, controlId } = useParams()
    const navigate = useNavigate()

    const [proceso, setProceso] = useState(null)
    const [control, setControl] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const p = obtenerProceso(procesoId) // sigue siendo síncrono
            const c = await obtenerControl(procesoId, controlId)
            setProceso(p)
            setControl(c)
            setLoading(false)
        }
        fetchData()
    }, [procesoId, controlId])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient flex items-center justify-center">
                <Card className="p-8 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                    <h2 className="text-xl font-bold text-gray-900 mt-4">Cargando...</h2>
                </Card>
            </div>
        )
    }

    if (!proceso) {
        return (
            <div className="min-h-screen bg-gradient flex items-center justify-center">
                <Card className="p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Proceso no encontrado
                    </h2>
                    <Link to="/" className="btn-primary">Volver</Link>
                </Card>
            </div>
        )
    }

    if (!control) {
        return (
            <div className="min-h-screen bg-gradient flex items-center justify-center">
                <Card className="p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Control no encontrado
                    </h2>
                    <button
                        onClick={() => {
                            setLoading(true)
                            setTimeout(() => navigate(`/proceso/${procesoId}`), 500)
                        }}
                        className="btn-back"
                    >
                        <ArrowLeft size={16} />
                        Volver
                    </button>
                </Card>
            </div>
        )
    }

    const getEstadoBadge = (estado) => {
        switch (estado) {
            case "Cumpliendo":
                return (
                    <Badge variant="success">
                        <CheckCircle size={12} style={{ marginRight: "4px" }} />
                        Cumpliendo
                    </Badge>
                )
            case "Atención":
                return (
                    <Badge variant="warning">
                        <AlertCircle size={12} style={{ marginRight: "4px" }} />
                        Atención
                    </Badge>
                )
            case "Crítico":
                return (
                    <Badge variant="danger">
                        <AlertCircle size={12} style={{ marginRight: "4px" }} />
                        Crítico
                    </Badge>
                )
            default:
                return <Badge variant="secondary">{estado}</Badge>
        }
    }

    const getCriticidadBadge = (criticidad) => {
        switch (criticidad) {
            case "Alta":
                return (
                    <Badge variant="danger">
                        <ExclamationTriangle size={12} style={{ marginRight: "4px" }} />
                        Alta
                    </Badge>
                )
            case "Media":
                return (
                    <Badge variant="warning">
                        <AlertCircle size={12} style={{ marginRight: "4px" }} />
                        Media
                    </Badge>
                )
            case "Baja":
                return (
                    <Badge variant="success">
                        <CheckCircle size={12} style={{ marginRight: "4px" }} />
                        Baja
                    </Badge>
                )
            default:
                return <Badge variant="secondary">{criticidad}</Badge>
        }
    }

    return (
        <div className="min-h-screen bg-gradient">
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <div className="header-left">
                            <Link to={`/proceso/${procesoId}`} className="btn-back">
                                <ArrowLeft size={16} />
                                Volver
                            </Link>
                            <div>
                                <h1 className="main-title">{control.nombre_control}</h1>
                                <p className="subtitle">{control.descripcion}</p>
                            </div>
                        </div>
                        <div className="control-badges">
                            {getEstadoBadge(control.estado)}
                            {getCriticidadBadge(control.criticidad)}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container main-content">
                {/* Control Info */}
                <div className="control-detail-grid">
                    {/* Power BI Dashboard */}
                    <Card className="powerbi-detail-card">
                        <div className="card-header">
                            <h3 className="control-title">
                                <BarChart3 size={20} style={{ marginRight: "8px", color: "#2563eb" }} />
                                Dashboard Interactivo
                            </h3>
                        </div>
                        <div className="card-content">
                            <div className="powerbi-detail-container">
                                <img
                                    src={control.powerBiUrl || "/placeholder.svg"}
                                    alt={`Dashboard de ${control.nombre_control}`}
                                    className="powerbi-detail-image"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Control Details */}
                    <div className="control-info-panel">
                        <Card className="control-info-card">
                            <div className="card-header">
                                <h3 className="control-title">Información del Control</h3>
                            </div>
                            <div className="card-content">
                                <div className="info-row">
                                    <span className="info-label">Estado:</span>
                                    {getEstadoBadge(control.estado)}
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Criticidad:</span>
                                    {getCriticidadBadge(control.criticidad)}
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Última Actualización:</span>
                                    <span>{new Date(control.ultimaActualizacion).toLocaleDateString("es-ES")}</span>
                                </div>
                                {control.accion_requerida && (
                                    <div className="info-row">
                                        <span className="info-label">Acción Requerida:</span>
                                        <div className="action-required">
                                            <Clock size={16} style={{ marginRight: "8px", color: "#d97706" }} />
                                            <span>{control.accion_requerida}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="control-description-card">
                            <div className="card-header">
                                <h3 className="control-title">Descripción Detallada</h3>
                            </div>
                            <div className="card-content">
                                <p className="control-detail-description">{control.detalles}</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ControlDetalle
