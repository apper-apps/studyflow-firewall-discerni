import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { isToday, isTomorrow, isPast } from "date-fns";
import TaskCard from "@/components/molecules/TaskCard";
import FilterButton from "@/components/molecules/FilterButton";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import tasksService from "@/services/api/tasksService";
import subjectsService from "@/services/api/subjectsService";

const TaskList = ({ onAddTask, onEditTask }) => {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSubject, setActiveSubject] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, activeFilter, activeSubject]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, subjectsData] = await Promise.all([
        tasksService.getAll(),
        subjectsService.getAll()
      ]);
      setTasks(tasksData);
      setSubjects(subjectsData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by subject
    if (activeSubject !== "all") {
      filtered = filtered.filter(task => task.subject === activeSubject);
    }

    // Filter by status/time
    switch (activeFilter) {
      case "today":
        filtered = filtered.filter(task => isToday(new Date(task.dueDate)));
        break;
      case "tomorrow":
        filtered = filtered.filter(task => isTomorrow(new Date(task.dueDate)));
        break;
      case "overdue":
        filtered = filtered.filter(task => 
          isPast(new Date(task.dueDate)) && task.status !== "completed"
        );
        break;
      case "completed":
        filtered = filtered.filter(task => task.status === "completed");
        break;
      case "pending":
        filtered = filtered.filter(task => task.status !== "completed");
        break;
      case "high":
        filtered = filtered.filter(task => task.priority === "high");
        break;
      case "medium":
        filtered = filtered.filter(task => task.priority === "medium");
        break;
      case "low":
        filtered = filtered.filter(task => task.priority === "low");
        break;
      default:
        break;
    }

    // Sort by due date and priority
    filtered.sort((a, b) => {
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (a.status !== "completed" && b.status === "completed") return -1;
      
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    setFilteredTasks(filtered);
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedTask = {
        ...task,
        status: completed ? "completed" : "not_started",
        completedAt: completed ? new Date().toISOString() : null
      };

      await tasksService.update(taskId, updatedTask);
      
      setTasks(prev => prev.map(t => 
        t.id === taskId ? updatedTask : t
      ));

      toast.success(completed ? "Task completed!" : "Task marked as incomplete");
    } catch (err) {
      toast.error("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await tasksService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  const getFilterCounts = () => {
    return {
      all: tasks.length,
      today: tasks.filter(task => isToday(new Date(task.dueDate))).length,
      tomorrow: tasks.filter(task => isTomorrow(new Date(task.dueDate))).length,
      overdue: tasks.filter(task => 
        isPast(new Date(task.dueDate)) && task.status !== "completed"
      ).length,
      completed: tasks.filter(task => task.status === "completed").length,
      pending: tasks.filter(task => task.status !== "completed").length,
      high: tasks.filter(task => task.priority === "high").length,
      medium: tasks.filter(task => task.priority === "medium").length,
      low: tasks.filter(task => task.priority === "low").length,
    };
  };

  const counts = getFilterCounts();

  if (loading) {
    return <Loading type="tasks" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            My Tasks
          </h1>
          <p className="text-gray-600 mt-1">
            {counts.pending} pending • {counts.completed} completed
          </p>
        </div>
        <Button onClick={onAddTask} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
        />
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <FilterButton
            label="All"
            active={activeFilter === "all"}
            count={counts.all}
            onClick={() => setActiveFilter("all")}
          />
          <FilterButton
            label="Today"
            active={activeFilter === "today"}
            count={counts.today}
            icon="Clock"
            color="warning"
            onClick={() => setActiveFilter("today")}
          />
          <FilterButton
            label="Tomorrow"
            active={activeFilter === "tomorrow"}
            count={counts.tomorrow}
            icon="Calendar"
            onClick={() => setActiveFilter("tomorrow")}
          />
          <FilterButton
            label="Overdue"
            active={activeFilter === "overdue"}
            count={counts.overdue}
            icon="AlertCircle"
            color="danger"
            onClick={() => setActiveFilter("overdue")}
          />
          <FilterButton
            label="Completed"
            active={activeFilter === "completed"}
            count={counts.completed}
            icon="CheckCircle"
            color="success"
            onClick={() => setActiveFilter("completed")}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterButton
            label="High Priority"
            active={activeFilter === "high"}
            count={counts.high}
            icon="ArrowUp"
            color="danger"
            onClick={() => setActiveFilter("high")}
          />
          <FilterButton
            label="Medium Priority"
            active={activeFilter === "medium"}
            count={counts.medium}
            icon="Minus"
            color="warning"
            onClick={() => setActiveFilter("medium")}
          />
          <FilterButton
            label="Low Priority"
            active={activeFilter === "low"}
            count={counts.low}
            icon="ArrowDown"
            color="success"
            onClick={() => setActiveFilter("low")}
          />
        </div>

        {/* Subject filters */}
        <div className="flex flex-wrap gap-2">
          <FilterButton
            label="All Subjects"
            active={activeSubject === "all"}
            onClick={() => setActiveSubject("all")}
          />
          {subjects.map(subject => (
            <FilterButton
              key={subject.id}
              label={subject.name}
              active={activeSubject === subject.id}
              count={tasks.filter(t => t.subject === subject.id).length}
              icon={subject.icon}
              onClick={() => setActiveSubject(subject.id)}
            />
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {filteredTasks.length === 0 ? (
            <Empty
              title="No tasks found"
              message={searchTerm 
                ? "No tasks match your search criteria. Try adjusting your filters."
                : "Create your first task to get started with your academic journey."
              }
              onAction={onAddTask}
              icon={searchTerm ? "Search" : "CheckSquare"}
            />
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                subjects={subjects}
                onToggleComplete={handleToggleComplete}
                onEdit={onEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;