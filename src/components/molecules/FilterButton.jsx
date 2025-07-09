import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FilterButton = ({ 
  label, 
  active = false, 
  count = 0, 
  icon,
  onClick,
  color = "primary"
}) => {
  const colors = {
    primary: active ? "bg-primary-500 text-white" : "bg-primary-100 text-primary-700 hover:bg-primary-200",
    secondary: active ? "bg-secondary-500 text-white" : "bg-secondary-100 text-secondary-700 hover:bg-secondary-200",
    accent: active ? "bg-accent-500 text-white" : "bg-accent-100 text-accent-700 hover:bg-accent-200",
    success: active ? "bg-green-500 text-white" : "bg-green-100 text-green-700 hover:bg-green-200",
    warning: active ? "bg-yellow-500 text-white" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    danger: active ? "bg-red-500 text-white" : "bg-red-100 text-red-700 hover:bg-red-200",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors duration-200",
        colors[color]
      )}
    >
      {icon && <ApperIcon name={icon} className="w-4 h-4" />}
      <span>{label}</span>
      {count > 0 && (
        <span className={cn(
          "px-2 py-0.5 text-xs rounded-full",
          active ? "bg-white/20" : "bg-white"
        )}>
          {count}
        </span>
      )}
    </motion.button>
  );
};

export default FilterButton;