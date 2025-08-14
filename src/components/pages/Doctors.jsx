import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { doctorService } from "@/services/api/doctorService";
import { departmentService } from "@/services/api/departmentService";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [doctorsData, departmentsData] = await Promise.all([
        doctorService.getAll(),
        departmentService.getAll()
      ]);
      setDoctors(doctorsData);
      setDepartments(departmentsData);
    } catch (err) {
      setError("Failed to load doctors");
      console.error("Error loading doctors:", err);
    } finally {
      setLoading(false);
    }
  };

const getDepartmentName = (departmentId) => {
    if (typeof departmentId === 'object' && departmentId?.Name) {
      return departmentId.Name;
    }
    const department = departments.find(d => d.Id.toString() === departmentId.toString());
    return department?.Name || department?.name || "Unknown Department";
  };

const getAvailabilityStatus = (availability_c) => {
    if (!availability_c) {
      return {
        status: "No Schedule",
        variant: "secondary",
        schedule: null
      };
    }
    
    let availability;
    try {
      availability = typeof availability_c === 'string' ? JSON.parse(availability_c) : availability_c;
    } catch (e) {
      return {
        status: "Schedule Error",
        variant: "secondary", 
        schedule: null
      };
    }
    
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    const todaySchedule = availability[today];
    
    if (todaySchedule && todaySchedule.length > 0) {
      return {
        status: "Available Today",
        variant: "success",
        schedule: todaySchedule.join(", ")
      };
    }
    
    return {
      status: "Not Available Today",
      variant: "secondary",
      schedule: null
    };
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

const filteredDoctors = doctors.filter(doctor => 
    !searchQuery || 
    (doctor.Name || doctor.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doctor.specialization_c || doctor.specialization || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header 
          title="Doctors"
          subtitle="Medical staff directory and information"
        />
        <div className="p-6">
          <Loading type="cards" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header 
          title="Doctors"
          subtitle="Medical staff directory and information"
        />
        <div className="p-6">
          <Error 
            title="Failed to load doctors"
            message={error}
            onRetry={loadData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Doctors"
        subtitle="Medical staff directory and information"
      />
      
      <motion.div 
        className="p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar
            placeholder="Search doctors by name or specialization..."
            onSearch={handleSearch}
            className="w-full sm:w-96"
          />
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {filteredDoctors.length === 0 && searchQuery ? (
          <Empty
            title="No doctors found"
            message={`No doctors match your search for "${searchQuery}". Try adjusting your search terms.`}
            actionLabel="Clear Search"
            onAction={() => handleSearch("")}
            icon="Search"
          />
        ) : filteredDoctors.length === 0 ? (
          <Empty
            title="No doctors registered"
            message="There are no doctors registered in the system yet."
            icon="UserCog"
            showAction={false}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{filteredDoctors.map((doctor, index) => {
              const availability = getAvailabilityStatus(doctor.availability_c || doctor.availability);
              
              return (
                <motion.div
                  key={doctor.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card hover className="p-6 h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success/10 to-green-50 flex items-center justify-center flex-shrink-0">
                          <ApperIcon name="UserCog" className="w-6 h-6 text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {doctor.Name || doctor.name}
                          </h3>
                          <p className="text-primary font-medium text-sm">
                            {doctor.specialization_c || doctor.specialization}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {getDepartmentName(doctor.department_id_c || doctor.departmentId)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{doctor.phone_c || doctor.phone}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 truncate">{doctor.email_c || doctor.email}</span>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              availability.variant === "success"
                                ? "bg-success/10 text-success"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              <ApperIcon 
                                name={availability.variant === "success" ? "CheckCircle" : "Clock"} 
                                className="w-3 h-3 mr-1" 
                              />
                              {availability.status}
                            </span>
                          </div>
                          
                          {availability.schedule && (
                            <p className="text-xs text-gray-500 mt-1">
                              {availability.schedule}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Doctors;