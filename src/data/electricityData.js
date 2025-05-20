// Mock data for electricity consumption analysis
// This data is structured to match the paste.txt format with monthly consumption values
export const electricityConsumptionData = [
  {
    name: "Pumping Station 01",
    type: "PS",
    meterAccountNo: "R52330",
    consumption: [1608, 1940, 1783, 1874, 1662, 3822, 6876, 1629, 1640, 1903, 2095, 3032]
  },
  {
    name: "Pumping Station 03",
    type: "PS",
    meterAccountNo: "R52329",
    consumption: [31, 47, 25, 3, 0, 0, 33, 0, 179, 33, 137, 131]
  },
  {
    name: "Pumping Station 04",
    type: "PS",
    meterAccountNo: "R52327",
    consumption: [830, 818, 720, 731, 857, 1176, 445, 919, 921, 245, 870, 646]
  },
  {
    name: "Pumping Station 05",
    type: "PS",
    meterAccountNo: "R52325",
    consumption: [1774, 2216, 2011, 2059, 2229, 5217, 2483, 2599, 1952, 2069, 2521, 2601]
  },
  {
    name: "Lifting Station 02",
    type: "LS",
    meterAccountNo: "R52328",
    consumption: [44, 0, 0, 0, 153, 125, 0, 0, 0, 0, 0, 0]
  },
  {
    name: "Lifting Station 03",
    type: "LS",
    meterAccountNo: "R52333",
    consumption: [198, 269, 122, 203, 208, 257, 196, 91, 185, 28, 40, 58]
  },
  {
    name: "Lifting Station 04",
    type: "LS",
    meterAccountNo: "R52324",
    consumption: [644, 865, 791, 768, 747, 723, 628, 686, 631, 701, 638, 572]
  },
  {
    name: "Lifting Station 05",
    type: "LS",
    meterAccountNo: "R52332",
    consumption: [2056, 2577, 2361, 3016, 3684, 5866, 1715, 2413, 2643, 2873, 3665, 3069]
  },
  {
    name: "Irrigation Tank 01",
    type: "IRR",
    meterAccountNo: "R52324 (R52326)",
    consumption: [1543, 2673, 2763, 2623, 1467, 1290, 1244, 1432, 1268, 1689, 2214, 1718]
  },
  {
    name: "Irrigation Tank 02",
    type: "IRR",
    meterAccountNo: "R52331",
    consumption: [1272, 2839, 3118, 2330, 2458, 1875, 893, 974, 1026, 983, 1124, 1110]
  },
  {
    name: "Irrigation Tank 03",
    type: "IRR",
    meterAccountNo: "R52323",
    consumption: [894, 866, 1869, 1543, 1793, 524, 266, 269, 417, 840, 1009, 845]
  },
  {
    name: "Irrigation Tank 04",
    type: "IRR",
    meterAccountNo: "R53195",
    consumption: [880, 827, 555, 443, 336, 195, 183, 212, 213, 40, 233, 235]
  },
  {
    name: "Actuator DB 01 (Z8)",
    type: "DB",
    meterAccountNo: "R53196",
    consumption: [39, 49, 43, 43, 45, 43, 36, 34, 29, 7, 28, 24]
  },
  {
    name: "Actuator DB 02",
    type: "DB",
    meterAccountNo: "R51900",
    consumption: [285, 335, 275, 220, 210, 219, 165, 232, 161, 33, 134, 139]
  },
  {
    name: "Actuator DB 03",
    type: "DB",
    meterAccountNo: "R51904",
    consumption: [188, 226, 197, 203, 212, 203, 196, 220, 199, 56, 203, 196]
  },
  {
    name: "Actuator DB 04",
    type: "DB",
    meterAccountNo: "R51901",
    consumption: [159, 275, 258, 210, 184, 201, 144, 172, 173, 186, 161, 227]
  },
  {
    name: "Actuator DB 05",
    type: "DB",
    meterAccountNo: "R51907",
    consumption: [15, 18, 15, 16, 16, 16, 15, 18, 16, 4, 18, 14]
  },
  {
    name: "Actuator DB 06",
    type: "DB",
    meterAccountNo: "R51909",
    consumption: [39, 50, 42, 48, 46, 129, 43, 49, 44, 47, 45, 38]
  },
  {
    name: "Street Light FP 01 (Z8)",
    type: "Street Light",
    meterAccountNo: "R53197",
    consumption: [2773, 3276, 3268, 3040, 3203, 3225, 3064, 3593, 3147, 787, 3228, 2663]
  },
  {
    name: "Street Light FP 02",
    type: "Street Light",
    meterAccountNo: "R51906",
    consumption: [1705, 2076, 1758, 1738, 1940, 2006, 1944, 2361, 2258, 633, 2298, 1812]
  },
  {
    name: "Street Light FP 03",
    type: "Street Light",
    meterAccountNo: "R51905",
    consumption: [1399, 1608, 1365, 1380, 1457, 1499, 1561, 2060, 1966, 1868, 1974, 1562]
  },
  {
    name: "Street Light FP 04",
    type: "Street Light",
    meterAccountNo: "R51908",
    consumption: [861, 1045, 1051, 2268, 2478, 2513, 2341, 2299, 1389, 325, 1406, 1401]
  },
  {
    name: "Street Light FP 05",
    type: "Street Light",
    meterAccountNo: "R51902",
    consumption: [532, 587, 575, 770, 1341, 1895, 1844, 1477, 1121, 449, 2070, 1870]
  },
  {
    name: "Beachwell",
    type: "D_Building",
    meterAccountNo: "R51903",
    consumption: [16908, 46, 19332, 23170, 42241, 15223, 25370, 24383, 37236, 38168, 18422, 40]
  },
  {
    name: "Helipad",
    type: "D_Building",
    meterAccountNo: "R52334",
    consumption: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    name: "Central Park",
    type: "D_Building",
    meterAccountNo: "R54672",
    consumption: [12208, 21845, 29438, 28186, 21995, 20202, 14900, 9604, 19032, 22819, 19974, 14190]
  },
  {
    name: "Guard House",
    type: "D_Building",
    meterAccountNo: "R53651",
    consumption: [823, 1489, 1574, 1586, 1325, 1391, 1205, 1225, 814, 798, 936, 879]
  },
  {
    name: "Security Building",
    type: "D_Building",
    meterAccountNo: "R53649",
    consumption: [3529, 3898, 4255, 4359, 3728, 3676, 3140, 5702, 5131, 5559, 5417, 4504]
  },
  {
    name: "ROP Building",
    type: "D_Building",
    meterAccountNo: "R53648",
    consumption: [2047, 4442, 3057, 4321, 4185, 3554, 3692, 3581, 2352, 2090, 2246, 1939]
  },
  {
    name: "D Building 44",
    type: "D_Building",
    meterAccountNo: "R53705",
    consumption: [463, 2416, 2036, 2120, 1645, 1717, 1643, 1377, 764, 647, 657, 650]
  },
  {
    name: "D Building 45",
    type: "D_Building",
    meterAccountNo: "R53665",
    consumption: [709, 2944, 1267, 262, 3212, 1330, 1570, 1252, 841, 670, 556, 608]
  },
  {
    name: "D Building 46",
    type: "D_Building",
    meterAccountNo: "R53700",
    consumption: [818, 2392, 1620, 2216, 1671, 1718, 1734, 1577, 890, 724, 690, 752]
  },
  {
    name: "D Building 47",
    type: "D_Building",
    meterAccountNo: "R53690",
    consumption: [918, 2678, 1446, 2173, 2068, 2073, 1651, 1774, 1055, 887, 738, 792]
  },
  {
    name: "D Building 48",
    type: "D_Building",
    meterAccountNo: "R53666",
    consumption: [725, 1970, 1415, 1895, 1853, 1084, 1127, 1046, 785, 826, 676, 683]
  },
  {
    name: "D Building 49",
    type: "D_Building",
    meterAccountNo: "R53715",
    consumption: [947, 2912, 780, 1911, 1714, 1839, 1785, 1608, 1068, 860, 837, 818]
  },
  {
    name: "D Building 50",
    type: "D_Building",
    meterAccountNo: "R53672",
    consumption: [577, 1253, 849, 1097, 1059, 1091, 1107, 1102, 789, 765, 785, 707]
  },
  {
    name: "D Building 51",
    type: "D_Building",
    meterAccountNo: "R53657",
    consumption: [735, 3030, 1677, 2046, 2472, 2285, 2165, 1855, 710, 661, 682, 642]
  },
  {
    name: "D Building 52",
    type: "D_Building",
    meterAccountNo: "R53699",
    consumption: [727, 2882, 2087, 2897, 2786, 2990, 2501, 1986, 1208, 979, 896, 952]
  },
  {
    name: "D Building 53",
    type: "D_Building",
    meterAccountNo: "R54782",
    consumption: [714, 2699, 1405, 1845, 1494, 1709, 1525, 1764, 968, 693, 732, 760]
  },
  {
    name: "D Building 54",
    type: "D_Building",
    meterAccountNo: "R54793",
    consumption: [717, 2904, 1961, 2449, 3031, 1453, 1261, 1777, 834, 681, 559, 531]
  },
  {
    name: "D Building 55",
    type: "D_Building",
    meterAccountNo: "R54804",
    consumption: [693, 2550, 1735, 2430, 2250, 2100, 1947, 1828, 1035, 677, 616, 719]
  },
  {
    name: "D Building 56",
    type: "D_Building",
    meterAccountNo: "R54815",
    consumption: [938, 3099, 1617, 2384, 2185, 2190, 2055, 1805, 937, 683, 731, 765]
  },
  {
    name: "D Building 57",
    type: "D_Building",
    meterAccountNo: "R54826",
    consumption: [574, 2704, 1816, 2477, 2429, 1935, 2260, 2262, 1332, 990, 846, 795]
  },
  {
    name: "D Building 58",
    type: "D_Building",
    meterAccountNo: "R54836",
    consumption: [568, 2430, 1555, 2233, 1860, 1688, 1469, 1534, 778, 593, 535, 594]
  },
  {
    name: "D Building 59",
    type: "D_Building",
    meterAccountNo: "R54847",
    consumption: [546, 1847, 1514, 2112, 1691, 1792, 1790, 1634, 998, 628, 582, 697]
  },
  {
    name: "D Building 60",
    type: "D_Building",
    meterAccountNo: "R54858",
    consumption: [628, 1935, 1327, 1762, 1269, 1360, 1260, 1275, 705, 674, 612, 679]
  },
  {
    name: "D Building 61",
    type: "D_Building",
    meterAccountNo: "R54869",
    consumption: [532, 2022, 1662, 2255, 1929, 1958, 1704, 1734, 977, 767, 800, 719]
  },
  {
    name: "D Building 62",
    type: "D_Building",
    meterAccountNo: "R53717",
    consumption: [858, 2297, 1744, 2425, 2018, 1950, 1768, 1630, 957, 715, 677, 595]
  },
  {
    name: "D Building 74",
    type: "D_Building",
    meterAccountNo: "R53675",
    consumption: [718, 2495, 1291, 1895, 1339, 840, 1147, 1303, 766, 639, 566, 463]
  },
  {
    name: "D Building 75",
    type: "D_Building",
    meterAccountNo: "R53668",
    consumption: [795, 6744, 983, 1438, 1268, 1225, 1125, 1169, 702, 475, 508, 554]
  },
  {
    name: "Village Square",
    type: "D_Building",
    meterAccountNo: "R56628",
    consumption: [2550, 2550, 2550, 2550, 8117, 9087, 4038, 6229, 3695, 3304, 3335, 3383]
  },
  {
    name: "Zone-3 landscape light 17",
    type: "FP-Landscape Lights Z3",
    meterAccountNo: "R54872",
    consumption: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    name: "Zone-3 landscape light 21",
    type: "FP-Landscape Lights Z3",
    meterAccountNo: "R54873",
    consumption: [42, 67, 37, 42, 40, 33, 28, 40, 48, 13, 57, 47]
  },
  {
    name: "Zone-3 landscape light 22",
    type: "FP-Landscape Lights Z3",
    meterAccountNo: "R54874",
    consumption: [5, 10, 3, 5, 4, 5, 12, 6, 8, 0, 0, 0]
  },
  {
    name: "Bank muscat",
    type: "Retail",
    meterAccountNo: "",
    consumption: [0, 0, 0, 3, 71, -2, 1407, 148, 72, 59, 98, 88]
  },
  {
    name: "CIF kitchen",
    type: "Retail",
    meterAccountNo: "",
    consumption: [0, 0, 0, 17895, 16532, 18955, 15071, 16742, 15554, 16788, 16154, 14971]
  }
];

// Months array for reference
export const months = [
  "Apr 2024", "May 2024", "Jun 2024", "Jul 2024", "Aug 2024", "Sep 2024", 
  "Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025"
];

// Price per kWh
export const electricityRate = 0.025; // OMR per kWh