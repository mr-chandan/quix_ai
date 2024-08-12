// src/context/GlobalStateContext.tsx
"use client";

import React, { createContext, useState, ReactNode } from 'react';

interface GlobalStateContextType {
  dataUpdated: boolean;
  setDataUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  const [dataUpdated, setDataUpdated] = useState(false);

  return (
    <GlobalStateContext.Provider value={{ dataUpdated, setDataUpdated }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
