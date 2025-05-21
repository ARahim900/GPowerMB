import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WaterAnalysis from '../pages/WaterAnalysis';

// Mock the recharts library to avoid rendering issues in tests
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    LineChart: () => <div data-testid="line-chart" />,
    BarChart: () => <div data-testid="bar-chart" />,
    PieChart: () => <div data-testid="pie-chart" />,
    AreaChart: () => <div data-testid="area-chart" />,
    ComposedChart: () => <div data-testid="composed-chart" />,
  };
});

// Wrap component with router for testing
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('WaterAnalysis Component', () => {
  test('all tabs load and display data correctly', async () => {
    renderWithRouter(<WaterAnalysis />);
    
    // Wait for loading to complete
    // In a real test, you would use await waitForElementToBeRemoved instead of setTimeout
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check Overview tab loads by default
    expect(screen.getByText('Water Consumption Overview')).toBeInTheDocument();
    
    // Check Group Details tab
    fireEvent.click(screen.getByText('Group Details'));
    expect(screen.getByText('Zone Consumption Analysis')).toBeInTheDocument();
    
    // Check Type Details tab
    fireEvent.click(screen.getByText('Type Details'));
    expect(screen.getByText('Consumption by Type')).toBeInTheDocument();
    
    // Check Loss Details tab
    fireEvent.click(screen.getByText('Loss Details'));
    expect(screen.getByText('Water Loss Analysis')).toBeInTheDocument();
  });

  test('filters update visualizations appropriately', async () => {
    renderWithRouter(<WaterAnalysis />);
    
    // Wait for loading to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Test month filter
    const monthSelect = screen.getByLabelText('Month');
    fireEvent.change(monthSelect, { target: { value: 'April' } });
    
    // Verify data updates (check specific data points in charts)
    expect(screen.getByText('April 2025')).toBeInTheDocument();
    
    // Test year filter
    const yearSelect = screen.getByLabelText('Year');
    fireEvent.change(yearSelect, { target: { value: '2024' } });
    
    // Verify data updates
    expect(screen.getByText('April 2024')).toBeInTheDocument();
    
    // Test zone filter in Group Details tab
    fireEvent.click(screen.getByText('Group Details'));
    const zoneSelect = screen.getByLabelText('Zone');
    fireEvent.change(zoneSelect, { target: { value: 'Zone A' } });
    
    // Verify zone-specific data displays
    expect(screen.getByText('Zone A Analysis')).toBeInTheDocument();
  });

  test('search functionality works in Group Details section', async () => {
    renderWithRouter(<WaterAnalysis />);
    
    // Wait for loading to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Navigate to Group Details tab
    fireEvent.click(screen.getByText('Group Details'));
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText('Search customers...');
    fireEvent.change(searchInput, { target: { value: 'Villa' } });
    
    // Verify filtered results
    const rows = screen.getAllByRole('row');
    const originalCount = rows.length;
    
    expect(originalCount).toBeGreaterThan(1); // At least header row + one data row
    expect(screen.getByText('Villa 123')).toBeInTheDocument();
    expect(screen.queryByText('Apartment 456')).not.toBeInTheDocument();
  });
});
