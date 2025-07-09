import { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import SubjectProgress from "@/components/molecules/SubjectProgress";
import CalendarWidget from "@/components/molecules/CalendarWidget";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import tasksService from "@/services/api/tasksService";
import subjectsService from "@/services/api/subjectsService";

const DashboardSidebar = () => {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

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
      setError("Failed to load dashboard data");
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getOverallStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "completed").length;
    const pendingTasks = totalTasks - completedTasks;
    const overdueTasks = tasks.filter(task => 
      new Date(task.dueDate) < new Date() && task.status !== "completed"
    ).length;
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  const stats = getOverallStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <Loading type="calendar" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold">
            Overall Progress
          </h2>
          <ApperIcon name="TrendingUp" className="w-6 h-6" />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/80">Completion Rate</span>
            <span className="text-2xl font-bold">{stats.completionRate}%</span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-white h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.completedTasks}</div>
              <div className="text-sm text-white/80">Completed</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.pendingTasks}</div>
              <div className="text-sm text-white/80">Pending</div>
            </div>
          </div>
          
          {stats.overdueTasks > 0 && (
            <div className="bg-red-500/20 rounded-lg p-3 flex items-center justify-center gap-2 mt-3">
              <ApperIcon name="AlertCircle" className="w-4 h-4" />
              <span className="text-sm font-medium">
                {stats.overdueTasks} overdue task{stats.overdueTasks !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Widget */}
      <CalendarWidget tasks={tasks} />

      {/* Subject Progress */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-semibold text-gray-900">
          Progress by Subject
        </h2>
        {subjects.length > 0 ? (
          subjects.map(subject => (
            <SubjectProgress
              key={subject.id}
              subject={subject}
              tasks={tasks}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg p-6 text-center">
            <ApperIcon name="BookOpen" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No subjects configured yet</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-card border border-gray-100 p-6">
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
          Quick Stats
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Tasks</span>
            <Badge variant="primary">{stats.totalTasks}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">This Week</span>
            <Badge variant="accent">
              {tasks.filter(task => {
                const taskDate = new Date(task.dueDate);
                const now = new Date();
                const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                return taskDate >= now && taskDate <= weekFromNow;
              }).length}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">High Priority</span>
            <Badge variant="danger">
              {tasks.filter(task => task.priority === "high").length}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;