import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Calendar, 
  Droplets, 
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
  Truck,
  ArrowRight,
  Download,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  RefreshCw,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

import { 
  LineChart as RechartLineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart,
  ComposedChart,
  ReferenceLine
} from 'recharts';

import { stpData, groupDataByMonth, calculateSTPMetrics, getMaintenanceIssues, getMonthlyAverages, getDateRanges } from '../data/stpData';
import PageHeader from '../components/PageHeader';

// Enhanced STP Dashboard Component
const EnhancedSTPDashboard = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  // State for view type (daily/monthly)
  const [viewType, setViewType] = useState('daily');
  // State for date range
  const [dateRange, setDateRange] = useState({
    start: '2024-07-01',
    end: '2025-05-16'
  });
  // State for efficiency threshold filter
  const [efficiencyThreshold, setEfficiencyThreshold] = useState(0);
  // State for maintenance days filter
  const [showMaintenanceDays, setShowMaintenanceDays] = useState(false);
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // Theme colors
  const PRIMARY_COLOR = '#4E4456';
  const SECONDARY_COLOR = '#6E5E78';
  const COLORS = [PRIMARY_COLOR, '#6E5E78', '#8F7A9A', '#AF96BC', '#D0B2DE', '#E6CCF0', '#F2E5F9'];
  
  // Set initial date range on component mount
  useEffect(() => {
    const { startDate, endDate } = getDateRanges();
    setDateRange({ start: startDate, end: endDate });
  }, []);
  
  // Filter data based on date range, efficiency threshold, and maintenance filter
  const filteredData = useMemo(() => {
    return stpData.filter(day => {
      // Filter by date range
      const dateInRange = day.date >= dateRange.start && day.date <= dateRange.end;
      
      // Filter by efficiency threshold
      const efficiency = (day.totalTSEWaterOutput / day.totalInletSewage) * 100;
      const meetsEfficiencyThreshold = efficiency >= efficiencyThreshold;
      
      // Filter by maintenance days
      const maintenanceFilter = showMaintenanceDays 
        ? (day.maintenanceAction1 || day.maintenanceAction2)
        : true;
      
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        (day.observations && day.observations.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (day.maintenanceAction1 && day.maintenanceAction1.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (day.maintenanceAction2 && day.maintenanceAction2.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return dateInRange && meetsEfficiencyThreshold && maintenanceFilter && matchesSearch;
    });
  }, [dateRange, efficiencyThreshold, showMaintenanceDays, searchTerm]);
  
  // Process data based on view type (daily or monthly)
  const processedData = useMemo(() => {
    return viewType === 'daily' ? filteredData : groupDataByMonth(filteredData);
  }, [viewType, filteredData]);
  
  // Calculate metrics
  const metrics = useMemo(() => {
    return calculateSTPMetrics(processedData);
  }, [processedData]);
  
  // Format numbers for display
  const formatNumber = (num, precision = 0) => {
    return num ? Number(num).toLocaleString('en-US', { maximumFractionDigits: precision }) : '0';
  };
  
  // Format percentage for display
  const formatPercent = (num) => {
    return num ? `${Number(num).toLocaleString('en-US', { maximumFractionDigits: 1 })}%` : '0%';
  };
  
  // Get efficiency color based on value
  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return '#22C55E'; // Green
    if (efficiency >= 85) return '#84CC16'; // Light Green
    if (efficiency >= 80) return '#FACC15'; // Yellow
    if (efficiency >= 70) return '#FB923C'; // Orange
    return '#EF4444'; // Red
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (viewType === 'monthly') {
      const [year, month] = dateString.split('-');
      return `${getMonthName(parseInt(month))} ${year}`;
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  // Get month name
  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
  };
  
  // Treatment process chart data
  const treatmentProcessData = useMemo(() => {
    return processedData.map(day => ({
      date: day.date,
      inlet: day.totalInletSewage,
      treated: day.totalTreatedWater,
      output: day.totalTSEWaterOutput,
      // Revised efficiency calculation: Output to Input ratio
      recoveryRate: (day.totalTSEWaterOutput / day.totalInletSewage) * 100,
      // Process efficiency: Output to Treated ratio
      processEfficiency: (day.totalTSEWaterOutput / day.totalTreatedWater) * 100,
      // Capacity utilization
      capacityUtilization: (day.totalInletSewage / 750) * 100,
      // Tanker contribution
      tankerContribution: (day.expectedTankerVolume / day.totalInletSewage) * 100
    }));
  }, [processedData]);
  
  // Source composition data
  const sourceCompositionData = useMemo(() => {
    const totalTankerVolume = processedData.reduce((sum, day) => sum + day.expectedTankerVolume, 0);
    const totalDirectSewage = processedData.reduce((sum, day) => sum + day.directInlineSewage, 0);
    
    return [
      { name: 'Tanker Discharge', value: totalTankerVolume },
      { name: 'Direct Inline', value: totalDirectSewage }
    ];
  }, [processedData]);
  
  // Maintenance issues
  const maintenanceIssues = useMemo(() => {
    return getMaintenanceIssues(filteredData);
  }, [filteredData]);
  
  return (
    <div className="p-6 bg-gray-50">
      <PageHeader
        title="STP Plant Monitoring Dashboard"
        description="Comprehensive analysis and monitoring of the Sewage Treatment Plant (MBR Technology, 750 m³/day)"
      />
      
      {/* Top Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-6 transition-all duration-300 ease-in-out flex items-center ${
            activeTab === 'overview' 
              ? 'border-b-2 border-[#4E4456] text-[#4E4456] font-medium' 
              : 'text-gray-500 hover:text-[#4E4456]/80'
          }`}
        >
          <Gauge size={18} className="mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`py-3 px-6 transition-all duration-300 ease-in-out flex items-center ${
            activeTab === 'performance' 
              ? 'border-b-2 border-[#4E4456] text-[#4E4456] font-medium' 
              : 'text-gray-500 hover:text-[#4E4456]/80'
          }`}
        >
          <TrendingUp size={18} className="mr-2" />
          Performance Analysis
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`py-3 px-6 transition-all duration-300 ease-in-out flex items-center ${
            activeTab === 'maintenance' 
              ? 'border-b-2 border-[#4E4456] text-[#4E4456] font-medium' 
              : 'text-gray-500 hover:text-[#4E4456]/80'
          }`}
        >
          <Wrench size={18} className="mr-2" />
          Maintenance History
        </button>
        <button
          onClick={() => setActiveTab('data-table')}
          className={`py-3 px-6 transition-all duration-300 ease-in-out flex items-center ${
            activeTab === 'data-table' 
              ? 'border-b-2 border-[#4E4456] text-[#4E4456] font-medium' 
              : 'text-gray-500 hover:text-[#4E4456]/80'
          }`}
        >
          <Table size={18} className="mr-2" />
          Data Explorer
        </button>
      </div>
      
      {/* Filter Controls Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {/* View Type Selector */}
            <div className="flex items-center space-x-3 bg-white p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => setViewType('daily')}
                className={`px-4 py-1.5 rounded-md transition-colors ${
                  viewType === 'daily' 
                  ? 'bg-[#4E4456] text-white' 
                  : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setViewType('monthly')}
                className={`px-4 py-1.5 rounded-md transition-colors ${
                  viewType === 'monthly' 
                  ? 'bg-[#4E4456] text-white' 
                  : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                Monthly
              </button>
            </div>
            
            {/* Date Range Picker */}
            <button 
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Calendar size={16} className="mr-2" />
              <span>{formatDate(dateRange.start)} - {formatDate(dateRange.end)}</span>
              <ChevronDown size={16} className="ml-2" />
            </button>
            
            {/* Maintenance Days Filter */}
            <button
              onClick={() => setShowMaintenanceDays(!showMaintenanceDays)}
              className={`flex items-center px-4 py-2 rounded transition-colors ${
                showMaintenanceDays
                ? 'bg-[#4E4456]/10 border border-[#4E4456]/30 text-[#4E4456]'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Wrench size={16} className="mr-2" />
              Maintenance Days
              {showMaintenanceDays && <Check size={16} className="ml-2" />}
            </button>
            
            {/* Efficiency Threshold */}
            <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden">
              <div className="px-3 py-2 text-gray-700 bg-gray-100 whitespace-nowrap">
                <Gauge size={16} className="inline-block mr-1" />
                <span>Recovery ≥</span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                value={efficiencyThreshold}
                onChange={(e) => setEfficiencyThreshold(parseInt(e.target.value) || 0)}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4E4456]/30 focus:border-[#4E4456]"
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Export Button */}
            <button className="flex items-center px-4 py-2 bg-[#4E4456] text-white rounded hover:bg-[#4E4456]/90 transition-colors">
              <Download size={16} className="mr-2" />
              Export Data
            </button>
          </div>
        </div>
        
        {/* Filter information */}
        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
          <span>
            {processedData.length} {viewType === 'daily' ? 'days' : 'months'} matching filters
          </span>
          <span className="flex items-center">
            <RefreshCw size={14} className="mr-1" />
            Last updated: May 16, 2025
          </span>
        </div>
      </div>
      
      {/* Summary Stats Banner - Show for all tabs */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-2">
          {/* Efficiency / Recovery Rate */}
          <div className="bg-[#4E4456]/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 flex items-center">
              Water Recovery Rate
              <HelpCircle size={14} className="ml-1 text-gray-400" title="TSE Output ÷ Inlet Sewage" />
            </h3>
            <div className="flex items-end mt-1">
              <p className="text-2xl font-bold text-gray-800" style={{ color: getEfficiencyColor(metrics.waterRecoveryRate) }}>
                {formatPercent(metrics.waterRecoveryRate)}
              </p>
            </div>
          </div>
          
          {/* Capacity Utilization */}
          <div className="bg-[#4E4456]/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 flex items-center">
              Capacity Utilization
              <HelpCircle size={14} className="ml-1 text-gray-400" title="Average Daily Inflow ÷ Design Capacity (750 m³/day)" />
            </h3>
            <div className="flex items-end mt-1">
              <p className="text-2xl font-bold text-gray-800">{formatPercent(metrics.capacityUtilization)}</p>
              <p className="text-sm text-gray-500 ml-1 mb-1">of 750 m³/day</p>
            </div>
          </div>
          
          {/* Process Efficiency */}
          <div className="bg-[#4E4456]/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 flex items-center">
              Process Efficiency
              <HelpCircle size={14} className="ml-1 text-gray-400" title="TSE Output ÷ Treated Water" />
            </h3>
            <div className="flex items-end mt-1">
              <p className="text-2xl font-bold text-gray-800">{formatPercent(metrics.processEfficiency)}</p>
            </div>
          </div>
          
          {/* Total Tankers */}
          <div className="bg-[#4E4456]/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Tankers</h3>
            <div className="flex items-end mt-1">
              <p className="text-2xl font-bold text-gray-800">{formatNumber(metrics.totalTankers)}</p>
              <p className="text-sm text-gray-500 ml-1 mb-1">
                ({formatNumber(metrics.avgTankersPerDay, 1)}/day)
              </p>
            </div>
          </div>
          
          {/* Total Treated Volume */}
          <div className="bg-[#4E4456]/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Treated Volume</h3>
            <div className="flex items-end mt-1">
              <p className="text-2xl font-bold text-gray-800">{formatNumber(metrics.totalTreatedVolume)}</p>
              <p className="text-sm text-gray-500 ml-1 mb-1">m³</p>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>Analysis period: {formatNumber(metrics.totalDaysAnalyzed)} {viewType === 'daily' ? 'days' : 'months'}</span>
          <span className="flex items-center">
            <Info size={14} className="mr-1" />
            All metrics calculated based on current filter settings
          </span>
        </div>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Treatment Process Performance */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Treatment Process Performance</h3>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <BarChart3 size={16} />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <TrendingUp size={16} />
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={treatmentProcessData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={formatDate}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(value) => `${value} m³`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'inlet') return [`${formatNumber(value)} m³`, 'Inlet Sewage'];
                      if (name === 'treated') return [`${formatNumber(value)} m³`, 'Treated Water'];
                      if (name === 'output') return [`${formatNumber(value)} m³`, 'TSE Output'];
                      if (name === 'recoveryRate') return [`${formatNumber(value, 1)}%`, 'Recovery Rate'];
                      return [value, name];
                    }}
                    labelFormatter={formatDate}
                  />
                  <Legend />
                  <ReferenceLine y={750} yAxisId="left" stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Design Capacity', position: 'top', fill: '#EF4444' }} />
                  <Bar 
                    dataKey="inlet" 
                    name="Inlet Sewage"
                    fill="#94A3B8" 
                    yAxisId="left"
                    barSize={8}
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar 
                    dataKey="treated" 
                    name="Treated Water"
                    fill="#A78BFA" 
                    yAxisId="left"
                    barSize={8}
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar 
                    dataKey="output" 
                    name="TSE Output"
                    fill={PRIMARY_COLOR}
                    yAxisId="left"
                    barSize={8}
                    radius={[10, 10, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recoveryRate" 
                    name="Recovery Rate"
                    stroke="#10B981" 
                    yAxisId="right"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="text-xs text-center text-gray-500 mt-2">
                {viewType === 'daily' ? 'Daily Treatment Data' : 'Monthly Treatment Data'} - Recovery Rate (TSE Output ÷ Inlet)
              </div>
            </div>
            
            {/* Inlet Source Composition */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Inlet Source Composition</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={sourceCompositionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {sourceCompositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${formatNumber(value)} m³`, 'Volume']}
                      />
                    </RechartsPieChart>
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
                        <span className="text-sm font-medium">{formatPercent(metrics.inletComposition.tankerPercentage)}</span>
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
                        <span className="text-sm font-medium">{formatPercent(metrics.inletComposition.directPercentage)}</span>
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
                      <span>Total tankers:</span>
                      <span className="font-medium">{formatNumber(metrics.totalTankers)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Avg. tankers per day:</span>
                      <span className="font-medium">{formatNumber(metrics.avgTankersPerDay, 1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* KPI Cards */}
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow lg:col-span-2">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Key Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Water Recovery Rate */}
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Water Recovery Rate</h4>
                    <Recycle size={20} className="text-[#4E4456]" />
                  </div>
                  <div className="relative h-28 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border-8 border-gray-200"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-3xl font-bold" style={{ color: getEfficiencyColor(metrics.waterRecoveryRate) }}>
                        {formatPercent(metrics.waterRecoveryRate)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-600 mt-1">
                    {metrics.waterRecoveryRate >= 90 ? 'Excellent' : 
                     metrics.waterRecoveryRate >= 85 ? 'Good' : 
                     metrics.waterRecoveryRate >= 80 ? 'Average' : 'Needs Improvement'}
                  </p>
                </div>
                
                {/* Process Efficiency */}
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Process Efficiency</h4>
                    <Beaker size={20} className="text-[#4E4456]" />
                  </div>
                  <div className="flex flex-col items-center justify-center h-28">
                    <div className="text-3xl font-bold text-[#4E4456]">{formatPercent(metrics.processEfficiency)}</div>
                    <div className="text-sm text-center text-gray-600 mt-1">
                      TSE: {formatNumber(metrics.totalOutputVolume)} m³
                    </div>
                    <div className="text-sm text-center text-gray-600">
                      Treated: {formatNumber(metrics.totalTreatedVolume)} m³
                    </div>
                  </div>
                </div>
                
                {/* Capacity Utilization */}
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Capacity Utilization</h4>
                    <Gauge size={20} className="text-[#4E4456]" />
                  </div>
                  <div className="flex flex-col items-center justify-center h-28">
                    <div className="text-3xl font-bold text-[#4E4456]">{formatPercent(metrics.capacityUtilization)}</div>
                    <div className="text-sm text-center text-gray-600 mt-1">
                      Avg. Daily: {formatNumber(metrics.avgDailyInflow, 0)} m³
                    </div>
                    <div className="text-sm text-center text-gray-600">
                      Design: 750 m³/day
                    </div>
                  </div>
                </div>
                
                {/* Tanker Details */}
                <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Tanker Analysis</h4>
                    <Truck size={20} className="text-[#4E4456]" />
                  </div>
                  <div className="flex flex-col items-center justify-center h-28">
                    <div className="text-3xl font-bold text-[#4E4456]">
                      {formatNumber(metrics.totalTankers)}
                    </div>
                    <div className="text-sm text-center text-gray-600 mt-1">
                      Total Tankers
                    </div>
                    <div className="text-sm text-center text-gray-600">
                      {formatNumber(metrics.totalTankerVolume)} m³ from tankers
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
                  <ChevronDown size={16} className="ml-1" />
                </button>
              </div>
              <div className="overflow-hidden">
                {maintenanceIssues.slice(0, 3).map((issue, index) => (
                  <div key={index} className="border-b border-gray-100 py-3 last:border-b-0 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className="min-w-8 pt-1">
                        <AlertTriangle size={16} className="text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-gray-800">{issue.issue.split('\n')[0]}</p>
                          <span className="text-sm text-gray-500">{formatDate(issue.date)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{issue.action}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {maintenanceIssues.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                    <p>No maintenance issues found for the selected period.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Performance Analysis</h3>
            
            {/* Capacity Utilization Chart */}
            <div className="mb-8">
              <h4 className="text-md font-medium mb-3 text-gray-700">Capacity Utilization Over Time</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={treatmentProcessData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#6b7280' }} 
                    tickFormatter={formatDate}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${formatNumber(value, 1)}%`, 'Capacity Utilization']}
                    labelFormatter={formatDate}
                  />
                  <ReferenceLine y={100} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Max Capacity', position: 'right', fill: '#EF4444' }} />
                  <ReferenceLine y={80} stroke="#22C55E" strokeDasharray="3 3" label={{ value: 'Optimal Utilization', position: 'right', fill: '#22C55E' }} />
                  <Area 
                    type="monotone" 
                    dataKey="capacityUtilization" 
                    name="Capacity Utilization"
                    stroke={PRIMARY_COLOR}
                    fill={`${PRIMARY_COLOR}30`}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-2">
                The plant is operating at {formatPercent(metrics.capacityUtilization)} of its design capacity (750 m³/day).
                The maximum utilization reached was {formatPercent(metrics.maxCapacityUtilization)}.
              </p>
            </div>
            
            {/* Recovery Rate & Process Efficiency Chart */}
            <div className="mt-8">
              <h4 className="text-md font-medium mb-3 text-gray-700">Recovery Rate & Process Efficiency</h4>
              <ResponsiveContainer width="100%" height={300}>
                <RechartLineChart data={treatmentProcessData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#6b7280' }} 
                    tickFormatter={formatDate}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'recoveryRate') return [`${formatNumber(value, 1)}%`, 'Recovery Rate'];
                      if (name === 'processEfficiency') return [`${formatNumber(value, 1)}%`, 'Process Efficiency'];
                      return [value, name];
                    }}
                    labelFormatter={formatDate}
                  />
                  <Legend />
                  <ReferenceLine y={85} stroke="#22C55E" strokeDasharray="3 3" label={{ value: 'Target Recovery', position: 'right', fill: '#22C55E' }} />
                  <Line 
                    type="monotone" 
                    dataKey="recoveryRate" 
                    name="Recovery Rate"
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="processEfficiency" 
                    name="Process Efficiency"
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                </RechartLineChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-2">
                The water recovery rate (TSE Output ÷ Inlet) was {formatPercent(metrics.waterRecoveryRate)} on average.
                The plant achieved the target recovery rate (85%+) on {formatNumber(metrics.daysAboveTargetEfficiency)} days 
                ({formatPercent(metrics.targetEfficiencyPercentage)} of the time).
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'maintenance' && (
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Maintenance History</h3>
            
            {/* Maintenance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700">Maintenance Frequency</h4>
                <p className="text-2xl font-bold text-gray-800 mt-2">{formatPercent(metrics.maintenanceFrequency)}</p>
                <p className="text-sm text-gray-600">of days required maintenance</p>
              </div>
              
              <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700">Maintenance Records</h4>
                <p className="text-2xl font-bold text-gray-800 mt-2">{formatNumber(maintenanceIssues.length)}</p>
                <p className="text-sm text-gray-600">documented issues</p>
              </div>
              
              <div className="bg-[#4E4456]/5 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700">Last Maintenance</h4>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {maintenanceIssues.length > 0 
                    ? formatDate(maintenanceIssues[0].date)
                    : 'N/A'}
                </p>
                <p className="text-sm text-gray-600">most recent issue</p>
              </div>
            </div>
            
            {/* Maintenance Issues List */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-2 font-medium text-gray-700">Date</div>
                  <div className="col-span-4 font-medium text-gray-700">Issue</div>
                  <div className="col-span-6 font-medium text-gray-700">Action Taken</div>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {maintenanceIssues.map((issue, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 px-4 py-3">
                      <div className="col-span-2 text-gray-600">{formatDate(issue.date)}</div>
                      <div className="col-span-4 text-gray-800">{issue.issue}</div>
                      <div className="col-span-6 text-gray-700">{issue.action}</div>
                    </div>
                  </div>
                ))}
                
                {maintenanceIssues.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                    <p>No maintenance issues found for the selected period.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'data-table' && (
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Data Explorer</h3>
              
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-3 py-1.5 bg-gray-100 rounded text-gray-700 hover:bg-gray-200 transition-colors">
                  <Filter size={14} className="mr-1" />
                  Filter
                </button>
                <button className="flex items-center px-3 py-1.5 bg-gray-100 rounded text-gray-700 hover:bg-gray-200 transition-colors">
                  <Download size={14} className="mr-1" />
                  Export
                </button>
              </div>
            </div>
            
            {/* Data Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tankers
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanker Volume (m³)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Direct Inline (m³)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Inlet (m³)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Treated Water (m³)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TSE Output (m³)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recovery Rate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity Used
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {treatmentProcessData.slice(0, 20).map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(day.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {processedData[index].tankersCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatNumber(processedData[index].expectedTankerVolume)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatNumber(processedData[index].directInlineSewage)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatNumber(day.inlet)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatNumber(day.treated)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatNumber(day.output)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              day.recoveryRate >= 85 
                              ? 'bg-green-100 text-green-800' 
                              : day.recoveryRate >= 80
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {formatPercent(day.recoveryRate)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatPercent(day.capacityUtilization)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">20</span> of{' '}
                      <span className="font-medium">{processedData.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        <ChevronDown className="h-5 w-5 rotate-90" aria-hidden="true" />
                      </button>
                      <button className="bg-[#4E4456] border-[#4E4456] text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        1
                      </button>
                      <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        2
                      </button>
                      <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium">
                        3
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                      <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        {Math.ceil(processedData.length / 20)}
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        <ChevronDown className="h-5 w-5 -rotate-90" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSTPDashboard;