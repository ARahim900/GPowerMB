import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Droplet,
  CircleOff, TrendingUp, TrendingDown, AlertTriangle
} from 'lucide-react';
import { 
  waterData,
  getMonths,
  calculateLossPercentage,
  getZoneSummaryByMonth
} from '../../data/waterData';

// Overview component for Water Analysis
const Overview = ({ activeMonthFilter, activeYearFilter, activeZoneFilter, THEME, CHART_COLORS, formatNumber }) => {
  // Get data for the active month
  const months = getMonths();
  const currentMonthData = getZoneSummaryByMonth(activeMonthFilter);
  
  // Calculate totals
  const totalBulkSupply = waterData.mainBulkMeter[activeMonthFilter] || 0;
  const totalZoneBulk = waterData.zoneBulkMeters[activeMonthFilter] || 0;
  const totalIndividual = waterData.individualMeters[activeMonthFilter] || 0;
  
  // Calculate losses
  const stageOneLoss = totalBulkSupply - totalZoneBulk;
  const stageTwoLoss = totalZoneBulk - totalIndividual;
  const totalLoss = stageOneLoss + stageTwoLoss;
  const lossPercentage = calculateLossPercentage(activeMonthFilter);
  
  // Current month index
  const currentMonthIndex = months.findIndex(m => m.id === activeMonthFilter);
  const previousMonth = currentMonthIndex > 0 ? months[currentMonthIndex - 1].id : null;
  
  // Calculate month-over-month changes
  const previousBulkSupply = previousMonth ? waterData.mainBulkMeter[previousMonth] || 0 : 0;
  const bulkSupplyChange = previousBulkSupply > 0 
    ? ((totalBulkSupply - previousBulkSupply) / previousBulkSupply) * 100 
    : 0;
    
  const previousLossPerc = previousMonth ? waterData.lossData.percentages[previousMonth] || 0 : 0;
  const lossPercentageChange = previousLossPerc > 0 
    ? lossPercentage - previousLossPerc 
    : 0;
  
  // Prepare chart data
  const monthlyConsumptionData = months
    .filter(month => month.id.includes(activeYearFilter))
    .map(month => ({
      name: month.id.split('-')[0],
      bulk: waterData.mainBulkMeter[month.id] || 0,
      zones: waterData.zoneBulkMeters[month.id] || 0,
      individual: waterData.individualMeters[month.id] || 0
    }));
    
  const lossData = months
    .filter(month => month.id.includes(activeYearFilter))
    .map(month => ({
      name: month.id.split('-')[0],
      stageOne: waterData.lossData.stageOne[month.id] || 0,
      stageTwo: waterData.lossData.stageTwo[month.id] || 0,
      percentage: waterData.lossData.percentages[month.id] || 0
    }));
    
  const consumptionByZoneData = currentMonthData.map(zone => ({
    name: zone.name,
    value: zone.individual
  }));

  return (
    <div className="water-dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Supply */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Bulk Supply</h3>
              <p className="text-2xl font-bold mt-1">{formatNumber(totalBulkSupply)} m³</p>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${bulkSupplyChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {bulkSupplyChange >= 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
              {Math.abs(bulkSupplyChange).toFixed(1)}%
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
        
        {/* Zone Metering */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Zone Bulk Meters</h3>
              <p className="text-2xl font-bold mt-1">{formatNumber(totalZoneBulk)} m³</p>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
              <Droplet size={14} className="mr-1" />
              {((totalZoneBulk / totalBulkSupply) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(totalZoneBulk / totalBulkSupply) * 100}%` }}></div>
          </div>
        </div>
        
        {/* Individual Consumption */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Individual Consumption</h3>
              <p className="text-2xl font-bold mt-1">{formatNumber(totalIndividual)} m³</p>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
              <Droplet size={14} className="mr-1" />
              {((totalIndividual / totalBulkSupply) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${(totalIndividual / totalBulkSupply) * 100}%` }}></div>
          </div>
        </div>
        
        {/* Water Loss */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Water Loss</h3>
              <p className="text-2xl font-bold mt-1">{formatNumber(totalLoss)} m³</p>
            </div>
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${lossPercentageChange <= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {lossPercentageChange <= 0 ? <TrendingDown size={14} className="mr-1" /> : <TrendingUp size={14} className="mr-1" />}
              {Math.abs(lossPercentageChange).toFixed(1)}%
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${lossPercentage}%` }}></div>
          </div>
        </div>
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Consumption Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-base font-medium text-gray-700 mb-4">Monthly Consumption Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyConsumptionData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${formatNumber(value)} m³`, '']}
                  labelFormatter={(label) => `${label} ${activeYearFilter}`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="bulk" 
                  name="Bulk Supply" 
                  stroke={CHART_COLORS[0]} 
                  fill={CHART_COLORS[0]} 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="zones" 
                  name="Zone Meters" 
                  stroke={CHART_COLORS[1]} 
                  fill={CHART_COLORS[1]} 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="individual" 
                  name="Individual Meters" 
                  stroke={CHART_COLORS[2]} 
                  fill={CHART_COLORS[2]} 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Loss Analysis Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-base font-medium text-gray-700 mb-4">Loss Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lossData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  domain={[0, 100]} 
                  tickFormatter={(value) => `${value}%`} 
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'percentage') {
                      return [`${value.toFixed(1)}%`, 'Loss Percentage'];
                    }
                    return [`${formatNumber(value)} m³`, name === 'stageOne' ? 'Stage 1 Loss' : 'Stage 2 Loss'];
                  }}
                  labelFormatter={(label) => `${label} ${activeYearFilter}`}
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="stageOne" 
                  name="Stage 1 Loss" 
                  fill={CHART_COLORS[3]} 
                  barSize={20} 
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="stageTwo" 
                  name="Stage 2 Loss" 
                  fill={CHART_COLORS[4]} 
                  barSize={20} 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="percentage" 
                  name="Loss Percentage" 
                  stroke={CHART_COLORS[1]} 
                  strokeWidth={2} 
                  dot 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Comparison */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-base font-medium text-gray-700 mb-4">Zone Consumption Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={consumptionByZoneData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {consumptionByZoneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${formatNumber(value)} m³`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Zone Loss Analysis */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-base font-medium text-gray-700 mb-4">Zone Loss Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentMonthData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${formatNumber(value)} m³`, '']}
                />
                <Legend />
                <Bar dataKey="bulk" name="Bulk Meter" fill={CHART_COLORS[0]} />
                <Bar dataKey="individual" name="Individual Meters" fill={CHART_COLORS[2]} />
                <Bar dataKey="loss" name="Loss" fill={CHART_COLORS[4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Alert Section */}
      {lossPercentage > 25 && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertTriangle size={24} className="text-red-500 mr-3" />
            <div>
              <h4 className="text-red-800 font-medium">High Water Loss Detected</h4>
              <p className="text-red-700 mt-1">
                The current water loss rate of {lossPercentage.toFixed(1)}% exceeds the recommended threshold of 25%. 
                Consider investigating Zone {currentMonthData.sort((a, b) => b.percentage - a.percentage)[0].zone} 
                which has the highest loss percentage.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;