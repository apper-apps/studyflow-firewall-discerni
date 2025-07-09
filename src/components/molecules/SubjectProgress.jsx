import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const SubjectProgress = ({ subject, tasks = [] }) => {
  const subjectTasks = tasks.filter(task => task.subject === subject.id);
  const completedTasks = subjectTasks.filter(task => task.status === "completed");
  const progress = subjectTasks.length > 0 ? (completedTasks.length / subjectTasks.length) * 100 : 0;
  
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: subject.color }}
          >
            <ApperIcon name={subject.icon} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{subject.name}</h3>
            <p className="text-sm text-gray-500">
              {completedTasks.length} of {subjectTasks.length} tasks
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="h-2 rounded-full"
          style={{ backgroundColor: subject.color }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default SubjectProgress;