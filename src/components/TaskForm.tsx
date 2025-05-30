
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { useTaskContext } from "@/context/TaskContext";
import { toast } from "sonner";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task;
}

const initialTask = {
  title: "",
  description: "",
  status: "not-started" as TaskStatus,
  priority: "medium" as TaskPriority,
  categoryId: null,
  startDate: null,
  dueDate: null,
};

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { addTask, updateTask, categories } = useTaskContext();
  const [formData, setFormData] = useState(initialTask);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description,
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        categoryId: taskToEdit.categoryId,
        startDate: taskToEdit.startDate,
        dueDate: taskToEdit.dueDate,
      });
      
      if (taskToEdit.startDate) {
        setStartDate(new Date(taskToEdit.startDate));
      } else {
        setStartDate(undefined);
      }
      
      if (taskToEdit.dueDate) {
        setDueDate(new Date(taskToEdit.dueDate));
      } else {
        setDueDate(undefined);
      }
    } else {
      setFormData(initialTask);
      setStartDate(undefined);
      setDueDate(undefined);
    }
    setDateError(null);
  }, [taskToEdit, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as TaskStatus }));
  };

  const handlePriorityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, priority: value as TaskPriority }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      categoryId: value === "none" ? null : value 
    }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    setFormData(prev => ({
      ...prev,
      startDate: date ? date.toISOString() : null
    }));
    
    // Validate against due date if it exists
    if (date && dueDate && date > dueDate) {
      setDateError("Tanggal jatuh tempo tidak boleh lebih awal dari tanggal mulai.");
    } else {
      setDateError(null);
    }
  };

  const handleDueDateChange = (date: Date | undefined) => {
    setDueDate(date);
    setFormData(prev => ({
      ...prev,
      dueDate: date ? date.toISOString() : null
    }));
    
    // Validate against start date if it exists
    if (date && startDate && date < startDate) {
      setDateError("Tanggal jatuh tempo tidak boleh lebih awal dari tanggal mulai.");
    } else {
      setDateError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates once more before submission
    if (startDate && dueDate && startDate > dueDate) {
      setDateError("Tanggal jatuh tempo tidak boleh lebih awal dari tanggal mulai.");
      return;
    }
    
    // If only due date is provided, set start date to today
    let finalFormData = {...formData};
    if (!finalFormData.startDate && finalFormData.dueDate) {
      finalFormData.startDate = new Date().toISOString();
    }
    
    if (taskToEdit) {
      updateTask({
        ...taskToEdit,
        ...finalFormData,
      });
    } else {
      addTask(finalFormData);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {taskToEdit ? "Edit Task" : "Add New Task"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal Awal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : <span>Pilih tanggal mulai</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Tanggal Jatuh Tempo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dueDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "dd/MM/yyyy") : <span>Pilih tanggal jatuh tempo</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={handleDueDateChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {dateError && (
            <div className="text-sm font-medium text-destructive">
              {dateError}
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup
              value={formData.status}
              onValueChange={handleStatusChange}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="not-started" id="not-started" />
                <Label htmlFor="not-started" className="cursor-pointer">
                  Not Started
                </Label>
              </div>
              
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="in-progress" id="in-progress" />
                <Label htmlFor="in-progress" className="cursor-pointer">
                  In Progress
                </Label>
              </div>
              
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="done" id="done" />
                <Label htmlFor="done" className="cursor-pointer">
                  Done
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup
              value={formData.priority}
              onValueChange={handlePriorityChange}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="cursor-pointer">
                  Low
                </Label>
              </div>
              
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="cursor-pointer">
                  Medium
                </Label>
              </div>
              
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="cursor-pointer">
                  High
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.categoryId || "none"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {taskToEdit ? "Update" : "Add"} Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
