import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, ComposedChart, Scatter
} from 'recharts';
import { 
  AlertTriangle, Droplet, TrendingUp, TrendingDown, 
  AlertCircle, CheckCircle, CircleOff, BarChart2, PieChart as PieChartIcon
} from 'lucide-react';

import { 
  waterData,
  getMonths,
  getZoneTypes,
  calculateLossPercentage,
  calculateZoneLoss,
  getZoneSummaryByMonth
} from '../../data/waterData';

// LossDetails component for Water Analysis
const LossDetails = ({ 
  activeMonthFilter, 
  activeYearFilter, 
  activeZoneFilter, 
  zoneCode,
  THEME, 
  CHART_COLORS,
  formatNumber
}) => {
  // Get zone summary for current month
  const zoneSummary = useMemo(() => {
    return getZoneSummaryByMonth(activeMonthFilter);
  }, [activeMonthFilter]);
  
  // Get data for the selected zone or all zones
  const zoneData = useMemo(() => {
    let data;
    
    if (activeZoneFilter === 'All Zones') {
      data = {
        stageOneLoss: waterData.lossData.stageOne[activeMonthFilter] || 0,
        stageTwoLoss: waterData.lossData.stageTwo[activeMonthFilter] || 0,
        totalLoss: waterData.lossData.total[activeMonthFilter] || 0,
        lossPercentage: waterData.lossData.percentages[activeMonthFilter] || 0
      };
    } else if (zoneCode) {
      const { loss, percentage } = calculateZoneLoss(zoneCode, activeMonthFilter);
      data = {
        stageOneLoss: 0, // Zone level data doesn't have stage one loss
        stageTwoLoss: loss,
        totalLoss: loss,
        lossPercentage: percentage
      };
    } else {
      data = {
        stageOneLoss: 0,
        stageTwoLoss: 0,
        totalLoss: 0,
        lossPercentage: 0
      };
    }
    
    return data;
  }, [activeMonthFilter, activeZoneFilter, zoneCode]);
  
  // Get critical zones (zones with high loss rates)
  const criticalZones = useMemo(() => {
    return zoneSummary
      .filter(zone => zone.percentage > 25)
      .sort((a, b) => b.percentage - a.percentage);
  }, [zoneSummary]);
  
  // Get yearly loss trends
  const lossYearlyTrend = useMemo(() => {
    const months = getMonths().filter(month => month.id.includes(activeYearFilter));
    
    if (activeZoneFilter === 'All Zones') {
      return months.map(month => ({
        name: month.id.split('-')[0],
        stageOne: waterData.lossData.stageOne[month.id] || 0,
        stageTwo: waterData.lossData.stageTwo[month.id] || 0,
        total: waterData.lossData.total[month.id] || 0,
        percentage: waterData.lossData.percentages[month.id] || 0
      }));
    } else if (zoneCode) {
      return months.map(month => {
        const { loss, percentage } = calculateZoneLoss(zoneCode, month.id);
        return {
          name: month.id.split('-')[0],
          stageOne: 0, // Zone level data doesn't have stage one loss
          stageTwo: loss,
          total: loss,
          percentage
        };
      });
    }
    
    return [];
  }, [activeYearFilter, activeZoneFilter, zoneCode]);
  
  // Get loss by zone data
  const lossByZoneData = useMemo(() => {
    return zoneSummary.map(zone => ({
      name: zone.name,
      loss: zone.loss,
      percentage: zone.percentage
    }));
  }, [zoneSummary]);

  // Custom tooltip for the Loss Distribution chart
  const CustomLossTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold text-[#4E4456]">{data.name}</p>
          <p className="text-sm text-gray-600">Loss: <span className="font-medium">{formatNumber(data.loss)} m³</span></p>
          <p className="text-sm text-gray-600">Loss Rate: <span className="font-medium">{data.percentage.toFixed(1)}%</span></p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="water-dashboard">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Water Loss Analysis</h2>
        <p className="text-gray-600 mt-1">
          Analysis of water losses and problem areas for {activeZoneFilter === 'All Zones' ? 'all zones' : activeZoneFilter} in {activeMonthFilter}.
        </p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Loss</h3>
              <p className="text-2xl font-bold mt-1">{formatNumber(zoneData.totalLoss)} m³</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <Droplet size={20} className="text-red-500" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {zoneData.totalLoss > 0 ? `Equivalent to ${Math.round(zoneData.totalLoss * 1000)} liters of water` : 'No loss detected'}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Loss Percentage</h3>
              <p className="text-2xl font-bold mt-1">{zoneData.lossPercentage.toFixed(1)}%</p>
            </div>
            <div className={`p-2 rounded-full ${
              zoneData.lossPercentage > 25 ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {zoneData.lossPercentage > 25 ? (
                <AlertTriangle size={20} className="text-red-500" />
              ) : (
                <CheckCircle size={20} className="text-green-500" />
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {zoneData.lossPercentage > 25 ? 'Above acceptable threshold (25%)' : 'Within acceptable threshold'}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {activeZoneFilter === 'All Zones' ? 'Stage 1 Loss' : 'Distribution Loss'}
              </h3>
              <p className="text-2xl font-bold mt-1">
                {formatNumber(activeZoneFilter === 'All Zones' ? zoneData.stageOneLoss : zoneData.stageTwoLoss)} m³
              </p>
            </div>
            <div className="p-2 bg-orange-100 rounded-full">
              <CircleOff size={20} className="text-orange-500" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {activeZoneFilter === 'All Zones' 
              ? 'Water lost between main supply and zones' 
              : 'Water lost within distribution network'}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {activeZoneFilter === 'All Zones' ? 'Stage 2 Loss' : 'Critical Areas'}
              </h3>
              <p className="text-2xl font-bold mt-1">
                {activeZoneFilter === 'All Zones' 
                  ? formatNumber(zoneData.stageTwoLoss) + ' m³'
                  : criticalZones.length > 0 ? criticalZones.length : 'None'}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertCircle size={20} className="text-yellow-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {activeZoneFilter === 'All Zones' 
              ? 'Water lost within distribution network' 
              : 'Areas identified for immediate action'}
          </p>
        </div>
      </div>
      
      {/* Problem Zone Summary */}
      {criticalZones.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Critical Loss Zones</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <h4 className="font-medium text-red-800 flex items-center">
                <AlertTriangle size={18} className="mr-2" />
                High Priority Loss Issues
              </h4>
              <ul className="mt-2 text-sm text-red-700 space-y-1 pl-6 list-disc">
                {criticalZones.slice(0, 3).map(zone => (
                  <li key={zone.zone}>
                    {zone.name} shows a high loss rate of <span className="font-semibold">{zone.percentage.toFixed(1)}%</span> 
                    ({formatNumber(zone.loss)} m³)
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-[#8ED2D6]">
              <h4 className="font-medium text-[#4E4456] flex items-center">
                <Droplet size={18} className="mr-2 text-[#8ED2D6]" />
                Recommended Actions
              </h4>
              <ul className="mt-2 text-sm text-gray-700 space-y-1 pl-6 list-disc">
                <li>Conduct pressure testing in {criticalZones[0]?.name}</li>
                <li>Inspect {criticalZones.length > 1 ? criticalZones[1]?.name : criticalZones[0]?.name} for recent infrastructure changes</li>
                <li>Verify meter calibration for all zones showing abnormal readings</li>
                <li>Schedule a network-wide leak detection survey</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Loss Distribution Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-700">Loss Distribution by Zone</h3>
            <div className="flex items-center text-sm text-gray-500">
              <PieChartIcon size={16} className="mr-1" />
              {activeMonthFilter}
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lossByZoneData}
                margin={{ top: 5, right: 5, left: 5, bottom: 30 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  width={100}
                />
                <Tooltip content={<CustomLossTooltip />} />
                <Legend />
                <Bar 
                  dataKey="loss" 
                  name="Water Loss (m³)" 
                  fill={CHART_COLORS[4]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Loss Percentage Comparison */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-700">Loss Percentage by Zone</h3>
            <div className="flex items-center text-sm text-gray-500">
              <BarChart2 size={16} className="mr-1" />
              {activeMonthFilter}
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lossByZoneData.sort((a, b) => b.percentage - a.percentage)}
                margin={{ top: 5, right: 5, left: 5, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis 
                  label={{ value: 'Loss (%)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(1)}%`, 'Loss Percentage']}
                />
                <Legend />
                <Bar 
                  dataKey="percentage" 
                  name="Loss Percentage" 
                  fill={CHART_COLORS[1]}
                >
                  {lossByZoneData
                    .sort((a, b) => b.percentage - a.percentage)
                    .map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.percentage > 25 ? '#f87171' : CHART_COLORS[1]} 
                      />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Loss Trend Chart */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-gray-700">Loss Trend Analysis</h3>
          <div className="flex items-center text-sm text-gray-500">
            <TrendingUp size={16} className="mr-1" />
            {activeYearFilter}
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={lossYearlyTrend}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis 
                yAxisId="left" 
                orientation="left"
                label={{ value: 'Volume (m³)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[0, 100]}
                label={{ value: 'Loss (%)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'percentage') {
                    return [`${value.toFixed(1)}%`, 'Loss Percentage'];
                  }
                  return [`${formatNumber(value)} m³`, name];
                }}
                labelFormatter={(label) => `${label} ${activeYearFilter}`}
              />
              <Legend />
              {activeZoneFilter === 'All Zones' && (
                <Bar 
                  yAxisId="left" 
                  dataKey="stageOne" 
                  name="Stage 1 Loss" 
                  fill={CHART_COLORS[0]} 
                  stackId="a"
                  barSize={20}
                />
              )}
              <Bar 
                yAxisId="left" 
                dataKey="stageTwo" 
                name={activeZoneFilter === 'All Zones' ? 'Stage 2 Loss' : 'Zone Loss'} 
                fill={CHART_COLORS[2]} 
                stackId="a"
                barSize={20}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="percentage" 
                name="Loss Percentage" 
                stroke={CHART_COLORS[4]} 
                strokeWidth={2}
                dot 
              />
              <Area 
                yAxisId="right"
                type="monotone"
                dataKey="percentage"
                stroke="none"
                fill={CHART_COLORS[4]}
                fillOpacity={0.1}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LossDetails;