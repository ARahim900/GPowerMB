import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
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
import '../styles/WaterAnalysisResponsive.css';

// Lazy load tab contents
const Overview = lazy(() => import('../components/water/Overview'));
const GroupDetails = lazy(() => import('../components/water/GroupDetails'));
const TypeDetails = lazy(() => import('../components/water/TypeDetails'));
const LossDetails = lazy(() => import('../components/water/LossDetails'));

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

  // Performance measurement
  useEffect(() => {
    // Mark the start time when component mounts
    performance.mark('water-analysis-start');
    
    return () => {
      // Mark the end time when component unmounts
      performance.mark('water-analysis-end');
      
      // Measure the difference
      performance.measure(
        'water-analysis-render-time',
        'water-analysis-start',
        'water-analysis-end'
      );
      
      // Log the results
      const measurements = performance.getEntriesByName('water-analysis-render-time');
      console.log('Water Analysis render time:', measurements[0].duration, 'ms');
    };
  }, []);

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
    if (!dataLoaded) {
      return <LoadingScreen />;
    }
    
    return (
      <Suspense fallback={<div className="loading-spinner flex items-center justify-center h-64">Loading...</div>}>
        {activeTab === 'overview' && (
          <Overview 
            activeMonthFilter={activeMonthFilter}
            activeYearFilter={activeYearFilter}
            activeZoneFilter={activeZoneFilter}
            THEME={THEME}
            CHART_COLORS={CHART_COLORS}
            formatNumber={formatNumber}
          />
        )}
        
        {activeTab === 'group-details' && (
          <GroupDetails 
            activeMonthFilter={activeMonthFilter}
            activeYearFilter={activeYearFilter}
            activeZoneFilter={activeZoneFilter}
            zoneCode={zoneCode}
            THEME={THEME}
            CHART_COLORS={CHART_COLORS}
            formatNumber={formatNumber}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        
        {activeTab === 'type-details' && (
          <TypeDetails 
            activeMonthFilter={activeMonthFilter}
            activeYearFilter={activeYearFilter}
            THEME={THEME}
            CHART_COLORS={CHART_COLORS}
            formatNumber={formatNumber}
          />
        )}
        
        {activeTab === 'loss-details' && (
          <LossDetails 
            activeMonthFilter={activeMonthFilter}
            activeYearFilter={activeYearFilter}
            activeZoneFilter={activeZoneFilter}
            zoneCode={zoneCode}
            THEME={THEME}
            CHART_COLORS={CHART_COLORS}
            formatNumber={formatNumber}
          />
        )}
      </Suspense>
    );
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
    <div className="flex-1 overflow-y-auto water-dashboard">
      <PageHeader 
        title="Water Analysis" 
        subtitle="Comprehensive water supply and consumption analysis" 
      />
      
      {!dataLoaded ? (
        <LoadingScreen />
      ) : (
        <main className="p-6 bg-gray-50">
          {/* Help Modal */}
          {showHelp && <HelpModal />}
          
          {/* Top Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto bg-white rounded-t-lg shadow-sm water-analysis-tabs">
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
          <div className="bg-white border-b border-gray-200 py-3 px-4 rounded-lg shadow-sm mb-6 filter-bar">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Filter size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Filters:</span>
              </div>

              {/* Month Filter */}
              <div className="relative filter-item">
                <button 
                  onClick={toggleMonthFilter}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Calendar size={16} className="mr-2" />
                  <span>Month:</span>
                  <label className="ml-2">{activeMonthFilter}</label>
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
                          onClick={() => {
                            toggleMonth(month.id);
                            setActiveMonthFilter(month.id);
                          }}
                          className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                        >
                          <div className={`w-5 h-5 rounded flex items-center justify-center mr-2 ${
                            month.id === activeMonthFilter 
                              ? 'bg-[#4E4456] text-white' 
                              : 'border border-gray-300'
                          }`}>
                            {month.id === activeMonthFilter && <Check size={14} />}
                          </div>
                          <span>{month.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Year Filter */}
              <div className="flex items-center filter-item">
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
                <div className="flex items-center filter-item">
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
              <div className="flex items-center gap-2 water-analysis-actions">
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
          <div className="water-analysis-grid">
            {renderTabContent()}
          </div>
        </main>
      )}
    </div>
  );
};

export default WaterAnalysis;
