import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading the data. Please try again.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center mb-6"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
      </motion.div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{message}</p>

      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          className="inline-flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;