import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

import { 
  waterData,
  getMonths,
  getConsumptionTypes
} from '../../data/waterData';

// TypeDetails component for Water Analysis
const TypeDetails = ({ activeMonthFilter, activeYearFilter, THEME, CHART_COLORS, formatNumber }) => {
  // Get all consumption types
  const consumptionTypes = getConsumptionTypes();
  
  // Get consumption data for the active month
  const consumptionData = useMemo(() => {
    const typeData = [];
    let total = 0;
    
    // Calculate total consumption for percentage calculation
    Object.values(waterData.consumptionByType).forEach(type => {
      total += type.consumption[activeMonthFilter] || 0;
    });
    
    // Prepare data for each type
    consumptionTypes.forEach(type => {
      const typeInfo = waterData.consumptionByType[type.id];
      if (typeInfo) {
        const consumption = typeInfo.consumption[activeMonthFilter] || 0;
        const percentage = total > 0 ? (consumption / total) * 100 : 0;
        
        typeData.push({
          id: type.id,
          name: type.label,
          consumption,
          percentage
        });
      }
    });
    
    return { data: typeData, total };
  }, [activeMonthFilter, consumptionTypes]);
  
  // Get yearly trends for each consumption type
  const yearlyTrends = useMemo(() => {
    return getMonths()
      .filter(month => month.id.includes(activeYearFilter))
      .map(month => {
        const monthData = { name: month.id.split('-')[0] };
        
        consumptionTypes.forEach(type => {
          const typeInfo = waterData.consumptionByType[type.id];
          if (typeInfo) {
            monthData[type.id] = typeInfo.consumption[month.id] || 0;
          }
        });
        
        return monthData;
      });
  }, [activeYearFilter, consumptionTypes]);

  // Calculate changes from previous month
  const calculateChange = (typeId) => {
    const months = getMonths();
    const currentMonthIndex = months.findIndex(m => m.id === activeMonthFilter);
    const previousMonth = currentMonthIndex > 0 ? months[currentMonthIndex - 1].id : null;
    
    if (!previousMonth) return { value: 0, percentage: 0, direction: 'up' };
    
    const typeInfo = waterData.consumptionByType[typeId];
    if (!typeInfo) return { value: 0, percentage: 0, direction: 'up' };
    
    const currentValue = typeInfo.consumption[activeMonthFilter] || 0;
    const previousValue = typeInfo.consumption[previousMonth] || 0;
    
    if (previousValue === 0) return { value: currentValue, percentage: 100, direction: 'up' };
    
    const change = currentValue - previousValue;
    const percentage = (change / previousValue) * 100;
    
    return { 
      value: Math.abs(change), 
      percentage: Math.abs(percentage), 
      direction: change >= 0 ? 'up' : 'down' 
    };
  };

  // Custom legend for pie chart
  const renderPieChartLegend = () => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {consumptionData.data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <span className="text-xs">{entry.name}: {entry.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="water-dashboard">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Consumption by Type</h2>
        <p className="text-gray-600 mt-1">
          Water consumption breakdown by different property types for {activeMonthFilter}.
        </p>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {consumptionData.data.map((typeData, index) => {
          const change = calculateChange(typeData.id);
          
          return (
            <div key={typeData.id} className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-base font-medium text-[#4E4456]">{typeData.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <div className="text-2xl font-bold">{typeData.percentage.toFixed(1)}%</div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  change.direction === 'up' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {change.direction === 'up' ? (
                    <TrendingUp size={14} className="mr-1" />
                  ) : (
                    <TrendingDown size={14} className="mr-1" />
                  )}
                  {change.percentage.toFixed(1)}%
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-500">{formatNumber(typeData.consumption)} m³</div>
              <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${typeData.percentage}%`, 
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length] 
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-base font-medium text-gray-700 mb-4">Consumption Distribution</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={consumptionData.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="consumption"
                >
                  {consumptionData.data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS[index % CHART_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${formatNumber(value)} m³ (${props.payload.percentage.toFixed(1)}%)`,
                    props.payload.name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-xs text-gray-500">Total</div>
              <div className="text-xl font-bold">{formatNumber(consumptionData.total)} m³</div>
            </div>
          </div>
          {renderPieChartLegend()}
        </div>
        
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-base font-medium text-gray-700 mb-4">Consumption by Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={consumptionData.data}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${formatNumber(value)} m³`, 'Consumption']}
                />
                <Bar 
                  dataKey="consumption" 
                  name="Water Consumption"
                >
                  {consumptionData.data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS[index % CHART_COLORS.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Yearly Trends */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-base font-medium text-gray-700 mb-4">Yearly Consumption Trends by Type</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={yearlyTrends}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  const typeName = consumptionTypes.find(type => type.id === name)?.label || name;
                  return [`${formatNumber(value)} m³`, typeName];
                }}
                labelFormatter={(label) => `${label} ${activeYearFilter}`}
              />
              <Legend
                formatter={(value) => {
                  return consumptionTypes.find(type => type.id === value)?.label || value;
                }}
              />
              {consumptionTypes.map((type, index) => (
                <Line
                  key={type.id}
                  type="monotone"
                  dataKey={type.id}
                  name={type.id}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TypeDetails;