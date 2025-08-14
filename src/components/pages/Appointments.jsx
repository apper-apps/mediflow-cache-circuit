import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/organisms/Header";
import AppointmentCalendar from "@/components/organisms/AppointmentCalendar";
import AppointmentForm from "@/components/organisms/AppointmentForm";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Appointments = () => {
  const [currentView, setCurrentView] = useState("calendar");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setCurrentView("form");
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setCurrentView("form");
  };

  const handleFormSuccess = () => {
    setCurrentView("calendar");
    setSelectedAppointment(null);
  };

  const handleFormCancel = () => {
    setCurrentView("calendar");
    setSelectedAppointment(null);
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Appointments"
        subtitle="Manage patient appointments and scheduling"
      >
        {currentView === "calendar" && (
          <Button onClick={handleAddAppointment}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        )}
        
        {currentView === "form" && (
          <Button variant="secondary" onClick={handleFormCancel}>
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Calendar
          </Button>
        )}
      </Header>
      
      <motion.div 
        className="p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {currentView === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AppointmentCalendar
                onAppointmentSelect={handleEditAppointment}
                onAddAppointment={handleAddAppointment}
              />
            </motion.div>
          )}
          
          {currentView === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AppointmentForm
                appointment={selectedAppointment}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Appointments;