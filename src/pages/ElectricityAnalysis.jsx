import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Calendar, Download, Zap, TrendingUp, TrendingDown, Battery } from 'lucide-react';
import PageHeader from '../components/PageHeader';

// Sample data for electricity
const electricityData = {
  monthlyConsumption: [
    { name: 'Jan', consumption: 4200, peak: 1200, offPeak: 3000 },
    { name: 'Feb', consumption: 3800, peak: 1000, offPeak: 2800 },
    { name: 'Mar', consumption: 4500, peak: 1300, offPeak: 3200 },
    { name: 'Apr', consumption: 5100, peak: 1500, offPeak: 3600 },
    { name: 'May', consumption: 6200, peak: 1800, offPeak: 4400 },
    { name: 'Jun', consumption: 7100, peak: 2200, offPeak: 4900 },
    { name: 'Jul', consumption: 7800, peak: 2500, offPeak: 5300 },
    { name: 'Aug', consumption: 8200, peak: 2700, offPeak: 5500 },
    { name: 'Sep', consumption: 7300, peak: 2300, offPeak: 5000 },
    { name: 'Oct', consumption: 6100, peak: 1900, offPeak: 4200 },
    { name: 'Nov', consumption: 5200, peak: 1600, offPeak: 3600 },
    { name: 'Dec', consumption: 4700, peak: 1400, offPeak: 3300 }
  ],
  distributionByZone: [
    { name: 'Zone FM', value: 20 },
    { name: 'Zone 03A', value: 15 },
    { name: 'Zone 03B', value: 25 },
    { name: 'Zone 05', value: 18 },
    { name: 'Zone 08', value: 12 },
    { name: 'Village Square', value: 10 }
  ],
  peakHours: [
    { time: '00:00', load: 1200 },
    { time: '02:00', load: 900 },
    { time: '04:00', load: 800 },
    { time: '06:00', load: 1100 },
    { time: '08:00', load: 2200 },
    { time: '10:00', load: 2800 },
    { time: '12:00', load: 3200 },
    { time: '14:00', load: 3500 },
    { time: '16:00', load: 3700 },
    { time: '18:00', load: 4100 },
    { time: '20:00', load: 3800 },
    { time: '22:00', load: 2200 }
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

const ElectricityAnalysis = () => {
  const [activeMonth, setActiveMonth] = useState('Apr');
  const [activeYear, setActiveYear] = useState('2025');
  
  // Format number with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };
  
  // Find month data
  const monthData = electricityData.monthlyConsumption.find(m => m.name === activeMonth) || electricityData.monthlyConsumption[0];
  
  // Calculate month-over-month change
  const monthIndex = electricityData.monthlyConsumption.findIndex(m => m.name === activeMonth);
  const previousMonthIndex = monthIndex > 0 ? monthIndex - 1 : 11; // Wrap to Dec if Jan
  const previousMonth = electricityData.monthlyConsumption[previousMonthIndex];
  const consumptionChange = ((monthData.consumption - previousMonth.consumption) / previousMonth.consumption) * 100;

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title="Electricity Analysis" 
        subtitle="Power consumption tracking and analysis" 
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
                  {electricityData.monthlyConsumption.map(m => (
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Consumption</h3>
                <p className="text-2xl font-bold mt-1">{formatNumber(monthData.consumption)} kWh</p>
              </div>
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${consumptionChange >= 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {consumptionChange >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                {Math.abs(consumptionChange).toFixed(1)}%
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {consumptionChange >= 0 ? 'Increased' : 'Decreased'} from previous month
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Peak Consumption</h3>
                <p className="text-2xl font-bold mt-1">{formatNumber(monthData.peak)} kWh</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Zap size={20} className="text-yellow-500" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {((monthData.peak / monthData.consumption) * 100).toFixed(1)}% of total consumption
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Off-Peak Consumption</h3>
                <p className="text-2xl font-bold mt-1">{formatNumber(monthData.offPeak)} kWh</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Battery size={20} className="text-blue-500" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {((monthData.offPeak / monthData.consumption) * 100).toFixed(1)}% of total consumption
            </p>
          </div>
        </div>
        
        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-base font-medium text-gray-700 mb-4">Monthly Consumption Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={electricityData.monthlyConsumption}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${formatNumber(value)} kWh`, '']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="consumption" 
                    name="Total Consumption" 
                    stroke={CHART_COLORS[0]} 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="peak" 
                    name="Peak Hours" 
                    stroke={CHART_COLORS[1]} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="offPeak" 
                    name="Off-Peak Hours" 
                    stroke={CHART_COLORS[2]} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-base font-medium text-gray-700 mb-4">Distribution by Zone</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={electricityData.distributionByZone}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {electricityData.distributionByZone.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Consumption']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Load Profile Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-base font-medium text-gray-700 mb-4">Daily Load Profile</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={electricityData.peakHours}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${formatNumber(value)} kW`, 'Load']}
                />
                <Bar 
                  dataKey="load" 
                  name="Power Load" 
                  fill={CHART_COLORS[0]}
                >
                  {electricityData.peakHours.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.load > 3000 ? '#f87171' : CHART_COLORS[0]} 
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

export default ElectricityAnalysis;