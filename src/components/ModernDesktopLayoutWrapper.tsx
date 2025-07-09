import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import ModernDesktopLayout from './ModernDesktopLayout';

const ModernDesktopLayoutWrapper: React.FC = () => {
  return (
    <ThemeProvider>
      <ModernDesktopLayout />
    </ThemeProvider>
  );
};

export default ModernDesktopLayoutWrapper;