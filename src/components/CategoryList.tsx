
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTaskContext } from "@/context/TaskContext";
import { Category, Task } from "@/lib/types";
import { Edit, Plus, Trash2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CategoryList: React.FC = () => {
  const { categories, tasks, addCategory, updateCategory, deleteCategory, updateTask, deleteTask, statistics } = useTaskContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | undefined>(undefined);
  const [formData, setFormData] = useState({ name: "", color: "#9b87f5" });
  const [openCategoryIds, setOpenCategoryIds] = useState<string[]>([]);

  const handleAddCategory = () => {
    setCategoryToEdit(undefined);
    setFormData({ name: "", color: "#9b87f5" });
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setFormData({ name: category.name, color: category.color });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCategoryToEdit(undefined);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (categoryToEdit) {
      updateCategory({
        ...categoryToEdit,
        name: formData.name,
        color: formData.color,
      });
    } else {
      addCategory({
        name: formData.name,
        color: formData.color,
      });
    }
    
    handleCloseForm();
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
  };

  const getTaskCount = (categoryId: string) => {
    return statistics.byCategory[categoryId] || 0;
  };

  const handleCategoryClick = (categoryId: string) => {
    setOpenCategoryIds(prev => {
      if (prev.includes(categoryId)) {
        // If already open, close it
        return prev.filter(id => id !== categoryId);
      } else {
        // If closed, open it
        return [...prev, categoryId];
      }
    });
  };

  const getTasksForCategory = (categoryId: string) => {
    return tasks.filter(task => task.categoryId === categoryId);
  };

  const handleMarkAsDone = (task: Task) => {
    updateTask({
      ...task,
      status: "done",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "not-started":
        return "Not Started";
      case "in-progress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return "Unknown";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "low":
        return "Low";
      case "medium":
        return "Medium";
      case "high":
        return "High";
      default:
        return "Unknown";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Button onClick={handleAddCategory}>
          <Plus size={16} className="mr-2" />
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">No categories found. Add your first category!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Accordion 
              key={category.id} 
              type="single" 
              collapsible
              value={openCategoryIds.includes(category.id) ? category.id : undefined}
              onValueChange={(value) => {
                if (value) {
                  setOpenCategoryIds(prev => [...prev.filter(id => id !== category.id), category.id]);
                } else {
                  setOpenCategoryIds(prev => prev.filter(id => id !== category.id));
                }
              }}
              className="w-full"
            >
              <AccordionItem value={category.id} className="border rounded-md hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-center">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center">
                      <span 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      ></span>
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({getTaskCount(category.id)} tasks)
                      </span>
                    </div>
                  </AccordionTrigger>
                  <div className="px-4 flex">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCategory(category);
                      }}
                      title="Edit Category"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      title="Delete Category"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3 pt-2">
                    {getTasksForCategory(category.id).length > 0 ? (
                      getTasksForCategory(category.id).map((task) => (
                        <Card key={task.id} className="fade-in">
                          <CardHeader className="py-3 px-4">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{task.title}</CardTitle>
                              <div className="flex space-x-1">
                                <Badge className={`status-${task.status}`}>
                                  {getStatusLabel(task.status)}
                                </Badge>
                                <Badge className={`priority-${task.priority}`}>
                                  {getPriorityLabel(task.priority)}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          
                          {task.description && (
                            <CardContent className="py-1 px-4">
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            </CardContent>
                          )}
                          
                          <CardFooter className="py-2 px-4 flex justify-between">
                            <div className="text-xs text-muted-foreground">
                              {new Date(task.updatedAt).toLocaleString()}
                            </div>
                            <div className="flex space-x-2">
                              {task.status !== "done" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsDone(task)}
                                  title="Mark as Done"
                                >
                                  <CheckCircle size={16} />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTask(task.id)}
                                title="Delete Task"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">Tidak ada tugas dalam kategori ini.</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {categoryToEdit ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-10 p-1"
                />
                <div className="text-sm text-muted-foreground">
                  Selected color: {formData.color}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button type="submit">
                {categoryToEdit ? "Update" : "Add"} Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryList;
