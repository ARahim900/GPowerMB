import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to GPowerMB Dashboard</h1>
          <p className="text-gray-600">
            Muscat Bay Utility Management System - Modern dashboard for managing water, electricity, STP plant and contractor data
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            to="/water" 
            className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-300 border-t-4 border-[#8ED2D6]"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Water Analysis</h2>
            <p className="text-gray-600">Comprehensive water supply and consumption analysis.</p>
          </Link>
          
          <Link 
            to="/electricity" 
            className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-300 border-t-4 border-[#4E4456]"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Electricity Analysis</h2>
            <p className="text-gray-600">Power consumption tracking and analysis.</p>
          </Link>
          
          <Link 
            to="/stp" 
            className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-300 border-t-4 border-[#9A95A6]"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">STP Plant</h2>
            <p className="text-gray-600">Sewage treatment plant monitoring.</p>
          </Link>
          
          <Link 
            to="/contractors" 
            className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow duration-300 border-t-4 border-[#ADA6B9]"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Contractor Tracker</h2>
            <p className="text-gray-600">Contractor management and performance tracking.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
