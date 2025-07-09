"""
Script para exportar tablas de PostgreSQL a Excel
Ejecuta este script para generar archivos Excel de las tablas
"""

import psycopg2
import pandas as pd
import os
from datetime import datetime

# Configuración de conexión
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'dbname': 'postgres',
    'user': 'postgres',
    'password': 'mev37nkpmg'
}

def conectar_db():
    """Establece conexión con la base de datos"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        print("✅ Conexión exitosa a PostgreSQL")
        return conn
    except Exception as e:
        print(f"❌ Error conectando a la base de datos: {e}")
        return None

def obtener_tablas():
    """Obtiene lista de todas las tablas en la base de datos"""
    conn = conectar_db()
    if not conn:
        return []
    
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        """)
        
        tablas = [tabla[0] for tabla in cursor.fetchall()]
        print(f"📋 Tablas encontradas: {tablas}")
        return tablas
        
    except Exception as e:
        print(f"❌ Error obteniendo tablas: {e}")
        return []
    finally:
        conn.close()

def exportar_tabla_a_excel(nombre_tabla, ruta_salida=None):
    """Exporta una tabla específica a Excel"""
    conn = conectar_db()
    if not conn:
        return False
    
    try:
        # Leer tabla completa
        df = pd.read_sql_query(f"SELECT * FROM {nombre_tabla}", conn)
        
        # Crear directorio si no existe
        if not ruta_salida:
            ruta_salida = "exports"
        
        os.makedirs(ruta_salida, exist_ok=True)
        
        # Generar nombre de archivo con timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        nombre_archivo = f"{nombre_tabla}_{timestamp}.xlsx"
        ruta_completa = os.path.join(ruta_salida, nombre_archivo)
        
        # Exportar a Excel
        df.to_excel(ruta_completa, index=False, engine='openpyxl')
        
        print(f"✅ Tabla '{nombre_tabla}' exportada a: {ruta_completa}")
        print(f"📊 Registros exportados: {len(df)}")
        
        return ruta_completa
        
    except Exception as e:
        print(f"❌ Error exportando tabla '{nombre_tabla}': {e}")
        return False
    finally:
        conn.close()

def exportar_todas_las_tablas():
    """Exporta todas las tablas a archivos Excel separados"""
    tablas = obtener_tablas()
    
    if not tablas:
        print("❌ No se encontraron tablas para exportar")
        return
    
    print(f"🚀 Iniciando exportación de {len(tablas)} tablas...")
    
    resultados = []
    for tabla in tablas:
        resultado = exportar_tabla_a_excel(tabla)
        if resultado:
            resultados.append(resultado)
    
    print(f"\n✅ Exportación completada!")
    print(f"📁 Archivos generados: {len(resultados)}")
    for archivo in resultados:
        print(f"   - {archivo}")

def exportar_tablas_a_un_archivo():
    """Exporta todas las tablas a un solo archivo Excel con múltiples hojas"""
    conn = conectar_db()
    if not conn:
        return False
    
    tablas = obtener_tablas()
    if not tablas:
        print("❌ No se encontraron tablas para exportar")
        return False
    
    try:
        # Crear directorio
        os.makedirs("exports", exist_ok=True)
        
        # Generar nombre de archivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        nombre_archivo = f"base_datos_completa_{timestamp}.xlsx"
        ruta_completa = os.path.join("exports", nombre_archivo)
        
        # Crear writer de Excel
        with pd.ExcelWriter(ruta_completa, engine='openpyxl') as writer:
            total_registros = 0
            
            for tabla in tablas:
                try:
                    # Leer tabla
                    df = pd.read_sql_query(f"SELECT * FROM {tabla}", conn)
                    
                    # Escribir a hoja (máximo 31 caracteres para nombre de hoja)
                    nombre_hoja = tabla[:31] if len(tabla) > 31 else tabla
                    df.to_excel(writer, sheet_name=nombre_hoja, index=False)
                    
                    total_registros += len(df)
                    print(f"✅ Tabla '{tabla}': {len(df)} registros")
                    
                except Exception as e:
                    print(f"⚠️  Error con tabla '{tabla}': {e}")
                    continue
        
        print(f"\n✅ Base de datos completa exportada a: {ruta_completa}")
        print(f"📊 Total de registros: {total_registros}")
        print(f"📋 Tablas incluidas: {len(tablas)}")
        
        return ruta_completa
        
    except Exception as e:
        print(f"❌ Error en exportación completa: {e}")
        return False
    finally:
        conn.close()

# Ejecutar exportación
if __name__ == "__main__":
    print("🔄 Iniciando exportación de base de datos PostgreSQL...")
    
    # Opción 1: Exportar cada tabla a un archivo separado
    # exportar_todas_las_tablas()
    
    # Opción 2: Exportar todas las tablas a un solo archivo
    exportar_tablas_a_un_archivo()
