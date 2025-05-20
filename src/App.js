import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import WaterAnalysis from './pages/WaterAnalysis';
import ElectricityAnalysis from './pages/ElectricityAnalysis';
import STPPlant from './pages/STPPlant';
import ContractorTracker from './pages/ContractorTracker';
import ContractorDetail from './pages/ContractorDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="water-analysis" element={<WaterAnalysis />} />
          <Route path="electricity-analysis" element={<ElectricityAnalysis />} />
          <Route path="stp-plant" element={<STPPlant />} />
          <Route path="contractor-tracker" element={<ContractorTracker />} />
          <Route path="contractor-tracker/:id" element={<ContractorDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;