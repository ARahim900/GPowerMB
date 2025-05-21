import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  Calendar, Download, Search, User, Users, 
  FileText, CreditCard, CheckCircle, XCircle, Clock
} from 'lucide-react';
import PageHeader from '../components/PageHeader';

// Sample data for contractor tracking
const contractorData = {
  activeContractors: [
    { id: 'C001', name: 'Al Maha Facilities Management', type: 'Facilities Management', status: 'Active', contractValue: 250000, completion: 65 },
    { id: 'C002', name: 'Green Thumb Landscaping LLC', type: 'Landscaping', status: 'Active', contractValue: 120000, completion: 78 },
    { id: 'C003', name: 'Aqua Blue Pool Services', type: 'Pool Maintenance', status: 'Active', contractValue: 85000, completion: 92 },
    { id: 'C004', name: 'Secure Guard Security Services', type: 'Security', status: 'Active', contractValue: 175000, completion: 85 },
    { id: 'C005', name: 'Elite Cleaning Solutions', type: 'Cleaning', status: 'Active', contractValue: 95000, completion: 70 }
  ],
  contractsByType: [
    { name: 'Facilities Management', value: 3 },
    { name: 'Landscaping', value: 2 },
    { name: 'Pool Maintenance', value: 1 },
    { name: 'Security', value: 2 },
    { name: 'Cleaning', value: 2 },
    { name: 'HVAC', value: 1 }
  ],
  monthlyExpenses: [
    { name: 'Jan', amount: 48000 },
    { name: 'Feb', amount: 52000 },
    { name: 'Mar', amount: 61000 },
    { name: 'Apr', amount: 65000 },
    { name: 'May', amount: 68000 },
    { name: 'Jun', amount: 72000 },
    { name: 'Jul', amount: 75000 },
    { name: 'Aug', amount: 71000 },
    { name: 'Sep', amount: 69000 },
    { name: 'Oct', amount: 63000 },
    { name: 'Nov', amount: 59000 },
    { name: 'Dec', amount: 55000 }
  ],
  upcomingPayments: [
    { id: 'INV-2025-042', contractor: 'Al Maha Facilities Management', amount: 20800, dueDate: '2025-05-15' },
    { id: 'INV-2025-043', contractor: 'Green Thumb Landscaping LLC', amount: 10000, dueDate: '2025-05-18' },
    { id: 'INV-2025-044', contractor: 'Secure Guard Security Services', amount: 14580, dueDate: '2025-05-20' },
    { id: 'INV-2025-045', contractor: 'Elite Cleaning Solutions', amount: 7900, dueDate: '2025-05-25' }
  ],
  recentActivities: [
    { id: 1, contractor: 'Al Maha Facilities Management', action: 'Maintenance Request Completed', date: '2025-05-10', status: 'Completed' },
    { id: 2, contractor: 'Green Thumb Landscaping LLC', action: 'Monthly Report Submitted', date: '2025-05-12', status: 'Pending Review' },
    { id: 3, contractor: 'Secure Guard Security Services', action: 'Contract Amendment', date: '2025-05-14', status: 'Approved' },
    { id: 4, contractor: 'Elite Cleaning Solutions', action: 'Invoice Submitted', date: '2025-05-15', status: 'Pending Payment' }
  ]
};

// Color theme
const CHART_COLORS = [
  '#8ED2D6', // Teal from logo
  '#4E4456', // Darker purple
  '#9A95A6', // Slate purple
  '#B5E4E7', // Light teal
  '#6E5E76', // Medium purple
  '#DCDADF'  // Light lavender
];

