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
    FileSpreadsheet,
    LayoutList,
    Rows4,
    Rows2,
    Wrench,
    Filter,
    X
} from "lucide-react"

import { useEffect, useState } from "react"
// ...
import {
    obtenerProceso
} from "../data/procesos";
import {
    obtenerControlesPorProceso
} from "../data/procesos";

import {
    calcularEstadisticasProceso
} from "../utils/estadisticas";
import Card from "./ui/Card"
import Badge from "./ui/Badge"

import { Loader2 } from "lucide-react"
import { obtenerNormativasPorControl, obtenerNormativas } from "../data/procesos"



const ProcesoPage = () => {
    const { id } = useParams()

    const [proceso, setProceso] = useState(null)
    const [controles, setControles] = useState([])
    const [estadisticas, setEstadisticas] = useState(null)
    const [loading, setLoading] = useState(true)
    const [vistaCompacta, setVistaCompacta] = useState(false)

    const [filtroCriticidad, setFiltroCriticidad] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [busquedaId, setBusquedaId] = useState("")

    const [normativas, setNormativas] = useState([])
    const [normativaSeleccionada, setNormativaSeleccionada] = useState("")






    const tablasPorProceso = {
        "compra": [
            "resultados_control1",
            "resultados_control2",
            "resultados_control3",
            "resultados_control4",
            "resultados_control5",
            "resultados_control6",
            "resultados_control8",
            "resultados_control9",
        ],
        "fraude": [
            "resultados_control10"
        ],
        "estadosfinancieros": [

        ],
        "accesos": [
            "resultados_control14"
        ]
    }



    const controlesFiltrados = controles.filter((control) => {
        const coincideBusqueda = busquedaId === "" || control.id.toString().includes(busquedaId.trim())
        const coincideCriticidad = filtroCriticidad === "" || control.criticidad === filtroCriticidad
        const coincideEstado = filtroEstado === "" || control.estado === filtroEstado
        const coincideNormativa = normativaSeleccionada === "" ||
            (control.normativas && control.normativas.some(n => n.id === normativaSeleccionada))

        return coincideBusqueda && coincideCriticidad && coincideEstado && coincideNormativa
    })

    const limpiarFiltroNormativa = () => {
        setNormativaSeleccionada("")
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const p = await obtenerProceso(id)
            const c = await obtenerControlesPorProceso(id)
            const stats = await calcularEstadisticasProceso(id)
            const normativasData = await obtenerNormativas()

            // Añadimos normativas a cada control
            const controlesConNormativas = await Promise.all(
                (c || []).map(async (control) => {
                    const normativasControl = await obtenerNormativasPorControl(control.id)
                    return { ...control, normativas: normativasControl }
                })
            )

            setProceso(p)
            setControles(controlesConNormativas)
            setEstadisticas(stats)
            setNormativas(normativasData)
            setLoading(false)
        }

        fetchData()
    }, [id])


    const tablasDisponibles = tablasPorProceso[id] || []





    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const p = await obtenerProceso(id)
            const c = await obtenerControlesPorProceso(id)
            const stats = await calcularEstadisticasProceso(id)

            const controlesConNormativas = await Promise.all(
                (c || []).map(async (control) => {
                    const normativasControl = await obtenerNormativasPorControl(control.id)
                    return { ...control, normativas: normativasControl }
                })
            )

            setProceso(p)
            setControles(controlesConNormativas)
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
                    <h2 className="text-xl font-bold text-gray-900 mt-4">Cargando...</h2>
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
                        <div className="header-right">
                            <div className="filters-section">
                                <div className="filters-header">
                                    <div className="filters-title">
                                        <Filter size={20} />
                                        <span>Filtrar por Normativa</span>
                                    </div>
                                    {normativaSeleccionada && (
                                        <button onClick={limpiarFiltroNormativa} className="btn-clear-filter">
                                            <X size={16} />
                                            Limpiar filtro
                                        </button>
                                    )}
                                </div>

                                <div className="normativas-filter">
                                    {normativas.map((normativa) => (
                                        <button
                                            key={normativa.id}
                                            onClick={() => setNormativaSeleccionada(normativa.id)}
                                            className={`normativa-tag ${normativaSeleccionada === normativa.id ? "active" : ""} ${normativa.color}`}
                                        >
                                            {normativa.nombre}
                                        </button>
                                    ))}
                                </div>

                                {normativaSeleccionada && (
                                    <div className="filter-info">
                                        <span>
                                            Mostrando {controlesFiltrados.length} controles de{" "}
                                            {normativas.find((n) => n.id === normativaSeleccionada)?.nombre}
                                        </span>
                                    </div>
                                )}
                            </div>

                        </div>

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

                        <div className="header-right-tools">
                            <input
                                type="text"
                                placeholder="Buscar por ID"
                                value={busquedaId}
                                onChange={(e) => setBusquedaId(e.target.value)}
                                className="input-search"
                            />



                            {/* Filtro por Estado */}
                            <select
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                                className="input-select"
                            >
                                <option value="">Todos los estados</option>
                                <option value="Cumpliendo">Cumpliendo</option>
                                <option value="Atención">Atención</option>
                                <option value="Crítico">Crítico</option>
                            </select>

                            {/* Filtro por Criticidad */}
                            <select
                                value={filtroCriticidad}
                                onChange={(e) => setFiltroCriticidad(e.target.value)}
                                className="input-select"
                            >
                                <option value="">Todas las criticidades</option>
                                <option value="Alta">Alta</option>
                                <option value="Media">Media</option>
                                <option value="Baja">Baja</option>
                            </select>

                            <div className="view-toggle">
                                <button
                                    className={`toggle-button ${!vistaCompacta ? "active" : ""}`}
                                    onClick={() => setVistaCompacta(false)}
                                    title="Vista detallada"
                                >
                                    <Rows2 size={18} />
                                </button>
                                <button
                                    className={`toggle-button ${vistaCompacta ? "active" : ""}`}
                                    onClick={() => setVistaCompacta(true)}
                                    title="Vista compacta"
                                >
                                    <Rows4 size={18} />
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="card-content">
                        <div className="controls-list">
                            {controlesFiltrados.map((control, index) => {

                                if (!vistaCompacta) {
                                    // Vista detallada
                                    return (
                                        <div
                                            key={control.id}
                                            className={`control-list-item ${index !== controles.length - 1 ? "border-bottom" : ""}`}
                                        >
                                            <div className="control-list-main">
                                                <div className="control-list-info">
                                                    <h4 className="control-list-title">{control.nombre_control}</h4>
                                                    <h2 className="control-list-description">ID: {control.id}</h2>
                                                    <p className="control-list-description">{control.descripcion}</p>

                                                    {/* Normativas asociadas */}
                                                    <div className="control-list-normativas">
                                                        {control.normativas?.length > 0 ? (
                                                            control.normativas.map((n) => {
                                                                const normativa = normativas.find((norm) => norm.id === n.id) // buscar color
                                                                return normativa ? (
                                                                    <span key={n.id} className={`normativa-badge ${normativa.color}`}>
                                                                        {normativa.nombre}
                                                                    </span>
                                                                ) : (
                                                                    <span key={n.id} className="normativa-badge blue">
                                                                        {n.nombre}
                                                                    </span>
                                                                )
                                                            })
                                                        ) : (
                                                            <span className="normativa-badge empty">Sin normativas</span>
                                                        )}
                                                    </div>

                                                </div>
                                                <div className="control-list-badges">
                                                    {getEstadoBadge(control.estado)}
                                                    {getCriticidadBadge(control.criticidad)}
                                                </div>
                                            </div>
                                            {control.accion_requerida && (
                                                <div className="control-action-required">
                                                    <Wrench size={16} style={{ marginRight: "8px", color: "#d97706" }} />
                                                    <span>{control.accion_requerida}</span>
                                                </div>
                                            )}
                                            <div className="control-list-actions">
                                                <Link to={`/proceso/${id}/control/${control.id}`} className="btn-outline">
                                                    Ver Detalle
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                } else {
                                    // Vista compacta
                                    return (
                                        <div key={control.id} className="compact-control-item">
                                            <div>
                                                <h4 className="compact-title">{control.nombre_control}</h4>
                                                {/*   <h2 className="control-list-description">ID: {control.id}</h2> */}
                                                <div className="compact-badges">
                                                    {getEstadoBadge(control.estado)}
                                                    {/*  
                                                    
                                                    {getCriticidadBadge(control.criticidad)} */}
                                                    {control.accion_requerida && (


                                                        <div className="control-action-required-compact">

                                                            <span> Acción Requerida </span>
                                                        </div>


                                                    )}
                                                </div>
                                            </div>
                                            <Link to={`/proceso/${id}/control/${control.id}`} className="btn-outline small">
                                                Ver Detalle
                                            </Link>
                                        </div>
                                    )
                                }
                            })}
                        </div>


                    </div>
                </Card>
                <Card className="controls-list-card">

                    {/* Export Section */}
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
                                    Descargar Data
                                </Badge>
                            </div>
                        </div>

                        <div className="card-content">
                            {tablasDisponibles.length === 0 ? (
                                <p>No hay tablas disponibles para exportar en este proceso.</p>
                            ) : (
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault()
                                        const form = new FormData(e.target)
                                        const selectedTables = form.getAll("tables")
                                        if (selectedTables.length === 0) {
                                            return alert("Selecciona al menos una tabla.")
                                        }
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
                                        link.download = "data.xlsx"
                                        link.click()
                                        window.URL.revokeObjectURL(url)
                                    }}
                                >
                                    <div className="export-tables-grid">
                                        {tablasDisponibles.map((table) => (
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
                            )}
                        </div>
                    </Card>
                </Card>

            </main>
        </div>
    )
}


export default ProcesoPage

