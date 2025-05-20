import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { contractorData } from '../data/contractorData';

const ContractorFinance = () => {
  const [timeframe, setTimeframe] = useState('monthly');

  // Process contractor data for financial insights
  const activeContractors = contractorData.filter(contract => contract.status === 'Active');
  
  // Extract and normalize monthly costs
  const monthlyContractCosts = activeContractors.map(contract => {
    const amountStr = contract.monthlyAmount || '';
    // Extract numeric value from string like "525 OMR" or "1,400 /Month Inc VAT"
    const match = amountStr.match(/(\d+,?\d*\.?\d*)/);
    const amount = match ? parseFloat(match[0].replace(',', '')) : 0;
    
    return {
      contractor: contract.contractor,
      service: contract.service.length > 30 ? contract.service.substring(0, 30) + '...' : contract.service,
      amount: amount
    };
  }).filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount); // Sort by amount descending
  
  // Calculate total monthly cost
  const totalMonthlyCost = monthlyContractCosts.reduce((sum, item) => sum + item.amount, 0);
  
  // Group costs by service type for pie chart
  const serviceTypes = {};
  activeContractors.forEach(contract => {
    // Extract base service type (first few words)
    const serviceWords = contract.service.split(' ');
    const serviceType = serviceWords.length > 2 ? 
      serviceWords.slice(0, 2).join(' ') : contract.service;
      
    // Extract amount from monthly amount
    const amountStr = contract.monthlyAmount || '';
    const match = amountStr.match(/(\d+,?\d*\.?\d*)/);
    const amount = match ? parseFloat(match[0].replace(',', '')) : 0;
    
    if (!serviceTypes[serviceType]) {
      serviceTypes[serviceType] = 0;
    }
    
    serviceTypes[serviceType] += amount;
  });
  
  // Convert to array for pie chart
  const serviceTypeData = Object.keys(serviceTypes).map(key => ({
    name: key,
    value: serviceTypes[key]
  })).sort((a, b) => b.value - a.value); // Sort by value descending

  // COLORS for pie chart
  const COLORS = ['#4E4456', '#636AFF', '#36B3C2', '#FFB547', '#FF6B6B', '#05CE91', '#8676FF'];

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title="Contractor Finance Dashboard" 
        subtitle="Financial overview of contractor services and costs" 
      />
      
      <main className="p-6">
        {/* Time Period Selection */}
        <div className="flex justify-end mb-6">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={`relative inline-flex items-center px-3 py-2 rounded-l-md border ${
                timeframe === 'monthly' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'
              } text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
              onClick={() => setTimeframe('monthly')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`relative inline-flex items-center px-3 py-2 border-t border-b ${
                timeframe === 'quarterly' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'
              } text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
              onClick={() => setTimeframe('quarterly')}
            >
              Quarterly
            </button>
            <button
              type="button"
              className={`relative inline-flex items-center px-3 py-2 rounded-r-md border ${
                timeframe === 'yearly' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'
              } text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
              onClick={() => setTimeframe('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Financial summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Active Contracts Cost */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-primary-light/20 mr-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Monthly Cost</p>
                <div className="flex items-end">
                  <p className="text-2xl font-bold">{totalMonthlyCost.toLocaleString()} OMR</p>
                </div>
                <div className="flex items-center mt-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500">2.5% from last month</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Annual Budget */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-blue-100 mr-4">
                <DollarSign className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Annual Budget</p>
                <div className="flex items-end">
                  <p className="text-2xl font-bold">{(totalMonthlyCost * 12).toLocaleString()} OMR</p>
                </div>
                <div className="flex items-center mt-1 text-xs">
                  <span className="text-gray-500">Budget Remaining: 45%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Active Contracts */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-green-100 mr-4">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Contracts</p>
                <div className="flex items-end">
                  <p className="text-2xl font-bold">{activeContractors.length}</p>
                </div>
                <div className="flex items-center mt-1 text-xs">
                  <span className="text-gray-500">Total Yearly: {(totalMonthlyCost * 12).toLocaleString()} OMR</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Budget Alerts */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-red-100 mr-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Budget Alerts</p>
                <div className="flex items-end">
                  <p className="text-2xl font-bold">2</p>
                </div>
                <div className="flex items-center mt-1 text-xs">
                  <span className="text-red-500">Requires attention</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Cost by Contractor */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Cost by Contractor</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyContractCosts}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="contractor" 
                    type="category" 
                    tick={{ fontSize: 12 }} 
                    width={100} 
                  />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} OMR`, 'Monthly Cost']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="amount" fill="#4E4456" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Cost by Service Type */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Distribution by Service Type</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={1}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {serviceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString()} OMR`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Top 5 Contracts by Monthly Cost */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Contracts by Monthly Cost</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contractor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yearly Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyContractCosts.slice(0, 5).map((contract, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{contract.contractor}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{contract.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contract.amount.toLocaleString()} OMR</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{(contract.amount * 12).toLocaleString()} OMR</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {((contract.amount / totalMonthlyCost) * 100).toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Budget Alerts */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Alerts</h3>
          
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Facility Management costs exceed budget by 12%</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Current monthly spending on Facility Management is 32,200.8 OMR, which is 12% over the allocated budget of 28,750 OMR.</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      type="button"
                      className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">STP Operations approaching budget limit</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Current spending on STP Operations is at 92% of the allocated yearly budget. Please review before approving additional expenses.</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      type="button"
                      className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContractorFinance;