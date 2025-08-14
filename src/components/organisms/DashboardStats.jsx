import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatsCard from "@/components/molecules/StatsCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    inProgressAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [patientsData, doctorsData, appointmentsData, todayAppointmentsData] = await Promise.all([
        patientService.getAll(),
        doctorService.getAll(),
        appointmentService.getAll(),
        appointmentService.getToday()
      ]);

      const inProgressCount = appointmentsData.filter(apt => apt.status === "in-progress").length;

      setStats({
        totalPatients: patientsData.length,
        totalDoctors: doctorsData.length,
        todayAppointments: todayAppointmentsData.length,
        inProgressAppointments: inProgressCount
      });
    } catch (err) {
      setError("Failed to load dashboard statistics");
      console.error("Error loading dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-pulse">
            <div className="bg-gray-200 h-4 rounded w-2/3 mb-2"></div>
            <div className="bg-gray-200 h-8 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Error 
        title="Failed to load statistics"
        message={error}
        onRetry={loadStats}
      />
    );
  }

  const statsCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: "Users",
      iconColor: "text-primary"
    },
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      icon: "UserCog",
      iconColor: "text-success"
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: "Calendar",
      iconColor: "text-info"
    },
    {
      title: "In Progress",
      value: stats.inProgressAppointments,
      icon: "Clock",
      iconColor: "text-warning"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <StatsCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;