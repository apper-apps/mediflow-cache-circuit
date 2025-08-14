import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { patientService } from "@/services/api/patientService";

const PatientForm = ({ patient, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: patient?.name || "",
    dateOfBirth: patient?.dateOfBirth || "",
    gender: patient?.gender || "",
    phone: patient?.phone || "",
    email: patient?.email || "",
    address: patient?.address || "",
    emergencyContact: patient?.emergencyContact || "",
    bloodType: patient?.bloodType || "",
    allergies: patient?.allergies?.join(", ") || ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !formData.email.includes("@")) newErrors.email = "Valid email is required";

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
      
      const submitData = {
        ...formData,
        allergies: formData.allergies
          ? formData.allergies.split(",").map(a => a.trim()).filter(a => a)
          : []
      };

      if (patient) {
        await patientService.update(patient.Id, submitData);
        toast.success("Patient updated successfully");
      } else {
        await patientService.create(submitData);
        toast.success("Patient registered successfully");
      }

      onSuccess?.();
    } catch (err) {
      toast.error(patient ? "Failed to update patient" : "Failed to register patient");
      console.error("Error saving patient:", err);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center">
            <ApperIcon name="UserPlus" className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {patient ? "Update Patient" : "Register New Patient"}
            </h2>
            <p className="text-gray-600 text-sm">
              {patient ? "Update patient information" : "Enter patient details to register them in the system"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Full Name"
              value={formData.name}
              onChange={handleChange("name")}
              error={errors.name}
              required
              placeholder="Enter patient's full name"
            />

            <FormField
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange("dateOfBirth")}
              error={errors.dateOfBirth}
              required
            />

            <FormField
              label="Gender"
              type="select"
              value={formData.gender}
              onChange={handleChange("gender")}
              error={errors.gender}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </FormField>

            <FormField
              label="Blood Type"
              type="select"
              value={formData.bloodType}
              onChange={handleChange("bloodType")}
              error={errors.bloodType}
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </FormField>

            <FormField
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={handleChange("phone")}
              error={errors.phone}
              required
              placeholder="(555) 123-4567"
            />

            <FormField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              error={errors.email}
              required
              placeholder="patient@example.com"
            />
          </div>

          <FormField
            label="Address"
            value={formData.address}
            onChange={handleChange("address")}
            error={errors.address}
            placeholder="Enter complete address"
          />

          <FormField
            label="Emergency Contact"
            value={formData.emergencyContact}
            onChange={handleChange("emergencyContact")}
            error={errors.emergencyContact}
            placeholder="Name - Phone Number"
          />

          <FormField
            label="Allergies"
            value={formData.allergies}
            onChange={handleChange("allergies")}
            error={errors.allergies}
            placeholder="Enter allergies separated by commas (e.g., Penicillin, Peanuts)"
          />

          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  {patient ? "Updating..." : "Registering..."}
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  {patient ? "Update Patient" : "Register Patient"}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              <ApperIcon name="X" className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default PatientForm;