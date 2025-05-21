import React from 'react';
import PageHeader from '../components/PageHeader';

const ContractorFinance = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title="Contractor Finance" 
        subtitle="Financial information and payment tracking" 
      />
      <div className="p-6 bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contractor Financial Dashboard</h2>
          <p className="text-gray-600 mb-4">
            Monitor and manage contractor payments, invoices, and financial performance.
          </p>
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-blue-700">
              Contractor Finance section is available but not the focus of current development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorFinance;
