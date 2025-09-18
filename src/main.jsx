import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
 import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Toaster position="top-right"/>
  <HashRouter>
<GoogleOAuthProvider clientId="752427255311-iusgq6oi5jqcpi8fld0ltcp76ajnnglu.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
       </HashRouter>
 </StrictMode>
);
