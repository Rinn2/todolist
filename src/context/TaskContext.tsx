
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Task, 
  Category, 
  AppSettings, 
  FilterOptions, 
  TaskStatistics,
  SortOption,
  TaskStatus,
  TaskPriority
} from '../lib/types';
import { 
  loadStore, 
  saveStore, 
  resetStore,
  generateStatistics,
  filterAndSortTasks,
  generateId
} from '../lib/taskStore';
import { toast } from "sonner";

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  categories: Category[];
  settings: AppSettings;
  statistics: TaskStatistics;
  filters: FilterOptions;
  sortBy: SortOption;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  
  updateSettings: (newSettings: AppSettings) => void;
  resetAllData: () => void;
  
  setFilters: (newFilters: Partial<FilterOptions>) => void;
  setSortBy: (sort: SortOption) => void;
}

const defaultFilters: FilterOptions = {
  status: null,
  priority: null,
  categoryId: null,
  searchTerm: '',
};

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [store, setStore] = useState(() => loadStore());
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortOption>(store.settings.defaultSort);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [statistics, setStatistics] = useState<TaskStatistics>(generateStatistics(store.tasks));

  // Save to local storage whenever store changes
  useEffect(() => {
    saveStore(store);
  }, [store]);

  // Update filtered tasks when tasks, filters, or sort changes
  useEffect(() => {
    const filtered = filterAndSortTasks(store.tasks, filters, sortBy);
    setFilteredTasks(filtered);
    setStatistics(generateStatistics(store.tasks));
  }, [store.tasks, filters, sortBy]);

  // Apply theme
  useEffect(() => {
    if (store.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [store.settings.theme]);

  // Task operations
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    setStore(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));
    
    toast.success(`Task "${newTask.title}" added`);
  };
  
  const updateTask = (updatedTask: Task) => {
    setStore(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === updatedTask.id 
          ? { ...updatedTask, updatedAt: new Date().toISOString() } 
          : task
      ),
    }));
    
    toast.success(`Task "${updatedTask.title}" updated`);
  };
  
  const deleteTask = (taskId: string) => {
    const taskTitle = store.tasks.find(task => task.id === taskId)?.title;
    
    setStore(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId),
    }));
    
    toast.success(`Task "${taskTitle || 'Unknown'}" deleted`);
  };

  // Category operations
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: generateId(),
    };
    
    setStore(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
    
    toast.success(`Category "${newCategory.name}" added`);
  };
  
  const updateCategory = (updatedCategory: Category) => {
    setStore(prev => ({
      ...prev,
      categories: prev.categories.map(category => 
        category.id === updatedCategory.id ? updatedCategory : category
      ),
    }));
    
    toast.success(`Category "${updatedCategory.name}" updated`);
  };
  
  const deleteCategory = (categoryId: string) => {
    const categoryName = store.categories.find(cat => cat.id === categoryId)?.name;
    
    // First update tasks that were in this category
    const updatedTasks = store.tasks.map(task => 
      task.categoryId === categoryId 
        ? { ...task, categoryId: null, updatedAt: new Date().toISOString() }
        : task
    );
    
    setStore(prev => ({
      ...prev,
      tasks: updatedTasks,
      categories: prev.categories.filter(cat => cat.id !== categoryId),
    }));
    
    toast.success(`Category "${categoryName || 'Unknown'}" deleted`);
  };

  // Settings operations
  const updateSettings = (newSettings: AppSettings) => {
    setStore(prev => ({
      ...prev,
      settings: newSettings,
    }));
    
    if (newSettings.defaultSort !== sortBy) {
      setSortBy(newSettings.defaultSort);
    }
    
    toast.success('Settings updated');
  };
  
  const resetAllData = () => {
    const newStore = resetStore();
    setStore(newStore);
    setFilters(defaultFilters);
    setSortBy(newStore.settings.defaultSort);
  };

  // Filter operations
  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: store.tasks,
        filteredTasks,
        categories: store.categories,
        settings: store.settings,
        statistics,
        filters,
        sortBy,
        
        addTask,
        updateTask,
        deleteTask,
        
        addCategory,
        updateCategory,
        deleteCategory,
        
        updateSettings,
        resetAllData,
        
        setFilters: updateFilters,
        setSortBy,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
