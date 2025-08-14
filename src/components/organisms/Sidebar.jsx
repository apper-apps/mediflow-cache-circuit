import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const navigation = [
  { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { name: "Patients", href: "/patients", icon: "Users" },
  { name: "Appointments", href: "/appointments", icon: "Calendar" },
  { name: "Doctors", href: "/doctors", icon: "UserCog" },
  { name: "Departments", href: "/departments", icon: "Building2" }
];

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          onClick={toggleMobile}
          className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 bg-white shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name={isMobileOpen ? "X" : "Menu"} className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="lg:hidden fixed left-0 top-0 z-40 h-full w-72 bg-white shadow-xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <SidebarContent onItemClick={closeMobile} location={location} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 bg-white border-r border-gray-200">
        <SidebarContent location={location} />
      </div>
    </>
  );
};

const SidebarContent = ({ onItemClick, location }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
          <ApperIcon name="Heart" className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            MediFlow
          </h1>
          <p className="text-xs text-gray-500">Hospital Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onItemClick}
                className={cn(
                  "group flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-blue-50 text-primary border border-primary/20"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <ApperIcon 
                  name={item.icon} 
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-700"
                  )} 
                />
                {item.name}
                {isActive && (
                  <motion.div
                    className="ml-auto w-2 h-2 rounded-full bg-primary"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <ApperIcon name="Stethoscope" className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Healthcare Staff</p>
              <p className="text-xs text-gray-500">Medical Professional</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;