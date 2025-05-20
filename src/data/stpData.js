export const stpData = [
  {
    date: "2024-07-01",
    tankersCount: 10,
    expectedTankerVolume: 200,
    directInlineSewage: 139,
    totalInletSewage: 339,
    totalTreatedWater: 385,
    totalTSEWaterOutput: 340,
    observations: "",
    maintenanceAction1: "",
    maintenanceAction2: ""
  },
  {
    date: "2024-07-02",
    tankersCount: 14,
    expectedTankerVolume: 280,
    directInlineSewage: 246,
    totalInletSewage: 526,
    totalTreatedWater: 519,
    totalTSEWaterOutput: 458,
    observations: "",
    maintenanceAction1: "",
    maintenanceAction2: ""
  },
  {
    date: "2024-07-03",
    tankersCount: 13,
    expectedTankerVolume: 260,
    directInlineSewage: 208,
    totalInletSewage: 468,
    totalTreatedWater: 479,
    totalTSEWaterOutput: 425,
    observations: "",
    maintenanceAction1: "",
    maintenanceAction2: ""
  },
  {
    date: "2024-07-04",
    tankersCount: 11,
    expectedTankerVolume: 220,
    directInlineSewage: 244,
    totalInletSewage: 464,
    totalTreatedWater: 547,
    totalTSEWaterOutput: 489,
    observations: "",
    maintenanceAction1: "",
    maintenanceAction2: ""
  },
  {
    date: "2024-07-05",
    tankersCount: 15,
    expectedTankerVolume: 300,
    directInlineSewage: 265,
    totalInletSewage: 565,
    totalTreatedWater: 653,
    totalTSEWaterOutput: 574,
    observations: "",
    maintenanceAction1: "",
    maintenanceAction2: ""
  },
  {
    date: "2024-07-06",
    tankersCount: 14,
    expectedTankerVolume: 280,
    directInlineSewage: 222,
    totalInletSewage: 502,
    totalTreatedWater: 552,
    totalTSEWaterOutput: 492,
    observations: "",
    maintenanceAction1: "",
    maintenanceAction2: ""
  },
  {
    date: "2024-07-07",
    tankersCount: 13,
    expectedTankerVolume: 260,
    directInlineSewage: 289,
    totalInletSewage: 549,
    totalTreatedWater: 575,
    totalTSEWaterOutput: 498,
    observations: "",
    maintenanceAction1: "",
    maintenanceAction2: ""
  },
  {
    date: "2024-07-08",
    tankersCount: 16,
    expectedTankerVolume: 320,
    directInlineSewage: 212,
    totalInletSewage: 532,
    totalTreatedWater: 587,
    totalTSEWaterOutput: 515,
    observations: "The aerator in equalization tank has abnormal noise",
    maintenanceAction1: "Need to empty the tank and the problem can be identified. need to open roof top structural work",
    maintenanceAction2: ""
  },
  {
    date: "2024-07-09",
    tankersCount: 13,
    expectedTankerVolume: 260,
    directInlineSewage: 272,
    totalInletSewage: 532,
    totalTreatedWater: 586,
    totalTSEWaterOutput: 519,
    observations: "1. Aerator of equalization tank has unusual sound \n2. Raw Sewage lifting pump has a problem flow low level",
    maintenanceAction1: "Need to empty out the tank and rooftop has to be removed for the maintainance activity.",
    maintenanceAction2: "The maintenance activity over removing the debris got stuck inside Raw sewage pump was done"
  },
  {
    date: "2024-07-10",
    tankersCount: 12,
    expectedTankerVolume: 240,
    directInlineSewage: 253,
    totalInletSewage: 493,
    totalTreatedWater: 542,
    totalTSEWaterOutput: 462,
    observations: "",
    maintenanceAction1: "",
    maintenanceAction2: ""
  },
  {
    date: "2024-07-12",
    tankersCount: 12,
    expectedTankerVolume: 240,
    directInlineSewage: 266,
    totalInletSewage: 506,
    totalTreatedWater: 533,
    totalTSEWaterOutput: 468,
    observations: "need to check equalization tank aerator. that aerator has some unusual sound",
    maintenanceAction1: "",
    maintenanceAction2: ""
  },
  {
    date: "2024-07-13",
    tankersCount: 16,
    expectedTankerVolume: 320,
    directInlineSewage: 258,
    totalInletSewage: 578,
    totalTreatedWater: 654,
    totalTSEWaterOutput: 580,
    observations: "",
    maintenanceAction1: "",
    maintenanceAction2: ""
  },
  {
    date: "2024-07-14",
    tankersCount: 10,
    expectedTankerVolume: 200,
    directInlineSewage: 279,
    totalInletSewage: 479,
    totalTreatedWater: 464,
    totalTSEWaterOutput: 402,
    observations: "",
    maintenanceAction1: "today clean and cheaked aeration blower air filter - oil level and blower belt today clean and cheaked mbr blower air filter - oil level and blower belt",
    maintenanceAction2: "poured lime powder \npoured chlorine for cleaning mbr"
  },
  {
    date: "2025-05-16",
    tankersCount: 9,
    expectedTankerVolume: 180,
    directInlineSewage: 479,
    totalInletSewage: 659,
    totalTreatedWater: 725,
    totalTSEWaterOutput: 646,
    observations: "",
    maintenanceAction1: "Aeration Tank and mbr filter clean and checked, checked PH and TDS of raw and product water",
    maintenanceAction2: ""
  }
];

