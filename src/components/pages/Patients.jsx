import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/organisms/Header";
import PatientList from "@/components/organisms/PatientList";
import PatientForm from "@/components/organisms/PatientForm";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Patients = () => {
  const [currentView, setCurrentView] = useState("list");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setCurrentView("form");
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setCurrentView("form");
  };

  const handleFormSuccess = () => {
    setCurrentView("list");
    setSelectedPatient(null);
  };

  const handleFormCancel = () => {
    setCurrentView("list");
    setSelectedPatient(null);
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Patients"
        subtitle="Manage patient records and information"
      >
        {currentView === "list" && (
          <Button onClick={handleAddPatient}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        )}
        
        {currentView === "form" && (
          <Button variant="secondary" onClick={handleFormCancel}>
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to List
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
          {currentView === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PatientList
                onPatientSelect={handleEditPatient}
                onAddPatient={handleAddPatient}
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
              <PatientForm
                patient={selectedPatient}
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

export default Patients;