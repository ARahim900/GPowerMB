import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ComposedChart, Scatter
} from 'recharts';
import {
  ArrowUpRight, ArrowDownRight, BarChart3,
  Calendar, Filter, ArrowRightLeft,
  RefreshCw, Database, Settings, AlertTriangle,
  Droplet, CircleOff, TrendingUp, TrendingDown, 
  HelpCircle, Download, Share2, Home, Search, Check, XCircle, Info
} from 'lucide-react';

import { 
  waterData, 
  getMonths, 
  getZoneTypes, 
  getConsumptionTypes, 
  calculateLossPercentage, 
  calculateZoneLoss, 
  getTotalConsumptionByMonth, 
  getZoneSummaryByMonth, 
  getCustomersByZone 
} from '../data/waterData';
import PageHeader from '../components/PageHeader';

// Main App Component
const WaterAnalysis = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeMonthFilter, setActiveMonthFilter] = useState('Apr-2025');
  const [activeYearFilter, setActiveYearFilter] = useState('2025');
  const [activeZoneFilter, setActiveZoneFilter] = useState('All Zones');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isMonthFilterOpen, setIsMonthFilterOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState(getMonths().map(month => month.id));
  const [searchQuery, setSearchQuery] = useState('');

  // Muscat Bay color palette
  const THEME = {
    primary: '#9A95A6', // Slate purple (darker)
    primaryLight: '#ADA6B9', // Lighter slate purple
    secondary: '#8ED2D6', // Teal/aqua from logo
    secondaryLight: '#B5E4E7', // Lighter teal
    accent: '#4E4456', // Darker purple
    white: '#FFFFFF',
    gray: {
      50: '#F9F9FB',
      100: '#F1F1F4',
      200: '#E2E2E7',
      300: '#D2D2D9',
      400: '#B5B5BD',
      500: '#92929A',
      600: '#696971',
      700: '#4B4B50',
      800: '#313134',
      900: '#1C1C1E',
    }
  };

  // Colors for charts
  const CHART_COLORS = [
    '#8ED2D6', // Teal from logo
    '#4E4456', // Darker purple
    '#9A95A6', // Slate purple
    '#B5E4E7', // Light teal
    '#6E5E76', // Medium purple
    '#DCDADF'  // Light lavender
  ];

  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setDataLoaded(true);
    }, 800);
  }, []);

  // Get zone code from zone name
  const getZoneCode = useCallback((filter) => {
    switch(filter) {
      case 'Zone FM': return 'FM';
      case 'Zone 03A': return '03A';
      case 'Zone 03B': return '03B';
      case 'Zone 05': return '05';
      case 'Zone 08': return '08';
      case 'Village Square': return 'VS';
      default: return null;
    }
  }, []);

  // Get zone data based on selected filter
  const zoneCode = useMemo(() => getZoneCode(activeZoneFilter), [getZoneCode, activeZoneFilter]);

  // Toggle month filter dropdown
  const toggleMonthFilter = () => {
    setIsMonthFilterOpen(!isMonthFilterOpen);
    if (isTypeFilterOpen) setIsTypeFilterOpen(false);
  };
  
  // Toggle type filter dropdown
  const toggleTypeFilter = () => {
    setIsTypeFilterOpen(!isTypeFilterOpen);
    if (isMonthFilterOpen) setIsMonthFilterOpen(false);
  };
  
  // Toggle month in selection
  const toggleMonth = (monthId) => {
    if (selectedMonths.includes(monthId)) {
      if (selectedMonths.length > 1) { // Ensure at least one month is selected
        setSelectedMonths(selectedMonths.filter(id => id !== monthId));
      }
    } else {
      setSelectedMonths([...selectedMonths, monthId]);
    }
  };
  
  // Select all months
  const selectAllMonths = () => {
    setSelectedMonths(getMonths().map(month => month.id));
  };
  
  // Clear all months (keep just one)
  const clearAllMonths = () => {
    setSelectedMonths([getMonths()[0].id]);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };

  // Render the selected tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return <OverviewSection
                  activeMonthFilter={activeMonthFilter}
                  activeYearFilter={activeYearFilter}
                  activeZoneFilter={activeZoneFilter}
                  THEME={THEME}
                  CHART_COLORS={CHART_COLORS}
                  formatNumber={formatNumber}
                />;
      case 'group-details':
        return <GroupDetailsSection
                  activeMonthFilter={activeMonthFilter}
                  activeYearFilter={activeYearFilter}
                  activeZoneFilter={activeZoneFilter}
                  zoneCode={zoneCode}
                  THEME={THEME}
                  CHART_COLORS={CHART_COLORS}
                  formatNumber={formatNumber}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />;
      case 'type-details':
        return <TypeDetailsSection
                  activeMonthFilter={activeMonthFilter}
                  activeYearFilter={activeYearFilter}
                  THEME={THEME}
                  CHART_COLORS={CHART_COLORS}
                  formatNumber={formatNumber}
                />;
      case 'loss-details':
        return <LossDetailsSection
                  activeMonthFilter={activeMonthFilter}
                  activeYearFilter={activeYearFilter}
                  activeZoneFilter={activeZoneFilter}
                  zoneCode={zoneCode}
                  THEME={THEME}
                  CHART_COLORS={CHART_COLORS}
                  formatNumber={formatNumber}
                />;
      default:
        return <OverviewSection
                  activeMonthFilter={activeMonthFilter}
                  activeYearFilter={activeYearFilter}
                  activeZoneFilter={activeZoneFilter}
                  THEME={THEME}
                  CHART_COLORS={CHART_COLORS}
                  formatNumber={formatNumber}
                />;
    }
  };

  // Help modal component
  const HelpModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">Dashboard Help</h3>
            <button onClick={() => setShowHelp(false)} className="text-gray-500 hover:text-gray-700">
              <XCircle size={20} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Overview Tab</h4>
              <p className="text-gray-600">Provides a high-level summary of water consumption data across all zones with main KPIs, monthly consumption trends, and loss analysis charts.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Group Details Tab</h4>
              <p className="text-gray-600">Displays detailed consumption analysis for specific zones, including bulk and individual meter readings with historical data.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Type Details Tab</h4>
              <p className="text-gray-600">Shows consumption breakdown by category (Irrigation, Residential Villa, Retail, etc.) to identify usage patterns.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Loss Details Tab</h4>
              <p className="text-gray-600">Focuses on water loss analysis with breakdowns by loss type and zone, helping identify problem areas.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Filters</h4>
              <p className="text-gray-600">Use the Month, Year, and Zone filters at the top to customize the data displayed across all tabs.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Terms Explained</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li><span className="font-medium">L1 (Main Bulk Supply)</span>: Total water supplied to the entire system</li>
                <li><span className="font-medium">L2 (Zone Bulk Meters)</span>: Water measured at zone entry points</li>
                <li><span className="font-medium">L3 (Individual Meters)</span>: Water measured at individual customer meters</li>
                <li><span className="font-medium">Stage 1 Loss</span>: Difference between L1 and L2 (transmission losses)</li>
                <li><span className="font-medium">Stage 2 Loss</span>: Difference between L2 and L3 (distribution losses)</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200">
          <button 
            onClick={() => setShowHelp(false)} 
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Tab Button Component
  const TabButton = ({ icon, title, active, onClick }) => {
    return (
      <button
        className={`flex items-center space-x-2 px-4 py-3 md:px-6 md:py-4 transition-colors text-sm md:text-base ${
          active ? 'text-[#4E4456] font-semibold border-b-2 border-[#8ED2D6]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        onClick={onClick}
      >
        {icon}
        <span>{title}</span>
      </button>
    );
  };

  // Loading Screen Component with Muscat Bay styling
  const LoadingScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#4E4456] to-[#9A95A6] text-white">
      <div className="relative w-32 h-32 mb-8">
        {/* Muscat Bay inspired logo animation */}
        <div className="absolute w-8 h-32 bg-[#8ED2D6] left-0 bottom-0 animate-pulse"></div>
        <div className="absolute w-8 h-24 bg-[#8ED2D6] left-12 bottom-0 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute w-12 h-12 bg-[#8ED2D6] right-0 top-0 animate-pulse" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)', animationDelay: '0.4s' }}></div>
        <div className="absolute w-32 h-6 bg-white bottom-0 right-0 animate-pulse" style={{ transform: 'skew(-45deg)', transformOrigin: 'bottom right', animationDelay: '0.6s' }}></div>
        <div className="absolute w-32 h-6 bg-white bottom-16 right-0 animate-pulse" style={{ transform: 'skew(-45deg)', transformOrigin: 'bottom right', animationDelay: '0.8s' }}></div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Loading Water Management System</h2>
      <p className="text-[#8ED2D6] animate-pulse">Preparing your dashboard...</p>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title="Water Analysis" 
        subtitle="Comprehensive water supply and consumption analysis" 
      />
      
      {/* Loading Screen */}
      {!dataLoaded ? (
        <LoadingScreen />
      ) : (
        <main className="p-6 bg-gray-50">
          {/* Help Modal */}
          {showHelp && <HelpModal />}
          
          {/* Top Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto bg-white rounded-t-lg shadow-sm">
            <TabButton
              icon={<BarChart3 size={18} />}
              title="Overview"
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
            />
            <TabButton
              icon={<Database size={18} />}
              title="Group Details"
              active={activeTab === 'group-details'}
              onClick={() => setActiveTab('group-details')}
            />
            <TabButton
              icon={<RefreshCw size={18} />}
              title="Type Details"
              active={activeTab === 'type-details'}
              onClick={() => setActiveTab('type-details')}
            />
            <TabButton
              icon={<AlertTriangle size={18} />}
              title="Loss Details"
              active={activeTab === 'loss-details'}
              onClick={() => setActiveTab('loss-details')}
            />
          </div>

          {/* Filter Bar */}
          <div className="bg-white border-b border-gray-200 py-3 px-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Filter size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Filters:</span>
              </div>

              {/* Month Filter */}
              <div className="relative">
                <button 
                  onClick={toggleMonthFilter}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Calendar size={16} className="mr-2" />
                  {selectedMonths.length === getMonths().length ? 'All Months' : `${selectedMonths.length} Month${selectedMonths.length !== 1 ? 's' : ''}`}
                  <ArrowDownRight size={16} className="ml-2" />
                </button>
                
                {isMonthFilterOpen && (
                  <div className="absolute z-10 mt-1 w-64 bg-white rounded-md shadow-lg">
                    <div className="p-2 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-700">Filter by Month</h3>
                        <div className="flex space-x-2">
                          <button 
                            onClick={selectAllMonths}
                            className="text-xs text-[#4E4456] hover:text-[#4E4456]/80 font-medium"
                          >
                            Select All
                          </button>
                          <button 
                            onClick={clearAllMonths}
                            className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-2">
                      {getMonths().map(month => (
                        <div 
                          key={month.id} 
                          onClick={() => toggleMonth(month.id)}
                          className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                        >
                          <div className={`w-5 h-5 rounded flex items-center justify-center mr-2 ${
                            selectedMonths.includes(month.id) 
                              ? 'bg-[#4E4456] text-white' 
                              : 'border border-gray-300'
                          }`}>
                            {selectedMonths.includes(month.id) && <Check size={14} />}
                          </div>
                          <span>{month.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Year Filter */}
              <div className="flex items-center">
                <label className="text-sm text-gray-600 mr-2">Year:</label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#8ED2D6] focus:border-[#8ED2D6] p-2"
                  value={activeYearFilter}
                  onChange={(e) => setActiveYearFilter(e.target.value)}
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>

              {/* Zone Filter (Conditionally rendered based on activeTab) */}
              {(activeTab === 'overview' || activeTab === 'group-details' || activeTab === 'loss-details') && (
                <div className="flex items-center">
                  <label className="text-sm text-gray-600 mr-2">Zone:</label>
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#8ED2D6] focus:border-[#8ED2D6] p-2"
                    value={activeZoneFilter}
                    onChange={(e) => setActiveZoneFilter(e.target.value)}
                  >
                    <option value="All Zones">All Zones</option>
                    <option value="Zone FM">Zone FM</option>
                    <option value="Zone 03A">Zone 03A</option>
                    <option value="Zone 03B">Zone 03B</option>
                    <option value="Zone 05">Zone 05</option>
                    <option value="Zone 08">Zone 08</option>
                    <option value="Village Square">Village Square</option>
                  </select>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex items-center text-xs text-gray-700 bg-gray-100 rounded px-2 py-1 hover:bg-gray-200 transition">
                  <Download size={14} className="mr-1" />
                  <span>Export</span>
                </button>
                <button 
                  onClick={() => setShowHelp(true)}
                  className="flex items-center text-xs text-gray-700 bg-gray-100 rounded px-2 py-1 hover:bg-gray-200 transition"
                >
                  <HelpCircle size={14} className="mr-1" />
                  <span>Help</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div>
            {renderTabContent()}
          </div>
        </main>
      )}
    </div>
  );
};

// Enhanced KPI Card Component
const KPICard = ({ title, value, change, changeType, icon, trend, description, THEME }) => {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-md bg-white h-48 transition-all duration-200 hover:shadow-lg group">
      <div className={`absolute top-0 left-0 w-1 h-full ${
        trend === 'good' ? 'bg-green-500' : 
        trend === 'warning' ? 'bg-yellow-500' : 
        trend === 'critical' ? 'bg-red-500' : 
        'bg-[#8ED2D6]'
      }`}></div>
      <div className="p-6 relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-600">{title}</h3>
          <div className={`p-2 rounded-full ${
            trend === 'good' ? 'bg-green-100 text-green-600' : 
            trend === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
            trend === 'critical' ? 'bg-red-100 text-red-600' : 
            'bg-[#B5E4E7] text-[#4E4456]'
          }`}>
            {icon}
          </div>
        </div>
        <div>
          <div className="mt-4 flex items-baseline">
            <p className="text-4xl font-bold text-gray-800">{value}</p>
            <span className="ml-2 text-gray-500 text-sm">units</span>
          </div>
          <div className="mt-4 flex items-center">
            {changeType === 'increase' ? (
              <ArrowUpRight size={18} className={`${trend === 'good' ? 'text-green-500' : 'text-red-500'} mr-1`} />
            ) : (
              <ArrowDownRight size={18} className={`${trend === 'good' ? 'text-green-500' : 'text-red-500'} mr-1`} />
            )}
            <span className={`text-sm font-medium ${trend === 'good' ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </span>
            <span className="text-gray-500 text-xs ml-2">vs. prev. month</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-0 bg-gray-100 group-hover:h-8 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

// ===== OVERVIEW SECTION =====
const OverviewSection = ({ activeMonthFilter, activeYearFilter, activeZoneFilter, THEME, CHART_COLORS, formatNumber }) => {
  // KPI data for the overview section
  const kpiData = {
    bulk: {
      value: formatNumber(waterData.mainBulkMeter[activeMonthFilter]),
      change: '31.8%',
      changeType: 'increase',
      trend: 'warning',
      description: 'Total water supplied to the system'
    },
    consumption: {
      value: formatNumber(waterData.zoneBulkMeters[activeMonthFilter]),
      change: '30.6%',
      changeType: 'decrease',
      trend: 'good',
      description: 'Total water measured at zone level'
    },
    individualMeters: {
      value: formatNumber(waterData.individualMeters[activeMonthFilter]),
      change: '35.3%',
      changeType: 'decrease',
      trend: 'good',
      description: 'Total end-user consumption'
    },
    stageOneLoss: {
      value: formatNumber(waterData.lossData.stageOne[activeMonthFilter]),
      change: '301.8%',
      changeType: 'increase',
      trend: 'critical',
      description: 'Loss between main supply and zones'
    },
    stageTwoLoss: {
      value: formatNumber(waterData.lossData.stageTwo[activeMonthFilter]),
      change: '6.5%',
      changeType: 'decrease',
      trend: 'good',
      description: 'Loss between zones and end users'
    },
    totalLoss: {
      value: formatNumber(waterData.lossData.total[activeMonthFilter]),
      change: '2266.1%',
      changeType: 'increase',
      trend: 'critical',
      description: 'Combined system water losses'
    }
  };

  // Prepare monthly consumption data for charts
  const monthlyConsumptionData = getMonths()
    .filter(month => month.id.includes(activeYearFilter))
    .map(month => ({
      name: month.id.split('-')[0],
      L1: waterData.mainBulkMeter[month.id],
      L2: waterData.zoneBulkMeters[month.id],
      L3: waterData.individualMeters[month.id]
    }));

  // Prepare loss data for charts
  const lossData = getMonths()
    .filter(month => month.id.includes(activeYearFilter))
    .map(month => ({
      name: month.id.split('-')[0],
      Loss1: waterData.lossData.stageOne[month.id],
      Loss2: waterData.lossData.stageTwo[month.id],
      Total: waterData.lossData.total[month.id]
    }));

  // Prepare zone distribution data for charts
  const zoneDistributionData = getZoneSummaryByMonth(activeMonthFilter)
    .map(zone => ({
      name: zone.name,
      value: zone.individual
    }));

  // Prepare loss percentage by zone data for charts  
  const lossPercentageByZoneData = getZoneSummaryByMonth(activeMonthFilter)
    .map(zone => ({
      name: zone.name.replace('Zone ', '').replace('Village Square', 'VS'),
      loss: parseFloat(zone.percentage.toFixed(1))
    }));

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Dashboard Summary</h2>
          <div className="flex items-center text-sm">
            <span className="text-gray-500">Selected Period:</span>
            <span className="ml-2 font-medium text-gray-800">{activeMonthFilter}</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium">Current Status:</span> The system shows a high water loss rate of <span className="font-medium text-red-600">49.6%</span> in {activeMonthFilter}, 
              mainly from transmission losses. Zone 03A continues to show the highest loss percentage at <span className="font-medium text-red-600">78.9%</span>, 
              while Zone FM shows the lowest at <span className="font-medium text-yellow-600">25.3%</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="L1 (Total Bulk Supply)"
          value={kpiData.bulk.value}
          change={kpiData.bulk.change}
          changeType={kpiData.bulk.changeType}
          trend={kpiData.bulk.trend}
          description={kpiData.bulk.description}
          icon={<Database size={18} />}
          THEME={THEME}
        />
        <KPICard
          title="L2 (Total Consumption)"
          value={kpiData.consumption.value}
          change={kpiData.consumption.change}
          changeType={kpiData.consumption.changeType}
          trend={kpiData.consumption.trend}
          description={kpiData.consumption.description}
          icon={<BarChart3 size={18} />}
          THEME={THEME}
        />
        <KPICard
          title="L3 (Individual Meters)"
          value={kpiData.individualMeters.value}
          change={kpiData.individualMeters.change}
          changeType={kpiData.individualMeters.changeType}
          trend={kpiData.individualMeters.trend}
          description={kpiData.individualMeters.description}
          icon={<ArrowRightLeft size={18} />}
          THEME={THEME}
        />
        <KPICard
          title="Stage 1 Loss (L1-L2)"
          value={kpiData.stageOneLoss.value}
          change={kpiData.stageOneLoss.change}
          changeType={kpiData.stageOneLoss.changeType}
          trend={kpiData.stageOneLoss.trend}
          description={kpiData.stageOneLoss.description}
          icon={<TrendingUp size={18} />}
          THEME={THEME}
        />
        <KPICard
          title="Stage 2 Loss (L2-L3)"
          value={kpiData.stageTwoLoss.value}
          change={kpiData.stageTwoLoss.change}
          changeType={kpiData.stageTwoLoss.changeType}
          trend={kpiData.stageTwoLoss.trend}
          description={kpiData.stageTwoLoss.description}
          icon={<TrendingDown size={18} />}
          THEME={THEME}
        />
        <KPICard
          title="Total Loss"
          value={kpiData.totalLoss.value}
          change={kpiData.totalLoss.change}
          changeType={kpiData.totalLoss.changeType}
          trend={kpiData.totalLoss.trend}
          description={kpiData.totalLoss.description}
          icon={<AlertTriangle size={18} />}
          THEME={THEME}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Consumption Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyConsumptionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${formatNumber(value)} units`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="L1" stroke={CHART_COLORS[0]} strokeWidth={3} dot={{ r: 3, strokeWidth: 2 }} name="L1 (Main Bulk)" />
                <Line type="monotone" dataKey="L2" stroke={CHART_COLORS[1]} strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} name="L2 (Zone Bulk)" />
                <Line type="monotone" dataKey="L3" stroke={CHART_COLORS[2]} strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }} name="L3 (Individual)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Loss Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={lossData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${formatNumber(value)} units`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
                <Legend />
                <Bar dataKey="Loss1" fill={CHART_COLORS[4]} name="Stage 1 Loss" />
                <Bar dataKey="Loss2" fill={CHART_COLORS[5]} name="Stage 2 Loss" />
                <Line type="monotone" dataKey="Total" stroke={CHART_COLORS[2]} strokeWidth={3} name="Total Loss" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Zone Distribution ({activeMonthFilter})</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={zoneDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {zoneDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${formatNumber(value)} units`, 'Consumption']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Loss Percentage by Zone ({activeMonthFilter})</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lossPercentageByZoneData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Loss Percentage']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
                <Legend />
                <Bar
                  dataKey="loss"
                  fill={CHART_COLORS[0]}
                  radius={[0, 4, 4, 0]}
                  name="Loss %"
                  label={{ position: 'right', formatter: (value) => `${value}%` }}
                >
                  {lossPercentageByZoneData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={
                        entry.loss > 70 ? '#EF4444' :
                        entry.loss > 50 ? '#F59E0B' :
                        entry.loss > 30 ? '#FBBF24' :
                        '#10B981'
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== GROUP DETAILS SECTION =====
const GroupDetailsSection = ({ 
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
  // Get data for the selected zone
  const selectedZoneData = useMemo(() => {
    if (!zoneCode) return null;
    
    const zoneBulk = waterData.zoneData[zoneCode]?.bulk[activeMonthFilter] || 0;
    const zoneIndividual = waterData.zoneData[zoneCode]?.individual[activeMonthFilter] || 0;
    const zoneLoss = zoneBulk - zoneIndividual;
    const zoneLossPercentage = zoneBulk > 0 ? (zoneLoss / zoneBulk) * 100 : 0;
    
    return {
      bulk: zoneBulk,
      individual: zoneIndividual,
      loss: zoneLoss,
      lossPercentage: zoneLossPercentage.toFixed(1)
    };
  }, [zoneCode, activeMonthFilter]);
  
  // Get historical data for the selected zone
  const historicalZoneData = useMemo(() => {
    if (!zoneCode) return [];
    
    return getMonths()
      .filter(month => month.id.includes(activeYearFilter))
      .map(month => {
        const bulk = waterData.zoneData[zoneCode].bulk[month.id] || 0;
        const individual = waterData.zoneData[zoneCode].individual[month.id] || 0;
        const loss = bulk - individual;
        const lossPercentage = bulk > 0 ? (loss / bulk) * 100 : 0;
        
        return {
          month: month.id.split('-')[0],
          bulk,
          individual,
          loss,
          lossPercentage: parseFloat(lossPercentage.toFixed(1))
        };
      });
  }, [zoneCode, activeYearFilter]);
  
  // Get zone summary data for all zones
  const allZonesData = useMemo(() => {
    return getZoneSummaryByMonth(activeMonthFilter);
  }, [activeMonthFilter]);
  
  // Get individual meter data for the selected zone
  const zoneCustomers = useMemo(() => {
    if (!zoneCode) return waterData.customerMeters;
    return getCustomersByZone(zoneCode);
  }, [zoneCode]);
  
  // Filter meters based on search query
  const filteredMeters = useMemo(() => {
    return zoneCustomers.filter(meter => 
      meter.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meter.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [zoneCustomers, searchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Zone Analysis Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {activeZoneFilter === 'All Zones' ? 'Zone Analysis Summary' : activeZoneFilter + ' Analysis'}
        </h3>

        {activeZoneFilter !== 'All Zones' && zoneCode && selectedZoneData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#8ED2D6] shadow">
              <h4 className="text-lg font-medium text-gray-600 mb-2">Bulk Meter</h4>
              <p className="text-3xl font-bold text-[#4E4456]">{formatNumber(selectedZoneData.bulk)}</p>
              <p className="text-sm text-gray-500 mt-1">units</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-[#4E4456] shadow">
              <h4 className="text-lg font-medium text-gray-600 mb-2">Individual Meters</h4>
              <p className="text-3xl font-bold text-[#4E4456]">{formatNumber(selectedZoneData.individual)}</p>
              <p className="text-sm text-gray-500 mt-1">units</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-500 shadow">
              <h4 className="text-lg font-medium text-gray-600 mb-2">Loss</h4>
              <p className="text-3xl font-bold text-[#4E4456]">{formatNumber(selectedZoneData.loss)}</p>
              <p className="text-sm text-gray-500 mt-1">units</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-purple-500 shadow">
              <h4 className="text-lg font-medium text-gray-600 mb-2">Loss Percentage</h4>
              <p className="text-3xl font-bold text-[#4E4456]">{selectedZoneData.lossPercentage}%</p>
              <p className="text-sm text-gray-500 mt-1">of total bulk</p>
            </div>
          </div>
        )}

        {activeZoneFilter === 'All Zones' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-[#4E4456] to-[#9A95A6] text-white">
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Zone</th>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Bulk Meter</th>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Individual Meters</th>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Loss</th>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Loss %</th>
                  <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allZonesData.map(zone => (
                  <tr key={zone.zone} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{zone.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{formatNumber(zone.bulk)}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{formatNumber(zone.individual)}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{formatNumber(zone.loss)}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              zone.percentage > 70 ? 'bg-red-500' :
                              zone.percentage > 50 ? 'bg-yellow-500' :
                              zone.percentage > 30 ? 'bg-yellow-400' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(100, zone.percentage)}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${
                          zone.percentage > 70 ? 'text-red-500' :
                          zone.percentage > 50 ? 'text-yellow-500' :
                          zone.percentage > 30 ? 'text-yellow-600' :
                          'text-green-500'
                        }`}>{zone.percentage.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        zone.percentage > 70 ? 'bg-red-100 text-red-800' :
                        zone.percentage > 50 ? 'bg-yellow-100 text-yellow-800' :
                        zone.percentage > 25 ? 'bg-yellow-50 text-yellow-600' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {zone.percentage > 70 ? 'Critical' :
                         zone.percentage > 50 ? 'High Risk' :
                         zone.percentage > 25 ? 'Moderate' :
                         'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={historicalZoneData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                  formatter={(value, name) => {
                    if (name === 'lossPercentage') return [`${value}%`, 'Loss %'];
                    return [`${formatNumber(value)} units`, name];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="bulk" fill={CHART_COLORS[0]} name="Bulk Meter" />
                <Bar yAxisId="left" dataKey="individual" fill={CHART_COLORS[1]} name="Individual Meters" />
                <Line yAxisId="left" type="monotone" dataKey="loss" stroke={CHART_COLORS[2]} strokeWidth={2} name="Loss" />
                <Line yAxisId="right" type="monotone" dataKey="lossPercentage" stroke={CHART_COLORS[3]} strokeWidth={2} name="Loss %" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Customer Details Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {activeZoneFilter === 'All Zones' ? 'Customer Details' : activeZoneFilter + ' Customer Details'}
          </h3>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search customers or account #..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#8ED2D6] focus:border-[#8ED2D6] block w-full pl-10 p-2.5"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-[#4E4456] to-[#9A95A6] text-white">
                <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Account #</th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Customer</th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Zone</th>
                <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Consumption (units)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMeters.length > 0 ? (
                filteredMeters.map((meter) => (
                  <tr key={meter.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{meter.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{meter.customer}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{meter.zone}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              meter.consumption > 40 ? 'bg-red-500' :
                              meter.consumption > 20 ? 'bg-yellow-500' :
                              meter.consumption > 0 ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                            style={{ width: `${Math.min(100, (meter.consumption / 50) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">{meter.consumption}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">No customers found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredMeters.length}</span> results
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 rounded-md">Previous</button>
            <button className="px-3 py-1 border border-[#4E4456] bg-[#4E4456] text-white rounded-md">1</button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 rounded-md">2</button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 rounded-md">3</button>
            <button className="px-3 py-1 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 rounded-md">Next</button>
          </div>
        </div>
      </div>
      
      {/* Zone Individual Consumption Analysis - Added as requested */}
      {activeZoneFilter !== 'All Zones' && zoneCode && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {activeZoneFilter} Consumption Detail
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500 shadow">
              <h4 className="text-lg font-medium text-gray-700 mb-2">Zone Bulk Meter</h4>
              <p className="text-3xl font-bold text-blue-700">{formatNumber(selectedZoneData.bulk)}</p>
              <p className="text-sm text-gray-600 mt-1">Total water entering zone</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500 shadow">
              <h4 className="text-lg font-medium text-gray-700 mb-2">Individual Meters</h4>
              <p className="text-3xl font-bold text-green-700">{formatNumber(selectedZoneData.individual)}</p>
              <p className="text-sm text-gray-600 mt-1">Sum of all customer consumption</p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500 shadow">
              <h4 className="text-lg font-medium text-gray-700 mb-2">Difference (Loss)</h4>
              <p className="text-3xl font-bold text-red-700">{formatNumber(selectedZoneData.loss)} ({selectedZoneData.lossPercentage}%)</p>
              <p className="text-sm text-gray-600 mt-1">Water unaccounted for</p>
            </div>
          </div>
          
          {/* Detailed individual meter breakdown */}
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Individual Consumption Breakdown</h4>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex flex-col md:flex-row justify-between mb-2">
                <div>
                  <span className="text-sm text-gray-500">Total Individual Consumption: </span>
                  <span className="text-base font-medium text-gray-900">{formatNumber(selectedZoneData.individual)} units</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Number of Meters: </span>
                  <span className="text-base font-medium text-gray-900">{zoneCustomers.length}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Average per Meter: </span>
                  <span className="text-base font-medium text-gray-900">
                    {formatNumber((selectedZoneData.individual / (zoneCustomers.length || 1)).toFixed(1))} units
                  </span>
                </div>
              </div>
            </div>
            
            {/* Individual meters visualization */}
            <div className="h-80 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={zoneCustomers.sort((a, b) => b.consumption - a.consumption)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 120 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="customer" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100} 
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} units`, 'Consumption']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Bar 
                    dataKey="consumption" 
                    fill={CHART_COLORS[0]} 
                    name="Consumption" 
                    radius={[4, 4, 0, 0]}
                  >
                    {zoneCustomers.map((entry) => (
                      <Cell 
                        key={`cell-${entry.id}`} 
                        fill={
                          entry.consumption > 40 ? '#EF4444' :
                          entry.consumption > 20 ? '#F59E0B' :
                          entry.consumption > 10 ? '#10B981' :
                          '#60A5FA'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== TYPE DETAILS SECTION =====
const TypeDetailsSection = ({ activeMonthFilter, activeYearFilter, THEME, CHART_COLORS, formatNumber }) => {
  // Prepare data for consumption types
  const typeData = {
    "irrigation": {
      "name": "Irrigation Services",
      "consumption": Object.keys(waterData.consumptionByType.irrigation.consumption)
        .filter(month => month.includes(activeYearFilter))
        .map(month => ({
          month: month.split('-')[0],
          value: waterData.consumptionByType.irrigation.consumption[month],
          percentage: waterData.consumptionByType.irrigation.percentage[month]
        }))
    },
    "residential_villa": {
      "name": "Residential Villa",
      "consumption": Object.keys(waterData.consumptionByType.residential_villa.consumption)
        .filter(month => month.includes(activeYearFilter))
        .map(month => ({
          month: month.split('-')[0],
          value: waterData.consumptionByType.residential_villa.consumption[month],
          percentage: waterData.consumptionByType.residential_villa.percentage[month]
        }))
    },
    "residential_apartment": {
      "name": "Residential Apartment",
      "consumption": Object.keys(waterData.consumptionByType.residential_apartment.consumption)
        .filter(month => month.includes(activeYearFilter))
        .map(month => ({
          month: month.split('-')[0],
          value: waterData.consumptionByType.residential_apartment.consumption[month],
          percentage: waterData.consumptionByType.residential_apartment.percentage[month]
        }))
    },
    "building_common": {
      "name": "Building Common Areas",
      "consumption": Object.keys(waterData.consumptionByType.building_common.consumption)
        .filter(month => month.includes(activeYearFilter))
        .map(month => ({
          month: month.split('-')[0],
          value: waterData.consumptionByType.building_common.consumption[month],
          percentage: waterData.consumptionByType.building_common.percentage[month]
        }))
    },
    "retail": {
      "name": "Retail",
      "consumption": Object.keys(waterData.consumptionByType.retail.consumption)
        .filter(month => month.includes(activeYearFilter))
        .map(month => ({
          month: month.split('-')[0],
          value: waterData.consumptionByType.retail.consumption[month],
          percentage: waterData.consumptionByType.retail.percentage[month]
        }))
    }
  };

  // Get data for the selected month
  const selectedMonthData = Object.keys(typeData).map(key => {
    const monthData = typeData[key].consumption.find(m => m.month+'-'+activeYearFilter === activeMonthFilter) || typeData[key].consumption[0];
    return {
      name: typeData[key].name,
      value: monthData.value,
      percentage: monthData.percentage
    };
  });

  // Create comparison data across all types
  const comparisonData = getMonths()
    .filter(month => month.id.includes(activeYearFilter))
    .map(month => {
      const monthEntry = { month: month.id.split('-')[0] };
      
      // Add consumption for each type
      Object.keys(waterData.consumptionByType).forEach(typeKey => {
        const typeName = waterData.consumptionByType[typeKey].name;
        monthEntry[typeName] = waterData.consumptionByType[typeKey].consumption[month.id] || 0;
      });
      
      return monthEntry;
    });

  return (
    <div className="space-y-6">
      {/* Monthly Type Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Consumption Type Distribution ({activeMonthFilter})</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={selectedMonthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {selectedMonthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${formatNumber(value)} units`, 'Consumption']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="col-span-2 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={selectedMonthData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip
                  formatter={(value, name, props) => [`${formatNumber(value)} units (${props.payload.percentage}%)`, 'Consumption']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  radius={[0, 4, 4, 0]}
                  name="Consumption"
                  label={{ position: 'right', formatter: (value) => `${formatNumber(value)} units` }}
                >
                  {selectedMonthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Type Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumption Types Comparison Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Consumption Types Comparison ({activeYearFilter})</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={comparisonData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${formatNumber(value)} units`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="Retail" stackId="1" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.6} />
                <Area type="monotone" dataKey="Residential Villa" stackId="1" stroke={CHART_COLORS[1]} fill={CHART_COLORS[1]} fillOpacity={0.6} />
                <Area type="monotone" dataKey="Irrigation Services" stackId="1" stroke={CHART_COLORS[2]} fill={CHART_COLORS[2]} fillOpacity={0.6} />
                <Area type="monotone" dataKey="Residential Apartment" stackId="1" stroke={CHART_COLORS[3]} fill={CHART_COLORS[3]} fillOpacity={0.6} />
                <Area type="monotone" dataKey="Building Common Areas" stackId="1" stroke={CHART_COLORS[4]} fill={CHART_COLORS[4]} fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Type Percentage Analysis */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Type Percentage of Total ({activeYearFilter})</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={typeData.retail.consumption}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  name="Retail"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  data={typeData.residential_villa.consumption}
                  dataKey="percentage"
                  name="Residential Villa"
                  stroke={CHART_COLORS[1]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  data={typeData.irrigation.consumption}
                  dataKey="percentage"
                  name="Irrigation"
                  stroke={CHART_COLORS[2]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  data={typeData.residential_apartment.consumption}
                  dataKey="percentage"
                  name="Residential Apt"
                  stroke={CHART_COLORS[3]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  data={typeData.building_common.consumption}
                  dataKey="percentage"
                  name="Common Areas"
                  stroke={CHART_COLORS[4]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Type Details Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(typeData).map((key, index) => (
          <div key={key} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 text-white font-semibold bg-gradient-to-r" 
              style={{
                backgroundImage: `linear-gradient(to right, ${CHART_COLORS[index % CHART_COLORS.length]}, ${CHART_COLORS[(index + 1) % CHART_COLORS.length]})`
              }}>
              {typeData[key].name} Consumption
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumption</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {typeData[key].consumption.map(item => (
                    <tr key={item.month} className={item.month+'-'+activeYearFilter === activeMonthFilter ? 'bg-blue-50' : ''}>
                      <td className="py-2 px-3 text-xs text-gray-900">{item.month}</td>
                      <td className="py-2 px-3 text-xs text-gray-900">{formatNumber(item.value)}</td>
                      <td className="py-2 px-3 text-xs">
                        <div className="flex items-center">
                          <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-2">
                            <div 
                              className="h-1.5 rounded-full"
                              style={{ 
                                width: `${Math.min(100, item.percentage)}%`,
                                backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                              }}
                            ></div>
                          </div>
                          <span className="text-gray-900">{item.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== LOSS DETAILS SECTION =====
const LossDetailsSection = ({ 
  activeMonthFilter, 
  activeYearFilter, 
  activeZoneFilter, 
  zoneCode, 
  THEME, 
  CHART_COLORS, 
  formatNumber 
}) => {
  // Get overall loss data
  const overallLossData = useMemo(() => 
    getMonths()
      .filter(month => month.id.includes(activeYearFilter))
      .map(month => ({
        month: month.id.split('-')[0],
        l1: waterData.mainBulkMeter[month.id],
        l2: waterData.zoneBulkMeters[month.id],
        l3: waterData.individualMeters[month.id],
        loss1: waterData.lossData.stageOne[month.id],
        loss2: waterData.lossData.stageTwo[month.id],
        totalLoss: waterData.lossData.total[month.id],
        lossPercentage: waterData.lossData.percentages[month.id]
      })),
    [activeYearFilter]
  );

  // Get zone-specific data if a zone is selected
  const selectedZoneData = useMemo(() => {
    if (!zoneCode) return null;
    
    return getMonths()
      .filter(month => month.id.includes(activeYearFilter))
      .map(month => {
        const bulk = waterData.zoneData[zoneCode].bulk[month.id] || 0;
        const individual = waterData.zoneData[zoneCode].individual[month.id] || 0;
        const loss = bulk - individual;
        const lossPercentage = bulk > 0 ? (loss / bulk) * 100 : 0;
        
        return {
          month: month.id.split('-')[0],
          bulk,
          individual,
          loss,
          lossPercentage: parseFloat(lossPercentage.toFixed(1))
        };
      });
  }, [zoneCode, activeYearFilter]);

  // Loss by zone data for the selected month
  const lossByZoneData = useMemo(() => 
    getZoneSummaryByMonth(activeMonthFilter)
      .map(zone => ({
        name: zone.name.replace('Zone ', '').replace('Village Square', 'VS'),
        loss: zone.loss,
        lossPercentage: parseFloat(zone.percentage.toFixed(1))
      })),
    [activeMonthFilter]
  );

  // Sample data for different loss types (in a real app, this would come from the backend)
  const lossTypeData = [
    { type: 'Physical Leakage', value: 12000, percentage: 52.5 },
    { type: 'Unbilled Authorized Consumption', value: 3000, percentage: 13.1 },
    { type: 'Unauthorized Consumption', value: 5000, percentage: 21.9 },
    { type: 'Administrative Losses', value: 2837, percentage: 12.4 },
  ];

  // Colors for loss types
  const PIE_COLORS_LOSS = [
    '#EF4444', // Red
    '#8ED2D6', // Teal
    '#F59E0B', // Amber
    '#4E4456'  // Dark purple
  ];

  return (
    <div className="space-y-6">
      {/* Problem Zone Summary */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Loss Analysis Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
            <h4 className="font-medium text-red-800 flex items-center">
              <AlertTriangle size={18} className="mr-2" />
              Critical Loss Issues
            </h4>
            <ul className="mt-2 text-sm text-red-700 space-y-1 pl-6 list-disc">
              <li>Zone 03A shows an exceptionally high loss rate of <span className="font-semibold">78.9%</span></li>
              <li>Zone 03B maintains a concerningly high loss of <span className="font-semibold">66.6%</span></li>
              <li>Zone 08 has shown a significant increase from <span className="font-semibold">26.4%</span> to <span className="font-semibold">70.2%</span> in the last month</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-[#8ED2D6]">
            <h4 className="font-medium text-[#4E4456] flex items-center">
              <Droplet size={18} className="mr-2 text-[#8ED2D6]" />
              Recommended Actions
            </h4>
            <ul className="mt-2 text-sm text-gray-700 space-y-1 pl-6 list-disc">
              <li>Conduct pressure testing in Zone 03A and 03B</li>
              <li>Inspect Zone 08 for recent infrastructure changes</li>
              <li>Verify meter calibration for all zones showing abnormal readings</li>
              <li>Schedule a network-wide leak detection survey</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Loss Breakdown by Type ({activeMonthFilter})</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-1">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-[#4E4456] to-[#9A95A6] text-white">
                    <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Loss Type</th>
                    <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">Volume</th>
                    <th className="py-3 px-4 text-left text-sm font-medium uppercase tracking-wider">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lossTypeData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{data.type}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{formatNumber(data.value)}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{data.percentage.toFixed(1)}%</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-medium">
                    <td className="py-3 px-4 text-sm text-gray-900">Total Loss</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{formatNumber(lossTypeData.reduce((sum, item) => sum + item.value, 0))}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="col-span-1 lg:col-span-2 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lossTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="type"
                  label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {lossTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS_LOSS[index % PIE_COLORS_LOSS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [`${formatNumber(value)} units (${props.payload.percentage}%)`, props.payload.type]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
                <Legend 
                  formatter={(value, entry, index) => (
                    <span style={{ color: PIE_COLORS_LOSS[index % PIE_COLORS_LOSS.length] }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Historical Total Loss Trend ({activeYearFilter})
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overallLossData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${formatNumber(value)} units`, 'Total Loss']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="totalLoss" 
                  stroke="#EF4444" 
                  fillOpacity={0.6} 
                  fill="url(#colorTotalLoss)" 
                  name="Total Loss" 
                  activeDot={{ r: 8 }}
                />
                <defs>
                  <linearGradient id="colorTotalLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {activeZoneFilter !== 'All Zones' 
              ? `Loss Trend: ${activeZoneFilter} (${activeYearFilter})` 
              : `Loss Percentage by Zone (${activeMonthFilter})`}
          </h3>
          <div className="h-80">
            {activeZoneFilter !== 'All Zones' && selectedZoneData ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={selectedZoneData} 
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                    formatter={(value, name) => {
                      if (name === 'lossPercentage') return [`${value}%`, 'Loss %'];
                      return [`${formatNumber(value)} units`, name];
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="loss" fill={CHART_COLORS[0]} name="Loss (units)" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="lossPercentage" 
                    stroke={CHART_COLORS[1]} 
                    strokeWidth={3} 
                    name="Loss %" 
                    dot={{ r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={lossByZoneData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Loss Percentage']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="lossPercentage"
                    name="Loss %"
                    fill={CHART_COLORS[0]}
                    label={{ position: 'right', formatter: (value) => `${value}%` }}
                    radius={[0, 4, 4, 0]}
                  >
                    {lossByZoneData.map(entry => (
                      <Cell 
                        key={`cell-${entry.name}`} 
                        fill={
                          entry.lossPercentage > 70 ? '#EF4444' :
                          entry.lossPercentage > 50 ? '#F59E0B' :
                          entry.lossPercentage > 30 ? '#FBBF24' :
                          '#10B981'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterAnalysis;
