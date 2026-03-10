import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  habits: [
    { id: 1, name: "Practicar apertura italiana" },
    { id: 2, name: "Practicar gambito de dama" },
    { id: 3, name: "Practicar estrategia medio juego" },
    { id: 4, name: "Practicar finales basicos" },
    { id: 5, name: "Resolver puzzles tacticos" }
  ]
};

const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {}
});

export default habitsSlice.reducer;