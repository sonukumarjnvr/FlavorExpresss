import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap-icons/font/bootstrap-icons.css';
import {BrowserRouter} from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider} from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
            <App />
        </CartProvider>
      </AuthProvider>    
    </BrowserRouter>
  </StrictMode>,
)
