 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Obtener hábitos
export const fetchHabits = createAsyncThunk(
  "habits/fetchHabits",
  async () => {
    const res = await fetch("http://localhost:3001/api/habits");
    return res.json();
  }
);

// Marcar como hecho
export const markAsDone = createAsyncThunk(
  "habits/markAsDone",
  async (id) => {
    await fetch(
      `http://localhost:3001/api/habits/markasdone/${id}`,
      {
        method: "PATCH",
      }
    );

    return id;
  }
);

const habitsSlice = createSlice({
  name: "habits",
  initialState: {
    habits: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.habits = action.payload;
      })
      .addCase(markAsDone.fulfilled, () => {
         
      });
  },
});

export default habitsSlice.reducer;