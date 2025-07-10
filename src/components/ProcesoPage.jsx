"use client"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, BarChart3, CheckCircle, AlertCircle, TrendingUp, FileSpreadsheet, Download } from "lucide-react"

import Card from "./ui/Card"
import Badge from "./ui/Badge"
import control1 from "../assets/images/control1.png";
import control2 from "../assets/images/control2.png";
import control5 from "../assets/images/control5.png";
import control6 from "../assets/images/control6.png";
import control8 from "../assets/images/control8.png";


const ProcesoPage = () => {
    const { id } = useParams()

    const controles = [
        {
            id: 1,
            nombre: "Pago sin Factura",
            descripcion: "",
            estado: "Cumpliendo",
            ultimaActualizacion: "2024-01-15",
            powerBiUrl: control1,
        },
        {
            id: 2,
            nombre: "Proveedor no homologado",
            descripcion: "",
            estado: "Atención",
            ultimaActualizacion: "2024-01-15",
            powerBiUrl: control2,
        },
        {
            id: 3,
            nombre: "Pedido sin solicitud de gasto",
            descripcion: "",
            estado: "Cumpliendo",
            ultimaActualizacion: "2024-01-14",
            powerBiUrl: control8,
        },
        {
            id: 4,
            nombre: "Factura sin pedido asociado",
            descripcion: "",
            estado: "Cumpliendo",
            ultimaActualizacion: "2024-01-14",
            powerBiUrl: control1,
        },
        {
            id: 5,
            nombre: "Monto del pago mayor al monto de la factura",
            descripcion: "",
            estado: "Crítico",
            ultimaActualizacion: "2024-01-13",
            powerBiUrl: control5,
        },
        {
            id: 6,
            nombre: "Monto del pedido mayor al monto solicitado",
            descripcion: "",
            estado: "Cumpliendo",
            ultimaActualizacion: "2024-01-13",
            powerBiUrl: control6,
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
            powerBiUrl: control8,
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
                                        src={control.powerBiUrl}
                                        alt={`Dashboard de ${control.nombre}`}
                                        className="powerbi-image"
                                        onError={() => console.error(`Error cargando imagen de ${control.nombre}`)}
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

                {/* Exportar Datos a Excel */}


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