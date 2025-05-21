# GPowerMB - Muscat Bay Utility Management Dashboard

A modern SAAS dashboard application for managing water, electricity, STP plant, and contractor data for Muscat Bay.

## Project Overview

GPowerMB is a utility management dashboard built with React and Tailwind CSS. It features four main sections:

1. **Water Analysis** - Comprehensive water supply and consumption analysis
2. **Electricity Analysis** - Detailed electricity usage tracking and reporting
3. **STP Plant** - Sewage treatment plant monitoring and analytics
4. **Contractor Tracker** - Management of contractor activities and finances

## Technology Stack

- React.js
- React Router
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons

## Project Structure

```
GPowerMB/
├── public/             # Static files
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── water/      # Water analysis components
│   │   ├── electricity/ # Electricity analysis components
│   │   ├── stp/        # STP plant components
│   │   └── contractor/ # Contractor components
│   ├── data/           # Data files for all sections
│   ├── layouts/        # Layout components
│   ├── pages/          # Main page components
│   └── styles/         # CSS and style files
└── tailwind.config.js  # Tailwind CSS configuration
```

## Deployment Instructions

### Deploying to Netlify

1. Connect your GitHub repository to Netlify
2. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
3. Advanced build settings:
   - Add environment variable: `CI=false`

The application includes:
- Netlify configuration in `netlify.toml`
- SPA redirect rule in `public/_redirects`

## Developer Notes

- Primary color: `#4E4456`
- Secondary color: `#8ED2D6`
- Data is structured in separate files in the `src/data` folder
- Components follow a consistent pattern across sections

## Implementation Status

- ✅ Contractor Tracker - Complete
- ✅ Electricity Analysis - Complete
- ✅ Water Analysis - Complete
- ✅ STP Plant - Complete

## Troubleshooting Deployment

If you encounter issues with Netlify deployment:

1. Ensure `CI=false` is set in the build environment
2. Check that `public/_redirects` file is properly configured
3. Verify that all dependencies are correctly listed in `package.json`
4. Make sure React Router routes are correctly set up in `App.js`
