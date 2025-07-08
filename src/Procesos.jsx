// src/Procesos.jsx
export default function Procesos() {
    const procesos = ['Compras', 'Ventas', 'RRHH'];
    const controles = [
        { nombre: 'Control 1 - Duplicados', imagen: '/powerbi/c1.png' },
        { nombre: 'Control 2 - Pagos sin factura', imagen: '/powerbi/c2.png' },
        { nombre: 'Control 3 - Tiempos de aprobación', imagen: '/powerbi/c3.png' }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-60 bg-white shadow-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Procesos</h2>
                <ul className="space-y-2">
                    {procesos.map((p) => (
                        <li key={p} className="cursor-pointer text-blue-600 hover:underline">
                            {p}
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Controles del Proceso de Compras</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {controles.map((control, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-md overflow-hidden">
                            <div className="p-4 border-b">
                                <h3 className="text-lg font-semibold text-gray-700">{control.nombre}</h3>
                            </div>
                            <img
                                src={control.imagen}
                                alt={control.nombre}
                                className="w-full h-60 object-cover"
                            />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
