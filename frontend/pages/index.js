import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHabits } from "../features/habitsSlice";
import { markAsDone } from "../features/habitsSlice";

export default function Home() {

  const dispatch = useDispatch();
  const habits = useSelector((state) => state.habits.habits);
  const days = habits.length > 0 ? habits[0].days : 0;
  const progress = Math.min(days * 10, 100);

  console.log("HBTS:", habits);

  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">

      <h1 className="text-4xl font-bold mb-10">
        HABITOS DE AJEDREZ
      </h1>

      <div className="w-full max-w-md space-y-4">

        {habits.map((habit) => (
          <div
            key={habit._id}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md"
          >
            <span className="font-medium">
              {habit.title} — {habit.days} dias
            </span>


            <button
              onClick={async () => {
                await fetch(`http://localhost:3001/api/habits/markasdone/${habit._id}`, {
                  method: "PATCH",
                });

                dispatch(fetchHabits());
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg"
            >
              LISTO
            </button>
          </div>
        ))}

      </div>

      <div className="w-full max-w-md mt-10">

        <p className="mb-3 font-semibold">
          PROGRESO DEL HABITO
        </p>

        <div style={{ background: "#00D9FF", height: "20px", width: "100%", borderRadius: "10px" }}>
          <div style={{ background: "#223AD4", height: "20px", width: '$(progress)%', borderRadius: "10px" }}></div>
        </div>

        <p className="text-sm mt-2 text-gray-600">
          {days} Dias de Racha
        </p>

      </div>

    </div>
  );
}