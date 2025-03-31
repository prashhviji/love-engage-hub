
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

// Replace this with your actual Google Client ID
const GOOGLE_CLIENT_ID = "195486654049-lqcbulpping60kp35gi0igcfa7n1dq4u.apps.googleusercontent.com"; 

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
