import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE = "https://backend-five-kappa-47.vercel.app";

export const fetchHabitsThunk = createAsyncThunk("habit/fetchHabits", async (token) => {
  const res = await fetch(`${BASE}/habits`, {
    headers: { Authorization: "Bearer " + token }
  });
  return res.json();
});

export const markAsDoneThunk = createAsyncThunk("habit/markAsDone", async ({ habitId, token }, { rejectWithValue }) => {
  const res = await fetch(`${BASE}/habits/markasdone/${habitId}`, {
    method: "PATCH",
    headers: { Authorization: "Bearer " + token }
  });
  const data = await res.json();
  if (data.message === "Habit marked as done") return "Habito marcado como hecho";
  if (data.message === "Habit restarted") return rejectWithValue(data.message);
  return rejectWithValue("Failed to mark habit as done");
});

export const fetchAddHabitThunk = createAsyncThunk("habit/fetchAddHabit", async ({ token, title, description }) => {
  const res = await fetch(`${BASE}/habits`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, description })
  });
  return res.json();
});

const habitsSlice = createSlice({
  name: "habits",
  initialState: {
    habits: [],
    status: {},
    error: {}
  },
  reducers: {
    addHabits: (state, action) => { state.habits = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabitsThunk.fulfilled, (state, action) => {
        state.habits = action.payload;
      })
      .addCase(markAsDoneThunk.fulfilled, (state, action) => {
        state.status[action.meta.arg.habitId] = "success";
        state.error[action.meta.arg.habitId] = null;
      })
      .addCase(markAsDoneThunk.rejected, (state, action) => {
        state.status[action.meta.arg.habitId] = "failed";
        state.error[action.meta.arg.habitId] = action.payload;
      })
      .addCase(fetchAddHabitThunk.fulfilled, (state, action) => {
        state.habits.push(action.payload);
      });
  }
});

export const { addHabits } = habitsSlice.actions;
export default habitsSlice.reducer;