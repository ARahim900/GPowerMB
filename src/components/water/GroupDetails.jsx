import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Search, Download, Filter, ArrowUpDown, Info } from 'lucide-react';

import { 
  waterData,
  getMonths,
  getZoneTypes,
  getCustomersByZone
} from '../../data/waterData';

// GroupDetails component for Water Analysis
const GroupDetails = ({ 
  activeMonthFilter, 
  activeYearFilter, 
  activeZoneFilter, 
  zoneCode, 
  THEME, 
  CHART_COLORS,
  formatNumber,
  searchQuery, 
  setSearchQuery 
}) => {
  const [sortBy, setSortBy] = useState('consumption');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Get all months for the selected year
  const yearMonths = useMemo(() => {
    return getMonths().filter(month => month.id.includes(activeYearFilter));
  }, [activeYearFilter]);

  // Get customers for the selected zone
  const zoneCustomers = useMemo(() => {
    if (activeZoneFilter === 'All Zones') {
      return waterData.customerMeters;
    } else if (zoneCode) {
      return getCustomersByZone(zoneCode);
    }
    return [];
  }, [activeZoneFilter, zoneCode]);

  // Filter customers by search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return zoneCustomers;
    
    const query = searchQuery.toLowerCase();
    return zoneCustomers.filter(customer => 
      customer.customer.toLowerCase().includes(query) || 
      customer.id.toLowerCase().includes(query)
    );
  }, [zoneCustomers, searchQuery]);

  // Sort customers
  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      if (sortBy === 'customer') {
        return sortDirection === 'asc' 
          ? a.customer.localeCompare(b.customer)
          : b.customer.localeCompare(a.customer);
      } else if (sortBy === 'meterId') {
        return sortDirection === 'asc'
          ? a.id.localeCompare(b.id)
          : b.id.localeCompare(a.id);
      } else {
        return sortDirection === 'asc'
          ? a.consumption - b.consumption
          : b.consumption - a.consumption;
      }
    });
  }, [filteredCustomers, sortBy, sortDirection]);

  // Toggle sort
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  // Generate random historical data for selected customer
  const generateCustomerHistoryData = (customerId) => {
    return yearMonths.map(month => {
      // Seed based on customerId and month for consistent "random" data
      const seed = parseInt(customerId.replace(/\D/g, '')) + month.id.charCodeAt(0);
      // Generate a value between 5 and 50 based on the seed
      const baseValue = (seed % 46) + 5;
      // Add some monthly variation
      const monthFactor = month.id.includes('Jun') || month.id.includes('Jul') ? 1.2 : 
                          month.id.includes('Dec') || month.id.includes('Jan') ? 0.8 : 1;
      
      return {
        name: month.id.split('-')[0],
        consumption: Math.round(baseValue * monthFactor)
      };
    });
  };

  // Customer history data
  const customerHistoryData = useMemo(() => {
    if (!selectedCustomer) return [];
    return generateCustomerHistoryData(selectedCustomer.id);
  }, [selectedCustomer, activeYearFilter]);

  // Zone comparison data
  const zoneComparisonData = useMemo(() => {
    return getZoneTypes().map(zone => {
      const zoneData = waterData.zoneData[zone.id] || { bulk: {}, individual: {} };
      const bulk = zoneData.bulk[activeMonthFilter] || 0;
      const individual = zoneData.individual[activeMonthFilter] || 0;
      const loss = bulk - individual;
      const efficiency = bulk > 0 ? ((individual / bulk) * 100).toFixed(1) : 0;
      
      return {
        name: zone.label,
        bulk,
        individual,
        loss,
        efficiency
      };
    });
  }, [activeMonthFilter]);

  return (
    <div className="water-dashboard">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Zone Consumption Analysis</h2>
          <p className="text-gray-600 mt-1">
            Detailed analysis for {activeZoneFilter === 'All Zones' ? 'all zones' : activeZoneFilter} in {activeMonthFilter}.
          </p>
        </div>
        
        {/* Search field */}
        <div className="mt-4 md:mt-0">
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers or meters..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8ED2D6]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Zone Comparison Chart */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-base font-medium text-gray-700 mb-4">Zone Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={zoneComparisonData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'efficiency') {
                    return [`${value}%`, 'Efficiency Rate'];
                  }
                  return [`${formatNumber(value)} m³`, name];
                }}
              />
              <Legend />
              <Bar dataKey="bulk" name="Bulk Supply" fill={CHART_COLORS[0]} />
              <Bar dataKey="individual" name="Individual Consumption" fill={CHART_COLORS[2]} />
              <Bar dataKey="loss" name="Water Loss" fill={CHART_COLORS[4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-700">Customer Consumption</h3>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredCustomers.length} customers for {activeZoneFilter === 'All Zones' ? 'all zones' : activeZoneFilter}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none" 
                    onClick={() => toggleSort('meterId')}
                  >
                    Meter ID
                    {sortBy === 'meterId' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none" 
                    onClick={() => toggleSort('customer')}
                  >
                    Customer
                    {sortBy === 'customer' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center focus:outline-none" 
                    onClick={() => toggleSort('consumption')}
                  >
                    Consumption (m³)
                    {sortBy === 'consumption' && (
                      <ArrowUpDown size={14} className="ml-1" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zone
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCustomers.map((customer, index) => (
                <tr 
                  key={customer.id}
                  className={selectedCustomer?.id === customer.id ? 'bg-blue-50' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.consumption}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.zone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-[#4E4456] hover:text-[#8ED2D6] focus:outline-none"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCustomers.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-gray-500">No customers found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Customer Details */}
      {selectedCustomer && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-base font-medium text-gray-700">Customer Consumption History</h3>
              <p className="text-sm text-gray-500 mt-1">
                Meter ID: {selectedCustomer.id} | Customer: {selectedCustomer.customer}
              </p>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setSelectedCustomer(null)}
            >
              Close
            </button>
          </div>
          
          <div className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={customerHistoryData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} m³`, 'Consumption']}
                    labelFormatter={(label) => `${label} ${activeYearFilter}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="consumption" 
                    name="Water Consumption" 
                    stroke={THEME.primary} 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-500">
                <Info size={16} className="mr-1" />
                Data shown is for the year {activeYearFilter}
              </div>
              <button className="flex items-center text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 focus:outline-none">
                <Download size={14} className="mr-1" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;