const ContractorTracker = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMonth, setActiveMonth] = useState('Apr');
  const [activeYear, setActiveYear] = useState('2025');
  
  // Format number with commas
  const formatCurrency = (num) => {
    return '$' + num.toLocaleString('en-US');
  };
  
  // Filter contractors by search query
  const filteredContractors = contractorData.activeContractors.filter(
    contractor => contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  contractor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  contractor.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title="Contractor Tracker" 
        subtitle="Contractor management and performance tracking" 
      />
      
      <div className="p-6 bg-gray-50">
        {/* Filter Bar */}
        <div className="bg-white border-b border-gray-200 py-3 px-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-500 mr-2" />
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#8ED2D6] focus:border-[#8ED2D6] p-2"
                  value={activeMonth}
                  onChange={(e) => setActiveMonth(e.target.value)}
                >
                  {contractorData.monthlyExpenses.map(m => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#8ED2D6] focus:border-[#8ED2D6] p-2"
                  value={activeYear}
                  onChange={(e) => setActiveYear(e.target.value)}
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>
            
            <div className="relative w-64">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contractors..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ED2D6]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center text-xs text-gray-700 bg-gray-100 rounded px-2 py-1 hover:bg-gray-200 transition">
                <Download size={14} className="mr-1" />
                <span>Export</span>
              </button>
              
              <div className="flex space-x-2">
                <button className="bg-gray-200 px-3 py-1 rounded text-sm">Weekly</button>
                <button className="bg-white px-3 py-1 rounded text-sm border border-gray-300">Monthly</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Active Contractors</h3>
                <p className="text-2xl font-bold mt-1">{contractorData.activeContractors.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Users size={20} className="text-blue-500" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {contractorData.activeContractors.length} companies currently under contract
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Contract Value</h3>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(contractorData.activeContractors.reduce((sum, c) => sum + c.contractValue, 0))}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <CreditCard size={20} className="text-green-500" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Combined value of all active contracts
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Avg. Completion Rate</h3>
                <p className="text-2xl font-bold mt-1">
                  {Math.round(contractorData.activeContractors.reduce((sum, c) => sum + c.completion, 0) / contractorData.activeContractors.length)}%
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <CheckCircle size={20} className="text-yellow-500" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Average contract completion percentage
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(contractorData.upcomingPayments.reduce((sum, p) => sum + p.amount, 0))}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <Clock size={20} className="text-red-500" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {contractorData.upcomingPayments.length} payments due this month
            </p>
          </div>
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-base font-medium text-gray-700 mb-4">Monthly Expenses</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={contractorData.monthlyExpenses}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Expense']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    name="Monthly Expense" 
                    stroke={CHART_COLORS[0]} 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-base font-medium text-gray-700 mb-4">Contracts by Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contractorData.contractsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {contractorData.contractsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Active Contractors Table */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-700">Active Contractors</h3>
            <p className="text-sm text-gray-500 mt-1">
              {filteredContractors.length} active contractors {searchQuery && `matching "${searchQuery}"`}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contractor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contract Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContractors.map((contractor, index) => (
                  <tr key={contractor.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contractor.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contractor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contractor.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {contractor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(contractor.contractValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-[#8ED2D6] h-2.5 rounded-full" 
                            style={{ width: `${contractor.completion}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{contractor.completion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-[#4E4456] hover:text-[#8ED2D6] mr-3">
                        View
                      </button>
                      <button className="text-[#4E4456] hover:text-[#8ED2D6]">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredContractors.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-gray-500">No contractors found matching your search criteria.</p>
            </div>
          )}
        </div>
        
        {/* Recent Activities and Upcoming Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-700">Recent Activities</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {contractorData.recentActivities.map(activity => (
                <div key={activity.id} className="p-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-gray-800">{activity.action}</p>
                    <span 
                      className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full ${
                        activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                        activity.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{activity.contractor}</p>
                  <p className="text-xs text-gray-400 mt-2">{activity.date}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Payments */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-700">Upcoming Payments</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {contractorData.upcomingPayments.map(payment => (
                <div key={payment.id} className="p-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-semibold text-gray-800">{payment.id}</p>
                    <p className="text-sm font-medium text-[#4E4456]">{formatCurrency(payment.amount)}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{payment.contractor}</p>
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-gray-400">Due: {payment.dueDate}</p>
                    <button className="text-xs text-[#8ED2D6] hover:text-[#4E4456]">
                      Process Payment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorTracker;