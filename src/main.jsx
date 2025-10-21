import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AprendePage from "./pages/AprendePage.jsx";
import PerfilPage from "./pages/PerfilPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RecuperarPage from "./pages/RecuperarPage.jsx";
import AnalizadorPage from "./pages/AnalizadorPage.jsx";
import EstadisticasPage from './pages/EstadisticasPage.jsx';
import './index.css';

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/registrar", element: <RegisterPage /> },
  { path: "/aprende", element: <AprendePage /> },
  { path: "/perfil", element: <PerfilPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/recuperar", element: <RecuperarPage /> },
  { path: "/analizador", element: <AnalizadorPage /> },
  { path: "/estadisticas", element: <EstadisticasPage /> }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);