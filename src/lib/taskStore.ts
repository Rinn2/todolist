
import { Task, Category, TaskStore, AppSettings, TaskStatistics, FilterOptions, SortOption } from './types';
import { toast } from "sonner";

const LOCAL_STORAGE_KEY = 'todolist-app-data';

// Initial data
const defaultSettings: AppSettings = {
  theme: 'light',
  defaultSort: 'date',
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Work', color: '#9b87f5' },
  { id: '2', name: 'Personal', color: '#33C3F0' },
  { id: '3', name: 'Shopping', color: '#FEC6A1' },
];

const initialStore: TaskStore = {
  tasks: [],
  categories: defaultCategories,
  settings: defaultSettings,
};

// Load data from local storage
export const loadStore = (): TaskStore => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as TaskStore;
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    toast.error('Failed to load data from local storage');
  }
  return initialStore;
};

// Save data to local storage
export const saveStore = (store: TaskStore): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    toast.error('Failed to save data to local storage');
  }
};

// Reset all data
export const resetStore = (): TaskStore => {
  saveStore(initialStore);
  toast.success('All data has been reset');
  return initialStore;
};

// Generate task statistics
export const generateStatistics = (tasks: Task[]): TaskStatistics => {
  const statistics: TaskStatistics = {
    total: tasks.length,
    byStatus: {
      'not-started': 0,
      'in-progress': 0,
      'done': 0,
    },
    byPriority: {
      'low': 0,
      'medium': 0,
      'high': 0,
    },
    byCategory: {},
  };

  tasks.forEach(task => {
    // Count by status
    statistics.byStatus[task.status]++;
    
    // Count by priority
    statistics.byPriority[task.priority]++;
    
    // Count by category
    if (task.categoryId) {
      statistics.byCategory[task.categoryId] = (statistics.byCategory[task.categoryId] || 0) + 1;
    }
  });

  return statistics;
};

// Filter and sort tasks
export const filterAndSortTasks = (
  tasks: Task[],
  filters: FilterOptions,
  sortBy: SortOption
): Task[] => {
  let filteredTasks = [...tasks];

  // Apply filters
  if (filters.status) {
    filteredTasks = filteredTasks.filter(task => task.status === filters.status);
  }
  
  if (filters.priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
  }
  
  if (filters.categoryId) {
    filteredTasks = filteredTasks.filter(task => task.categoryId === filters.categoryId);
  }
  
  if (filters.searchTerm) {
    const searchTermLower = filters.searchTerm.toLowerCase();
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchTermLower) ||
      task.description.toLowerCase().includes(searchTermLower)
    );
  }

  // Apply sorting
  return sortTasks(filteredTasks, sortBy);
};

// Sort tasks
export const sortTasks = (tasks: Task[], sortBy: SortOption): Task[] => {
  const sortedTasks = [...tasks];
  
  switch (sortBy) {
    case 'date':
      return sortedTasks.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    
    case 'priority':
      return sortedTasks.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    
    case 'status':
      return sortedTasks.sort((a, b) => {
        const statusOrder = { 'not-started': 0, 'in-progress': 1, 'done': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
    
    default:
      return sortedTasks;
  }
};

// Generate a new ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};
