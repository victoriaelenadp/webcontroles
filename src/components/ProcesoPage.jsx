"use client"
import { Link, useParams } from "react-router-dom"
import {
    ArrowLeft,
    BarChart3,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    TriangleIcon as ExclamationTriangle,
    Clock,
    Download,
    FileSpreadsheet
} from "lucide-react"

import { useEffect, useState } from "react"
// ...
import {
    obtenerProceso
} from "../data/procesos"; // esto sí viene de estadisticas

import {
    obtenerControlesPorProceso
} from "../data/procesos"; // este sí está allí realmente

import {
    calcularEstadisticasProceso
} from "../utils/estadisticas";
import Card from "./ui/Card"
import Badge from "./ui/Badge"

import { Loader2 } from "lucide-react"

const ProcesoPage = () => {
    const { id } = useParams()

    const [proceso, setProceso] = useState(null)
    const [controles, setControles] = useState([])
    const [estadisticas, setEstadisticas] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const p = obtenerProceso(id) // síncrono
            const c = await obtenerControlesPorProceso(id)
            const stats = await calcularEstadisticasProceso(id)

            setProceso(p)
            setControles(c || [])
            setEstadisticas(stats)
            setLoading(false)
        }

        fetchData()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient flex items-center justify-center">
                <Card className="p-8 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                    <h2 className="text-xl font-bold text-gray-900 mt-4">Cargando proceso...</h2>
                </Card>
            </div>
        )
    }

    if (!proceso || !estadisticas) {
        return (
            <div className="min-h-screen bg-gradient flex items-center justify-center">
                <Card className="p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Proceso no encontrado</h2>
                    <Link to="/" className="btn-primary">Volver al Inicio</Link>
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
                            <Link to="/" className="btn-back">
                                <ArrowLeft size={16} />
                                Volver
                            </Link>
                            <div>
                                <h1 className="main-title">Controles </h1>
                                <p className="subtitle">{proceso.titulo}</p>
                            </div>
                        </div>
                        <div className="last-update">{estadisticas.totalControles} controles</div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container main-content">
                {/* Summary Cards */}
                <div className="summary-grid">
                    <Card>
                        <div className="stat-item">
                            <div className="stat-icon green">
                                <CheckCircle size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Cumpliendo</p>
                                <p className="stat-value">{estadisticas.cumpliendo}</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="stat-item">
                            <div className="stat-icon yellow">
                                <AlertCircle size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Atención</p>
                                <p className="stat-value">{estadisticas.atencion}</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="stat-item">
                            <div className="stat-icon red">
                                <AlertCircle size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Crítico</p>
                                <p className="stat-value">{estadisticas.critico}</p>
                            </div>
                        </div>
                    </Card>


                </div>

                {/* Controls List */}
                <Card className="controls-list-card">
                    <div className="card-header">
                        <h3 className="control-title">
                            <BarChart3 size={20} style={{ marginRight: "8px", color: "#2563eb" }} />
                            Controles ({estadisticas.totalControles})
                        </h3>
                    </div>
                    <div className="card-content">
                        <div className="controls-list">
                            {console.log("IDs de controles:", controles.map(c => c.id_control))}
                            {controles.map((control, index) => (
                                <div
                                    key={control.id}
                                    className={`control-list-item ${index !== controles.length - 1 ? "border-bottom" : ""}`}
                                >
                                    <div className="control-list-main">
                                        <div className="control-list-info">
                                            <h4 className="control-list-title">{control.nombre_control}</h4>
                                            <p className="control-list-description">{control.descripcion}</p>
                                            <div className="control-list-meta">
                                                <span className="last-update-text">
                                                    Actualizado: {new Date(control.ultimaActualizacion).toLocaleDateString("es-ES")}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="control-list-badges">
                                            {getEstadoBadge(control.estado)}
                                            {getCriticidadBadge(control.criticidad)}
                                        </div>
                                    </div>
                                    {control.accion_requerida && (
                                        <div className="control-action-required">
                                            <Clock size={16} style={{ marginRight: "8px", color: "#d97706" }} />
                                            <span>{control.accion_requerida}</span>
                                        </div>
                                    )}
                                    <div className="control-list-actions">
                                        <Link to={`/proceso/${id}/control/${control.id}`} className="btn-outline">
                                            Ver Detalle
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                <Card className="control-card" style={{ marginTop: "2rem" }}>
                    <div className="card-header">
                        <div className="control-info">
                            <div>
                                <h3 className="control-title">
                                    <FileSpreadsheet size={20} style={{ marginRight: "8px", color: "#2563eb" }} />
                                    Exportar Datos a Excel
                                </h3>
                                <p className="control-description">
                                    Selecciona las tablas de resultados que deseas exportar a un archivo Excel
                                </p>
                            </div>
                            <Badge variant="success">
                                <Download size={12} style={{ marginRight: "4px" }} />
                                Disponible
                            </Badge>
                        </div>
                    </div>

                    <div className="card-content">
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault()
                                const form = new FormData(e.target)
                                const selectedTables = form.getAll("tables")
                                if (selectedTables.length === 0) return alert("Selecciona al menos una tabla.")
                                const response = await fetch("http://localhost:8000/export_excel", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ tables: selectedTables }),
                                })
                                if (!response.ok) {
                                    return alert("Error al generar el Excel.")
                                }
                                const blob = await response.blob()
                                const url = window.URL.createObjectURL(blob)
                                const link = document.createElement("a")
                                link.href = url
                                link.download = "datos_auditoria.xlsx"
                                link.click()
                                window.URL.revokeObjectURL(url)
                            }}
                        >
                            <div className="export-tables-grid">
                                {[
                                    "resultados_control1",
                                    "resultados_control2",
                                    "resultados_control3",
                                    "resultados_control4",
                                    "resultados_control5",
                                    "resultados_control6",
                                    "resultados_control8",
                                ].map((table) => (
                                    <label key={table} className="table-export-checkbox">
                                        <input type="checkbox" name="tables" value={table} />
                                        <span className="table-export-name">
                                            {table.replace("resultados_", "").replace("control", "Control ").replace("_", " ")}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <button type="submit" className="btn-export-excel">
                                <Download size={16} style={{ marginRight: "8px" }} />
                                Descargar Excel
                            </button>
                        </form>
                    </div>
                </Card>

            </main>
        </div>
    )
}

export default ProcesoPage


{/* Exportar Datos a Excel */ }

{/* 
                <Card className="control-card" style={{ marginTop: "2rem" }}>
                    <div className="card-header">
                        <div className="control-info">
                            <div>
                                <h3 className="control-title">
                                    <FileSpreadsheet size={20} style={{ marginRight: "8px", color: "#2563eb" }} />
                                    Exportar Datos a Excel
                                </h3>
                                <p className="control-description">
                                    Selecciona las tablas de resultados que deseas exportar a un archivo Excel
                                </p>
                            </div>
                            <Badge variant="success">
                                <Download size={12} style={{ marginRight: "4px" }} />
                                Disponible
                            </Badge>
                        </div>
                    </div>

                    <div className="card-content">
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault()
                                const form = new FormData(e.target)
                                const selectedTables = form.getAll("tables")
                                if (selectedTables.length === 0) return alert("Selecciona al menos una tabla.")
                                const response = await fetch("http://localhost:8000/export_excel", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ tables: selectedTables }),
                                })
                                if (!response.ok) {
                                    return alert("Error al generar el Excel.")
                                }
                                const blob = await response.blob()
                                const url = window.URL.createObjectURL(blob)
                                const link = document.createElement("a")
                                link.href = url
                                link.download = "datos_auditoria.xlsx"
                                link.click()
                                window.URL.revokeObjectURL(url)
                            }}
                        >
                            <div className="export-tables-grid">
                                {[
                                    "resultados_control1",
                                    "resultados_control2",
                                    "resultados_control3",
                                    "resultados_control4",
                                    "resultados_control5",
                                    "resultados_control6",
                                    "resultados_control8",
                                ].map((table) => (
                                    <label key={table} className="table-export-checkbox">
                                        <input type="checkbox" name="tables" value={table} />
                                        <span className="table-export-name">
                                            {table.replace("resultados_", "").replace("control", "Control ").replace("_", " ")}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <button type="submit" className="btn-export-excel">
                                <Download size={16} style={{ marginRight: "8px" }} />
                                Descargar Excel
                            </button>
                        </form>
                    </div>
                </Card>
                */}


