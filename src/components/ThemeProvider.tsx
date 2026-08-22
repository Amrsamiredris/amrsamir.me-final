'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [, startTransition] = useTransition();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      startTransition(() => {
        setTheme(savedTheme);
      });
      const root = window.document.documentElement;
      root.classList.toggle('light', savedTheme === 'light');
      root.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      const root = window.document.documentElement;
      root.classList.toggle('light', next === 'light');
      root.classList.toggle('dark', next === 'dark');
      localStorage.setItem('theme', next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return { theme: 'dark' as Theme, toggleTheme: () => {} };
  }
  return context;
}
