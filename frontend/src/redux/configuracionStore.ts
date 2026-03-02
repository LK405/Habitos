import { configureStore } from '@reduxjs/toolkit'; 
import manejadorHabitos from './slices/estadoHabitos';
//configurando el store central
export const storeGlobal = configureStore({
  reducer: { 
    habitos: manejadorHabitos,
  },
});
//tipos para que typescript no de problemas despues
export type RootState = ReturnType<typeof storeGlobal.getState>;
export type AppDispatch = typeof storeGlobal.dispatch;