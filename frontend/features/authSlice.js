import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE = "https://habitos-backend-y461.onrender.com";

export const fetchRegisterUserThunk = createAsyncThunk(
  "user/fetchRegisterUser",
  async ({ username, password }, { rejectWithValue }) => {
    const res = await fetch(`${BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue("Failed to register user");
    if (data.message === "Usuario registrado correctamente") return data.message;
    return rejectWithValue(data.message);
  }
);

export const fetchLoginUserThunk = createAsyncThunk(
  "user/fetchLoginUser",
  async ({ username, password }, { rejectWithValue }) => {
    const res = await fetch(`${BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue("Failed to login");
    if (data.message === "Inicio de sesión exitoso") return data.token;
    return rejectWithValue(data.message);
  }
);

const authSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    status: "idle",
    error: null
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUserThunk.fulfilled, (state) => {
        state.status = "success";
        state.user = null;
        alert("Usuario registrado correctamente");
      })
      .addCase(fetchRegisterUserThunk.rejected, (state) => {
        state.status = "failed";
        alert("No es posible registrar el usuario en este momento");
      })
      .addCase(fetchLoginUserThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
      })
      .addCase(fetchLoginUserThunk.rejected, (state) => {
        state.status = "failed";
        alert("No es posible iniciar sesión en este momento");
      });
  }
});

export const { addUser } = authSlice.actions;
export default authSlice.reducer;