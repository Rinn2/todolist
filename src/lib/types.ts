
export type TaskStatus = 'not-started' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type SortOption = 'date' | 'priority' | 'status';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  defaultSort: SortOption;
}

export interface TaskStore {
  tasks: Task[];
  categories: Category[];
  settings: AppSettings;
}

export interface TaskStatistics {
  total: number;
  byStatus: {
    'not-started': number;
    'in-progress': number;
    'done': number;
  };
  byPriority: {
    'low': number;
    'medium': number;
    'high': number;
  };
  byCategory: Record<string, number>;
}

export interface FilterOptions {
  status: TaskStatus | null;
  priority: TaskPriority | null;
  categoryId: string | null;
  searchTerm: string;
}
