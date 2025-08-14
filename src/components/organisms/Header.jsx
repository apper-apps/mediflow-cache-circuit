import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title, subtitle, children }) => {
  return (
    <motion.header 
      className="bg-white border-b border-gray-200 px-6 py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {children}
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <motion.button
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Bell" className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Settings" className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;