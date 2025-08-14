import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const TodaysAppointments = ({ onAppointmentSelect }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentService.getToday(),
        patientService.getAll(),
        doctorService.getAll()
      ]);
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError("Failed to load today's appointments");
      console.error("Error loading today's appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await appointmentService.updateStatus(appointmentId, newStatus);
      setAppointments(prev => 
        prev.map(apt => 
          apt.Id === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        )
      );
      toast.success(`Appointment ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update appointment status");
      console.error("Error updating appointment status:", err);
    }
  };

const getPatientName = (patientId) => {
    if (typeof patientId === 'object' && patientId?.Name) {
      return patientId.Name;
    }
    const patient = patients.find(p => p.Id.toString() === patientId.toString());
    return patient?.Name || patient?.name || "Unknown Patient";
  };

  const getDoctorName = (doctorId) => {
    if (typeof doctorId === 'object' && doctorId?.Name) {
      return doctorId.Name;
    }
    const doctor = doctors.find(d => d.Id.toString() === doctorId.toString());
    return doctor?.Name || doctor?.name || "Unknown Doctor";
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
        </div>
        <Loading />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
        </div>
        <Error 
          title="Failed to load appointments"
          message={error}
          onRetry={loadData}
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
        </div>
        <span className="text-sm text-gray-500">
          {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
        </span>
      </div>

      {appointments.length === 0 ? (
        <Empty
          title="No appointments today"
          message="There are no appointments scheduled for today."
          actionLabel="View Calendar"
          onAction={() => window.location.href = "/appointments"}
          icon="Calendar"
          showAction={false}
        />
      ) : (
        <div className="space-y-4">
          {appointments
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((appointment, index) => (
<motion.div
                key={appointment.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-lg font-semibold text-primary min-w-[4rem]">
                    {appointment.time_c || appointment.time}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 truncate">
                        {getPatientName(appointment.patient_id_c || appointment.patientId)}
                      </p>
                      <StatusBadge status={appointment.status_c || appointment.status} />
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {getDoctorName(appointment.doctor_id_c || appointment.doctorId)} • {appointment.reason_c || appointment.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(appointment.status_c || appointment.status) === "scheduled" && (
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => updateAppointmentStatus(appointment.Id, "in-progress")}
                    >
                      Start
                    </Button>
                  )}
                  
                  {(appointment.status_c || appointment.status) === "in-progress" && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => updateAppointmentStatus(appointment.Id, "completed")}
                    >
                      Complete
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAppointmentSelect?.(appointment)}
                  >
                    <ApperIcon name="Eye" className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
        </div>
      )}
    </Card>
  );
};

export default TodaysAppointments;