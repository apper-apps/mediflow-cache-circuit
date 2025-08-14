import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { appointmentService } from "@/services/api/appointmentService";
import { patientService } from "@/services/api/patientService";
import { doctorService } from "@/services/api/doctorService";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

const AppointmentCalendar = ({ onAppointmentSelect, onAddAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("day"); // "day" or "week"

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll()
      ]);
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError("Failed to load calendar data");
      console.error("Error loading calendar data:", err);
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
    const patient = patients.find(p => p.Id.toString() === patientId.toString());
    return patient?.name || "Unknown Patient";
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.Id.toString() === doctorId.toString());
    return doctor?.name || "Unknown Doctor";
  };

  const getFilteredAppointments = () => {
    if (viewMode === "day") {
      return appointments.filter(apt => 
        isSameDay(new Date(apt.date), currentDate)
      );
    } else {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 6);
      return appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= weekStart && aptDate <= weekEnd;
      });
    }
  };

  const navigateDate = (direction) => {
    const days = viewMode === "day" ? 1 : 7;
    setCurrentDate(prev => 
      direction === "next" ? addDays(prev, days) : addDays(prev, -days)
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load calendar"
        message={error}
        onRetry={loadData}
      />
    );
  }

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigateDate("prev")}
              >
                <ApperIcon name="ChevronLeft" className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigateDate("next")}
              >
                <ApperIcon name="ChevronRight" className="w-4 h-4" />
              </Button>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {viewMode === "day" 
                  ? format(currentDate, "EEEE, MMMM d, yyyy")
                  : `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d, yyyy")}`
                }
              </h2>
              <p className="text-sm text-gray-600">
                {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "day" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("day")}
                className="text-xs"
              >
                Day
              </Button>
              <Button
                variant={viewMode === "week" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("week")}
                className="text-xs"
              >
                Week
              </Button>
            </div>

            <Button onClick={onAddAppointment}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>
      </Card>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Empty
          title={`No appointments ${viewMode === "day" ? "today" : "this week"}`}
          message={`Schedule appointments to see them appear in your ${viewMode} view.`}
          actionLabel="Schedule Appointment"
          onAction={onAddAppointment}
          icon="Calendar"
        />
      ) : (
        <div className="grid gap-4">
          {filteredAppointments
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((appointment, index) => (
              <motion.div
                key={appointment.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card hover className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center">
                        <ApperIcon name="Clock" className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.time}
                          </h3>
                          <StatusBadge status={appointment.status} />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <ApperIcon name="User" className="w-4 h-4 text-gray-400" />
                            {getPatientName(appointment.patientId)}
                          </div>
                          <div className="flex items-center gap-2">
                            <ApperIcon name="UserCog" className="w-4 h-4 text-gray-400" />
                            {getDoctorName(appointment.doctorId)}
                          </div>
                        </div>

                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">
                            {appointment.reason}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-500 mt-1">
                              {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {appointment.status === "scheduled" && (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.Id, "in-progress")}
                        >
                          Start
                        </Button>
                      )}
                      
                      {appointment.status === "in-progress" && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.Id, "completed")}
                        >
                          Complete
                        </Button>
                      )}
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onAppointmentSelect(appointment)}
                      >
                        <ApperIcon name="Eye" className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;