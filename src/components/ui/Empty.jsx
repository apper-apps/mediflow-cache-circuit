import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  message = "There's nothing here yet. Get started by adding some data.", 
  actionLabel = "Get Started",
  onAction,
  icon = "Inbox",
  showAction = true 
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
      </motion.div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{message}</p>

      {showAction && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          className="inline-flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;