import { useSelector } from "react-redux";

export default function Home() {

  const habits = useSelector((state) => state.habits.habits);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">

      <h1 className="text-4xl font-bold mb-10">
        HABITOS DE AJEDREZ
      </h1>

      <div className="w-full max-w-md space-y-4">

        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md"
          >
            <span className="font-medium">{habit.name}</span>

            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg">
              LISTO
            </button>
          </div>
        ))}

      </div>

      {/* BARRA DE PROGRESO 2 */}

<div className="w-full max-w-md mt-10">

  <p className="mb-3 font-semibold">
    PROGRESO DEL HABITO
  </p>

  <div style={{background:"#00D9FF", height:"20px", width:"100%", borderRadius:"10px"}}>

    <div style={{background:"#223AD4", height:"20px", width:"40%", borderRadius:"10px"}}></div>

  </div>

  <p className="text-sm mt-2 text-gray-600">
    40% completado
  </p>

</div>

    </div>
  );
}