// Utility function to group data by month
export const groupDataByMonth = (data) => {
  const monthlyData = {};
  
  data.forEach(day => {
    const date = new Date(day.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        date: monthYear,
        tankersCount: 0,
        expectedTankerVolume: 0,
        directInlineSewage: 0,
        totalInletSewage: 0,
        totalTreatedWater: 0,
        totalTSEWaterOutput: 0,
        daysWithMaintenance: 0,
        daysCount: 0,
        observations: [],
        maintenanceActions: []
      };
    }
    
    monthlyData[monthYear].tankersCount += day.tankersCount;
    monthlyData[monthYear].expectedTankerVolume += day.expectedTankerVolume;
    monthlyData[monthYear].directInlineSewage += day.directInlineSewage;
    monthlyData[monthYear].totalInletSewage += day.totalInletSewage;
    monthlyData[monthYear].totalTreatedWater += day.totalTreatedWater;
    monthlyData[monthYear].totalTSEWaterOutput += day.totalTSEWaterOutput;
    monthlyData[monthYear].daysCount += 1;
    
    if (day.maintenanceAction1 || day.maintenanceAction2) {
      monthlyData[monthYear].daysWithMaintenance += 1;
      
      if (day.observations) {
        monthlyData[monthYear].observations.push({date: day.date, text: day.observations});
      }
      
      if (day.maintenanceAction1) {
        monthlyData[monthYear].maintenanceActions.push({date: day.date, text: day.maintenanceAction1});
      }
      
      if (day.maintenanceAction2) {
        monthlyData[monthYear].maintenanceActions.push({date: day.date, text: day.maintenanceAction2});
      }
    }
  });
  
  return Object.values(monthlyData);
};

