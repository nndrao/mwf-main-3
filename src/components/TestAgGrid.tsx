import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';
import { themeQuartz } from 'ag-grid-community';

// Register modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Sample data
const rowData = [
  { make: "Tesla", model: "Model Y", price: 64950 },
  { make: "Ford", model: "F-Series", price: 33850 },
  { make: "Toyota", model: "Corolla", price: 29600 },
];

// Column definitions
const columnDefs: ColDef[] = [
  { field: 'make' },
  { field: 'model' },
  { field: 'price' }
];

// Theme
const theme = themeQuartz.withParams({
  fontSize: 14,
  rowHeight: 50,
  headerHeight: 40,
  accentColor: '#D71E2B'
});

const TestAgGrid: React.FC = () => {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <h2>Test AG-Grid</h2>
      <AgGridReact
        theme={theme}
        rowData={rowData}
        columnDefs={columnDefs}
        onGridReady={(params) => {
          console.log('Test grid ready');
          console.log('Row count:', params.api.getDisplayedRowCount());
        }}
      />
    </div>
  );
};

export default TestAgGrid;