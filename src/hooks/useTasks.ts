import { useState, useEffect } from 'react';
import { Task, TaskFilters } from '../types';
import { generateMockTasks } from '../utils/mockData';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    category: 'all',
    priority: 'all',
    search: '',
    subcategory: '',
    daysFilter: '',
    teamView: 'all'
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const mockTasks = generateMockTasks();
    setTasks(mockTasks);
    setSelectedTask(mockTasks[0]);
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesCategory = filters.category === 'all' || task.category === filters.category;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesTeamView = filters.teamView === 'all' || task.teamView === filters.teamView;
    const matchesSubcategory = !filters.subcategory || task.subcategory === filters.subcategory;
    const matchesSearch = filters.search === '' || 
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.controlName.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.id.includes(filters.search);
    
    // Days filter logic
    let matchesDaysFilter = true;
    if (filters.daysFilter && filters.daysFilter !== '') {
      const days = parseInt(filters.daysFilter);
      const daysDiff = Math.ceil((task.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      matchesDaysFilter = daysDiff <= days;
    }
    
    return matchesStatus && matchesCategory && matchesPriority && matchesTeamView && 
           matchesSubcategory && matchesSearch && matchesDaysFilter;
  });

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const addTask = (newTask: Omit<Task, 'id' | 'createdDate'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdDate: new Date()
    };
    setTasks(prev => [task, ...prev]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
    
    // Update selected task if it's the one being updated
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }
  };

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filters,
    setFilters,
    selectedTask,
    setSelectedTask,
    updateTaskStatus,
    addTask,
    updateTask,
    deleteTask
  };
};