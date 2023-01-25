import * as React from "react";
import LocationsProvider from "./LocationsProvider";
import CartProvider from "./CartProvider";

export interface ProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: ProviderProps) => {
  return (
    <LocationsProvider>
      <CartProvider>{children}</CartProvider>
    </LocationsProvider>
  );
};

export default AppProvider;
