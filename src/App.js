import { BrowserRouter, Routes, Route } from "react-router-dom";
import SetupPage from "./pages/SetupPage";
import ScanPage from "./pages/ScanPage";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<SetupPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/stats/:sessionId" element={<StatsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
