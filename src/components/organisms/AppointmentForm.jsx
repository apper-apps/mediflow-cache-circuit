import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import { departmentService } from "@/services/api/departmentService";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const AppointmentForm = ({ appointment, onSuccess, onCancel }) => {
const [formData, setFormData] = useState({
    patientId: appointment?.patient_id_c?.Id || appointment?.patientId || "",
    doctorId: appointment?.doctor_id_c?.Id || appointment?.doctorId || "",
    departmentId: appointment?.department_id_c?.Id || appointment?.departmentId || "",
    date: appointment?.date_c || appointment?.date || "",
    time: appointment?.time_c || appointment?.time || "",
    duration: appointment?.duration_c || appointment?.duration || 30,
    reason: appointment?.reason_c || appointment?.reason || "",
    notes: appointment?.notes_c || appointment?.notes || ""
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const loadData = async () => {
    try {
      setDataLoading(true);
      const [patientsData, doctorsData, departmentsData] = await Promise.all([
        patientService.getAll(),
        doctorService.getAll(),
        departmentService.getAll()
      ]);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setDepartments(departmentsData);
    } catch (err) {
      toast.error("Failed to load form data");
      console.error("Error loading form data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patientId) newErrors.patientId = "Patient is required";
    if (!formData.doctorId) newErrors.doctorId = "Doctor is required";
    if (!formData.departmentId) newErrors.departmentId = "Department is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.reason.trim()) newErrors.reason = "Reason is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    try {
      setLoading(true);
      
      if (appointment) {
        await appointmentService.update(appointment.Id, formData);
        toast.success("Appointment updated successfully");
      } else {
        await appointmentService.create(formData);
        toast.success("Appointment scheduled successfully");
      }

      onSuccess?.();
    } catch (err) {
      toast.error(appointment ? "Failed to update appointment" : "Failed to schedule appointment");
      console.error("Error saving appointment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

const getAvailableDoctors = () => {
    if (!formData.departmentId) return doctors;
    return doctors.filter(doctor => 
      (doctor.department_id_c?.Id || doctor.departmentId) === formData.departmentId ||
      (doctor.department_id_c?.Id || doctor.departmentId) === formData.departmentId.toString()
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  if (dataLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-11 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
    initial={{
        opacity: 0,
        y: 20
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    transition={{
        duration: 0.5
    }}>
    <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
            <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center">
                <ApperIcon name="CalendarPlus" className="w-5 h-5 text-primary" />
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-900">
                    {appointment ? "Update Appointment" : "Schedule New Appointment"}
                </h2>
                <p className="text-gray-600 text-sm">
                    {appointment ? "Update appointment details" : "Schedule a new appointment for a patient"}
                </p>
            </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    label="Patient"
                    type="select"
                    value={formData.patientId}
                    onChange={handleChange("patientId")}
                    error={errors.patientId}
                    required>
                    <option value="">Select Patient</option>
                    {patients.map(patient => <option key={patient.Id} value={patient.Id}>
                        {patient.Name || patient.name}- {patient.phone_c || patient.phone}
                    </option>)}
                    <FormField
                        label="Department"
                        type="select"
                        value={formData.departmentId}
                        onChange={handleChange("departmentId")}
                        error={errors.departmentId}
                        required>
                        <option value="">Select Department</option>
                        {departments.map(department => <option key={department.Id} value={department.Id}>
                            {department.Name || department.name}
                        </option>)}
                        <FormField
                            label="Doctor"
                            type="select"
                            value={formData.doctorId}
                            onChange={handleChange("doctorId")}
                            error={errors.doctorId}
                            required>
                            <option value="">Select Doctor</option>
                            {getAvailableDoctors().map(doctor => <option key={doctor.Id} value={doctor.Id}>
                                {doctor.Name || doctor.name}- {doctor.specialization_c || doctor.specialization}
                            </option>)}
                            <FormField
                                label="Date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange("date")}
                                error={errors.date}
                                required
                                min={new Date().toISOString().split("T")[0]} />
                            <FormField
                                label="Time"
                                type="time"
                                value={formData.time}
                                onChange={handleChange("time")}
                                error={errors.time}
                                required />
                            <FormField
                                label="Duration (minutes)"
                                type="select"
                                value={formData.duration}
                                onChange={handleChange("duration")}>
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={45}>45 minutes</option>
                                <option value={60}>60 minutes</option>
                                <option value={90}>90 minutes</option>
                            </FormField>
                        </FormField></FormField></FormField></div>
            <FormField
                label="Reason for Visit"
                value={formData.reason}
                onChange={handleChange("reason")}
                error={errors.reason}
                required
                placeholder="e.g., Annual checkup, Follow-up consultation" />
            <FormField
                label="Notes"
                type="textarea"
                value={formData.notes}
                onChange={handleChange("notes")}
                error={errors.notes}
                placeholder="Additional notes or special instructions" />
            <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
                    {loading ? <>
                        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                        {appointment ? "Updating..." : "Scheduling..."}
                    </> : <>
                        <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                        {appointment ? "Update Appointment" : "Schedule Appointment"}
                    </>}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
                    <ApperIcon name="X" className="w-4 h-4 mr-2" />Cancel
                                </Button>
            </div>
        </form>
    </Card>
</motion.div>
  );
};

export default AppointmentForm;