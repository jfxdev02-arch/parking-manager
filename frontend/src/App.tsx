import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { VagaPage } from "./pages/VagaPage";

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vaga/:numero" element={<VagaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
