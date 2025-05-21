import React from 'react';

// TypeDetails component for Water Analysis
const TypeDetails = ({ activeMonthFilter, activeYearFilter }) => {
  return (
    <div className="water-dashboard">
      <h2 className="text-xl font-semibold mb-4">Consumption by Type</h2>
      <p className="text-gray-600 mb-6">
        This section displays water consumption breakdown by different property types for {activeMonthFilter}.
      </p>
      
      {/* The actual component will render content from WaterAnalysis.jsx */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-sm text-gray-500">
          This is a placeholder component for lazy loading the Type Details section.
          In the actual implementation, this component will render the Type Details content
          that is currently in the WaterAnalysis.jsx file.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-[#4E4456]">Irrigation</h3>
          <div className="mt-2 text-2xl font-bold">24%</div>
          <div className="mt-1 text-sm text-gray-500">of total consumption</div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-[#4E4456]">Residential Villas</h3>
          <div className="mt-2 text-2xl font-bold">35%</div>
          <div className="mt-1 text-sm text-gray-500">of total consumption</div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-[#4E4456]">Residential Apts</h3>
          <div className="mt-2 text-2xl font-bold">18%</div>
          <div className="mt-1 text-sm text-gray-500">of total consumption</div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-[#4E4456]">Retail</h3>
          <div className="mt-2 text-2xl font-bold">12%</div>
          <div className="mt-1 text-sm text-gray-500">of total consumption</div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-[#4E4456]">Common Areas</h3>
          <div className="mt-2 text-2xl font-bold">11%</div>
          <div className="mt-1 text-sm text-gray-500">of total consumption</div>
        </div>
      </div>
    </div>
  );
};

export default TypeDetails;