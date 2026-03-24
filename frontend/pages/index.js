import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { fetchHabitsThunk, markAsDoneThunk, fetchAddHabitThunk } from "../features/habitsSlice";
import { addUser, fetchLoginUserThunk, fetchRegisterUserThunk } from "../features/authSlice";

const calculateProgress = (days) => Math.min((days / 66) * 100, 100);

function HabitList({ habits, user, dispatch }) {
  const { status, error } = useSelector((state) => state.habits);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (title && description) {
      dispatch(fetchAddHabitThunk({ token: user, title, description }));
      setTitle("");
      setDescription("");
      dispatch(fetchHabitsThunk(user));
    }
  };

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-black">Habits</h1>
      <ul className="space-y-4">
        {habits.length > 0 ? habits.map((habit) => (
          <li className="flex items-center justify-between mt-2" key={habit._id}>
            <span className="text-black">{habit.title}</span>
            <div className="flex items-center space-x-2">
              <progress className="w-24" value={calculateProgress(habit.days)} max="100"></progress>
              <button
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded"
                onClick={() => {
                  dispatch(markAsDoneThunk({ habitId: habit._id, token: user }));
                  dispatch(fetchHabitsThunk(user));
                }}
              >
                {status[habit._id] === "loading" ? "Processing" : "Mark as Done"}
              </button>
              {status[habit._id] === "failed" && <span className="text-red-500">{error[habit._id]}</span>}
              {status[habit._id] === "success" && <span className="text-green-500">Already marked!</span>}
            </div>
          </li>
        )) : <li className="text-gray-500">No habits available.</li>}
      </ul>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-black">Agrega un habito nuevo</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black" />
        </div>
        <button onClick={handleAdd} className="px-4 py-2 bg-green-500 text-white rounded-md">Add</button>
      </div>
    </div>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  const habits = useSelector((state) => state.habits.habits);
  const user = useSelector((state) => state.user.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Leer token de cookie si existe
    const cookies = document.cookie.split(";").reduce((acc, c) => {
      const [k, v] = c.trim().split("=");
      acc[k] = v;
      return acc;
    }, {});
    const token = cookies["habitToken"];
    if (token) dispatch(addUser(token));
  }, []);

  useEffect(() => {
    if (user) dispatch(fetchHabitsThunk(user));
  }, [user]);

  const handleLogin = () => dispatch(fetchLoginUserThunk({ username, password }));
  const handleRegister = () => dispatch(fetchRegisterUserThunk({ username, password }));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      {!user ? (
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Ingresar / Registro</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contraseña </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-black" />
          </div>
          <div className="flex space-x-4">
            <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded-md">Login</button>
            <button onClick={handleRegister} className="px-4 py-2 bg-green-500 text-white rounded-md">Registrarse</button>
          </div>
        </div>
      ) : (
        <HabitList habits={habits} user={user} dispatch={dispatch} />
      )}
    </div>
  );
}