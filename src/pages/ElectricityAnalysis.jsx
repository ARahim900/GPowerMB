import React, { useState, useMemo } from 'react';
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
  AreaChart,
  Area,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Zap, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart2,
  AlertTriangle,
  Clock,
  Download,
  Calendar,
  Filter,
  Search,
  ArrowUpDown
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { electricityConsumptionData, months, electricityRate } from '../data/electricityData';

const ElectricityAnalysis = () => {
  // State for active tab and time period filter
  const [activeTab, setActiveTab] = useState('overview');
  const [activePeriod, setActivePeriod] = useState('yearly');
  const [selectedMonth, setSelectedMonth] = useState(11); // Default to March 2025 (index 11)
  const [sortField, setSortField] = useState('consumption');
  const [sortDirection, setSortDirection] = useState('desc');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Process data for calculations and charts
  const processedData = useMemo(() => {
    // Calculate total consumption for each month
    const monthlyTotals = months.map((_, monthIndex) => {
      return electricityConsumptionData.reduce((sum, facility) => {
        return sum + facility.consumption[monthIndex];
      }, 0);
    });

    // Calculate consumption by facility type for each month
    const consumptionByType = {};
    
    // Initialize the consumption by type object
    electricityConsumptionData.forEach(facility => {
      if (!consumptionByType[facility.type]) {
        consumptionByType[facility.type] = Array(12).fill(0);
      }
    });
    
    // Calculate consumption for each type by month
    electricityConsumptionData.forEach(facility => {
      facility.consumption.forEach((value, monthIndex) => {
        consumptionByType[facility.type][monthIndex] += value;
      });
    });

    // Convert to array format for charts
    const typesChartData = Object.keys(consumptionByType).map(type => {
      const totalConsumption = consumptionByType[type].reduce((sum, val) => sum + val, 0);
      return {
        type,
        totalConsumption,
        monthlyData: months.map((month, index) => ({
          month,
          consumption: consumptionByType[type][index]
        }))
      };
    }).sort((a, b) => b.totalConsumption - a.totalConsumption);

    // Calculate month-over-month change 
    const monthlyChange = monthlyTotals.map((total, index) => {
      if (index === 0) return 0;
      const prevMonth = monthlyTotals[index - 1];
      return prevMonth === 0 ? 0 : ((total - prevMonth) / prevMonth) * 100;
    });

    // Top consumers data
    const topConsumers = electricityConsumptionData
      .map(facility => {
        const totalConsumption = facility.consumption.reduce((sum, val) => sum + val, 0);
        return {
          name: facility.name,
          type: facility.type,
          totalConsumption,
          monthlyCost: facility.consumption.map(value => value * electricityRate),
          totalCost: totalConsumption * electricityRate
        };
      })
      .sort((a, b) => b.totalConsumption - a.totalConsumption)
      .slice(0, 10);

    // Format data for monthly consumption chart
    const monthlyConsumptionData = months.map((month, index) => ({
      month,
      consumption: monthlyTotals[index],
      cost: monthlyTotals[index] * electricityRate
    }));

    // Breakdown by facility type for current month (pie chart)
    const typeBreakdownCurrentMonth = Object.keys(consumptionByType).map(type => ({
      type,
      value: consumptionByType[type][selectedMonth],
      costValue: consumptionByType[type][selectedMonth] * electricityRate
    })).sort((a, b) => b.value - a.value);

    // Calculate totals
    const totalConsumption = monthlyTotals.reduce((sum, val) => sum + val, 0);
    const totalCost = totalConsumption * electricityRate;
    const currentMonthConsumption = monthlyTotals[selectedMonth];
    const currentMonthCost = currentMonthConsumption * electricityRate;
    const prevMonthConsumption = selectedMonth > 0 ? monthlyTotals[selectedMonth - 1] : 0;
    const percentChange = prevMonthConsumption === 0 ? 0 : 
      ((currentMonthConsumption - prevMonthConsumption) / prevMonthConsumption) * 100;

    // Get consumption by major facility types
    const pumpingStationTotal = electricityConsumptionData
      .filter(facility => facility.type === 'PS')
      .reduce((sum, facility) => sum + facility.consumption.reduce((s, val) => s + val, 0), 0);
    
    const liftingStationTotal = electricityConsumptionData
      .filter(facility => facility.type === 'LS')
      .reduce((sum, facility) => sum + facility.consumption.reduce((s, val) => s + val, 0), 0);
    
    const streetLightTotal = electricityConsumptionData
      .filter(facility => facility.type === 'Street Light')
      .reduce((sum, facility) => sum + facility.consumption.reduce((s, val) => s + val, 0), 0);
    
    const dBuildingTotal = electricityConsumptionData
      .filter(facility => facility.type === 'D_Building')
      .reduce((sum, facility) => sum + facility.consumption.reduce((s, val) => s + val, 0), 0);

    return {
      monthlyTotals,
      monthlyChange,
      consumptionByType,
      typesChartData,
      topConsumers,
      monthlyConsumptionData,
      typeBreakdownCurrentMonth,
      totalConsumption,
      totalCost,
      currentMonthConsumption,
      currentMonthCost,
      percentChange,
      pumpingStationTotal,
      liftingStationTotal,
      streetLightTotal,
      dBuildingTotal
    };
  }, [selectedMonth]);

  // Filter and sort facilities for the table view
  const filteredFacilities = useMemo(() => {
    return electricityConsumptionData
      .map(facility => {
        const totalConsumption = facility.consumption.reduce((sum, val) => sum + val, 0);
        const currentMonthConsumption = facility.consumption[selectedMonth];
        return {
          name: facility.name,
          type: facility.type,
          meterNo: facility.meterAccountNo,
          currentMonthConsumption,
          currentMonthCost: currentMonthConsumption * electricityRate,
          totalConsumption,
          totalCost: totalConsumption * electricityRate
        };
      })
      .filter(facility => {
        const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             facility.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             facility.meterNo.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (facilityFilter === 'all') {
          return matchesSearch;
        }
        return matchesSearch && facility.type === facilityFilter;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (sortDirection === 'asc') {
          return aValue - bValue;
        }
        return bValue - aValue;
      });
  }, [selectedMonth, sortField, sortDirection, facilityFilter, searchTerm]);

  // COLORS for charts
  const COLORS = ['#4E4456', '#636AFF', '#36B3C2', '#FFB547', '#FF6B6B', '#05CE91', '#8676FF'];

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader 
        title="Electricity Analysis" 
        subtitle="Comprehensive electricity consumption and distribution analysis" 
      />
      
      <main className="p-6">
        {/* Export Data Button */}
        <div className="flex justify-end mb-6">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'consumption' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('consumption')}
            >
              Consumption Analysis
            </button>
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'facilities' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('facilities')}
            >
              Facilities Breakdown
            </button>
            <button
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('reports')}
            >
              Reports
            </button>
          </nav>
        </div>
        
        {/* Time Period Selection */}
        <div className="flex items-center mb-6">
          <Calendar className="text-gray-400 mr-2" size={16} />
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className={`relative inline-flex items-center px-3 py-2 rounded-l-md border ${
                activePeriod === 'monthly' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'
              } text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
              onClick={() => setActivePeriod('monthly')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`relative inline-flex items-center px-3 py-2 border-t border-b border-r ${
                activePeriod === 'quarterly' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'
              } text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
              onClick={() => setActivePeriod('quarterly')}
            >
              Quarterly
            </button>
            <button
              type="button"
              className={`relative inline-flex items-center px-3 py-2 rounded-r-md border-t border-b border-r ${
                activePeriod === 'yearly' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'
              } text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
              onClick={() => setActivePeriod('yearly')}
            >
              Yearly
            </button>
          </div>
          
          {/* Month Selection Dropdown */}
          <div className="ml-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Consumption KPI */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary/10 mr-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Consumption</p>
                    <p className="text-2xl font-bold">{processedData.totalConsumption.toLocaleString()} kWh</p>
                    <div className="flex items-center text-xs">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="text-gray-500">Last 12 months</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Total Cost KPI */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Cost</p>
                    <p className="text-2xl font-bold">{processedData.totalCost.toLocaleString()} OMR</p>
                    <div className="flex items-center text-xs">
                      <Clock className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="text-gray-500">Last 12 months</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Current Month Consumption */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <BarChart2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{months[selectedMonth]} Consumption</p>
                    <p className="text-2xl font-bold">{processedData.currentMonthConsumption.toLocaleString()} kWh</p>
                    <div className="flex items-center text-xs">
                      {processedData.percentChange > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1 text-red-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                      )}
                      <span className={processedData.percentChange > 0 ? 'text-red-500' : 'text-green-500'}>
                        {processedData.percentChange.toFixed(1)}% from previous month
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Current Month Cost */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-amber-100 mr-4">
                    <DollarSign className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{months[selectedMonth]} Cost</p>
                    <p className="text-2xl font-bold">{processedData.currentMonthCost.toLocaleString()} OMR</p>
                    <div className="flex items-center text-xs">
                      <span className="text-gray-500">
                        {electricityRate} OMR per kWh
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional KPI Cards - Facility Type Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Pumping Stations */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Pumping Stations</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{processedData.pumpingStationTotal.toLocaleString()} kWh</p>
                    <p className="text-sm text-gray-500">{(processedData.pumpingStationTotal * electricityRate).toLocaleString()} OMR</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium">{((processedData.pumpingStationTotal / processedData.totalConsumption) * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">of total</p>
                  </div>
                </div>
              </div>
              
              {/* Lifting Stations */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Lifting Stations</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{processedData.liftingStationTotal.toLocaleString()} kWh</p>
                    <p className="text-sm text-gray-500">{(processedData.liftingStationTotal * electricityRate).toLocaleString()} OMR</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium">{((processedData.liftingStationTotal / processedData.totalConsumption) * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">of total</p>
                  </div>
                </div>
              </div>
              
              {/* Street Lights */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Street Lights</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{processedData.streetLightTotal.toLocaleString()} kWh</p>
                    <p className="text-sm text-gray-500">{(processedData.streetLightTotal * electricityRate).toLocaleString()} OMR</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium">{((processedData.streetLightTotal / processedData.totalConsumption) * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">of total</p>
                  </div>
                </div>
              </div>
              
              {/* D Buildings */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">D Buildings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{processedData.dBuildingTotal.toLocaleString()} kWh</p>
                    <p className="text-sm text-gray-500">{(processedData.dBuildingTotal * electricityRate).toLocaleString()} OMR</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium">{((processedData.dBuildingTotal / processedData.totalConsumption) * 100).toFixed(1)}%</p>
                    <p className="text-sm text-gray-500">of total</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Consumption Chart */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Consumption Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={processedData.monthlyConsumptionData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        yAxisId="consumption"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        domain={[0, 'auto']}
                        tickFormatter={(value) => `${value.toLocaleString()}`}
                      />
                      <YAxis
                        yAxisId="cost"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        domain={[0, 'auto']}
                        tickFormatter={(value) => `${value.toLocaleString()} OMR`}
                      />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="consumption"
                        type="monotone"
                        dataKey="consumption"
                        name="Consumption (kWh)"
                        stroke="#4E4456"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="cost"
                        type="monotone"
                        dataKey="cost"
                        name="Cost (OMR)"
                        stroke="#FFB547"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Consumption by Facility Type */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Consumption by Facility Type</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={processedData.typeBreakdownCurrentMonth}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={1}
                        dataKey="value"
                        label={({ type, percent }) => `${type} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {processedData.typeBreakdownCurrentMonth.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => {
                          if (name === 'value') {
                            return [`${value.toLocaleString()} kWh`, 'Consumption'];
                          }
                          return [`${value.toLocaleString()} OMR`, 'Cost'];
                        }}
                        labelFormatter={(index) => processedData.typeBreakdownCurrentMonth[index].type}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Top Consumers Table */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">Top Consumers</h3>
                <p className="text-sm text-gray-500 mt-1">Facilities with highest electricity consumption</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Facility Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Consumption (kWh)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Cost (OMR)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % of Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {processedData.topConsumers.map((consumer, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{consumer.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{consumer.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{consumer.totalConsumption.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{consumer.totalCost.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {((consumer.totalConsumption / processedData.totalConsumption) * 100).toFixed(1)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Consumption Analysis Tab */}
        {activeTab === 'consumption' && (
          <div>
            {/* Monthly Consumption Area Chart */}
            <div className="bg-white rounded-lg shadow-card p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Consumption Breakdown</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={months.map((month, index) => {
                      const data = { month };
                      processedData.typesChartData.forEach(type => {
                        data[type.type] = type.monthlyData[index].consumption;
                      });
                      return data;
                    })}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value.toLocaleString()}`} />
                    <Tooltip />
                    <Legend />
                    {processedData.typesChartData.map((type, index) => (
                      <Area
                        key={type.type}
                        type="monotone"
                        dataKey={type.type}
                        stackId="1"
                        stroke={COLORS[index % COLORS.length]}
                        fill={COLORS[index % COLORS.length]}
                        fillOpacity={0.6}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Monthly Change Analysis */}
            <div className="bg-white rounded-lg shadow-card p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Change Analysis</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={months.map((month, i) => ({
                      month,
                      change: i > 0 ? processedData.monthlyChange[i] : 0
                    })).slice(1)} // Skip first month as it has no change
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => `${value.toFixed(0)}%`} 
                    />
                    <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Month-over-Month Change']} />
                    <Bar 
                      dataKey="change" 
                      name="Month-over-Month Change" 
                      fill={(data) => (data.change >= 0 ? '#FF6B6B' : '#05CE91')}
                      radius={[4, 4, 0, 0]}
                    >
                      {months.slice(1).map((month, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={processedData.monthlyChange[index + 1] >= 0 ? '#FF6B6B' : '#05CE91'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center space-x-8">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Increase from previous month</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Decrease from previous month</span>
                </div>
              </div>
            </div>
            
            {/* Seasonal Patterns */}
            <div className="bg-white rounded-lg shadow-card p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Seasonal Consumption Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Summer Months (May-Aug) */}
                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-amber-800 mb-2">Summer (May-Aug)</h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-amber-900">
                        {(processedData.monthlyTotals[1] + processedData.monthlyTotals[2] + 
                          processedData.monthlyTotals[3] + processedData.monthlyTotals[4]).toLocaleString()}
                      </p>
                      <p className="text-sm text-amber-800">kWh Total</p>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-amber-900">
                        {((processedData.monthlyTotals[1] + processedData.monthlyTotals[2] + 
                          processedData.monthlyTotals[3] + processedData.monthlyTotals[4]) / 4).toLocaleString()}
                      </p>
                      <p className="text-sm text-amber-800">kWh Monthly Avg</p>
                    </div>
                  </div>
                </div>
                
                {/* Autumn/Winter Months (Sep-Dec) */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-blue-800 mb-2">Autumn/Winter (Sep-Dec)</h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-900">
                        {(processedData.monthlyTotals[5] + processedData.monthlyTotals[6] + 
                          processedData.monthlyTotals[7] + processedData.monthlyTotals[8]).toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-800">kWh Total</p>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-blue-900">
                        {((processedData.monthlyTotals[5] + processedData.monthlyTotals[6] + 
                          processedData.monthlyTotals[7] + processedData.monthlyTotals[8]) / 4).toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-800">kWh Monthly Avg</p>
                    </div>
                  </div>
                </div>
                
                {/* Spring Months (Jan-Apr) */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-green-800 mb-2">Spring (Jan-Apr)</h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-green-900">
                        {(processedData.monthlyTotals[9] + processedData.monthlyTotals[10] + 
                          processedData.monthlyTotals[11] + processedData.monthlyTotals[0]).toLocaleString()}
                      </p>
                      <p className="text-sm text-green-800">kWh Total</p>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-green-900">
                        {((processedData.monthlyTotals[9] + processedData.monthlyTotals[10] + 
                          processedData.monthlyTotals[11] + processedData.monthlyTotals[0]) / 4).toLocaleString()}
                      </p>
                      <p className="text-sm text-green-800">kWh Monthly Avg</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Insights & Recommendations */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Insights & Recommendations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key Insights */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">Key Insights</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-600">
                        <span className="font-medium text-gray-700">High consumption variability </span> 
                        in Beachwell facility indicates potential equipment issues.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Peak consumption </span> 
                        occurs during summer months (May-August), with June having the highest average.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <DollarSign className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Retail facilities </span> 
                        account for over 20% of total energy consumption, primarily from CIF kitchen.
                      </p>
                    </li>
                  </ul>
                </div>
                
                {/* Recommendations */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">Recommendations</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Conduct energy audit </span> 
                        for Beachwell facility to identify causes of high consumption variability.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Implement time-of-use strategies </span> 
                        to reduce peak consumption during summer months.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-600">
                        <span className="font-medium text-gray-700">Review and optimize </span> 
                        kitchen equipment operation in retail facilities to reduce consumption.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Facilities Breakdown Tab */}
        {activeTab === 'facilities' && (
          <div>
            {/* Filter Controls */}
            <div className="bg-white rounded-lg shadow-card p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search facilities..."
                    className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <div className="relative w-full md:w-64">
                  <select
                    className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    value={facilityFilter}
                    onChange={(e) => setFacilityFilter(e.target.value)}
                  >
                    <option value="all">All Facility Types</option>
                    {processedData.typesChartData.map(type => (
                      <option key={type.type} value={type.type}>{type.type}</option>
                    ))}
                  </select>
                  <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Facilities Table */}
            <div className="bg-white rounded-lg shadow-card overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <SortableHeader 
                        title="Facility Name" 
                        field="name" 
                        currentSort={sortField}
                        direction={sortDirection}
                        onSort={() => {
                          if (sortField === 'name') {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField('name');
                            setSortDirection('asc');
                          }
                        }}
                      />
                      <SortableHeader 
                        title="Type" 
                        field="type" 
                        currentSort={sortField}
                        direction={sortDirection}
                        onSort={() => {
                          if (sortField === 'type') {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField('type');
                            setSortDirection('asc');
                          }
                        }}
                      />
                      <SortableHeader 
                        title="Meter Number" 
                        field="meterNo" 
                        currentSort={sortField}
                        direction={sortDirection}
                        onSort={() => {
                          if (sortField === 'meterNo') {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField('meterNo');
                            setSortDirection('asc');
                          }
                        }}
                      />
                      <SortableHeader 
                        title={`${months[selectedMonth]} (kWh)`}
                        field="currentMonthConsumption" 
                        currentSort={sortField}
                        direction={sortDirection}
                        onSort={() => {
                          if (sortField === 'currentMonthConsumption') {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField('currentMonthConsumption');
                            setSortDirection('desc');
                          }
                        }}
                      />
                      <SortableHeader 
                        title={`${months[selectedMonth]} (OMR)`}
                        field="currentMonthCost" 
                        currentSort={sortField}
                        direction={sortDirection}
                        onSort={() => {
                          if (sortField === 'currentMonthCost') {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField('currentMonthCost');
                            setSortDirection('desc');
                          }
                        }}
                      />
                      <SortableHeader 
                        title="Total (kWh)" 
                        field="totalConsumption" 
                        currentSort={sortField}
                        direction={sortDirection}
                        onSort={() => {
                          if (sortField === 'totalConsumption') {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField('totalConsumption');
                            setSortDirection('desc');
                          }
                        }}
                      />
                      <SortableHeader 
                        title="Total (OMR)" 
                        field="totalCost" 
                        currentSort={sortField}
                        direction={sortDirection}
                        onSort={() => {
                          if (sortField === 'totalCost') {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortField('totalCost');
                            setSortDirection('desc');
                          }
                        }}
                      />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFacilities.map((facility, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{facility.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{facility.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{facility.meterNo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{facility.currentMonthConsumption.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{facility.currentMonthCost.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{facility.totalConsumption.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{facility.totalCost.toLocaleString()}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Facility Type Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Facility Type Distribution */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Facility Type Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={processedData.typesChartData.map(type => ({
                        type: type.type,
                        consumption: type.totalConsumption,
                        cost: type.totalConsumption * electricityRate
                      }))}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis 
                        dataKey="type" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        width={100} 
                      />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="consumption" 
                        name="Consumption (kWh)" 
                        fill="#4E4456" 
                        barSize={20} 
                        radius={[0, 4, 4, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Selected Month Consumption by Facility Type */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">{months[selectedMonth]} Consumption by Type</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={processedData.typeBreakdownCurrentMonth}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={1}
                        dataKey="value"
                        label={({ type, percent }) => `${type} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {processedData.typeBreakdownCurrentMonth.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [`${value.toLocaleString()}`, name === 'value' ? 'kWh' : 'OMR']}
                        labelFormatter={(index) => processedData.typeBreakdownCurrentMonth[index].type}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <div className="bg-white rounded-lg shadow-card overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">Available Reports</h3>
                <p className="text-sm text-gray-500 mt-1">Download and export electricity consumption reports</p>
              </div>
              
              <ul className="divide-y divide-gray-200">
                <ReportItem 
                  title="Monthly Consumption Report" 
                  description="Detailed monthly electricity consumption by facility"
                  date="Generated May 20, 2025"
                />
                <ReportItem 
                  title="Quarterly Cost Analysis" 
                  description="Q1 2025 electricity costs breakdown by facility type"
                  date="Generated Apr 15, 2025"
                />
                <ReportItem 
                  title="Annual Consumption Summary" 
                  description="2024 yearly electricity consumption trends and analysis"
                  date="Generated Jan 10, 2025"
                />
                <ReportItem 
                  title="Facility Type Comparison" 
                  description="Comparative analysis of electricity usage by facility type"
                  date="Generated Mar 5, 2025"
                />
                <ReportItem 
                  title="Efficiency Recommendations" 
                  description="Energy efficiency recommendations and potential savings"
                  date="Generated Feb 28, 2025"
                />
              </ul>
            </div>
            
            {/* Generate Custom Report Section */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Generate Custom Report</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option>Consumption Analysis</option>
                    <option>Cost Breakdown</option>
                    <option>Facility Comparison</option>
                    <option>Efficiency Report</option>
                    <option>Trend Analysis</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option>Last Month</option>
                    <option>Last Quarter</option>
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                    <option>Custom Range</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facility Filter</label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option>All Facilities</option>
                    <option>Pumping Stations</option>
                    <option>Lifting Stations</option>
                    <option>Street Lights</option>
                    <option>D Buildings</option>
                    <option>Custom Selection</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Format</label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option>PDF Report</option>
                    <option>Excel Spreadsheet</option>
                    <option>CSV Data</option>
                    <option>Interactive Dashboard</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Sortable Header Component for Tables
const SortableHeader = ({ title, field, currentSort, direction, onSort }) => {
  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={onSort}
    >
      <div className="flex items-center">
        <span>{title}</span>
        <ArrowUpDown 
          size={14} 
          className={`ml-1 ${currentSort === field ? 'text-primary' : 'text-gray-400'}`} 
        />
      </div>
    </th>
  );
};

// Report Item Component
const ReportItem = ({ title, description, date }) => {
  return (
    <li className="px-6 py-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>
        <div>
          <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-primary-dark bg-primary-light/10 hover:bg-primary-light/20">
            <Download className="h-3 w-3 mr-1" />
            Download
          </button>
        </div>
      </div>
    </li>
  );
};

export default ElectricityAnalysis;