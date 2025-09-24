import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Obtener tema guardado o usar 'system' por defecto
    return localStorage.getItem('theme') || 'system';
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      // Detectar si estamos en páginas de autenticación
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
      
      if (isAuthPage) {
        // En páginas de autenticación, siempre remover la clase dark del html
        document.documentElement.classList.remove('dark');
        setIsDark(false);
        return;
      }

      // Para el resto de la aplicación, aplicar el tema normalmente
      let shouldBeDark = false;

      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'light') {
        shouldBeDark = false;
      } else if (theme === 'system') {
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDark(shouldBeDark);

      // Actualizar la clase en el elemento html
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Guardar en localStorage
      localStorage.setItem('theme', theme);
    };

    updateTheme();

    // Escuchar cambios de ruta para aplicar/remover tema
    const handleRouteChange = () => {
      updateTheme();
    };

    // Escuchar cambios en la URL con popstate (botones atrás/adelante)
    window.addEventListener('popstate', handleRouteChange);

    // Escuchar cambios en las preferencias del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    setTheme(current => current === 'dark' ? 'light' : 'dark');
  };

  const value = {
    theme,
    isDark,
    changeTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  return context;
}