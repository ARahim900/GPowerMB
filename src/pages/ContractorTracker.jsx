import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  DollarSign, 
  FileText,
  Filter,
  Search,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { contractorData } from '../data/contractorData';

const ContractorTracker = () => {
  const [view, setView] = useState('table');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('contractor');
  const [sortDirection, setSortDirection] = useState('asc');

  // Calculate statistics
  const totalContracts = contractorData.length;
  const activeContracts = contractorData.filter(contract => contract.status === 'Active').length;
  const expiredContracts = contractorData.filter(contract => contract.status === 'Expired').length;
  
  // Calculate near expiry (contracts with less than 60 days remaining)
  const today = new Date();
  const nearExpiryContracts = contractorData.filter(contract => {
    if (contract.status === 'Expired') return false;
    const endDate = new Date(contract.endDate);
    const daysRemaining = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 && daysRemaining < 60;
  });
  
  // Calculate total monthly and yearly costs
  const totalMonthlyCost = contractorData
    .filter(contract => contract.status === 'Active' && contract.monthlyAmount)
    .reduce((total, contract) => {
      // Extract numerical value from string like "525 OMR" or "1,400 /Month Inc VAT"
      const match = contract.monthlyAmount.match(/(\d+,?\d*\.?\d*)/);
      if (match) {
        return total + parseFloat(match[0].replace(',', ''));
      }
      return total;
    }, 0);
    
  // Filter contractors based on search term and status filter
  const filteredContractors = contractorData.filter(contract => {
    const matchesSearch = 
      contract.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.service.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && contract.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Sort contractors
  const sortedContractors = [...filteredContractors].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle date comparison
    if (sortField === 'startDate' || sortField === 'endDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title="Contractor Tracker" 
        subtitle="Manage and monitor contractor agreements and performance" 
      />
      
      <main className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Contracts" 
            value={totalContracts} 
            icon={<FileText className="text-primary" size={24} />} 
          />
          <StatCard 
            title="Active Contracts" 
            value={activeContracts} 
            icon={<CheckCircle className="text-green-500" size={24} />} 
          />
          <StatCard 
            title="Expiring Soon" 
            value={nearExpiryContracts.length} 
            icon={<AlertTriangle className="text-accent" size={24} />} 
          />
          <StatCard 
            title="Monthly Cost" 
            value={`${totalMonthlyCost.toLocaleString()} OMR`} 
            icon={<DollarSign className="text-blue-500" size={24} />} 
          />
        </div>
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <button 
              className={`px-4 py-2 rounded-md ${view === 'table' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setView('table')}
            >
              Table View
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${view === 'cards' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setView('cards')}
            >
              Card View
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search contractors..."
                className="py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="relative">
              <select
                className="py-2 pl-10 pr-8 rounded-md border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
              <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Table View */}
        {view === 'table' && (
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <SortableHeader 
                      title="Contractor" 
                      field="contractor" 
                      currentSort={sortField} 
                      direction={sortDirection} 
                      onSort={() => handleSort('contractor')} 
                    />
                    <SortableHeader 
                      title="Service" 
                      field="service" 
                      currentSort={sortField} 
                      direction={sortDirection} 
                      onSort={() => handleSort('service')} 
                    />
                    <SortableHeader 
                      title="Status" 
                      field="status" 
                      currentSort={sortField} 
                      direction={sortDirection} 
                      onSort={() => handleSort('status')} 
                    />
                    <SortableHeader 
                      title="Type" 
                      field="contractType" 
                      currentSort={sortField} 
                      direction={sortDirection} 
                      onSort={() => handleSort('contractType')} 
                    />
                    <SortableHeader 
                      title="Start Date" 
                      field="startDate" 
                      currentSort={sortField} 
                      direction={sortDirection} 
                      onSort={() => handleSort('startDate')} 
                    />
                    <SortableHeader 
                      title="End Date" 
                      field="endDate" 
                      currentSort={sortField} 
                      direction={sortDirection} 
                      onSort={() => handleSort('endDate')} 
                    />
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedContractors.map((contract, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{contract.contractor}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{contract.service}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          contract.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contract.contractType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(contract.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(contract.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contract.monthlyAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/contractor-tracker/${index}`} className="text-primary hover:text-primary-dark">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Card View */}
        {view === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedContractors.map((contract, index) => (
              <div key={index} className="bg-white rounded-lg shadow-card overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{contract.contractor}</h3>
                      <p className="text-sm text-gray-500 mt-1">{contract.service}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      contract.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Contract Type:</span>
                      <p className="font-medium">{contract.contractType}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Monthly:</span>
                      <p className="font-medium">{contract.monthlyAmount}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Start Date:</span>
                      <p className="font-medium">{new Date(contract.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">End Date:</span>
                      <p className="font-medium">{new Date(contract.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {contract.note && (
                    <div className="mt-4 text-sm">
                      <span className="text-gray-500">Note:</span>
                      <p className="text-gray-600 mt-1">{contract.note}</p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Link
                      to={`/contractor-tracker/${index}`}
                      className="w-full block text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

// Sortable Header Component for Tables
const SortableHeader = ({ title, field, currentSort, direction, onSort }) => {
  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={onSort}
    >
      <div className="flex items-center">
        <span>{title}</span>
        <ArrowUpDown 
          size={14} 
          className={`ml-1 ${currentSort === field ? 'text-primary' : 'text-gray-400'}`} 
        />
      </div>
    </th>
  );
};

export default ContractorTracker;