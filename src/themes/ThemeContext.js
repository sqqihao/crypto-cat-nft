import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { getTheme, defaultThemeId } from './index.js';

const STORAGE_KEY = 'crypto-cat-theme';

const ThemeContext = createContext({
  themeId: defaultThemeId,
  theme: getTheme(defaultThemeId),
  setThemeId: () => {},
});

export function ThemeProvider({ children }) {
  const [themeId, setThemeIdState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ['cyberpunk', 'modern', 'cartoon'].includes(saved)) {
        return saved;
      }
    } catch (_) {}
    return defaultThemeId;
  });

  const theme = getTheme(themeId);

  // Inject CSS variables to <body>
  useEffect(() => {
    const body = document.body;
    if (!body) return;
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      body.style.setProperty(key, value);
    });
    // body background image
    body.style.background = theme.bgImage;
    body.style.backgroundAttachment = 'fixed';
    body.style.minHeight = '100vh';
    body.style.color = theme.cssVars['--text-primary'];
    body.style.fontFamily = theme.cssVars['--font-family'];
    body.style.transition = 'background 0.4s ease, color 0.3s ease';

    return () => {
      // cleanup on unmount (not strictly needed, but tidy)
    };
  }, [theme]);

  const setThemeId = useCallback((id) => {
    setThemeIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (_) {}
  }, []);

  return (
    <ThemeContext.Provider value={{ themeId, theme, setThemeId, themes: { cyberpunk: 1, modern: 1, cartoon: 1 } }}>
      <ConfigProvider
        theme={{
          algorithm: themeId === 'modern' ? antdTheme.defaultAlgorithm : antdTheme.darkAlgorithm,
          ...theme.antd,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
