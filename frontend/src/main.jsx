import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import RouterComponent from './routers/router.component';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterComponent />
  </StrictMode>
)
