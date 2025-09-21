import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
 import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

  const clientId="752427255311-srr9oie5nh580soak1okt43gs7igm378.apps.googleusercontent.com"
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Toaster position="top-right"/>
  <HashRouter>
<GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
       </HashRouter>
 </StrictMode>
);
