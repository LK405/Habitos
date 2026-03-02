"use client";

import { Provider } from "react-redux"; 
import { storeGlobal } from "./configuracionStore";

//este componente envuelve a toda la app para que todos tengan acceso al estado
export default function ProveedorRedux({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={storeGlobal}>
      {children}
    </Provider>
  );
}