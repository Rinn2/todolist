
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/lib/types";
import { useTaskContext } from "@/context/TaskContext";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";
import { EmptyState } from "@/components/ui/empty-state";
import { Plus, Filter, Search, ArrowLeft } from "lucide-react";

const TaskList: React.FC = () => {
  const { filteredTasks, filters, setFilters, categories, sortBy, setSortBy } = useTaskContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  // Find the active category name if a category filter is applied
  const activeCategoryName = filters.categoryId 
    ? categories.find(cat => cat.id === filters.categoryId)?.name 
    : null;

  const handleAddTask = () => {
    setTaskToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTaskToEdit(undefined);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ searchTerm: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : value as any });
  };

  const handlePriorityChange = (value: string) => {
    setFilters({ priority: value === "all" ? null : value as any });
  };

  const handleCategoryChange = (value: string) => {
    setFilters({ categoryId: value === "all" ? null : value });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as any);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearCategoryFilter = () => {
    setFilters({ categoryId: null });
  };

  const handleClearFilters = () => {
    setFilters({ 
      status: null, 
      priority: null, 
      categoryId: null, 
      searchTerm: '' 
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="flex items-center w-full sm:w-auto">
          {activeCategoryName ? (
            <div className="flex items-center mr-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCategoryFilter}
                className="flex items-center text-sm"
              >
                <ArrowLeft size={16} className="mr-1" />
                <span>All Tasks</span>
              </Button>
              <span className="text-sm font-medium ml-2">
                Category: <span className="text-primary">{activeCategoryName}</span>
              </span>
            </div>
          ) : (
            <Input
              placeholder="Search tasks..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="max-w-xs"
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFilters}
            title="Show Filters"
          >
            <Filter size={20} />
          </Button>
        </div>
        <Button onClick={handleAddTask}>
          <Plus size={16} className="mr-2" />
          Add Task
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 bg-secondary/50 p-4 rounded-lg">
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select value={filters.status || "all"} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Priority</label>
            <Select value={filters.priority || "all"} onValueChange={handlePriorityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Category</label>
            <Select value={filters.categoryId || "all"} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Sort By</label>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <EmptyState 
          title={activeCategoryName ? "No tasks in this category" : "No tasks found"}
          description={activeCategoryName 
            ? "There are no tasks in this category yet."
            : "Try adjusting your filters or add a new task."
          }
          action={(filters.status || filters.priority || filters.categoryId || filters.searchTerm) ? {
            label: "Clear filters",
            onClick: handleClearFilters
          } : undefined}
          className="py-12"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
          ))}
        </div>
      )}

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default TaskList;
