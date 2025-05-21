import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ContractorTracker from './pages/ContractorTracker';
import ContractorDetail from './pages/ContractorDetail';
import ContractorFinance from './pages/ContractorFinance';
import WaterAnalysis from './pages/WaterAnalysis';
import ElectricityAnalysis from './pages/ElectricityAnalysis';
import STPPlant from './pages/STPPlant';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="contractors" element={<ContractorTracker />} />
          <Route path="contractors/:id" element={<ContractorDetail />} />
          <Route path="contractors/finance" element={<ContractorFinance />} />
          <Route path="water" element={<WaterAnalysis />} />
          <Route path="water-analysis" element={<WaterAnalysis />} />
          <Route path="electricity" element={<ElectricityAnalysis />} />
          <Route path="stp" element={<STPPlant />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
