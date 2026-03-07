import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectForm from "./components/projectForm.jsx";
import PipelineSetup from "./components/checkRunComp.jsx";
import ReportComp from "./components/reportComp.jsx";

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
        <Route path="/parsing-pipeline" element={<PipelineSetup />} />
        <Route path="/pipeline-results/:projectId" element={<ReportComp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;