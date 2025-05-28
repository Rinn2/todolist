
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/lib/types";
import { useTaskContext } from "@/context/TaskContext";
import { CheckCircle, Edit, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { deleteTask, updateTask, categories } = useTaskContext();

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const handleMarkAsDone = () => {
    updateTask({
      ...task,
      status: "done",
    });
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

  const getCategory = () => {
    if (!task.categoryId) return null;
    return categories.find((cat) => cat.id === task.categoryId);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  const category = getCategory();
  const startDateFormatted = formatDate(task.startDate);
  const dueDateFormatted = formatDate(task.dueDate);

  return (
    <Card className="fade-in h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <div className="flex flex-wrap gap-1">
            <Badge className={`status-${task.status}`}>
              {getStatusLabel(task.status)}
            </Badge>
            <Badge className={`priority-${task.priority}`}>
              {getPriorityLabel(task.priority)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
        
        {(startDateFormatted || dueDateFormatted) && (
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <Calendar size={14} className="mr-1 flex-shrink-0" />
            <span className="flex flex-wrap">
              {startDateFormatted && `Mulai: ${startDateFormatted}`}
              {startDateFormatted && dueDateFormatted && " • "}
              {dueDateFormatted && `Selesai: ${dueDateFormatted}`}
            </span>
          </div>
        )}
        
        {category && (
          <div className="mt-2">
            <Badge
              variant="outline"
              style={{ 
                borderColor: category.color,
                color: category.color
              }}
            >
              {category.name}
            </Badge>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between mt-auto">
        <div className="text-xs text-muted-foreground">
          {new Date(task.updatedAt).toLocaleString()}
        </div>
        <div className="flex space-x-2">
          {task.status !== "done" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAsDone}
              title="Mark as Done"
            >
              <CheckCircle size={18} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <Edit size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            title="Delete Task"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskItem;
