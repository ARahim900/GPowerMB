import React from 'react';
import PageHeader from '../components/PageHeader';

const ContractorTracker = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title="Contractor Tracker" 
        subtitle="Manage and monitor contractor agreements and performance" 
      />
      
      <main className="p-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contractor Management Dashboard</h2>
          <p>Content for Contractor Tracker section will be implemented here.</p>
        </div>
      </main>
    </div>
  );
};

export default ContractorTracker;