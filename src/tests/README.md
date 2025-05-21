# GPowerMB Testing Framework

This directory contains tests and testing utilities for the GPowerMB dashboard application.

## Testing Approach

### 1. Functional Testing

We use React Testing Library for component testing. Each component has its own test file that covers:

- Component rendering
- User interactions (clicks, form inputs, etc.)
- State changes
- Conditional rendering
- Component integration

### 2. Browser Compatibility Testing

The `browser-compatibility-test.js` file generates a testing matrix for manual cross-browser testing. Key areas to test include:

- Rendering of charts and visualizations
- Responsive layout across different screen sizes
- Interactive elements (filters, tabs, etc.)
- Animation and transitions

### 3. Style Consistency Testing

The `style-consistency-check.js` file helps maintain design consistency across different sections of the application. It checks:

- Component styling
- Color usage
- Typography
- Spacing and layout
- Animations and transitions

### 4. Performance Testing

We measure component performance using the Performance API. Each major section includes:

```javascript
useEffect(() => {
  // Mark the start time when component mounts
  performance.mark('component-start');
  
  return () => {
    // Mark the end time when component unmounts
    performance.mark('component-end');
    
    // Measure the difference
    performance.measure(
      'component-render-time',
      'component-start',
      'component-end'
    );
    
    // Log the results
    const measurements = performance.getEntriesByName('component-render-time');
    console.log('Component render time:', measurements[0].duration, 'ms');
  };
}, []);
```

### 5. Responsive Testing

We use a combination of:

- CSS media queries (in WaterAnalysisResponsive.css)
- Responsive components
- Device-specific testing
- Breakpoint testing

## Running Tests

```bash
# Run all tests
npm test

# Run tests for a specific component
npm test -- -t "WaterAnalysis"

# Run tests in watch mode
npm test -- --watch
```

## Test Files

- `WaterAnalysis.test.js` - Tests for the Water Analysis section
- `browser-compatibility-test.js` - Generates testing matrix for cross-browser testing
- `style-consistency-check.js` - Helps maintain design consistency

## Best Practices

1. Use data-testid attributes for test-specific element selection
2. Test user behavior, not implementation details
3. Focus on critical user paths
4. Mock external dependencies (charts, API calls)
5. Keep tests fast and focused
6. Test accessibility concerns

## Future Improvements

- Add end-to-end testing with Cypress
- Implement visual regression testing
- Add automated performance testing
- Expand test coverage to include edge cases
- Add accessibility tests
