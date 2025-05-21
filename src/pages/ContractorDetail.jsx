import React from 'react';
import PageHeader from '../components/PageHeader';
import { useParams } from 'react-router-dom';

const ContractorDetail = () => {
  const { id } = useParams();

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title={`Contractor Details: ${id || 'Unknown'}`} 
        subtitle="Detailed contractor information and performance" 
      />
      <div className="p-6 bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contractor #{id || 'Unknown'}</h2>
          <p className="text-gray-600 mb-4">
            This page displays detailed information about a specific contractor.
          </p>
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-blue-700">
              Contractor Detail section is available but not the focus of current development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorDetail;
