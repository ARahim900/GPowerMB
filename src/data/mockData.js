// Mock data for development

// Water Analysis Data
export const waterSupplyData = [
  { month: 'Oct', supply: 38000, distribution: 35000, consumption: 32000, loss: 7.9 },
  { month: 'Nov', supply: 35000, distribution: 31000, consumption: 25000, loss: 8.5 },
  { month: 'Dec', supply: 37000, distribution: 33000, consumption: 26000, loss: 7.2 },
  { month: 'Jan', supply: 33000, distribution: 32000, consumption: 28000, loss: 6.8 },
  { month: 'Feb', supply: 43000, distribution: 38000, consumption: 29000, loss: 7.4 },
  { month: 'Mar', supply: 37000, distribution: 34000, consumption: 29000, loss: 7.6 },
];

export const waterQualityData = [
  { parameter: 'pH', value: 7.2, min: 6.5, max: 8.5, status: 'normal' },
  { parameter: 'TDS', value: 320, min: 0, max: 500, status: 'normal' },
  { parameter: 'Turbidity', value: 0.8, min: 0, max: 5, status: 'normal' },
  { parameter: 'Chlorine', value: 0.5, min: 0.2, max: 1.0, status: 'normal' },
  { parameter: 'Hardness', value: 180, min: 0, max: 300, status: 'normal' },
];

// Electricity Analysis Data
export const electricityData = [
  { month: 'Oct-24', consumption: 135000, peak: 15200 },
  { month: 'Nov-24', consumption: 130000, peak: 14800 },
  { month: 'Dec-24', consumption: 132000, peak: 15100 },
  { month: 'Jan-25', consumption: 125000, peak: 14500 },
  { month: 'Feb-25', consumption: 105000, peak: 12300 },
  { month: 'Mar-25', consumption: 78000, peak: 9700 },
];

export const electricityDistributionData = [
  { area: 'Residential', consumption: 42000, percentage: 53.8 },
  { area: 'Commercial', consumption: 18500, percentage: 23.7 },
  { area: 'Utilities', consumption: 12000, percentage: 15.3 },
  { area: 'Public Areas', consumption: 5600, percentage: 7.2 },
];

// STP Plant Data
export const stpPerformanceData = [
  { month: 'Oct', inflow: 620, outflow: 605, efficiency: 102.5 },
  { month: 'Nov', inflow: 580, outflow: 570, efficiency: 101.8 },
  { month: 'Dec', inflow: 610, outflow: 595, efficiency: 102.5 },
  { month: 'Jan', inflow: 590, outflow: 575, efficiency: 102.6 },
  { month: 'Feb', inflow: 500, outflow: 490, efficiency: 102.0 },
  { month: 'Mar', inflow: 530, outflow: 520, efficiency: 101.9 },
];

export const stpQualityData = [
  { parameter: 'BOD', value: 8, limit: 30, status: 'good' },
  { parameter: 'COD', value: 35, limit: 100, status: 'good' },
  { parameter: 'TSS', value: 12, limit: 30, status: 'good' },
  { parameter: 'pH', value: 7.1, min: 6.0, max: 9.0, status: 'normal' },
  { parameter: 'Fecal Coliform', value: 85, limit: 1000, status: 'good' },
];

// Contractor Data
export const contractorsData = [
  { 
    id: 1, 
    name: 'Alpha Maintenance LLC', 
    service: 'Water System Maintenance', 
    startDate: '2024-06-15', 
    endDate: '2025-06-14',
    status: 'active',
    lastInspection: '2025-04-10',
    performanceRating: 4.2
  },
  { 
    id: 2, 
    name: 'Omega Power Solutions', 
    service: 'Electrical Systems', 
    startDate: '2024-03-10', 
    endDate: '2025-07-09',
    status: 'active',
    lastInspection: '2025-03-25',
    performanceRating: 4.7
  },
  { 
    id: 3, 
    name: 'EcoTreat Environmental', 
    service: 'STP Operations', 
    startDate: '2024-08-01', 
    endDate: '2025-07-31',
    status: 'active',
    lastInspection: '2025-05-05',
    performanceRating: 4.5
  },
  { 
    id: 4, 
    name: 'GreenScapes LLC', 
    service: 'Landscaping & Irrigation', 
    startDate: '2024-05-20', 
    endDate: '2025-05-19',
    status: 'expiring-soon',
    lastInspection: '2025-04-30',
    performanceRating: 3.9
  },
  { 
    id: 5, 
    name: 'SecureTech Systems', 
    service: 'Security & Surveillance', 
    startDate: '2024-07-15', 
    endDate: '2025-06-30',
    status: 'expiring-soon',
    lastInspection: '2025-05-01',
    performanceRating: 4.0
  },
];