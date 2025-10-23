import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react';
import './index.css'
import App from './App.tsx'
import { apolloClient } from './lib/apolloClient';
import { SpeedInsights } from "@vercel/speed-insights/react"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <SpeedInsights />
      <App />
    </ApolloProvider>
  </StrictMode>,
)
