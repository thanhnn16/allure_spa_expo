// src/context/ConfirmationContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';
import { ConfirmationResult } from 'firebase/auth';

interface ConfirmationContextProps {
  confirmation: ConfirmationResult | null;
  setConfirmation: (confirmation: ConfirmationResult | null) => void;
}

const ConfirmationContext = createContext<ConfirmationContextProps>({
  confirmation: null,
  setConfirmation: () => {},
});


export const confirmOtp = async (confirmation: ConfirmationResult, otpValue: string) => {
  return await confirmation.confirm(otpValue);
};


export const ConfirmationProvider = ({ children }: { children: ReactNode }) => {
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  return (
    <ConfirmationContext.Provider value={{ confirmation, setConfirmation }}>
      {children}
    </ConfirmationContext.Provider>
  );
};


export const useConfirmation = () => useContext(ConfirmationContext);
