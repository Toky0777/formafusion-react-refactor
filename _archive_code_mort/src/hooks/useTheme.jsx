// hooks/useTheme.js (Modified)
import { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';

// 1. Create the Context
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    // Initialisation
    if (typeof window !== 'undefined') { // Check for SSR compatibility
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default for SSR or if window is not defined
  });

  // Effect pour appliquer le thème au document et sauvegarder
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Apply transition
    const applyTransition = () => {
      const css = document.createElement('style');
      css.textContent = `* { transition: background-color 0.3s ease, color 0.2s ease !important; }`;
      css.id = 'theme-transition';
      document.head.appendChild(css);
      setTimeout(() => {
        const style = document.getElementById('theme-transition');
        if (style) style.remove();
      }, 300);
    };
    applyTransition();
  }, [theme]);

  // Synchronisation avec les préférences système
  useEffect(() => {
    // Only listen to system preference if no theme is explicitly saved by the user
    if (localStorage.getItem('theme')) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setThemeState(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []); // Empty dependency array means this runs once on mount

  // Basculer entre les thèmes (mémoïsé)
  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const themeValue = useMemo(() => ({
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 2. Modify useTheme to consume the context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};