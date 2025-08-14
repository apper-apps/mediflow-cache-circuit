import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { departmentService } from "@/services/api/departmentService";
import { doctorService } from "@/services/api/doctorService";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [departmentsData, doctorsData] = await Promise.all([
        departmentService.getAll(),
        doctorService.getAll()
      ]);
      setDepartments(departmentsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError("Failed to load departments");
      console.error("Error loading departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDoctorCount = (departmentId) => {
    return doctors.filter(doctor => doctor.departmentId === departmentId.toString()).length;
  };

  const getDepartmentDoctors = (departmentId) => {
    return doctors.filter(doctor => doctor.departmentId === departmentId.toString());
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header 
          title="Departments"
          subtitle="Hospital departments and medical specialties"
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
          title="Departments"
          subtitle="Hospital departments and medical specialties"
        />
        <div className="p-6">
          <Error 
            title="Failed to load departments"
            message={error}
            onRetry={loadData}
          />
        </div>
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="min-h-screen">
        <Header 
          title="Departments"
          subtitle="Hospital departments and medical specialties"
        />
        <div className="p-6">
          <Empty
            title="No departments found"
            message="There are no departments registered in the system yet."
            icon="Building2"
            showAction={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Departments"
        subtitle="Hospital departments and medical specialties"
      />
      
      <motion.div 
        className="p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-sm text-gray-600 mb-6">
          {departments.length} department{departments.length !== 1 ? "s" : ""} • {doctors.length} total doctor{doctors.length !== 1 ? "s" : ""}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department, index) => {
            const departmentDoctors = getDepartmentDoctors(department.Id);
            const doctorCount = departmentDoctors.length;
            
            return (
              <motion.div
                key={department.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card hover className="p-6 h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/10 to-cyan-50 flex items-center justify-center flex-shrink-0">
                        <ApperIcon name="Building2" className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {department.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {department.floor}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <ApperIcon name="UserCog" className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Head: {department.head}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{department.contactNumber}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <ApperIcon name="Users" className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {doctorCount} doctor{doctorCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {departmentDoctors.length > 0 && (
                        <div className="pt-4 border-t border-gray-100">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Medical Staff:</h4>
                          <div className="space-y-1">
                            {departmentDoctors.map((doctor) => (
                              <div key={doctor.Id} className="text-sm text-gray-600">
                                <span className="font-medium">{doctor.name}</span>
                                <span className="text-gray-500"> - {doctor.specialization}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Departments;