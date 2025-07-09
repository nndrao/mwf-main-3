import React, { useState } from 'react';
import HeaderImproved from './components/HeaderImproved';
import TaskListImproved from './components/TaskListImproved';
import TaskDetails from './components/TaskDetails';
import FilterSheet from './components/FilterSheet';
import ModernDesktopLayoutWrapper from './components/ModernDesktopLayoutWrapper';
import TabletLayout from './components/TabletLayout';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTasks } from './hooks/useTasks';

function App() {
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [showFilters, setShowFilters] = useState(false);
  const {
    tasks,
    allTasks,
    filters,
    setFilters,
    selectedTask,
    setSelectedTask,
    updateTaskStatus,
    addTask,
    updateTask,
    deleteTask
  } = useTasks();

  // Responsive breakpoints for different view modes
  React.useEffect(() => {
    const checkViewMode = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setViewMode('desktop');
      } else if (width >= 768) {
        setViewMode('tablet');
      } else {
        setViewMode('mobile');
      }
    };
    
    checkViewMode();
    window.addEventListener('resize', checkViewMode);
    return () => window.removeEventListener('resize', checkViewMode);
  }, []);

  if (viewMode === 'desktop') {
    return <ModernDesktopLayoutWrapper />;
  }

  if (viewMode === 'tablet') {
    return (
      <ThemeProvider>
        <TabletLayout />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
        <HeaderImproved />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TaskListImproved 
            tasks={tasks}
            selectedTask={selectedTask}
            onSelectTask={setSelectedTask}
            onUpdateTaskStatus={updateTaskStatus}
            onShowFilters={() => setShowFilters(true)}
          />
        </div>
        
        {/* Task Details Modal with improved animation */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center sm:justify-center animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 w-full h-[90vh] sm:h-auto sm:max-h-[85vh] sm:w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
              <TaskDetails 
                task={selectedTask}
                onUpdateTask={updateTask}
                onClose={() => setSelectedTask(null)}
              />
            </div>
          </div>
        )}
        
        {/* Filter Sheet */}
        {showFilters && (
          <FilterSheet
            filters={filters}
            onFiltersChange={setFilters}
            tasks={allTasks}
            onClose={() => setShowFilters(false)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;