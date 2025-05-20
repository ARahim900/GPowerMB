import React from 'react';
import PageHeader from '../components/PageHeader';

const STPPlant = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title="STP Plant Analysis" 
        subtitle="Sewage treatment plant performance and metrics" 
      />
      
      <main className="p-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">STP Plant Dashboard</h2>
          <p>Content for STP Plant section will be implemented here.</p>
        </div>
      </main>
    </div>
  );
};

export default STPPlant;