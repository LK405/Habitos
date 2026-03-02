"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/redux/configuracionStore";
import { empezarCarga, cargarHabitos, agregarHabito } from "@/src/redux/slices/estadoHabitos";

export default function Home() {
  const dispatch = useDispatch();
  const { lista, cargando } = useSelector((state: RootState) => state.habitos);
  
  // estados locales para el formulario
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const obtenerDatos = async () => {
      dispatch(empezarCarga());
      try {
        const respuesta = await fetch("http://localhost:5000/habitos"); 
        const datos = await respuesta.json();
        dispatch(cargarHabitos(datos));
      } catch (error) {
        console.log("error al traer datos", error);
      }
    };
    obtenerDatos();
  }, [dispatch]);

  // funcion para enviar el nuevo habito al backend
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    try {
      const respuesta = await fetch("http://localhost:5000/habitos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, conteo: 1 }), // empezamos en dia 1
      });
      const nuevo = await respuesta.json();
      dispatch(agregarHabito(nuevo)); // lo metemos a redux
      setNombre(""); // limpiamos el cuadrito
    } catch (error) {
      console.log("error al guardar", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50 text-slate-900 font-sans">
      <div className="max-w-4xl w-full">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-2">mis habitos de ajedrez</h1>
          <p className="text-slate-600">metas de 66 dias para ser un pro.</p>
        </header>

        {/* --- FORMULARIO NUEVO --- */}
        <section className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={manejarEnvio} className="flex gap-4">
            <input 
              type="text" 
              placeholder="escribe un nuevo habito..." 
              className="flex-1 p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
              añadir
            </button>
          </form>
        </section>

        {/* --- LISTA DE HABITOS --- */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">seguimiento actual</h2>
          <div className="space-y-6">
            {cargando && <p>buscando en la base de datos...</p>}
            {lista.map((habito) => (
              <div key={habito._id} className="p-5 border border-slate-100 rounded-xl bg-slate-50">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{habito.nombre}</h3>
                    <p className="text-sm text-slate-500">dia {habito.conteo} de 66</p>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${habito.conteo > 40 ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${(habito.conteo / 66) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}