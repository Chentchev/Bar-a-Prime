import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const ConfigContext = createContext(null);

// Valeurs par defaut le temps que /api/config reponde, pour eviter un ecran
// vide ou des divergences visibles au premier rendu.
const DEFAULT_CONFIG = { minBetAmount: 10, startingBalance: 1000 };

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    api
      .getConfig()
      .then(setConfig)
      .catch(() => {});
  }, []);

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig doit etre utilise dans un ConfigProvider');
  return ctx;
}
