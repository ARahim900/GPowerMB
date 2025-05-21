import React from 'react';
import { AlertTriangle, Droplet } from 'lucide-react';

// LossDetails component for Water Analysis
const LossDetails = ({ activeMonthFilter, activeYearFilter, activeZoneFilter, zoneCode }) => {
  return (
    <div className="water-dashboard">
      <h2 className="text-xl font-semibold mb-4">Water Loss Analysis</h2>
      <p className="text-gray-600 mb-6">
        This section analyzes water losses and identifies problem areas for {activeZoneFilter === 'All Zones' ? 'all zones' : activeZoneFilter} in {activeMonthFilter}.
      </p>
      
      {/* Problem Zone Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
            <h4 className="font-medium text-red-800 flex items-center">
              <AlertTriangle size={18} className="mr-2" />
              Critical Loss Issues
            </h4>
            <ul className="mt-2 text-sm text-red-700 space-y-1 pl-6 list-disc">
              <li>Zone 03A shows an exceptionally high loss rate of <span className="font-semibold">78.9%</span></li>
              <li>Zone 03B maintains a concerningly high loss of <span className="font-semibold">66.6%</span></li>
              <li>Zone 08 has shown a significant increase from <span className="font-semibold">26.4%</span> to <span className="font-semibold">70.2%</span> in the last month</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-[#8ED2D6]">
            <h4 className="font-medium text-[#4E4456] flex items-center">
              <Droplet size={18} className="mr-2 text-[#8ED2D6]" />
              Recommended Actions
            </h4>
            <ul className="mt-2 text-sm text-gray-700 space-y-1 pl-6 list-disc">
              <li>Conduct pressure testing in Zone 03A and 03B</li>
              <li>Inspect Zone 08 for recent infrastructure changes</li>
              <li>Verify meter calibration for all zones showing abnormal readings</li>
              <li>Schedule a network-wide leak detection survey</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* The actual component will render content from WaterAnalysis.jsx */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-sm text-gray-500">
          This is a placeholder component for lazy loading the Loss Details section.
          In the actual implementation, this component will render the Loss Details content
          that is currently in the WaterAnalysis.jsx file.
        </p>
      </div>
    </div>
  );
};

export default LossDetails;