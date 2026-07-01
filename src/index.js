import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from "@chakra-ui/react";
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { config } from "./wagmiconf.js";
import "./components/styles/globals.css";
import { ThemeProvider, useTheme } from "./themes/ThemeContext.js";
import ErrorBoundary from "./components/ErrorBoundary.js";

const queryClient = new QueryClient();

// 注入主题字体（Google Fonts）
function FontLoader() {
  const { themeId } = useTheme();
  const linkHref = themeId === 'modern'
    ? 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    : themeId === 'cartoon'
    ? 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Comic+Neue:wght@400;700&display=swap'
    : 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap';
  React.useEffect(() => {
    let link = document.getElementById('theme-fonts');
    if (!link) {
      link = document.createElement('link');
      link.id = 'theme-fonts';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = linkHref;
  }, [linkHref]);
  return null;
}

function AppRoot() {
  return (
    <ChakraProvider resetCSS>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <FontLoader />
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </QueryClientProvider>
      </WagmiProvider>
    </ChakraProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <AppRoot />
  </ThemeProvider>
);
