import { useState } from "react";
import { motion } from "framer-motion";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Checkbox from "@/components/atoms/Checkbox";

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete, subjects }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const subject = subjects.find(s => s.id === task.subject);
  
  const formatDueDate = (date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM dd");
  };
  
  const getDueDateColor = (date, status) => {
    if (status === "completed") return "text-green-600";
    if (isPast(date) && status !== "completed") return "text-red-600";
    if (isToday(date)) return "text-yellow-600";
    return "text-gray-600";
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "CheckCircle2";
      case "in_progress": return "Clock";
      case "overdue": return "AlertCircle";
      default: return "Circle";
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in_progress": return "text-blue-600";
      case "overdue": return "text-red-600";
      default: return "text-gray-400";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "bg-white rounded-lg shadow-card border border-gray-100 p-6 hover:shadow-card-hover transition-shadow duration-200",
        task.priority === "high" && "priority-high",
        task.priority === "medium" && "priority-medium",
        task.priority === "low" && "priority-low",
        task.status === "completed" && "opacity-75"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Checkbox
            checked={task.status === "completed"}
            onChange={(e) => onToggleComplete(task.id, e.target.checked)}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={cn(
                "text-lg font-semibold",
                task.status === "completed" && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              <ApperIcon 
                name={getStatusIcon(task.status)} 
                className={cn("w-4 h-4", getStatusColor(task.status))}
              />
            </div>
            
            <div className="flex items-center gap-3 mb-3">
              {subject && (
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: subject.color }}
                >
                  <ApperIcon name={subject.icon} className="w-3 h-3" />
                  {subject.name}
                </div>
              )}
              
              <Badge variant={task.priority} size="sm">
                {task.priority}
              </Badge>
              
              <div className={cn(
                "flex items-center gap-1 text-sm",
                getDueDateColor(new Date(task.dueDate), task.status)
              )}>
                <ApperIcon name="Calendar" className="w-3 h-3" />
                {formatDueDate(new Date(task.dueDate))}
              </div>
            </div>
            
            {task.description && (
              <div className="mb-3">
                <p className={cn(
                  "text-gray-600 text-sm",
                  !isExpanded && "line-clamp-2"
                )}>
                  {task.description}
                </p>
                {task.description.length > 100 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-primary-500 text-sm hover:text-primary-600 mt-1"
                  >
                    {isExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;