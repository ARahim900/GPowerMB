import React, { useState } from 'react';

const PageHeader = ({ title, subtitle }) => {
  const [activeView, setActiveView] = useState('Monthly');

  return (
    <header className="bg-primary text-white p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-300">{subtitle}</p>
        </div>
        <div className="flex space-x-1 bg-white/10 rounded-lg overflow-hidden">
          <button 
            className={`px-6 py-2 text-sm ${activeView === 'Weekly' ? 'bg-white text-primary' : ''}`}
            onClick={() => setActiveView('Weekly')}
          >
            Weekly
          </button>
          <button 
            className={`px-6 py-2 text-sm ${activeView === 'Monthly' ? 'bg-white text-primary' : ''}`}
            onClick={() => setActiveView('Monthly')}
          >
            Monthly
          </button>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;