// Calculate metrics based on data period
export const calculateSTPMetrics = (data) => {
  // Design capacity is 750 m³/day
  const designCapacity = 750;
  
  let totalInlet = 0;
  let totalTreated = 0;
  let totalOutput = 0;
  let totalTankers = 0;
  let totalTankerVolume = 0;
  let totalDirect = 0;
  let daysWithMaintenance = 0;
  let maxDailyInflow = 0;
  let avgEfficiency = 0;
  let daysAboveTargetEfficiency = 0;
  let daysCount = data.length;
  
  data.forEach(day => {
    totalInlet += day.totalInletSewage;
    totalTreated += day.totalTreatedWater;
    totalOutput += day.totalTSEWaterOutput;
    totalTankers += day.tankersCount;
    totalTankerVolume += day.expectedTankerVolume;
    totalDirect += day.directInlineSewage;
    
    if (day.maintenanceAction1 || day.maintenanceAction2) {
      daysWithMaintenance++;
    }
    
    // Calculate daily metrics
    const dailyEfficiency = (day.totalTSEWaterOutput / day.totalInletSewage) * 100;
    avgEfficiency += dailyEfficiency;
    
    // Count days with TSE output at least 85% of inlet
    if (dailyEfficiency >= 85) {
      daysAboveTargetEfficiency++;
    }
    
    // Track maximum daily inflow
    if (day.totalInletSewage > maxDailyInflow) {
      maxDailyInflow = day.totalInletSewage;
    }
  });
  
  const avgDailyInlet = totalInlet / daysCount;
  const avgDailyTreated = totalTreated / daysCount;
  const avgDailyOutput = totalOutput / daysCount;
  avgEfficiency = avgEfficiency / daysCount;
  
  return {
    // Corrected efficiency metric (recovery rate)
    waterRecoveryRate: (totalOutput / totalInlet) * 100,
    // Process efficiency
    processEfficiency: (totalOutput / totalTreated) * 100,
    // Overall efficiency
    overallEfficiency: (totalTreated / totalInlet) * 100,
    // Capacity metrics
    capacityUtilization: (avgDailyInlet / designCapacity) * 100,
    maxCapacityUtilization: (maxDailyInflow / designCapacity) * 100,
    // Daily averages
    avgDailyInflow: avgDailyInlet,
    avgDailyOutflow: avgDailyOutput,
    avgDailyTreated: avgDailyTreated,
    // Total volumes
    totalInletVolume: totalInlet,
    totalTreatedVolume: totalTreated,
    totalOutputVolume: totalOutput,
    // Tanker metrics
    totalTankers: totalTankers,
    avgTankersPerDay: totalTankers / daysCount,
    totalTankerVolume: totalTankerVolume,
    // Time metrics
    totalDaysAnalyzed: daysCount,
    daysAboveTargetEfficiency: daysAboveTargetEfficiency,
    targetEfficiencyPercentage: (daysAboveTargetEfficiency / daysCount) * 100,
    // Maintenance metrics
    maintenanceFrequency: (daysWithMaintenance / daysCount) * 100,
    // Inlet composition
    inletComposition: {
      tankerPercentage: (totalTankerVolume / totalInlet) * 100,
      directPercentage: (totalDirect / totalInlet) * 100
    }
  };
};

// Get maintenance issues
export const getMaintenanceIssues = (data = stpData) => {
  const issues = [];
  
  data.forEach(day => {
    if (day.observations) {
      issues.push({
        date: day.date,
        issue: day.observations,
        action: day.maintenanceAction1 || day.maintenanceAction2 || 'No action recorded'
      });
    }
  });
  
  return issues.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Get monthly averages for key metrics
export const getMonthlyAverages = () => {
  const monthlyData = {};
  
  stpData.forEach(entry => {
    const date = new Date(entry.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        month: monthYear,
        displayMonth: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString('default', { month: 'short', year: 'numeric' }),
        counts: 0,
        totalInlet: 0,
        totalTreated: 0,
        totalOutput: 0,
        tankersCount: 0,
        directInlineSewage: 0,
        maintenanceCount: 0
      };
    }
    
    monthlyData[monthYear].counts += 1;
    monthlyData[monthYear].totalInlet += entry.totalInletSewage;
    monthlyData[monthYear].totalTreated += entry.totalTreatedWater;
    monthlyData[monthYear].totalOutput += entry.totalTSEWaterOutput;
    monthlyData[monthYear].tankersCount += entry.tankersCount;
    monthlyData[monthYear].directInlineSewage += entry.directInlineSewage;
    
    // Count if there was maintenance
    if (entry.maintenanceAction1 || entry.maintenanceAction2) {
      monthlyData[monthYear].maintenanceCount += 1;
    }
  });
  
  return Object.values(monthlyData).map(month => ({
    ...month,
    avgInlet: Math.round(month.totalInlet / month.counts),
    avgTreated: Math.round(month.totalTreated / month.counts),
    avgOutput: Math.round(month.totalOutput / month.counts),
    efficiency: Math.round((month.totalTreated / month.totalInlet) * 100),
    recoveryRate: Math.round((month.totalOutput / month.totalTreated) * 100),
    avgTankersCount: Math.round(month.tankersCount / month.counts),
    avgDirectInlineSewage: Math.round(month.directInlineSewage / month.counts),
    maintenanceFrequency: Math.round((month.maintenanceCount / month.counts) * 100)
  }));
};

// Get date ranges for filtering
export const getDateRanges = () => {
  const sortedData = [...stpData].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return {
    startDate: sortedData[0].date,
    endDate: sortedData[sortedData.length - 1].date
  };
};