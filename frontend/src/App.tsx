import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { HomePage3D } from "./pages/HomePage3D";
import { VagaPage } from "./pages/VagaPage";

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/3d" element={<HomePage3D />} />
        <Route path="/vaga/:numero" element={<VagaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
