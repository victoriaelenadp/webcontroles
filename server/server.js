// Servidor Express para manejar las API calls
const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")
const ExcelJS = require("exceljs")

const app = express()
const port = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Configuración de conexión PostgreSQL
const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "mev37nkpmg",
})

// Test de conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error conectando a PostgreSQL:", err.stack)
  } else {
    console.log("✅ Conectado a PostgreSQL exitosamente")
    release()
  }
})

// Ruta para obtener lista de tablas
app.get("/api/get-tables", async (req, res) => {
  try {
    console.log("📋 Obteniendo lista de tablas...")

    const result = await pool.query(`
      SELECT 
        t.table_name as nombre,
        COALESCE(
          (SELECT COUNT(*) FROM information_schema.columns 
           WHERE table_name = t.table_name AND table_schema = 'public'), 0
        ) as columnas
      FROM information_schema.tables t
      WHERE t.table_schema = 'public' 
      AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_name;
    `)

    // Obtener conteo de registros para cada tabla
    const tablasConConteo = []

    for (const tabla of result.rows) {
      try {
        const countResult = await pool.query(`SELECT COUNT(*) as count FROM "${tabla.nombre}"`)
        tablasConConteo.push({
          nombre: tabla.nombre,
          registros: Number.parseInt(countResult.rows[0].count) || 0,
          columnas: Number.parseInt(tabla.columnas) || 0,
        })
      } catch (error) {
        console.warn(`⚠️ No se pudo contar registros de tabla ${tabla.nombre}:`, error.message)
        tablasConConteo.push({
          nombre: tabla.nombre,
          registros: 0,
          columnas: Number.parseInt(tabla.columnas) || 0,
        })
      }
    }

    console.log(`✅ Encontradas ${tablasConConteo.length} tablas`)

    res.json({
      tablas: tablasConConteo,
      total: tablasConConteo.length,
    })
  } catch (error) {
    console.error("❌ Error obteniendo tablas:", error)
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    })
  }
})

// Ruta para exportar base de datos
app.post("/api/export-database", async (req, res) => {
  try {
    console.log("🚀 Iniciando exportación de base de datos...")

    const { tablas, formato = "completo" } = req.body

    // Obtener lista de tablas si no se especifica
    let tablasAExportar = tablas
    if (!tablasAExportar || tablasAExportar.length === 0) {
      const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `)
      tablasAExportar = result.rows.map((row) => row.table_name)
    }

    console.log(`📊 Exportando ${tablasAExportar.length} tablas:`, tablasAExportar)

    // Crear workbook de Excel
    const workbook = new ExcelJS.Workbook()
    workbook.creator = "Sistema de Procesos"
    workbook.created = new Date()

    let totalRegistros = 0
    let tablasExportadas = 0

    // Exportar cada tabla
    for (const nombreTabla of tablasAExportar) {
      try {
        console.log(`📋 Procesando tabla: ${nombreTabla}`)

        // Obtener datos de la tabla
        const result = await pool.query(`SELECT * FROM "${nombreTabla}"`)
        const datos = result.rows

        if (datos.length === 0) {
          console.log(`⚠️ Tabla ${nombreTabla} está vacía`)
          // Crear hoja vacía
          const worksheet = workbook.addWorksheet(nombreTabla.substring(0, 31))
          worksheet.addRow(["Sin datos"])
          continue
        }

        // Crear hoja de trabajo
        const worksheet = workbook.addWorksheet(nombreTabla.substring(0, 31))

        // Obtener columnas
        const columnas = Object.keys(datos[0])

        // Configurar columnas
        worksheet.columns = columnas.map((col) => ({
          header: col.toUpperCase(),
          key: col,
          width: 15,
        }))

        // Estilo del header
        const headerRow = worksheet.getRow(1)
        headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } }
        headerRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4472C4" },
        }

        // Agregar datos
        datos.forEach((fila) => {
          // Convertir valores para evitar errores
          const filaLimpia = {}
          Object.keys(fila).forEach((key) => {
            let valor = fila[key]
            if (valor === null || valor === undefined) {
              valor = ""
            } else if (typeof valor === "object") {
              valor = JSON.stringify(valor)
            }
            filaLimpia[key] = valor
          })
          worksheet.addRow(filaLimpia)
        })

        // Auto-ajustar columnas
        worksheet.columns.forEach((column) => {
          let maxLength = 0
          column.eachCell({ includeEmpty: true }, (cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 10
            if (columnLength > maxLength) {
              maxLength = columnLength
            }
          })
          column.width = Math.min(maxLength + 2, 50)
        })

        totalRegistros += datos.length
        tablasExportadas++
        console.log(`✅ Tabla ${nombreTabla}: ${datos.length} registros`)
      } catch (error) {
        console.error(`❌ Error procesando tabla ${nombreTabla}:`, error.message)

        // Crear hoja con error
        const worksheet = workbook.addWorksheet(`ERROR_${nombreTabla}`.substring(0, 31))
        worksheet.addRow(["Error al procesar tabla"])
        worksheet.addRow([error.message])
        continue
      }
    }

    // Generar buffer del archivo Excel
    console.log("📦 Generando archivo Excel...")
    const buffer = await workbook.xlsx.writeBuffer()

    // Configurar headers para descarga
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const filename = `base_datos_${timestamp}.xlsx`

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
    res.setHeader("Content-Length", buffer.length)

    console.log(`✅ Exportación completada:`)
    console.log(`   - Tablas exportadas: ${tablasExportadas}`)
    console.log(`   - Total registros: ${totalRegistros}`)
    console.log(`   - Archivo: ${filename}`)

    // Enviar archivo
    res.send(buffer)
  } catch (error) {
    console.error("❌ Error en exportación:", error)
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    })
  }
})

// Ruta de prueba
app.get("/api/test", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente", timestamp: new Date() })
})

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`)
  console.log(`📡 API disponible en http://localhost:${port}/api/`)
})
