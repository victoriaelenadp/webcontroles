// src/components/HomePage.jsx
"use client"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FileText, Settings, BookIcon as BookAlert, Loader2, Filter, X, ShoppingCart, ShieldAlert, ChartBar } from "lucide-react"
import Card from "./ui/Card"
import Badge from "./ui/Badge"
import { obtenerProcesosConEstadisticas, calcularEstadisticasGenerales } from "../utils/estadisticas"
import { obtenerNormativas, obtenerProcesosPorNormativa } from "../data/procesos"


const HomePage = () => {
    const [normativas, setNormativas] = useState([])
    const [procesos, setProcesos] = useState([])
    const [procesosFiltrados, setProcesosFiltrados] = useState([])
    const [estadisticas, setEstadisticas] = useState({
        totalProcesos: 0,
        procesosActivos: 0,
        totalControles: 0,
        controlesPorEstado: {},
    })
    const [loading, setLoading] = useState(true)
    const [normativaSeleccionada, setNormativaSeleccionada] = useState("")

    const iconosPorProceso = {
        compra: ShoppingCart,
        fraude: ShieldAlert,
        estadosfinancieros: ChartBar,
        accesos: Settings,
    }

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true)
            const procesosData = await obtenerProcesosConEstadisticas()
            const stats = await calcularEstadisticasGenerales()
            const normativasData = await obtenerNormativas()

            setProcesos(procesosData)
            setProcesosFiltrados(procesosData)
            setEstadisticas(stats)
            setNormativas(normativasData)
            setLoading(false)
        }
        cargarDatos()
    }, [])


    useEffect(() => {
        const filtrarProcesos = () => {
            if (normativaSeleccionada) {
                const filtrados = procesos.filter((p) =>
                    p.normativas && p.normativas.includes(normativaSeleccionada)
                )
                setProcesosFiltrados(filtrados)
            } else {
                setProcesosFiltrados(procesos)
            }
        }

        filtrarProcesos()
    }, [normativaSeleccionada, procesos])



    const limpiarFiltro = () => {
        setNormativaSeleccionada("")
    }

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

    return (
        <div className="min-h-screen bg-gradient">
            <header className="header">


                <div className="container">
                    <div className="header-content">
                        {/* IZQUIERDA */}
                        <div className="header-left">
                            <div>
                                <h1 className="main-title">Procesos</h1>
                                <p className="subtitle">Sistema de Monitoreo Contínuo</p>
                                <div className="header-stats">
                                    <div className="header-stat">
                                        <FileText size={16} />
                                        <span>{estadisticas.totalProcesos} Procesos</span>
                                    </div>
                                    {/* < <div className="header-stat">
                                        {/* <Settings size={16} />
                                        <span>{estadisticas.procesosActivos} Activos</span> 
                                    </div> */}
                                    <div className="header-stat">
                                        <BookAlert size={16} />
                                        <span>{estadisticas.totalControles} Controles</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DERECHA */}
                        <div className="header-right">
                            <div className="filters-section">
                                <div className="filters-header">
                                    <div className="filters-title">
                                        <Filter size={20} />
                                        <span>Filtrar por Normativa</span>
                                    </div>
                                    {normativaSeleccionada && (
                                        <button onClick={limpiarFiltro} className="btn-clear-filter">
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
                                            Mostrando {procesosFiltrados.length} procesos de{" "}
                                            {normativas.find((n) => n.id === normativaSeleccionada)?.nombre}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>


            <main className="container main-content">


                <div className="processes-grid">
                    {procesosFiltrados.map((proceso) => {
                        const IconComponent = iconosPorProceso[proceso.id] || FileText
                        const isActive = proceso.estado === "Activo"
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
                                                {/* <Badge variant={isActive ? "active" : "inactive"}>{proceso.estado}</Badge>  */}
                                                {isActive && <Badge variant="outline">{proceso.controles} controles</Badge>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-content">
                                    <p className="process-description">{proceso.descripcion}</p>
                                    {/* Normativas del proceso */}
                                    <div className="process-normativas">
                                        {proceso.normativas?.map((normativaId) => {
                                            const normativa = normativas.find((n) => n.id === normativaId)
                                            return normativa ? (
                                                <span key={normativaId} className={`normativa-badge ${normativa.color}`}>
                                                    {normativa.nombre}
                                                </span>
                                            ) : null
                                        })}
                                    </div>
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
