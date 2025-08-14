import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import DashboardStats from "@/components/organisms/DashboardStats";
import TodaysAppointments from "@/components/organisms/TodaysAppointments";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard"
        subtitle="Welcome to MediFlow - Your hospital management overview"
      />
      
      <motion.div 
        className="p-6 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Statistics Cards */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
          <DashboardStats />
        </section>

        {/* Today's Schedule */}
        <section>
          <TodaysAppointments />
        </section>
      </motion.div>
    </div>
  );
};

export default Dashboard;