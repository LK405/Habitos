import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Habito {
  _id: string;
  nombre: string;
  conteo: number;
}

interface EstadoHabitos {
  lista: Habito[];
  cargando: boolean;
}

const estadoInicial: EstadoHabitos = {
  lista: [],
  cargando: false,
};

export const sliceHabitos = createSlice({
  name: 'habitos',
  initialState: estadoInicial,
  reducers: {
    empezarCarga: (state) => {
      state.cargando = true;
    },
    cargarHabitos: (state, action: PayloadAction<Habito[]>) => {
      state.lista = action.payload;
      state.cargando = false;
    },
    // agregamos esta funcion para meter el nuevo habito a la lista
    agregarHabito: (state, action: PayloadAction<Habito>) => {
      state.lista.push(action.payload);
    },
  },
});

export const { empezarCarga, cargarHabitos, agregarHabito } = sliceHabitos.actions;
export default sliceHabitos.reducer;