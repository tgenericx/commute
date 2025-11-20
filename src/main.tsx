import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/theme-provider.tsx";
import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "@/lib/apolloClient";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
);
