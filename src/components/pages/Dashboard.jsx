import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import TaskList from "@/components/organisms/TaskList";
import DashboardSidebar from "@/components/organisms/DashboardSidebar";
import TaskModal from "@/components/organisms/TaskModal";
import tasksService from "@/services/api/tasksService";
import subjectsService from "@/services/api/subjectsService";

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [subjectsLoaded, setSubjectsLoaded] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const subjectsData = await subjectsService.getAll();
      setSubjects(subjectsData);
      setSubjectsLoaded(true);
    } catch (err) {
      console.error("Error loading subjects:", err);
      toast.error("Failed to load subjects");
      setSubjectsLoaded(true);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmitTask = async (taskData) => {
    try {
      if (editingTask) {
        await tasksService.update(editingTask.id, taskData);
        toast.success("Task updated successfully!");
      } else {
        await tasksService.create(taskData);
        toast.success("Task created successfully!");
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Error saving task:", err);
      toast.error("Failed to save task");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <TaskList
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
            />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <DashboardSidebar />
          </motion.div>
        </div>
      </div>

      {/* Task Modal */}
      {subjectsLoaded && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          task={editingTask}
          subjects={subjects}
          onSubmit={handleSubmitTask}
        />
      )}
    </div>
  );
};

export default Dashboard;