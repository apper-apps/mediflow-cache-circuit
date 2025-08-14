import { motion } from "framer-motion";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <motion.main 
          className="flex-1 lg:ml-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;