// Water Analysis data structured similarly to electricityData.js
const waterData = {
  // Main meter readings
  mainBulkMeter: {
    "Jan-2024": 32803,
    "Feb-2024": 27996,
    "Mar-2024": 23860,
    "Apr-2024": 31869,
    "May-2024": 30737,
    "Jun-2024": 41953,
    "Jul-2024": 35166,
    "Aug-2024": 35420,
    "Sep-2024": 41341,
    "Oct-2024": 31519,
    "Nov-2024": 35290,
    "Dec-2024": 36733,
    "Jan-2025": 32580,
    "Feb-2025": 44043,
    "Mar-2025": 34915,
    "Apr-2025": 46039
  },
  
  // Zone bulk meter readings
  zoneBulkMeters: {
    "Jan-2024": 28076,
    "Feb-2024": 25060,
    "Mar-2024": 23914,
    "Apr-2024": 29411,
    "May-2024": 28952,
    "Jun-2024": 28942,
    "Jul-2024": 34635,
    "Aug-2024": 30994,
    "Sep-2024": 34896,
    "Oct-2024": 31298,
    "Nov-2024": 33078,
    "Dec-2024": 50499,
    "Jan-2025": 53378,
    "Feb-2025": 40961,
    "Mar-2025": 42949,
    "Apr-2025": 29810
  },
  
  // Individual meter readings total
  individualMeters: {
    "Jan-2024": 26599,
    "Feb-2024": 23011,
    "Mar-2024": 20534,
    "Apr-2024": 24679,
    "May-2024": 24774,
    "Jun-2024": 23400,
    "Jul-2024": 24957,
    "Aug-2024": 23111,
    "Sep-2024": 26667,
    "Oct-2024": 23414,
    "Nov-2024": 25166,
    "Dec-2024": 41304,
    "Jan-2025": 43529,
    "Feb-2025": 32679,
    "Mar-2025": 35882,
    "Apr-2025": 23202
  },
  
  // Losses computed from the above readings
  lossData: {
    stageOne: {
      "Jan-2024": 4727,
      "Feb-2024": 2936,
      "Mar-2024": -54,
      "Apr-2024": 2458,
      "May-2024": 1785,
      "Jun-2024": 13011,
      "Jul-2024": 531,
      "Aug-2024": 4426,
      "Sep-2024": 6445,
      "Oct-2024": 221,
      "Nov-2024": 2212,
      "Dec-2024": -13766,
      "Jan-2025": -20798,
      "Feb-2025": 3082,
      "Mar-2025": -8034,
      "Apr-2025": 16229
    },
    stageTwo: {
      "Jan-2024": 1477,
      "Feb-2024": 2049,
      "Mar-2024": 3380,
      "Apr-2024": 4732,
      "May-2024": 4178,
      "Jun-2024": 5542,
      "Jul-2024": 9678,
      "Aug-2024": 7883,
      "Sep-2024": 8229,
      "Oct-2024": 7884,
      "Nov-2024": 7912,
      "Dec-2024": 9195,
      "Jan-2025": 9849,
      "Feb-2025": 8282,
      "Mar-2025": 7067,
      "Apr-2025": 6608
    },
    total: {
      "Jan-2024": 6204,
      "Feb-2024": 4985,
      "Mar-2024": 3326,
      "Apr-2024": 7190,
      "May-2024": 5963,
      "Jun-2024": 18553,
      "Jul-2024": 10209,
      "Aug-2024": 12309,
      "Sep-2024": 14674,
      "Oct-2024": 8105,
      "Nov-2024": 10124,
      "Dec-2024": -4571,
      "Jan-2025": -10949,
      "Feb-2025": 11364,
      "Mar-2025": -967,
      "Apr-2025": 22837
    },
    percentages: {
      "Jan-2024": 18.9,
      "Feb-2024": 17.8,
      "Mar-2024": 13.9,
      "Apr-2024": 22.6,
      "May-2024": 19.4,
      "Jun-2024": 44.2,
      "Jul-2024": 29.0,
      "Aug-2024": 34.8,
      "Sep-2024": 35.5,
      "Oct-2024": 25.7,
      "Nov-2024": 28.7,
      "Dec-2024": -12.4,
      "Jan-2025": -33.6,
      "Feb-2025": 25.8,
      "Mar-2025": -2.8,
      "Apr-2025": 49.6
    }
  },
  
  // Zone-specific data
  zoneData: {
    'FM': {
      bulk: {
        "Jan-2024": 1595,
        "Feb-2024": 1283,
        "Mar-2024": 1255,
        "Apr-2024": 1383,
        "May-2024": 1411,
        "Jun-2024": 2078,
        "Jul-2024": 2601,
        "Aug-2024": 1638,
        "Sep-2024": 1550,
        "Oct-2024": 2098,
        "Nov-2024": 1808,
        "Dec-2024": 1946,
        "Jan-2025": 2008,
        "Feb-2025": 1740,
        "Mar-2025": 1880,
        "Apr-2025": 1880
      },
      individual: {
        "Jan-2024": 1612,
        "Feb-2024": 1130,
        "Mar-2024": 988,
        "Apr-2024": 1075,
        "May-2024": 1124,
        "Jun-2024": 1109,
        "Jul-2024": 1175,
        "Aug-2024": 1363,
        "Sep-2024": 1255,
        "Oct-2024": 1362,
        "Nov-2024": 1410,
        "Dec-2024": 1500,
        "Jan-2025": 1506,
        "Feb-2025": 1418,
        "Mar-2025": 1432,
        "Apr-2025": 1404
      }
    },
    '03A': {
      bulk: {
        "Jan-2024": 1234,
        "Feb-2024": 1099,
        "Mar-2024": 1297,
        "Apr-2024": 1892,
        "May-2024": 2254,
        "Jun-2024": 2227,
        "Jul-2024": 3313,
        "Aug-2024": 3172,
        "Sep-2024": 2698,
        "Oct-2024": 3715,
        "Nov-2024": 3501,
        "Dec-2024": 3796,
        "Jan-2025": 4235,
        "Feb-2025": 4273,
        "Mar-2025": 3591,
        "Apr-2025": 4041
      },
      individual: {
        "Jan-2024": 930,
        "Feb-2024": 782,
        "Mar-2024": 793,
        "Apr-2024": 789,
        "May-2024": 879,
        "Jun-2024": 786,
        "Jul-2024": 766,
        "Aug-2024": 846,
        "Sep-2024": 775,
        "Oct-2024": 1009,
        "Nov-2024": 986,
        "Dec-2024": 792,
        "Jan-2025": 750,
        "Feb-2025": 732,
        "Mar-2025": 561,
        "Apr-2025": 854
      }
    },
    '03B': {
      bulk: {
        "Jan-2024": 2653,
        "Feb-2024": 2169,
        "Mar-2024": 2315,
        "Apr-2024": 2381,
        "May-2024": 2634,
        "Jun-2024": 2932,
        "Jul-2024": 3369,
        "Aug-2024": 3458,
        "Sep-2024": 3742,
        "Oct-2024": 2906,
        "Nov-2024": 2695,
        "Dec-2024": 3583,
        "Jan-2025": 3256,
        "Feb-2025": 2962,
        "Mar-2025": 3331,
        "Apr-2025": 2157
      },
      individual: {
        "Jan-2024": 997,
        "Feb-2024": 821,
        "Mar-2024": 873,
        "Apr-2024": 945,
        "May-2024": 934,
        "Jun-2024": 884,
        "Jul-2024": 828,
        "Aug-2024": 812,
        "Sep-2024": 814,
        "Oct-2024": 914,
        "Nov-2024": 712,
        "Dec-2024": 929,
        "Jan-2025": 683,
        "Feb-2025": 625,
        "Mar-2025": 624,
        "Apr-2025": 721
      }
    },
    '05': {
      bulk: {
        "Jan-2024": 4286,
        "Feb-2024": 3897,
        "Mar-2024": 4127,
        "Apr-2024": 4911,
        "May-2024": 2639,
        "Jun-2024": 4992,
        "Jul-2024": 5305,
        "Aug-2024": 4039,
        "Sep-2024": 2736,
        "Oct-2024": 3383,
        "Nov-2024": 1438,
        "Dec-2024": 3788,
        "Jan-2025": 4267,
        "Feb-2025": 4231,
        "Mar-2025": 3862,
        "Apr-2025": 3737
      },
      individual: {
        "Jan-2024": 2043,
        "Feb-2024": 1481,
        "Mar-2024": 1054,
        "Apr-2024": 1661,
        "May-2024": 873,
        "Jun-2024": 1180,
        "Jul-2024": 1304,
        "Aug-2024": 1022,
        "Sep-2024": 727,
        "Oct-2024": 1079,
        "Nov-2024": 967,
        "Dec-2024": 1098,
        "Jan-2025": 1176,
        "Feb-2025": 1020,
        "Mar-2025": 1079,
        "Apr-2025": 1514
      }
    },
    '08': {
      bulk: {
        "Jan-2024": 2170,
        "Feb-2024": 1825,
        "Mar-2024": 2021,
        "Apr-2024": 2753,
        "May-2024": 2722,
        "Jun-2024": 3193,
        "Jul-2024": 3639,
        "Aug-2024": 3957,
        "Sep-2024": 3947,
        "Oct-2024": 4296,
        "Nov-2024": 3569,
        "Dec-2024": 3018,
        "Jan-2025": 1547,
        "Feb-2025": 1498,
        "Mar-2025": 2605,
        "Apr-2025": 3203
      },
      individual: {
        "Jan-2024": 1783,
        "Feb-2024": 1052,
        "Mar-2024": 1297,
        "Apr-2024": 2096,
        "May-2024": 2091,
        "Jun-2024": 2447,
        "Jul-2024": 2178,
        "Aug-2024": 2453,
        "Sep-2024": 2501,
        "Oct-2024": 1669,
        "Nov-2024": 1620,
        "Dec-2024": 1587,
        "Jan-2025": 1088,
        "Feb-2025": 1198,
        "Mar-2025": 1917,
        "Apr-2025": 953
      }
    },
    'VS': {
      bulk: {
        "Jan-2024": 26,
        "Feb-2024": 19,
        "Mar-2024": 72,
        "Apr-2024": 60,
        "May-2024": 125,
        "Jun-2024": 277,
        "Jul-2024": 143,
        "Aug-2024": 137,
        "Sep-2024": 145,
        "Oct-2024": 63,
        "Nov-2024": 34,
        "Dec-2024": 17,
        "Jan-2025": 14,
        "Feb-2025": 12,
        "Mar-2025": 21,
        "Apr-2025": 13
      },
      individual: {
        "Jan-2024": 0,
        "Feb-2024": 1,
        "Mar-2024": 16,
        "Apr-2024": 49,
        "May-2024": 33,
        "Jun-2024": 34,
        "Jul-2024": 32,
        "Aug-2024": 48,
        "Sep-2024": 34,
        "Oct-2024": 51,
        "Nov-2024": 55,
        "Dec-2024": 34,
        "Jan-2025": 35,
        "Feb-2025": 30,
        "Mar-2025": 33,
        "Apr-2025": 8
      }
    }
  },
  
  // Consumption by type (Irrigation, Residential, Retail, etc.)
  consumptionByType: {
    irrigation: {
      name: "Irrigation Services",
      consumption: {
        "Jan-2024": 3758,
        "Feb-2024": 2765,
        "Mar-2024": 2157,
        "Apr-2024": 2798,
        "May-2024": 2211,
        "Jun-2024": 3991,
        "Jul-2024": 4376,
        "Aug-2024": 1640,
        "Sep-2024": 1190,
        "Oct-2024": 2763,
        "Nov-2024": 297,
        "Dec-2024": 242,
        "Jan-2025": 208,
        "Feb-2025": 286,
        "Mar-2025": 326,
        "Apr-2025": 1433
      },
      percentage: {
        "Jan-2024": 11.5,
        "Feb-2024": 9.9,
        "Mar-2024": 9.0,
        "Apr-2024": 8.8,
        "May-2024": 7.2,
        "Jun-2024": 9.5,
        "Jul-2024": 12.4,
        "Aug-2024": 4.6,
        "Sep-2024": 2.9,
        "Oct-2024": 8.8,
        "Nov-2024": 0.8,
        "Dec-2024": 0.7,
        "Jan-2025": 0.6,
        "Feb-2025": 0.6,
        "Mar-2025": 0.9,
        "Apr-2025": 3.1
      }
    },
    residential_villa: {
      name: "Residential Villa",
      consumption: {
        "Jan-2024": 3984,
        "Feb-2024": 3031,
        "Mar-2024": 3146,
        "Apr-2024": 3917,
        "May-2024": 3704,
        "Jun-2024": 3916,
        "Jul-2024": 3882,
        "Aug-2024": 4191,
        "Sep-2024": 3673,
        "Oct-2024": 3834,
        "Nov-2024": 3853,
        "Dec-2024": 3510,
        "Jan-2025": 3144,
        "Feb-2025": 2913,
        "Mar-2025": 3549,
        "Apr-2025": 3618
      },
      percentage: {
        "Jan-2024": 12.1,
        "Feb-2024": 10.8,
        "Mar-2024": 13.2,
        "Apr-2024": 12.3,
        "May-2024": 12.1,
        "Jun-2024": 9.3,
        "Jul-2024": 11.0,
        "Aug-2024": 11.8,
        "Sep-2024": 8.9,
        "Oct-2024": 12.2,
        "Nov-2024": 10.9,
        "Dec-2024": 9.6,
        "Jan-2025": 9.7,
        "Feb-2025": 6.6,
        "Mar-2025": 10.2,
        "Apr-2025": 7.9
      }
    },
    residential_apartment: {
      name: "Residential Apartment",
      consumption: {
        "Jan-2024": 1354,
        "Feb-2024": 1194,
        "Mar-2024": 1164,
        "Apr-2024": 1329,
        "May-2024": 1343,
        "Jun-2024": 1165,
        "Jul-2024": 1140,
        "Aug-2024": 1125,
        "Sep-2024": 1005,
        "Oct-2024": 1364,
        "Nov-2024": 1214,
        "Dec-2024": 1148,
        "Jan-2025": 1098,
        "Feb-2025": 1078,
        "Mar-2025": 944,
        "Apr-2025": 1320
      },
      percentage: {
        "Jan-2024": 4.1,
        "Feb-2024": 4.3,
        "Mar-2024": 4.9,
        "Apr-2024": 4.2,
        "May-2024": 4.4,
        "Jun-2024": 2.8,
        "Jul-2024": 3.2,
        "Aug-2024": 3.2,
        "Sep-2024": 2.4,
        "Oct-2024": 4.3,
        "Nov-2024": 3.4,
        "Dec-2024": 3.1,
        "Jan-2025": 3.4,
        "Feb-2025": 2.4,
        "Mar-2025": 2.7,
        "Apr-2025": 2.9
      }
    },
    building_common: {
      name: "Building Common Areas",
      consumption: {
        "Jan-2024": 340,
        "Feb-2024": 345,
        "Mar-2024": 247,
        "Apr-2024": 212,
        "May-2024": 207,
        "Jun-2024": 250,
        "Jul-2024": 233,
        "Aug-2024": 136,
        "Sep-2024": 125,
        "Oct-2024": 142,
        "Nov-2024": 178,
        "Dec-2024": 292,
        "Jan-2025": 349,
        "Feb-2025": 273,
        "Mar-2025": 240,
        "Apr-2025": 267
      },
      percentage: {
        "Jan-2024": 1.0,
        "Feb-2024": 1.2,
        "Mar-2024": 1.0,
        "Apr-2024": 0.7,
        "May-2024": 0.7,
        "Jun-2024": 0.6,
        "Jul-2024": 0.7,
        "Aug-2024": 0.4,
        "Sep-2024": 0.3,
        "Oct-2024": 0.5,
        "Nov-2024": 0.5,
        "Dec-2024": 0.8,
        "Jan-2025": 1.1,
        "Feb-2025": 0.6,
        "Mar-2025": 0.7,
        "Apr-2025": 0.6
      }
    },
    retail: {
      name: "Retail",
      consumption: {
        "Jan-2024": 15620,
        "Feb-2024": 13765,
        "Mar-2024": 12307,
        "Apr-2024": 14275,
        "May-2024": 15242,
        "Jun-2024": 16285,
        "Jul-2024": 14127,
        "Aug-2024": 15247,
        "Sep-2024": 14505,
        "Oct-2024": 19996,
        "Nov-2024": 17806,
        "Dec-2024": 17045,
        "Jan-2025": 20584,
        "Feb-2025": 21405,
        "Mar-2025": 25076,
        "Apr-2025": 30251
      },
      percentage: {
        "Jan-2024": 47.6,
        "Feb-2024": 49.2,
        "Mar-2024": 51.6,
        "Apr-2024": 44.8,
        "May-2024": 49.6,
        "Jun-2024": 38.8,
        "Jul-2024": 40.2,
        "Aug-2024": 43.0,
        "Sep-2024": 35.1,
        "Oct-2024": 63.4,
        "Nov-2024": 50.5,
        "Dec-2024": 46.4,
        "Jan-2025": 63.2,
        "Feb-2025": 48.6,
        "Mar-2025": 71.8,
        "Apr-2025": 65.7
      }
    }
  },
  
  // Individual customer meters data
  customerMeters: [
    { id: '4300008', customer: 'Habib Ismail Ali Al Suwaid', zone: 'Zone 03B', consumption: 14 },
    { id: '4300009', customer: 'Leopold Julian Zentner & Erica Kalobwe', zone: 'Zone 03B', consumption: 48 },
    { id: '4300020', customer: 'Wahibah R H Al Mulla', zone: 'Zone 03B', consumption: 3 },
    { id: '4300025', customer: 'Britta Stefanie Gerdes & Dr. Barbara Ungeheuer', zone: 'Zone 03B', consumption: 23 },
    { id: '4300029', customer: 'Al Fadhal Mohamed Ahmed Al Harthy', zone: 'Zone 03B', consumption: 0 },
    { id: '4300042', customer: 'Nasser Abdelsalam Abdelrehiem', zone: 'Zone 03B', consumption: 5 },
    { id: '4300054', customer: 'Nekmohamed Manji & Zahara Manji', zone: 'Zone 03B', consumption: 11 },
    { id: '4300056', customer: 'Al Sayyid Abdulla Hamad Saif Al Busaidy', zone: 'Zone 03B', consumption: 7 },
    { id: '4300057', customer: 'Radhibai Thakurdas Gangwani', zone: 'Zone 03B', consumption: 46 },
    { id: '4300060', customer: 'Anwar Salim Ali Al-Mahri', zone: 'Zone 03B', consumption: 42 },
    { id: '4300062', customer: 'Vanguard Oil Tools and Services LLC', zone: 'Zone 03B', consumption: 10 },
    { id: '4300064', customer: 'Eihab Saleh Moahmed Al Yafi', zone: 'Zone 03B', consumption: 0 },
    { id: '4300065', customer: 'Fahad Al-Hamdani', zone: 'Zone FM', consumption: 25 },
    { id: '4300066', customer: 'Sara Al-Balushi', zone: 'Zone FM', consumption: 18 },
    { id: '4300067', customer: 'Ahmed Al-Saidi', zone: 'Zone 03A', consumption: 30 },
    { id: '4300068', customer: 'Fatima Al-Riyami', zone: 'Zone 03A', consumption: 55 },
    { id: '4300069', customer: 'Khalid Al-Hajri', zone: 'Zone 05', consumption: 12 },
    { id: '4300070', customer: 'Aisha Al-Hashmi', zone: 'Zone 05', consumption: 7 },
    { id: '4300071', customer: 'Sultan Al-Amri', zone: 'Zone 08', consumption: 40 },
    { id: '4300072', customer: 'Noora Al-Hinai', zone: 'Zone 08', consumption: 22 },
    { id: '4300073', customer: 'Mohammed Al-Maamari', zone: 'Village Square', consumption: 1 },
    { id: '4300074', customer: 'Zainab Al-Kalbani', zone: 'Village Square', consumption: 2 },
    { id: '4300075', customer: 'Yousef Al-Fazari', zone: 'Zone FM', consumption: 32 },
    { id: '4300076', customer: 'Maryam Al-Zadjali', zone: 'Zone FM', consumption: 27 },
    { id: '4300077', customer: 'Hassan Al-Lawati', zone: 'Zone 03A', consumption: 18 },
    { id: '4300078', customer: 'Laila Al-Mahrooqi', zone: 'Zone 03A', consumption: 42 },
    { id: '4300079', customer: 'Omar Al-Habsi', zone: 'Zone 05', consumption: 33 },
    { id: '4300080', customer: 'Salma Al-Rashdi', zone: 'Zone 05', consumption: 26 },
    { id: '4300081', customer: 'Ali Al-Ghafri', zone: 'Zone 08', consumption: 37 },
    { id: '4300082', customer: 'Zahra Al-Abri', zone: 'Zone 08', consumption: 19 }
  ]
};

