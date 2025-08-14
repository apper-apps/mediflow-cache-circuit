import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { patientService } from "@/services/api/patientService";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const PatientList = ({ onPatientSelect, onAddPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError("Failed to load patients");
      console.error("Error loading patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setSearchQuery(query);
      setLoading(true);
      setError(null);
      const data = await patientService.search(query);
      setPatients(data);
    } catch (err) {
      setError("Failed to search patients");
      console.error("Error searching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (patientId, patientName) => {
    if (!window.confirm(`Are you sure you want to delete ${patientName}?`)) {
      return;
    }

    try {
      await patientService.delete(patientId);
      setPatients(patients.filter(p => p.Id !== patientId));
      toast.success("Patient deleted successfully");
    } catch (err) {
      toast.error("Failed to delete patient");
      console.error("Error deleting patient:", err);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load patients"
        message={error}
        onRetry={loadPatients}
      />
    );
  }

  if (patients.length === 0 && !searchQuery) {
    return (
      <Empty
        title="No patients registered"
        message="Get started by registering your first patient in the system."
        actionLabel="Add Patient"
        onAction={onAddPatient}
        icon="Users"
      />
    );
  }

  if (patients.length === 0 && searchQuery) {
    return (
      <Empty
        title="No patients found"
        message={`No patients match your search for "${searchQuery}". Try adjusting your search terms.`}
        actionLabel="Clear Search"
        onAction={() => handleSearch("")}
        icon="Search"
      />
    );
  }

  return (
    <div className="space-y-6">
    <div
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
            placeholder="Search patients by name, phone, or email..."
            onSearch={handleSearch}
            className="w-full sm:w-96" />
        <Button onClick={onAddPatient} className="whitespace-nowrap">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />Add Patient
                    </Button>
    </div>
    <div className="grid gap-4">
        {patients.map((patient, index) => <motion.div
            key={patient.Id}
            initial={{
                opacity: 0,
                y: 20
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            transition={{
                duration: 0.3,
                delay: index * 0.05
            }}>
            <Card hover className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center">
                            <ApperIcon name="User" className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {patient.Name || patient.name}
                            </h3>
                            <span
                                className="px-2 py-1 bg-info/10 text-info text-xs font-medium rounded-full">
                                {patient.blood_type_c || patient.bloodType}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                                    {patient.phone_c || patient.phone}
                                </div>
                                <div className="flex items-center gap-2">
                                    <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                                    {patient.email_c || patient.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />Age: {new Date().getFullYear() - new Date(patient.date_of_birth_c || patient.dateOfBirth).getFullYear()}
                                </div>
                                {(patient.allergies_c && patient.allergies_c.length > 0 || patient.allergies && patient.allergies.length > 0) && <div className="mt-2 flex items-center gap-2">
                                    <ApperIcon name="AlertTriangle" className="w-4 h-4 text-warning" />
                                    <span className="text-sm text-warning font-medium">Allergies: {(patient.allergies_c || patient.allergies || "").split(",").map(a => a.trim()).filter(a => a).join(", ")}
                                    </span>
                                </div>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <Button variant="secondary" size="sm" onClick={() => onPatientSelect(patient)}>
                                <ApperIcon name="Eye" className="w-4 h-4 mr-2" />View
                                                  </Button>
                            <Button
                                variant="error"
                                size="sm"
                                onClick={() => handleDeletePatient(patient.Id, patient.Name || patient.name)}>
                                <ApperIcon name="Trash2" className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div></Card>
        </motion.div>)}
    </div>
</div>
  );
};

export default PatientList;