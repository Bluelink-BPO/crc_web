"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, Search, Sparkles, Zap, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import axios from 'axios';
import CSVReader from 'react-csv-reader';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

// Componente de partículas flotantes
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => i)
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const NUM_PARTICLES = 20;

  useEffect(() => {
    const newPositions = Array.from({ length: NUM_PARTICLES }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setPositions(newPositions);
  }, []);



  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {positions.map((pos, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
          initial={{
            x: pos.x,
            y: pos.y,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// Componente de ondas animadas de fondo
const AnimatedWaves = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-red-400/10 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"
        animate={{
          x: [-50, 50, -50],
          y: [-30, 30, -30],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}




// Marcas de agua
const WatermarkElements = () => {


  type WatermarkProps = {
    x: number;
    y: number;
    delay: number;
    duration: number;
  };


  const [positions, setPositions] = useState<WatermarkProps[]>([]);

  useEffect(() => {
    // Solo se ejecuta en el cliente
    const generated = Array.from({ length: 8 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: Math.random() * 5,
      duration: Math.random() * 20 + 15,
    }));
    setPositions(generated);
  }, []);


  return (
    <>
      {/* Marca de agua principal */}
      <div className="fixed bottom-4 right-4 pointer-events-none z-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-right"
        >
          <div className="text-xs font-bold text-gray-400 mb-1">JsvrDev | JormanDev</div>
          <div className="text-[10px] text-gray-300">Full Stack Developer</div>
        </motion.div>
      </div>

      {/* Marca de agua lateral */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none z-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ delay: 3, duration: 1 }}
          className="text-xs font-light text-gray-300 tracking-widest"
        >
          JSVRDEV • JORMANDEV • JSVRDEV • JORMANDEV
        </motion.div>
      </div>

      {/* Marca de agua en el centro (muy sutil) */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-30">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ delay: 4, duration: 2 }}
          className="text-6xl md:text-8xl font-black text-gray-400 select-none"
          style={{ transform: "rotate(-15deg)" } as any}
        >
          JSvrDev
        </motion.div>
      </div>

      {/* Marcas de agua flotantes */}
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none z-20 text-[10px] text-gray-200 font-light select-none"
          initial={{
            opacity: 0,
            x: pos.x,
            y: pos.y,
          }}
          animate={{
            opacity: [0, 0.05, 0],
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: pos.duration,
            repeat: Infinity,
            delay: pos.delay,
          }}
        >
          JormanDev
        </motion.div>
      ))}
    </>
  );
}

// Componente principal
export default function CRCConsultaApp() {
  const [archivo, setArchivo] = useState<string[][]>([]);
  const [tipoConsulta, setTipoConsulta] = useState("")
  const [cargando, setCargando] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [archivoNombre, setArchivoNombre] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const [token, setToken] = useState('');
  const [tokenCargado, setTokenCargado] = useState(false);

  const [mostrarModalToken, setMostrarModalToken] = useState(false);
  const [nuevoToken, setNuevoToken] = useState('');
  const [reintentarConsulta, setReintentarConsulta] = useState(false);


  useEffect(() => {
    const cargarTokenDesdeAPI = async () => {
      try {
        const response = await fetch('/api/token');
        const nuevoToken = await response.text();
        setToken(nuevoToken.trim());
        setTokenCargado(true);
      } catch (error) {
        console.error("Error al obtener token:", error);
      }
    };

    cargarTokenDesdeAPI();
  }, []);



  const actualizarTokenEnGitHub = async () => {
    try {
      // Paso 1: guardar token temporal
      const guardarTemp = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoToken }),
      });

      if (!guardarTemp.ok) {
        mostrarError("No se pudo guardar el token temporal.");
        return;
      }

      // Paso 2: subir a GitHub (esto es opcional)
      await fetch('/api/actualizar-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoToken }),
      });

      // Paso 3: cerrar modal y limpiar
      setMostrarModalToken(false);
      setNuevoToken('');

      // Paso 4: ESPERA antes de llamar enviarSolicitud
      setTimeout(() => {
        enviarSolicitud(); // 👈 asegúrate de que se llama después
      }, 200); // pequeño delay opcional

    } catch (err) {
      console.error("Error al actualizar token:", err);
      mostrarError("Error técnico al guardar el token.");
    }
  };






  const enviarSolicitudConToken = async (tokenActual: string) => {
    setCargando(true);

    try {
      const partes = dividirArchivoCSV(archivo);
      const todasRespuestas: any[] = [];

      for (const parte of partes) {
        const keys = parte.map((row) => row[0]);

        const consulta = await axios.post(
          "https://tramitescrcom.gov.co/excluidosback/consultaMasiva/validarExcluidos",
          {
            type: tipoConsulta,
            keys,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenActual}`,
            },
          }
        );

        todasRespuestas.push(...consulta.data);
      }

      guardarEnExcel(todasRespuestas);
      mostrarExito();

    } catch (error: any) {
      console.error("Error al consultar:", error);

      if (error.response?.status === 403) {
        setMostrarModalToken(true);
      } else {
        mostrarError("Error en la consulta. Revisa los campos o recarga la página.");
      }
    } finally {
      setCargando(false);
    }
  };






  // 📌 Movimiento del mouse 
  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  // 📁 Carga del archivo CSV
  const handleFileLoad = (data: any) => {
    setArchivo(data);
    setArchivoNombre("archivo_cargado.csv");
  };

  // ⬇️ Cambio del tipo de consulta (ComboBox)
  const handleComboChange = (value: string) => {
    setTipoConsulta(value);
  };

  // 🔐 Verifica si el token expiró
  function estaExpirado(token: string) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const ahora = Math.floor(Date.now() / 1000);
      return payload.exp < ahora;
    } catch (error) {
      console.log("🧪 Token recibido desde GitHub:", token);
      console.error("Token inválido o corrupto:", error);
      return true;
    }
  }

  // ⛔ Mostrar error en el frontend
  const mostrarError = (mensaje: string) => {
    setErrorMessage(mensaje);
    setShowError(true);
    setTimeout(() => setShowError(false), 4000);
  };

  // ✅ Mostrar éxito en el frontend
  const mostrarExito = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  // 🚀 Enviar solicitud al backend y guardar Excel
  const enviarSolicitud = async () => {
    if (!archivo.length) {
      mostrarError("Debes seleccionar un archivo");
      return;
    }

    if (!tipoConsulta) {
      mostrarError("Debes seleccionar un tipo de consulta");
      return;
    }

    setCargando(true);

    try {
      // 🔁 Cache buster para evitar usar un token viejo
      const response = await fetch(`/api/token?nocache=${Date.now()}`);
      const tokenActual = (await response.text()).trim();

      // Verifica si el token es válido
      if (!tokenActual || estaExpirado(tokenActual)) {
        setMostrarModalToken(true);
        setCargando(false);
        return;
      }

      const partes = dividirArchivoCSV(archivo);
      const todasRespuestas: any[] = [];

      for (const parte of partes) {
        const keys = parte.map((row) => row[0]);

        const consulta = await axios.post(
          "https://tramitescrcom.gov.co/excluidosback/consultaMasiva/validarExcluidos",
          {
            type: tipoConsulta,
            keys,
          },
          {
            headers: {
              Authorization: `Bearer ${tokenActual}`,
            },
          }
        );

        todasRespuestas.push(...consulta.data);
      }

      guardarEnExcel(todasRespuestas);
      mostrarExito();

    } catch (error: any) {
      console.error("Error al consultar:", error);

      if (error.response?.status === 403) {
        setMostrarModalToken(true); // Token posiblemente inválido
      } else {
        mostrarError("Error en la consulta. Revisa los campos o recarga la página.");
      }
    } finally {
      setCargando(false);
    }
  };



  // 📤 Guardar en Excel con validación defensiva
  const guardarEnExcel = (respuestas: any) => {
    console.log("Intentando exportar", respuestas);

    if (!respuestas.length) {
      alert("Sin datos para exportar");
      return;
    }

    const datos = respuestas.map((respuesta: any) => ({
      Número: respuesta.llave ?? '',
      Tipo: respuesta.tipo ?? '',
      SMS: respuesta.opcionesContacto?.sms ?? '',
      Llamadas: respuesta.opcionesContacto?.llamada ?? '',
      Aplicaciones: respuesta.opcionesContacto?.aplicacion ?? '',
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Respuestas");

    const nombreArchivo = `resultado_excluidos_${new Date().toISOString().slice(0, 10)}.xlsx`;
    console.log("Descargando:", nombreArchivo);
    XLSX.writeFile(wb, nombreArchivo); // 👈 Esto dispara la descarga
  };


  // 🔄 Divide el CSV en partes
  const dividirArchivoCSV = (data: any[], tamañoParte = 10000) => {
    const partes = [];
    for (let i = 0; i < data.length; i += tamañoParte) {
      partes.push(data.slice(i, i + tamañoParte));
    }
    return partes;
  };

  // 📥 Carga manual desde input file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setArchivoNombre(file.name);

    Papa.parse(file, {
      complete: (result) => {
        const data = result.data as string[][];

        // Limpia filas vacías (por ejemplo, si hay filas en blanco)
        const limpio = data.filter((row) => row[0]);

        setArchivo(limpio);
      },
      error: (error) => {
        console.error("Error al leer el archivo CSV:", error);
        mostrarError("No se pudo leer el archivo CSV."); // ✅ usa tu sistema
      },
    });
  };



  return (
    <div
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50"
      onMouseMove={handleMouseMove}
    >
      {/* Efectos de fondo */}
      <AnimatedWaves />
      <FloatingParticles />
      <WatermarkElements />

      {/* Efecto de cursor personalizado */}
      <motion.div
        className="fixed w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      />

      {/* Contenedor principal */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header compacto con logos */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          {/* Barra superior con logos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center gap-6 mb-6 flex-wrap"
          >
            {/* Logo Bluelink */}
            <motion.img
              src="/bluelink_logo.png"
              alt="Bluelink BPO"
              className="h-10 md:h-12 drop-shadow-lg"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Separador */}
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

            {/* Logo CRC */}
            <motion.img
              src="/CRC_logo.png"
              alt="CRC"
              className="h-10 md:h-12 drop-shadow-lg"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Separador */}
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

            {/* Robot mascota compacto */}
            <motion.img
              src="/linky_3.png"
              alt="Linky Robot"
              className="h-12 md:h-14 drop-shadow-lg"
              whileHover={{
                scale: 1.2,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.4 },
              }}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Título principal más compacto */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 bg-clip-text text-transparent mb-2"
          >
            Consulta de Excluidos CRC
          </motion.h1>

          {/* Subtítulo compacto */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-gray-600 text-sm md:text-base mb-4"
          >
            Sistema de consultas masivas - Comisión de Regulación de Comunicaciones
          </motion.p>
        </motion.div>

        {/* Alertas animadas */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed top-4 right-4 z-50"
            >
              <Alert className="bg-green-50 border-green-200 text-green-800 shadow-lg">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  ¡Consulta realizada exitosamente! Archivo descargado.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed top-4 right-4 z-50"
            >
              <Alert className="bg-red-50 border-red-200 text-red-800 shadow-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">{errorMessage}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulario principal */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-2xl relative">
            <CardContent className="p-8">
              {/* Sección de carga de archivo */}
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  <FileText className="inline w-5 h-5 mr-2" />
                  Cargar archivo CSV
                </label>

                <motion.div
                  className="relative border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-gradient-to-br from-blue-50/50 to-cyan-50/50 hover:from-blue-100/50 hover:to-cyan-100/50 transition-all duration-300"
                  whileHover={{
                    borderColor: "#3b82f6",
                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.15)",
                  }}
                >
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <motion.div animate={archivoNombre ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.3 }}>
                    <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                    {archivoNombre ? (
                      <div className="text-green-600 font-medium">
                        <CheckCircle className="inline w-5 h-5 mr-2" />
                        {archivoNombre}
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600 font-medium mb-2">Arrastra tu archivo CSV aquí</p>
                        <p className="text-sm text-gray-500">o haz clic para seleccionar</p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Selector de tipo de consulta */}
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-4">
                  <Search className="inline w-5 h-5 mr-2" />
                  Tipo de consulta
                </label>

                <Select value={tipoConsulta} onValueChange={handleComboChange}>
                  <SelectTrigger className="h-14 text-lg bg-white/80 border-gray-200 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Seleccione el tipo de consulta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COR" className="text-lg py-3">
                      📧 Correo electrónico
                    </SelectItem>
                    <SelectItem value="TEL" className="text-lg py-3">
                      📱 Número telefónico
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Botón de consulta */}
              <motion.div className="text-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={enviarSolicitud}
                  disabled={cargando}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
                >
                  <AnimatePresence mode="wait">
                    {cargando ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                        />
                        Procesando consulta...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <Zap className="w-6 h-6 mr-3" />
                        Realizar Consulta
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>

              {/* Información adicional */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100"
              >
                <div className="flex items-center text-sm text-gray-600">
                  <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Sistema confiable para consultas masivas de la CRC | Bluelink BPO</span>
                </div>
              </motion.div>
            </CardContent>
            {/* Marca de agua en el formulario */}
            <div className="absolute top-2 right-2 pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-[10px] text-gray-400 font-medium"
              >
                JSvrDev
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Footer con marca personal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-100">

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-sm font-semibold shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>JsvrDev | JormanDev</span>
              <Zap className="w-4 h-4" />
            </motion.div>
            <p className="text-xs text-gray-500 mt-2">© 2025 | Bluelink BPO - Todos los derechos reservados</p>
          </div>
        </motion.div>
      </div>


      {mostrarModalToken && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-xl max-w-md w-full"
          >
            <h2 className="text-xl font-bold text-blue-700 mb-4">🔐 Token expirado</h2>

            <p className="text-gray-700 mb-4 text-sm">
              Tu token ha expirado o no tiene permisos. Ingresa uno nuevo para continuar con la consulta.
            </p>

            <input
              type="text"
              value={nuevoToken}
              onChange={(e) => setNuevoToken(e.target.value)}
              placeholder="Pega aquí el nuevo token"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-sm"
            />

            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={actualizarTokenEnGitHub}
              >
                Actualizar token
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}


    </div>
  )
}
