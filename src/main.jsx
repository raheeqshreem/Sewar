import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
 import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Toaster position="top-right"/>
  <BrowserRouter>
<GoogleOAuthProvider clientId="752427255311-9o7ldud5rmr2neecl1o055ugqd3e5ogi.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
       </BrowserRouter>
 </StrictMode>
);
