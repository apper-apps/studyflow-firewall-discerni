import { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  isSameDay,
  addMonths,
  subMonths
} from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CalendarWidget = ({ tasks = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getTasksForDate = (date) => {
    return tasks.filter(task => 
      isSameDay(new Date(task.dueDate), date)
    );
  };
  
  const getTaskCountColor = (count) => {
    if (count === 0) return "bg-gray-100";
    if (count <= 2) return "bg-green-100";
    if (count <= 4) return "bg-yellow-100";
    return "bg-red-100";
  };
  
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="bg-white rounded-lg shadow-card border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-semibold text-gray-900">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevMonth}
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextMonth}
          >
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const tasksForDay = getTasksForDate(day);
          const taskCount = tasksForDay.length;
          
          return (
            <motion.div
              key={day.toISOString()}
              whileHover={{ scale: 1.05 }}
              className={cn(
                "relative p-2 text-center text-sm cursor-pointer rounded-lg transition-colors duration-200",
                isToday(day) && "bg-primary-500 text-white font-semibold",
                !isToday(day) && isSameMonth(day, currentDate) && "text-gray-900 hover:bg-gray-100",
                !isSameMonth(day, currentDate) && "text-gray-400",
                !isToday(day) && getTaskCountColor(taskCount)
              )}
            >
              <div className="relative">
                {format(day, "d")}
                {taskCount > 0 && !isToday(day) && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {taskCount}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 rounded"></div>
          <span>Light</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-100 rounded"></div>
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 rounded"></div>
          <span>Heavy</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;