// Helper functions

// Get list of all months
const getMonths = () => {
  return [
    { id: 'Jan-2024', label: 'Jan 2024' },
    { id: 'Feb-2024', label: 'Feb 2024' },
    { id: 'Mar-2024', label: 'Mar 2024' },
    { id: 'Apr-2024', label: 'Apr 2024' },
    { id: 'May-2024', label: 'May 2024' },
    { id: 'Jun-2024', label: 'Jun 2024' },
    { id: 'Jul-2024', label: 'Jul 2024' },
    { id: 'Aug-2024', label: 'Aug 2024' },
    { id: 'Sep-2024', label: 'Sep 2024' },
    { id: 'Oct-2024', label: 'Oct 2024' },
    { id: 'Nov-2024', label: 'Nov 2024' },
    { id: 'Dec-2024', label: 'Dec 2024' },
    { id: 'Jan-2025', label: 'Jan 2025' },
    { id: 'Feb-2025', label: 'Feb 2025' },
    { id: 'Mar-2025', label: 'Mar 2025' },
    { id: 'Apr-2025', label: 'Apr 2025' }
  ];
};

// Get list of zone types
const getZoneTypes = () => {
  return [
    { id: 'FM', label: 'Zone FM' },
    { id: '03A', label: 'Zone 03A' },
    { id: '03B', label: 'Zone 03B' },
    { id: '05', label: 'Zone 05' },
    { id: '08', label: 'Zone 08' },
    { id: 'VS', label: 'Village Square' }
  ];
};

