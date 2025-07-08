"use client"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, BarChart3, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"
import Card from "./ui/Card"
import Badge from "./ui/Badge"

const ProcesoPage = () => {
    const { id } = useParams()

    const controles = [
        {
            id: 1,
            nombre: "Pago sin Factura",
            descripcion: "",
            estado: "Cumpliendo",
            ultimaActualizacion: "2024-01-15",
            powerBiUrl: "https://via.placeholder.com/600x400/e2e8f0/64748b?text=Dashboard+Presupuesto",
        },
        {
            id: 2,
            nombre: "Proveedor no homologado",
            descripcion: "",
            estado: "Atención",
            ultimaActualizacion: "2024-01-15",
            powerBiUrl: "https://via.placeholder.com/600x400/fef3c7/d97706?text=Dashboard+Aprobaciones",
        },
        {
            id: 3,
            nombre: "Pedido sin solicitud de gasto",
            descripcion: "",
            estado: "Cumpliendo",
            ultimaActualizacion: "2024-01-14",
            powerBiUrl: "https://via.placeholder.com/600x400/dcfce7/16a34a?text=Dashboard+Tiempos",
        },
        {
            id: 4,
            nombre: "Factura sin pedido asociado",
            descripcion: "",
            estado: "Cumpliendo",
            ultimaActualizacion: "2024-01-14",
            powerBiUrl: "https://via.placeholder.com/600x400/dbeafe/2563eb?text=Dashboard+Proveedores",
        },
        {
            id: 5,
            nombre: "Monto del pago mayor al monto de la factura",
            descripcion: "",
            estado: "Crítico",
            ultimaActualizacion: "2024-01-13",
            powerBiUrl: "https://via.placeholder.com/600x400/fecaca/dc2626?text=Dashboard+Políticas",
        },
        {
            id: 6,
            nombre: "Monto del pedido mayor al monto solicitado",
            descripcion: "",
            estado: "Cumpliendo",
            ultimaActualizacion: "2024-01-13",
            powerBiUrl: "https://via.placeholder.com/600x400/e0f2fe/0284c7?text=Dashboard+Costos",
        },
        {
            id: 7,
            nombre: "Solicitud aprobada pero sin pedido después de 15 días",
            descripcion: "",
            estado: "Cumpliendo",
            ultimaActualizacion: "2024-01-12",
            powerBiUrl: "https://via.placeholder.com/600x400/f3e8ff/7c3aed?text=Dashboard+Categorías",
        },
        {
            id: 8,
            nombre: "Factura emitida con proveedor no homologado",
            descripcion: "",
            estado: "Cumpliendo",
            ultimaActualizacion: "2024-01-12",
            powerBiUrl: "https://via.placeholder.com/600x400/ecfdf5/059669?text=Dashboard+KPIs",
        },
        {
            id: 9,
            nombre: "Pagos duplicados mismo monto y proveedor en el mismo mes",
            descripcion: "",
            estado: "Cumpliendo",
            ultimaActualizacion: "2024-01-12",
            powerBiUrl: "https://via.placeholder.com/600x400/ecfdf5/059669?text=Dashboard+KPIs",
        },
    ]

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
                                <p className="subtitle">Proceso de Compra</p>
                            </div>
                        </div>
                        <div className="last-update">{controles.length} controles activos</div>
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
                                <p className="stat-value">6</p>
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
                                <p className="stat-value">1</p>
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
                                <p className="stat-value">1</p>
                            </div>
                        </div>
                    </Card>


                </div>

                {/* Controls Grid */}
                <div className="controls-grid">
                    {controles.map((control) => (
                        <Card key={control.id} className="control-card">
                            <div className="card-header">
                                <div className="control-info">
                                    <div>
                                        <h3 className="control-title">
                                            <BarChart3 size={20} style={{ marginRight: "8px", color: "#2563eb" }} />
                                            {control.nombre}
                                        </h3>
                                        <p className="control-description">{control.descripcion}</p>
                                    </div>
                                    {getEstadoBadge(control.estado)}
                                </div>
                            </div>

                            <div className="card-content">
                                {/* Power BI Placeholder */}
                                <div className="powerbi-container">
                                    <img
                                        src={control.powerBiUrl || "/placeholder.svg"}
                                        alt={`Dashboard de ${control.nombre}`}
                                        className="powerbi-image"
                                    />
                                </div>

                                <div className="control-footer">
                                    <span className="last-update-text">
                                        Última actualización: {new Date(control.ultimaActualizacion).toLocaleDateString("es-ES")}
                                    </span>
                                    <button className="btn-outline">Ver Detalle</button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}

export default ProcesoPage