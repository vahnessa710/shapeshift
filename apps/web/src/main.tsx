import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './lib/firebase'
import { QueryProvider } from './providers/QueryProvider'
import './style.css'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>
)
