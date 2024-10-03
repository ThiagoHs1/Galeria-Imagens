import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Home } from './containers/Home/index'





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)
