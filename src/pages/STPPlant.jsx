import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Download, 
  Calendar, 
  Droplets, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Wrench,
  XCircle,
  Check,
  Search,
  Info,
  AlertTriangle,
  Gauge,
  Beaker,
  Recycle,
  Truck
} from 'lucide-react';

import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart,
  ComposedChart 
} from 'recharts';

import { stpData, getMonthlyAverages, calculateSTPMetrics, getMaintenanceIssues, getDateRanges } from '../data/stpData';
import PageHeader from '../components/PageHeader';

// Animate CSS for transitions and animations
import 'animate.css';

const STPPlant = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    showMaintenanceDays: false,
    efficiencyThreshold: 0,
    dateRangeOpen: false,
    searchQuery: ''
  });
  
  // Theme color - making sure we use the exact color specified
  const PRIMARY_COLOR = '#4E4456';
  const SECONDARY_COLOR = '#6E5E78';
  const COLORS = [PRIMARY_COLOR, '#6E5E78', '#8F7A9A', '#AF96BC', '#D0B2DE', '#E6CCF0', '#F2E5F9'];
  
  // Set initial date range on component mount
  useEffect(() => {
    const { startDate, endDate } = getDateRanges();
    setDateRange({ startDate, endDate });
  }, []);
  
  // Filter data based on selected criteria
  const filteredData = useMemo(() => {
    return stpData.filter(day => {
      // Filter by date range
      const recordDate = new Date(day.date);
      const startDate = dateRange.startDate ? new Date(dateRange.startDate) : new Date(0);
      const endDate = dateRange.endDate ? new Date(dateRange.endDate) : new Date(9999, 11, 31);
      
      if (recordDate < startDate || recordDate > endDate) {
        return false;
      }
      
      // Filter by maintenance days
      if (filterOptions.showMaintenanceDays && !(day.maintenanceAction1 || day.maintenanceAction2)) {
        return false;
      }
      
      // Filter by efficiency threshold
      const efficiency = (day.totalTreatedWater / day.totalInletSewage) * 100;
      if (efficiency < filterOptions.efficiencyThreshold) {
        return false;
      }
      
      // Filter by search query
      if (filterOptions.searchQuery) {
        const query = filterOptions.searchQuery.toLowerCase();
        const hasMatch = 
          day.observations?.toLowerCase().includes(query) || 
          day.maintenanceAction1?.toLowerCase().includes(query) ||
          day.maintenanceAction2?.toLowerCase().includes(query);
        
        if (!hasMatch) {
          return false;
        }
      }
      
      return true;
    });
  }, [dateRange, filterOptions]);
  
  // Calculate metrics for the filtered data
  const metrics = useMemo(() => {
    return calculateSTPMetrics(filteredData);
  }, [filteredData]);
  
  // Format numbers for display
  const formatNumber = (num, precision = 0) => {
    return num ? Number(num).toLocaleString('en-US', { maximumFractionDigits: precision }) : '0';
  };
  
  // For efficiency gauge visualization
  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 100) return '#10B981'; // Green
    if (efficiency >= 90) return '#22C55E'; // Light Green
    if (efficiency >= 80) return '#FBBF24'; // Yellow
    return '#EF4444'; // Red
  };
  
  // Get trending direction and percentage for a metric
  const getTrend = (current, previous) => {
    if (!previous) return { direction: 'neutral', percentage: 0 };
    
    const difference = current - previous;
    const percentage = (difference / previous) * 100;
    
    return {
      direction: difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral',
      percentage: Math.abs(percentage)
    };
  };

  // Get daily treatment data for charts
  const getDailyTreatmentData = () => {
    return filteredData.map(day => ({
      date: day.date,
      inlet: day.totalInletSewage,
      treated: day.totalTreatedWater,
      output: day.totalTSEWaterOutput,
      efficiency: (day.totalTreatedWater / day.totalInletSewage) * 100,
      recoveryRate: (day.totalTSEWaterOutput / day.totalTreatedWater) * 100
    }));
  };
  
  // Get source composition data for inlet sewage
  const getSourceCompositionData = () => {
    const totalTankerVolume = filteredData.reduce((sum, day) => sum + day.expectedTankerVolume, 0);
    const totalDirectSewage = filteredData.reduce((sum, day) => sum + day.directInlineSewage, 0);
    
    return [
      { name: 'Tanker Discharge', value: totalTankerVolume },
      { name: 'Direct Inline', value: totalDirectSewage }
    ];
  };
  
  // Get monthly performance data
  const getMonthlyPerformanceData = () => {
    return getMonthlyAverages().filter(month => {
      if (!dateRange.startDate || !dateRange.endDate) return true;
      
      const [year, monthNum] = month.month.split('-');
      const monthDate = new Date(parseInt(year), parseInt(monthNum) - 1, 15);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      
      return monthDate >= startDate && monthDate <= endDate;
    });
  };
  
  // Get maintenance issues from filtered data
  const getFilteredMaintenanceIssues = () => {
    return getMaintenanceIssues().filter(issue => {
      const issueDate = new Date(issue.date);
      const startDate = dateRange.startDate ? new Date(dateRange.startDate) : new Date(0);
      const endDate = dateRange.endDate ? new Date(dateRange.endDate) : new Date(9999, 11, 31);
      
      return issueDate >= startDate && issueDate <= endDate;
    });
  };
  
  // Toggle date range picker
  const toggleDateRangePicker = () => {
    setFilterOptions({
      ...filterOptions,
      dateRangeOpen: !filterOptions.dateRangeOpen
    });
  };
  
  // Update date range
  const handleDateRangeChange = (type, value) => {
    setDateRange({
      ...dateRange,
      [type]: value
    });
  };
  
  // Reset all filters
  const resetFilters = () => {
    const { startDate, endDate } = getDateRanges();
    setDateRange({ startDate, endDate });
    setFilterOptions({
      showMaintenanceDays: false,
      efficiencyThreshold: 0,
      dateRangeOpen: false,
      searchQuery: ''
    });
  };
  
  // Toggle maintenance days filter
  const toggleMaintenanceDays = () => {
    setFilterOptions({
      ...filterOptions,
      showMaintenanceDays: !filterOptions.showMaintenanceDays
    });
  };
  
  // Update efficiency threshold
  const handleEfficiencyThresholdChange = (e) => {
    setFilterOptions({
      ...filterOptions,
      efficiencyThreshold: parseInt(e.target.value) || 0
    });
  };
  
  return (
    <div className="p-6 bg-gray-50">
      <PageHeader
        title="STP Plant Monitoring"
        description="Comprehensive analysis and monitoring of the Sewage Treatment Plant (MBR Technology, 750 m³/day)"
      />
      
      {/* Top Navigation Tabs with animation */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-6 transition-all duration-300 ease-in-out ${
            activeTab === 'overview' 
              ? 'border-b-2 border-[#4E4456] text-[#4E4456] font-medium animate__animated animate__fadeIn' 
              : 'text-gray-500 hover:text-[#4E4456]/80'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`py-3 px-6 transition-all duration-300 ease-in-out ${
            activeTab === 'performance' 
              ? 'border-b-2 border-[#4E4456] text-[#4E4456] font-medium animate__animated animate__fadeIn' 
              : 'text-gray-500 hover:text-[#4E4456]/80'
          }`}
        >
          Performance
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`py-3 px-6 transition-all duration-300 ease-in-out ${
            activeTab === 'maintenance' 
              ? 'border-b-2 border-[#4E4456] text-[#4E4456] font-medium animate__animated animate__fadeIn' 
              : 'text-gray-500 hover:text-[#4E4456]/80'
          }`}
        >
          Maintenance
        </button>
        <button
          onClick={() => setActiveTab('data-table')}
          className={`py-3 px-6 transition-all duration-300 ease-in-out ${
            activeTab === 'data-table' 
              ? 'border-b-2 border-[#4E4456] text-[#4E4456] font-medium animate__animated animate__fadeIn' 
              : 'text-gray-500 hover:text-[#4E4456]/80'
          }`}
        >
          Data Explorer
        </button>
      </div>
      
      {/* Filter Controls Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow animate__animated animate__fadeIn">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {/* Date Range Picker */}
            <div className="relative">
              <button 
                onClick={toggleDateRangePicker}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Calendar size={16} className="mr-2" />
                <span>
                  {dateRange.startDate ? new Date(dateRange.startDate).toLocaleDateString() : 'Start'} 
                  {' - '} 
                  {dateRange.endDate ? new Date(dateRange.endDate).toLocaleDateString() : 'End'}
                </span>
                <ChevronDown size={16} className="ml-2" />
              </button>
              
              {filterOptions.dateRangeOpen && (
                <div className="absolute z-10 mt-1 w-64 bg-white rounded-md shadow-lg animate__animated animate__fadeIn">
                  <div className="p-2 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-700">Date Range</h3>
                      <button 
                        onClick={() => {
                          const { startDate, endDate } = getDateRanges();
                          setDateRange({ startDate, endDate });
                        }}
                        className="text-xs text-[#4E4456] hover:text-[#4E4456]/80 font-medium"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <div className="p-3 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4E4456] focus:border-[#4E4456]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#4E4456] focus:border-[#4E4456]"
                      />
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={toggleDateRangePicker}
                        className="px-4 py-2 bg-[#4E4456] text-white rounded-md hover:bg-[#4E4456]/90 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Maintenance Days Filter */}
            <button
              onClick={toggleMaintenanceDays}
              className={`flex items-center px-4 py-2 rounded transition-colors ${
                filterOptions.showMaintenanceDays
                  ? 'bg-[#4E4456] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Wrench size={16} className="mr-2" />
              Maintenance Days
            </button>
            
            {/* Efficiency Threshold */}
            <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden">
              <div className="px-3 py-2 text-gray-700 bg-gray-100 whitespace-nowrap">
                <Gauge size={16} className="inline-block mr-1" />
                <span>Efficiency ≥</span>
              </div>
              <input
                type="number"
                min="0"
                max="150"
                value={filterOptions.efficiencyThreshold}
                onChange={handleEfficiencyThresholdChange}
                className="w-16 px-3 py-2 border-none focus:outline-none focus:ring-0"
              />
              <div className="px-2 py-2 text-gray-700">%</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search observations..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4E4456]/30 focus:border-[#4E4456]"
                value={filterOptions.searchQuery}
                onChange={(e) => setFilterOptions({...filterOptions, searchQuery: e.target.value})}
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {filterOptions.searchQuery && (
                <button 
                  onClick={() => setFilterOptions({...filterOptions, searchQuery: ''})}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>
            <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(filterOptions.showMaintenanceDays || filterOptions.efficiencyThreshold > 0 || filterOptions.searchQuery) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            
            {filterOptions.showMaintenanceDays && (
              <div className="flex items-center bg-[#4E4456]/10 text-[#4E4456] px-2 py-1 rounded-full text-xs">
                <span>Maintenance Days Only</span>
                <button 
                  onClick={toggleMaintenanceDays}
                  className="ml-1 hover:text-[#4E4456]/80"
                >
                  <XCircle size={14} />
                </button>
              </div>
            )}
            
            {filterOptions.efficiencyThreshold > 0 && (
              <div className="flex items-center bg-[#4E4456]/10 text-[#4E4456] px-2 py-1 rounded-full text-xs">
                <span>Efficiency ≥ {filterOptions.efficiencyThreshold}%</span>
                <button 
                  onClick={() => setFilterOptions({...filterOptions, efficiencyThreshold: 0})}
                  className="ml-1 hover:text-[#4E4456]/80"
                >
                  <XCircle size={14} />
                </button>
              </div>
            )}
            
            {filterOptions.searchQuery && (
              <div className="flex items-center bg-[#4E4456]/10 text-[#4E4456] px-2 py-1 rounded-full text-xs">
                <span>Search: {filterOptions.searchQuery}</span>
                <button 
                  onClick={() => setFilterOptions({...filterOptions, searchQuery: ''})}
                  className="ml-1 hover:text-[#4E4456]/80"
                >
                  <XCircle size={14} />
                </button>
              </div>
            )}
            
            <button 
              onClick={resetFilters}
              className="text-xs text-gray-500 hover:text-gray-700 ml-2"
            >
              Reset all
            </button>
          </div>
        )}
      </div>
      
      {/* Summary Stats Banner */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 animate__animated animate__fadeInUp">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-2">
          <div className="bg-[#4E4456]/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Plant Efficiency</h3>
            <div className="flex items-end mt-1">
              <p className="text-2xl font-bold text-gray-800">{formatNumber(metrics.overallEfficiency, 1)}%</p>
              <p className="text-sm text-gray-500 ml-1 mb-1">(Treated/Inlet)</p>
            </div>
          </div>
          
          <div className="bg-[#4E4456]/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Capacity Utilization</h3>
            <div className="flex items-end mt-1">
              <p className="text-2xl font-bold text-gray-800">{formatNumber(metrics.capacityUtilization, 1)}%</p>
              <p className="text-sm text-gray-500 ml-1 mb-1">(of 750 m³/day)</p>
            </div>
          </div>
          
          <div className="bg-[#4E4456]/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Water Recovery</h3>
            <div className="flex items-end mt-1">
              <p className="text-2xl font-bold text-gray-800">{formatNumber(metrics.waterRecoveryRate, 1)}%</p>
              <p className="text-sm text-gray-500 ml-1 mb-1">(TSE/Treated)</p>
            </div>
          </div>
          
          <div className="bg-[#4E4456]/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Avg. Daily Flow</h3>
            <div className="flex items-end mt-1">
              <p className="text-2xl font-bold text-gray-800">{formatNumber(metrics.avgDailyInflow, 0)}</p>
              <p className="text-sm text-gray-500 ml-1 mb-1">m³/day</p>
            </div>
          </div>
          
          <div className="bg-[#4E4456]/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Maintenance</h3>
            <div className="flex items-end mt-1">
              <p className="text-2xl font-bold text-gray-800">{formatNumber(metrics.maintenanceFrequency, 1)}%</p>
              <p className="text-sm text-gray-500 ml-1 mb-1">of days</p>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>Analysis period: {formatNumber(metrics.totalDaysAnalyzed)} days</span>
          <span className="flex items-center">
            <Info size={14} className="mr-1" />
            All metrics calculated based on the current filter settings
          </span>
        </div>
      </div>
      
      {/* Tab Content with Animation */}
      <div className="animate__animated animate__fadeIn">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Treatment Process Performance */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Treatment Process Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={getDailyTreatmentData().slice(-30)} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'inlet') return [`${formatNumber(value)} m³`, 'Inlet Sewage'];
                      if (name === 'treated') return [`${formatNumber(value)} m³`, 'Treated Water'];
                      if (name === 'output') return [`${formatNumber(value)} m³`, 'TSE Output'];
                      if (name === 'efficiency') return [`${formatNumber(value, 1)}%`, 'Efficiency'];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="inlet" 
                    name="Inlet Sewage"
                    fill="#94A3B8" 
                    yAxisId="left"
                    barSize={6}
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar 
                    dataKey="treated" 
                    name="Treated Water"
                    fill="#A78BFA" 
                    yAxisId="left"
                    barSize={6}
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar 
                    dataKey="output" 
                    name="TSE Output"
                    fill={PRIMARY_COLOR}
                    yAxisId="left"
                    barSize={6}
                    radius={[10, 10, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    name="Efficiency"
                    stroke="#10B981" 
                    yAxisId="right"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="text-xs text-center text-gray-500 mt-2">Last 30 days of treatment data</div>
            </div>
            
            {/* Inlet Source Composition */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Inlet Source Composition</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={getSourceCompositionData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        animationDuration={1500}
                        animationBegin={300}
                      >
                        {getSourceCompositionData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${formatNumber(value)} m³`, 'Volume']}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Source Distribution</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600 flex items-center">
                          <span className="w-3 h-3 bg-[#4E4456] rounded-full inline-block mr-2"></span>
                          Tanker Discharge
                        </span>
                        <span className="text-sm font-medium">{formatNumber(metrics.inletComposition.tankerPercentage, 1)}%</span>
                      </div>
                      <div className="bg-gray-200 h-2 rounded-full">
                        <div 
                          className="bg-[#4E4456] h-2 rounded-full"
                          style={{ width: `${metrics.inletComposition.tankerPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600 flex items-center">
                          <span className="w-3 h-3 bg-[#6E5E78] rounded-full inline-block mr-2"></span>
                          Direct Inline
                        </span>
                        <span className="text-sm font-medium">{formatNumber(metrics.inletComposition.directPercentage, 1)}%</span>
                      </div>
                      <div className="bg-gray-200 h-2 rounded-full">
                        <div 
                          className="bg-[#6E5E78] h-2 rounded-full"
                          style={{ width: `${metrics.inletComposition.directPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Average tankers per day:</span>
                      <span className="font-medium">{formatNumber(filteredData.reduce((sum, day) => sum + day.tankersCount, 0) / filteredData.length, 1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* KPI Cards */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow lg:col-span-2">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Key Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Plant Efficiency */}
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Plant Efficiency</h4>
                    <Gauge size={20} className="text-[#4E4456]" />
                  </div>
                  <div className="relative h-28 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border-8 border-gray-200"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-3xl font-bold" style={{ color: getEfficiencyColor(metrics.overallEfficiency) }}>
                        {formatNumber(metrics.overallEfficiency, 1)}%
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-600 mt-1">
                    {metrics.overallEfficiency >= 100 ? 'Excellent' : 
                     metrics.overallEfficiency >= 90 ? 'Good' : 
                     metrics.overallEfficiency >= 80 ? 'Average' : 'Needs Improvement'}
                  </p>
                </div>
                
                {/* Water Recovery */}
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Water Recovery</h4>
                    <Recycle size={20} className="text-[#4E4456]" />
                  </div>
                  <div className="flex flex-col items-center justify-center h-28">
                    <div className="text-3xl font-bold text-[#4E4456]">{formatNumber(metrics.waterRecoveryRate, 1)}%</div>
                    <div className="text-sm text-center text-gray-600 mt-1">
                      Output: {formatNumber(filteredData.reduce((sum, day) => sum + day.totalTSEWaterOutput, 0))} m³
                    </div>
                    <div className="text-sm text-center text-gray-600">
                      Treated: {formatNumber(filteredData.reduce((sum, day) => sum + day.totalTreatedWater, 0))} m³
                    </div>
                  </div>
                </div>
                
                {/* Capacity Utilization */}
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Capacity Utilization</h4>
                    <Droplets size={20} className="text-[#4E4456]" />
                  </div>
                  <div className="flex flex-col items-center justify-center h-28">
                    <div className="text-3xl font-bold text-[#4E4456]">{formatNumber(metrics.capacityUtilization, 1)}%</div>
                    <div className="text-sm text-center text-gray-600 mt-1">
                      Avg. Daily: {formatNumber(metrics.avgDailyInflow, 0)} m³
                    </div>
                    <div className="text-sm text-center text-gray-600">
                      Design: 750 m³/day
                    </div>
                  </div>
                </div>
                
                {/* Inlet Source Breakdown */}
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Inlet Source</h4>
                    <Truck size={20} className="text-[#4E4456]" />
                  </div>
                  <div className="flex flex-col items-center justify-center h-28">
                    <div className="text-3xl font-bold text-[#4E4456]">
                      {formatNumber(filteredData.reduce((sum, day) => sum + day.tankersCount, 0))}
                    </div>
                    <div className="text-sm text-center text-gray-600 mt-1">
                      Total Tankers
                    </div>
                    <div className="text-sm text-center text-gray-600">
                      {formatNumber(filteredData.reduce((sum, day) => sum + day.expectedTankerVolume, 0))} m³ from tankers
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Maintenance Issues */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Recent Maintenance Issues</h3>
                <button
                  onClick={() => setActiveTab('maintenance')}
                  className="text-sm text-[#4E4456] hover:text-[#4E4456]/80 flex items-center"
                >
                  View All
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
              <div className="overflow-hidden">
                {getFilteredMaintenanceIssues().slice(0, 3).map((issue, index) => (
                  <div key={index} className="border-b border-gray-100 py-3 last:border-b-0 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className="min-w-8 pt-1">
                        <AlertTriangle size={16} className="text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-gray-800">{issue.issue.split('\n')[0]}</p>
                          <span className="text-sm text-gray-500">{new Date(issue.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{issue.action}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {getFilteredMaintenanceIssues().length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    <Wrench size={40} className="mx-auto mb-3 text-gray-300" />
                    <p>No maintenance issues found for the selected period</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Monthly Performance Trends */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Monthly Performance Trends</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={getMonthlyPerformanceData()} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="displayMonth" 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'avgInlet') return [`${formatNumber(value)} m³/day`, 'Avg. Inlet'];
                      if (name === 'avgTreated') return [`${formatNumber(value)} m³/day`, 'Avg. Treated'];
                      if (name === 'efficiency') return [`${formatNumber(value, 1)}%`, 'Efficiency'];
                      if (name === 'recoveryRate') return [`${formatNumber(value, 1)}%`, 'Recovery Rate'];
                      return [value, name];
                    }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="avgInlet" 
                    name="Avg. Inlet"
                    fill="#94A3B8" 
                    yAxisId="left"
                    barSize={20}
                  />
                  <Bar 
                    dataKey="avgTreated" 
                    name="Avg. Treated"
                    fill={PRIMARY_COLOR} 
                    yAxisId="left"
                    barSize={20}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    name="Efficiency"
                    stroke="#10B981" 
                    yAxisId="right"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#10B981', stroke: 'white', strokeWidth: 1 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recoveryRate" 
                    name="Recovery Rate"
                    stroke="#8884d8" 
                    yAxisId="right"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#8884d8', stroke: 'white', strokeWidth: 1 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {/* Capacity Utilization Analysis */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Capacity Utilization Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart 
                      data={getDailyTreatmentData().slice(-30)}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#6b7280' }}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <YAxis 
                        tick={{ fill: '#6b7280' }}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`${formatNumber(value)} m³`, 'Volume']}
                        labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="inlet" 
                        name="Inlet Volume"
                        stroke={PRIMARY_COLOR} 
                        fill={`${PRIMARY_COLOR}30`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="treated" 
                        name="Treated Volume"
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="output" 
                        name="Output Volume"
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-6">
                  <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Design Capacity</h4>
                    <div className="text-3xl font-bold text-[#4E4456]">750 m³/day</div>
                    <div className="text-sm text-gray-600 mt-1">Membrane Bioreactor Technology</div>
                  </div>
                  
                  <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Utilization</h4>
                    <div className="text-3xl font-bold text-[#4E4456]">{formatNumber(metrics.capacityUtilization, 1)}%</div>
                    <div className="text-sm text-gray-600 mt-1">Based on average daily inlet</div>
                    <div className="mt-3 bg-gray-200 h-2.5 rounded-full">
                      <div 
                        className="bg-[#4E4456] h-2.5 rounded-full"
                        style={{ width: `${Math.min(metrics.capacityUtilization, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Peak Utilization</h4>
                    {(() => {
                      const peakDay = filteredData.reduce((max, day) => 
                        day.totalInletSewage > max.totalInletSewage ? day : max, 
                        { totalInletSewage: 0 }
                      );
                      const peakUtilization = (peakDay.totalInletSewage / 750) * 100;
                      
                      return (
                        <>
                          <div className="text-3xl font-bold text-[#4E4456]">{formatNumber(peakUtilization, 1)}%</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {peakDay.date && `on ${new Date(peakDay.date).toLocaleDateString()}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatNumber(peakDay.totalInletSewage)} m³ received
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Water Quality Metrics */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Treatment Performance Analysis</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Beaker size={16} className="mr-1" />
                  MBR Technology Metrics
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Overall Efficiency */}
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Overall Efficiency</h4>
                  <div className="text-3xl font-bold text-[#4E4456]">{formatNumber(metrics.overallEfficiency, 1)}%</div>
                  <div className="text-sm text-gray-600 mt-1">Treated vs Inlet Ratio</div>
                </div>
                
                {/* Water Recovery Rate */}
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Water Recovery</h4>
                  <div className="text-3xl font-bold text-[#4E4456]">{formatNumber(metrics.waterRecoveryRate, 1)}%</div>
                  <div className="text-sm text-gray-600 mt-1">TSE Output vs Treated Ratio</div>
                </div>
                
                {/* Average Processing Time */}
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Avg. Treatment Volume</h4>
                  <div className="text-3xl font-bold text-[#4E4456]">{formatNumber(metrics.avgDailyTreated, 0)} m³</div>
                  <div className="text-sm text-gray-600 mt-1">Daily treated water</div>
                </div>
                
                {/* Inlet Source */}
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Inlet Composition</h4>
                  <div className="flex justify-between">
                    <div>
                      <div className="text-xl font-bold text-[#4E4456]">{formatNumber(metrics.inletComposition.tankerPercentage, 1)}%</div>
                      <div className="text-xs text-gray-600">Tanker</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-[#4E4456]">{formatNumber(metrics.inletComposition.directPercentage, 1)}%</div>
                      <div className="text-xs text-gray-600">Direct</div>
                    </div>
                  </div>
                  <div className="mt-2 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#4E4456] h-2.5"
                      style={{ width: `${metrics.inletComposition.tankerPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Insights</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 mt-0.5">
                      <Check size={12} />
                    </span>
                    <span className="text-sm text-gray-600">
                      Plant efficiency is {metrics.overallEfficiency >= 100 ? 'excellent' : 
                        metrics.overallEfficiency >= 90 ? 'good' : 
                        metrics.overallEfficiency >= 80 ? 'acceptable' : 'below optimal levels'} 
                      at {formatNumber(metrics.overallEfficiency, 1)}%.
                      {metrics.overallEfficiency >= 100 ? ' The plant is producing more treated water than received, likely due to measurement variations or residual water in the system.' : ''}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 mt-0.5">
                      <Check size={12} />
                    </span>
                    <span className="text-sm text-gray-600">
                      The water recovery rate is {metrics.waterRecoveryRate >= 85 ? 'excellent' : 
                        metrics.waterRecoveryRate >= 80 ? 'good' : 
                        metrics.waterRecoveryRate >= 75 ? 'acceptable' : 'below optimal levels'} 
                      at {formatNumber(metrics.waterRecoveryRate, 1)}%, indicating
                      {metrics.waterRecoveryRate >= 85 ? ' high efficiency in the MBR filtration process.' : 
                       metrics.waterRecoveryRate >= 80 ? ' good efficiency in the MBR filtration process.' : 
                       metrics.waterRecoveryRate >= 75 ? ' acceptable efficiency in the MBR filtration process.' : 
                       ' potential issues with the MBR filtration process.'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center mr-2 mt-0.5">
                      <Check size={12} />
                    </span>
                    <span className="text-sm text-gray-600">
                      Plant capacity utilization is at {formatNumber(metrics.capacityUtilization, 1)}% of the design capacity (750 m³/day),
                      {metrics.capacityUtilization >= 90 ? ' indicating the plant is operating near its maximum capacity.' : 
                       metrics.capacityUtilization >= 70 ? ' indicating good utilization of plant capacity.' : 
                       metrics.capacityUtilization >= 50 ? ' indicating moderate utilization with room for additional load.' : 
                       ' indicating significant unused capacity.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'maintenance' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Maintenance Overview */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Maintenance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Maintenance Frequency</h4>
                  <div className="text-3xl font-bold text-[#4E4456]">{formatNumber(metrics.maintenanceFrequency, 1)}%</div>
                  <div className="text-sm text-gray-600 mt-1">of operational days</div>
                </div>
                
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Maintenance Days</h4>
                  <div className="text-3xl font-bold text-[#4E4456]">
                    {filteredData.filter(day => day.maintenanceAction1 || day.maintenanceAction2).length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    out of {filteredData.length} total days
                  </div>
                </div>
                
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Equipment Issues</h4>
                  <div className="text-3xl font-bold text-[#4E4456]">
                    {getFilteredMaintenanceIssues().filter(issue => 
                      issue.issue.toLowerCase().includes('pump') || 
                      issue.issue.toLowerCase().includes('blower') || 
                      issue.issue.toLowerCase().includes('valve') ||
                      issue.issue.toLowerCase().includes('aerator')
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    reported equipment problems
                  </div>
                </div>
                
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Routine Maintenance</h4>
                  <div className="text-3xl font-bold text-[#4E4456]">
                    {filteredData.filter(day => 
                      (day.maintenanceAction1?.toLowerCase().includes('clean') || day.maintenanceAction2?.toLowerCase().includes('clean')) &&
                      !(day.observations && day.observations.length > 5)
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    preventive maintenance days
                  </div>
                </div>
              </div>
              
              {/* Common Issues Bar Chart */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Common Maintenance Issues</h4>
                {(() => {
                  const issues = getFilteredMaintenanceIssues();
                  const issueTypes = {
                    'Aerator': 0,
                    'Pump': 0,
                    'Valve': 0,
                    'Blower': 0,
                    'Pipe': 0,
                    'Tank': 0,
                    'Other': 0
                  };
                  
                  issues.forEach(issue => {
                    const text = (issue.issue + ' ' + issue.action).toLowerCase();
                    if (text.includes('aerator')) issueTypes['Aerator']++;
                    else if (text.includes('pump')) issueTypes['Pump']++;
                    else if (text.includes('valve')) issueTypes['Valve']++;
                    else if (text.includes('blower')) issueTypes['Blower']++;
                    else if (text.includes('pipe')) issueTypes['Pipe']++;
                    else if (text.includes('tank')) issueTypes['Tank']++;
                    else issueTypes['Other']++;
                  });
                  
                  const chartData = Object.entries(issueTypes)
                    .map(([name, count]) => ({ name, count }))
                    .filter(item => item.count > 0)
                    .sort((a, b) => b.count - a.count);
                  
                  return (
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart 
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip 
                          formatter={(value) => [`${value} issues`, 'Count']}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar dataKey="count" fill={PRIMARY_COLOR} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  );
                })()}
              </div>
            </div>
            
            {/* Maintenance History */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Maintenance History</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Info size={14} className="mr-1" />
                  Showing {getFilteredMaintenanceIssues().length} maintenance records
                </div>
              </div>
              
              <div className="overflow-hidden">
                {getFilteredMaintenanceIssues().length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    {getFilteredMaintenanceIssues().map((issue, index) => (
                      <div key={index} className="border-b last:border-b-0 p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="min-w-8 pt-1">
                            <AlertTriangle size={16} className="text-amber-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
                              <h4 className="font-medium text-gray-800">{issue.issue.split('\n')[0]}</h4>
                              <span className="text-sm text-gray-500 whitespace-nowrap">
                                {new Date(issue.date).toLocaleDateString()}
                              </span>
                            </div>
                            
                            {issue.issue.split('\n').length > 1 && (
                              <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-600">
                                {issue.issue.split('\n').slice(1).map((line, i) => (
                                  <li key={i}>{line}</li>
                                ))}
                              </ul>
                            )}
                            
                            <div className="mt-3 bg-gray-50 p-3 rounded text-sm text-gray-600">
                              <h5 className="font-medium text-gray-700 mb-1">Maintenance Action:</h5>
                              <p>{issue.action}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-gray-500">
                    <Wrench size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No maintenance issues found for the selected period</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'data-table' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Data Explorer */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">STP Plant Data Explorer</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Info size={14} className="mr-1" />
                  Showing {filteredData.length} days of operation
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-4 border-b border-gray-200">Date</th>
                      <th className="py-3 px-4 border-b border-gray-200 text-right">Tankers</th>
                      <th className="py-3 px-4 border-b border-gray-200 text-right">Tanker Vol. (m³)</th>
                      <th className="py-3 px-4 border-b border-gray-200 text-right">Direct Inline (m³)</th>
                      <th className="py-3 px-4 border-b border-gray-200 text-right">Total Inlet (m³)</th>
                      <th className="py-3 px-4 border-b border-gray-200 text-right">Treated Water (m³)</th>
                      <th className="py-3 px-4 border-b border-gray-200 text-right">TSE Output (m³)</th>
                      <th className="py-3 px-4 border-b border-gray-200 text-right">Efficiency (%)</th>
                      <th className="py-3 px-4 border-b border-gray-200 text-right">Recovery (%)</th>
                      <th className="py-3 px-4 border-b border-gray-200 text-center">Maintenance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.sort((a, b) => new Date(b.date) - new Date(a.date)).map((day, index) => {
                      const efficiency = (day.totalTreatedWater / day.totalInletSewage) * 100;
                      const recovery = (day.totalTSEWaterOutput / day.totalTreatedWater) * 100;
                      const hasMaintenance = day.maintenanceAction1 || day.maintenanceAction2;
                      
                      return (
                        <tr key={index} className={`hover:bg-gray-50 transition-colors ${day.observations ? 'bg-amber-50/30' : ''}`}>
                          <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900">
                            {new Date(day.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-right text-gray-900">{day.tankersCount}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-right text-gray-900">{formatNumber(day.expectedTankerVolume)}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-right text-gray-900">{formatNumber(day.directInlineSewage)}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-right font-medium text-gray-900">{formatNumber(day.totalInletSewage)}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-right font-medium text-gray-900">{formatNumber(day.totalTreatedWater)}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-right text-gray-900">{formatNumber(day.totalTSEWaterOutput)}</td>
                          <td className="py-3 px-4 whitespace-nowrap text-right">
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                efficiency >= 100 ? 'bg-green-100 text-green-800' :
                                efficiency >= 90 ? 'bg-green-100 text-green-800' :
                                efficiency >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {formatNumber(efficiency, 1)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-right">
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                recovery >= 85 ? 'bg-blue-100 text-blue-800' :
                                recovery >= 80 ? 'bg-blue-100 text-blue-800' :
                                recovery >= 75 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {formatNumber(recovery, 1)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-center">
                            {hasMaintenance ? (
                              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                <Wrench size={12} className="mr-1" />
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                No
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {filteredData.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                    <XCircle size={24} className="text-gray-400" />
                  </div>
                  <p>No data found for the selected filters</p>
                  <button 
                    onClick={resetFilters}
                    className="mt-2 text-[#4E4456] hover:text-[#4E4456]/80 text-sm"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default STPPlant;
