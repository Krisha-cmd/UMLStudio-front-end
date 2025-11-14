import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";
import { useAuthContext } from "./context/AuthContext";

export const AppRouter: React.FC = () => {
  const { token } = useAuthContext();

  // When deploying to GitHub Pages under a repo subpath (e.g. /<user>/<repo>/)
  // the router must be aware of the base path so route matching works.
  // Vite exposes the configured `base` as `import.meta.env.BASE_URL`.
  // Fallback to '/UMLStudio-front-end/' if BASE_URL is not set.
  const basename = (import.meta as any).env?.BASE_URL ?? '/UMLStudio-front-end/';

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/home"
          element={token ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route path="/editor" element={token ? <EditorPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};
