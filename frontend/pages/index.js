import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHabitsThunk, markAsDoneThunk, fetchAddHabitThunk } from "../features/habitsSlice";
import { addUser, fetchLoginUserThunk, fetchRegisterUserThunk } from "../features/authSlice";

const calculateProgress = (days) => Math.min((days / 66) * 100, 100);

const glass = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "16px",
};

function ProgressBar({ days }) {
  const progress = calculateProgress(days);
  const color = progress < 30
    ? "linear-gradient(90deg, #ef4444, #f97316)"
    : progress < 60
    ? "linear-gradient(90deg, #f59e0b, #eab308)"
    : "linear-gradient(90deg, #22c55e, #10b981)";
  return (
    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "99px", height: "6px", width: "100%", marginTop: "8px" }}>
      <div style={{
        width: `${progress}%`,
        height: "6px",
        borderRadius: "99px",
        background: color,
        transition: "width 0.6s ease",
        boxShadow: "0 0 8px rgba(34,197,94,0.5)"
      }} />
    </div>
  );
}

function HabitList({ habits, user, dispatch }) {
  const { status } = useSelector((state) => state.habits);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title || !description) return;
    setLoading(true);
    await dispatch(fetchAddHabitThunk({ token: user, title, description }));
    await dispatch(fetchHabitsThunk(user));
    setTitle("");
    setDescription("");
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d1117 0%, #1a1f35 40%, #0d2137 100%)",
      padding: "2rem 1rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Círculos decorativos tipo Windows 11 */}
      <div style={{
        position: "fixed", top: "-150px", right: "-150px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", bottom: "-100px", left: "-100px",
        width: "350px", height: "350px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,197,94,0.2), transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{ maxWidth: "580px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>☄️</div>
          <h1 style={{
            color: "#fff", fontSize: "2.2rem", fontWeight: "800",
            margin: "0 0 0.25rem",
            textShadow: "0 0 30px rgba(99,102,241,0.5)"
          }}>
            Mis Hábitos
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
            {habits.length} hábito{habits.length !== 1 ? "s" : ""} registrado{habits.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Formulario */}
        <div style={{ ...glass, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <h2 style={{
            color: "rgba(255,255,255,0.5)", fontSize: "0.75rem",
            fontWeight: "700", letterSpacing: "0.12em",
            textTransform: "uppercase", marginBottom: "1rem"
          }}>
            ✦ Nuevo hábito
          </h2>
          <input
            type="text"
            placeholder="Nombre del hábito"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%", background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
              padding: "0.75rem 1rem", color: "#fff", fontSize: "0.95rem",
              marginBottom: "0.75rem", boxSizing: "border-box", outline: "none"
            }}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%", background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
              padding: "0.75rem 1rem", color: "#fff", fontSize: "0.95rem",
              marginBottom: "1rem", boxSizing: "border-box", outline: "none"
            }}
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", border: "none", borderRadius: "10px",
              padding: "0.75rem", fontWeight: "700", fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.4)",
              transition: "all 0.2s"
            }}
          >
            {loading ? "Agregando..." : "+ Agregar hábito"}
          </button>
        </div>

        {/* Lista */}
        {habits.length === 0 ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", marginTop: "4rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌿</div>
            <p>Aún no tienes hábitos registrados.</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>¡Agrega tu primer hábito arriba!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {habits.map((habit) => (
              <div key={habit._id} style={{ ...glass, padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, marginRight: "1rem" }}>
                    <h3 style={{ color: "#fff", fontWeight: "700", margin: "0 0 0.2rem", fontSize: "1rem" }}>
                      {habit.title}
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", margin: 0 }}>
                      {habit.description}
                    </p>
                    <ProgressBar days={habit.days} />
                    <p style={{ color: "rgb(246, 255, 255)", fontSize: "0.72rem", marginTop: "0.4rem" }}>
                      {habit.days} / 66 días
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      dispatch(markAsDoneThunk({ habitId: habit._id, token: user }));
                      dispatch(fetchHabitsThunk(user));
                    }}
                    style={{
                      background: status[habit._id] === "success"
                        ? "linear-gradient(135deg, #22c55e, #16a34a)"
                        : "linear-gradient(135deg, #3b82f6, #2563eb)",
                      color: "#fff", border: "none", borderRadius: "10px",
                      padding: "0.5rem 1rem", fontWeight: "600",
                      fontSize: "0.85rem", cursor: "pointer", whiteSpace: "nowrap",
                      boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
                      transition: "all 0.2s"
                    }}
                  >
                    {status[habit._id] === "success" ? "✓ Hecho" : "Marcar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d1117 0%, #1a1f35 40%, #0d2137 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", position: "relative", overflow: "hidden"
    }}>
      {/* Decoración */}
      <div style={{
        position: "fixed", top: "-200px", right: "-200px",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", bottom: "-150px", left: "-150px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,197,94,0.15), transparent 70%)",
        pointerEvents: "none"
      }} />

      {!user ? (
        <div style={{
          ...glass,
          padding: "2.5rem",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          position: "relative", zIndex: 1
        }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>☄️</div>
            <h1 style={{
              color: "#e2e8f0", fontSize: "1.8rem", fontWeight: "800",
              margin: "0 0 0.25rem",
              textShadow: "0 0 20px rgba(99,102,241,0.6)"
            }}>
              Hábitos
            </h1>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", margin: 0 }}>
              Inicia sesión para continuar
            </p>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontWeight: "600", display: "block", marginBottom: "0.4rem" }}>
              USUARIO
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%", background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
                padding: "0.75rem 1rem", color: "#fff", fontSize: "0.95rem",
                boxSizing: "border-box", outline: "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontWeight: "600", display: "block", marginBottom: "0.4rem" }}>
              CONTRASEÑA
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%", background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
                padding: "0.75rem 1rem", color: "#fff", fontSize: "0.95rem",
                boxSizing: "border-box", outline: "none"
              }}
            />
          </div>

          <button
            onClick={() => dispatch(fetchLoginUserThunk({ username, password }))}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", border: "none", borderRadius: "10px",
              padding: "0.85rem", fontWeight: "700", fontSize: "1rem",
              cursor: "pointer", marginBottom: "0.75rem",
              boxShadow: "0 4px 20px rgba(99,102,241,0.5)",
              transition: "all 0.2s"
            }}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => dispatch(fetchRegisterUserThunk({ username, password }))}
            style={{
              width: "100%",
              background: "transparent",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.4)",
              borderRadius: "10px",
              padding: "0.85rem", fontWeight: "700", fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Registrarse
          </button>
        </div>
      ) : (
        <HabitList habits={habits} user={user} dispatch={dispatch} />
      )}
    </div>
  );
}