// Get list of consumption types
const getConsumptionTypes = () => {
  return [
    { id: 'irrigation', label: 'Irrigation Services' },
    { id: 'residential_villa', label: 'Residential Villa' },
    { id: 'residential_apartment', label: 'Residential Apartment' },
    { id: 'building_common', label: 'Building Common Areas' },
    { id: 'retail', label: 'Retail' }
  ];
};

// Calculate loss percentages for a specific month
const calculateLossPercentage = (month) => {
  const totalBulk = waterData.mainBulkMeter[month];
  const totalLoss = waterData.lossData.total[month];
  return totalLoss >= 0 ? (totalLoss / totalBulk) * 100 : 0;
};

// Calculate zone-specific loss for a month
const calculateZoneLoss = (zone, month) => {
  const zoneData = waterData.zoneData[zone];
  if (!zoneData) return { loss: 0, percentage: 0 };
  
  const bulk = zoneData.bulk[month] || 0;
  const individual = zoneData.individual[month] || 0;
  const loss = bulk - individual;
  const percentage = bulk > 0 ? (loss / bulk) * 100 : 0;
  
  return { loss, percentage };
};

// Get total consumption by month
const getTotalConsumptionByMonth = (month) => {
  return waterData.individualMeters[month] || 0;
};

// Get zone summary for all zones in a specific month
const getZoneSummaryByMonth = (month) => {
  return Object.keys(waterData.zoneData).map(zone => {
    const { loss, percentage } = calculateZoneLoss(zone, month);
    return {
      zone,
      name: getZoneTypes().find(z => z.id === zone)?.label || `Zone ${zone}`,
      bulk: waterData.zoneData[zone].bulk[month] || 0,
      individual: waterData.zoneData[zone].individual[month] || 0,
      loss,
      percentage
    };
  });
};

// Get customers for a specific zone
const getCustomersByZone = (zone) => {
  // Convert zone name format to match customer data (e.g., '03A' to 'Zone 03A')
  const zoneName = zone === 'VS' ? 'Village Square' : `Zone ${zone}`;
  return waterData.customerMeters.filter(meter => meter.zone === zoneName);
};

export {
  waterData,
  getMonths,
  getZoneTypes,
  getConsumptionTypes,
  calculateLossPercentage,
  calculateZoneLoss,
  getTotalConsumptionByMonth,
  getZoneSummaryByMonth,
  getCustomersByZone
};
