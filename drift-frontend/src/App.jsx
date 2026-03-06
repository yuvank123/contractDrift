import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectForm from "./components/projectForm.jsx";

const App = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<ProjectForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;