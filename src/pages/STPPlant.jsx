import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import { 
  Calendar, Download, Droplet, AlertTriangle, 
  CheckCircle, Thermometer, Activity, Waves
} from 'lucide-react';
import PageHeader from '../components/PageHeader';

// Sample data for STP Plant
const stpData = {
  flowRates: [
    { name: 'Jan', inflow: 450, outflow: 430, treated: 445 },
    { name: 'Feb', inflow: 420, outflow: 400, treated: 415 },
    { name: 'Mar', inflow: 480, outflow: 460, treated: 475 },
    { name: 'Apr', inflow: 520, outflow: 500, treated: 515 },
    { name: 'May', inflow: 550, outflow: 530, treated: 545 },
    { name: 'Jun', inflow: 600, outflow: 580, treated: 595 },
    { name: 'Jul', inflow: 650, outflow: 630, treated: 645 },
    { name: 'Aug', inflow: 620, outflow: 600, treated: 615 },
    { name: 'Sep', inflow: 580, outflow: 560, treated: 575 },
    { name: 'Oct', inflow: 540, outflow: 520, treated: 535 },
    { name: 'Nov', inflow: 510, outflow: 490, treated: 505 },
    { name: 'Dec', inflow: 490, outflow: 470, treated: 485 }
  ],
  qualityParams: [
    { name: 'BOD', value: 15, limit: 30, unit: 'mg/L' },
    { name: 'COD', value: 48, limit: 120, unit: 'mg/L' },
    { name: 'TSS', value: 12, limit: 50, unit: 'mg/L' },
    { name: 'TN', value: 8.2, limit: 15, unit: 'mg/L' },
    { name: 'TP', value: 1.8, limit: 5, unit: 'mg/L' },
    { name: 'pH', value: 7.2, limit: [6, 9], unit: '' }
  ],
  dailyReadings: [
    { time: '00:00', flowRate: 18, pH: 7.1, temperature: 22 },
    { time: '02:00', flowRate: 15, pH: 7.2, temperature: 21 },
    { time: '04:00', flowRate: 12, pH: 7.3, temperature: 21 },
    { time: '06:00', flowRate: 14, pH: 7.2, temperature: 22 },
    { time: '08:00', flowRate: 20, pH: 7.1, temperature: 23 },
    { time: '10:00', flowRate: 25, pH: 7.0, temperature: 24 },
    { time: '12:00', flowRate: 28, pH: 7.1, temperature: 25 },
    { time: '14:00', flowRate: 30, pH: 7.2, temperature: 26 },
    { time: '16:00', flowRate: 27, pH: 7.3, temperature: 25 },
    { time: '18:00', flowRate: 23, pH: 7.2, temperature: 24 },
    { time: '20:00', flowRate: 21, pH: 7.1, temperature: 23 },
    { time: '22:00', flowRate: 19, pH: 7.0, temperature: 22 }
  ],
  alerts: [
    { id: 1, type: 'warning', message: 'High influent flow rate detected', timestamp: '2025-04-15 08:32:15' },
    { id: 2, type: 'critical', message: 'Aeration tank #2 oxygen level below threshold', timestamp: '2025-04-21 14:15:47' },
    { id: 3, type: 'info', message: 'Scheduled maintenance completed', timestamp: '2025-04-28 11:20:33' }
  ],
  systemStatus: [
    { name: 'Screening', fill: '#10b981', value: 100 },
    { name: 'Grit Chamber', fill: '#10b981', value: 100 },
    { name: 'Aeration', fill: '#f59e0b', value: 75 },
    { name: 'Clarifier', fill: '#10b981', value: 95 },
    { name: 'Disinfection', fill: '#10b981', value: 90 },
    { name: 'Sludge Handling', fill: '#ef4444', value: 45 }
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

const STPPlant = () => {
  const [activeMonth, setActiveMonth] = useState('Apr');
  const [activeYear, setActiveYear] = useState('2025');
  
  // Format number with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US');
  };
  
  // Find month data
  const monthData = stpData.flowRates.find(m => m.name === activeMonth) || stpData.flowRates[0];
  
  // Calculate treatment efficiency
  const treatmentEfficiency = (monthData.treated / monthData.inflow) * 100;

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title="STP Plant" 
        subtitle="Sewage treatment plant monitoring" 
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
                  {stpData.flowRates.map(m => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Inflow Rate</h3>
                <p className="text-2xl font-bold mt-1">{formatNumber(monthData.inflow)} m³/day</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Waves size={20} className="text-blue-500" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Treated Water</h3>
                <p className="text-2xl font-bold mt-1">{formatNumber(monthData.treated)} m³/day</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Droplet size={20} className="text-green-500" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(monthData.treated / monthData.inflow) * 100}%` }}></div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Treatment Efficiency</h3>
                <p className="text-2xl font-bold mt-1">{treatmentEfficiency.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Activity size={20} className="text-yellow-500" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${treatmentEfficiency >= 95 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                style={{ width: `${treatmentEfficiency}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Average Temperature</h3>
                <p className="text-2xl font-bold mt-1">24.2 °C</p>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <Thermometer size={20} className="text-red-500" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
        
        {/* Flow Rates Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="text-base font-medium text-gray-700 mb-4">Monthly Flow Rates</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stpData.flowRates}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${formatNumber(value)} m³/day`, '']}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="inflow" 
                  name="Inflow" 
                  stroke={CHART_COLORS[0]} 
                  fill={CHART_COLORS[0]} 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="treated" 
                  name="Treated Water" 
                  stroke={CHART_COLORS[1]} 
                  fill={CHART_COLORS[1]} 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="outflow" 
                  name="Outflow" 
                  stroke={CHART_COLORS[2]} 
                  fill={CHART_COLORS[2]} 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Water Quality Parameters */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-base font-medium text-gray-700 mb-4">Water Quality Parameters</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stpData.qualityParams.filter(p => p.name !== 'pH')}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} ${props.payload.unit}`,
                      `Current Value`
                    ]}
                  />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Current Value" 
                    fill={CHART_COLORS[0]} 
                  />
                  <Bar 
                    dataKey="limit" 
                    name="Regulatory Limit" 
                    fill={CHART_COLORS[4]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Daily Readings */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-base font-medium text-gray-700 mb-4">Daily Operation Readings</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stpData.dailyReadings}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[6, 8]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="flowRate" 
                    name="Flow Rate (m³/h)" 
                    stroke={CHART_COLORS[0]} 
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="temperature" 
                    name="Temperature (°C)" 
                    stroke={CHART_COLORS[4]} 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="pH" 
                    name="pH Level" 
                    stroke={CHART_COLORS[1]} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* System Status and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-base font-medium text-gray-700 mb-4">System Status</h3>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="20%" 
                  outerRadius="80%" 
                  barSize={20} 
                  data={stpData.systemStatus}
                >
                  <RadialBar
                    background
                    clockWise
                    dataKey="value"
                    label={{ position: 'insideStart', fill: '#666', fontSize: 12 }}
                  />
                  <Legend 
                    iconSize={10} 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Operational Status']}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Alerts */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-base font-medium text-gray-700 mb-4">Recent Alerts</h3>
            <div className="space-y-4">
              {stpData.alerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg ${
                    alert.type === 'critical' ? 'bg-red-50 border-l-4 border-red-500' : 
                    alert.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 
                    'bg-blue-50 border-l-4 border-blue-500'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      {alert.type === 'critical' ? (
                        <AlertTriangle size={20} className="text-red-500" />
                      ) : alert.type === 'warning' ? (
                        <AlertTriangle size={20} className="text-yellow-500" />
                      ) : (
                        <CheckCircle size={20} className="text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${
                        alert.type === 'critical' ? 'text-red-800' : 
                        alert.type === 'warning' ? 'text-yellow-800' : 
                        'text-blue-800'
                      }`}>
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                    </div>
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

export default STPPlant;