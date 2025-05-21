# GPowerMB Dashboard

Muscat Bay Utility Management System - Modern SAAS dashboard application for managing water, electricity, STP plant and contractor data.

## Project Sections

1. **Water Analysis**: Comprehensive water supply and consumption analysis
2. **Electricity Analysis**: Power consumption tracking and analysis
3. **STP Plant**: Sewage treatment plant monitoring
4. **Contractor Tracker**: Contractor management and performance tracking

## Implementation Status

- ✅ Contractor Tracker
- ✅ Electricity Analysis
- ✅ Water Analysis
- ✅ STP Plant

## Technical Stack

- **Frontend**: React, Tailwind CSS
- **Charting**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router
- **Primary Color**: #4E4456

## Project Structure

```
src/
├── components/         # Reusable UI components
│   └── water/          # Water Analysis components
├── data/               # Data files for each section
├── layouts/            # Page layouts (sidebar, header)
├── pages/              # Main page components
│   ├── Dashboard.jsx
│   ├── WaterAnalysis.jsx
│   ├── ElectricityAnalysis.jsx
│   ├── STPPlant.jsx
│   └── ContractorTracker.jsx
├── styles/             # CSS styling
│   └── WaterAnalysisResponsive.css
└── tests/              # Test files
    ├── WaterAnalysis.test.js
    ├── browser-compatibility-test.js
    └── style-consistency-check.js
```

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/ARahim900/GPowerMB.git
   cd GPowerMB
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Water Analysis Section

The Water Analysis section provides comprehensive water management tools:

- **Overview**: High-level summary of water consumption across all zones
- **Group Details**: Zone-specific analysis with consumption breakdown
- **Type Details**: Consumption analysis by property type
- **Loss Details**: Water loss tracking and problem identification

### Key Features

- **KPI Cards**: Real-time performance indicators
- **Interactive Charts**: Data visualization with Recharts
- **Smart Filters**: Month, year, and zone filtering
- **Responsive Design**: Optimized for all device sizes
- **Performance Optimized**: Lazy loading of tab content

### Testing

Run tests for the Water Analysis section:

```
npm test -- -t "WaterAnalysis"
```

See the [Testing Documentation](./src/tests/README.md) for more details.

## Deployment

Build the application for production:

```
npm run build
```

The build folder will contain optimized files ready for deployment.

## Contributors

- [ARahim900](https://github.com/ARahim900)

## License

MIT