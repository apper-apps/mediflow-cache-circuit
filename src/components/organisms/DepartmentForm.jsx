import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import { departmentService } from '@/services/api/departmentService';

const DepartmentForm = ({ department, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: department?.name || '',
    description: department?.description || '',
    head: department?.head || '',
    phone: department?.phone || '',
    email: department?.email || '',
    location: department?.location || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.head.trim()) {
      newErrors.head = 'Department head is required';
    }
    
if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    
    try {
      if (department) {
        await departmentService.update(department.Id, formData);
        toast.success('Department updated successfully!');
      } else {
        await departmentService.create(formData);
        toast.success('Department created successfully!');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {department ? 'Edit Department' : 'Create New Department'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="!p-2"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Department Name"
              value={formData.name}
              onChange={handleChange('name')}
              error={errors.name}
              placeholder="Enter department name"
              required
            />

            <FormField
              label="Department Head"
              value={formData.head}
              onChange={handleChange('head')}
              error={errors.head}
              placeholder="Enter department head name"
              required
            />

            <FormField
              label="Phone"
              value={formData.phone}
              onChange={handleChange('phone')}
              error={errors.phone}
              placeholder="Enter phone number"
            />

            <FormField
              label="Email"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              placeholder="Enter email address"
              type="email"
            />

            <FormField
              label="Location"
              value={formData.location}
              onChange={handleChange('location')}
              error={errors.location}
              placeholder="Enter location"
            />
          </div>

          <FormField
            label="Description"
            value={formData.description}
            onChange={handleChange('description')}
            error={errors.description}
            placeholder="Enter department description"
            type="textarea"
            required
          />

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              <ApperIcon name="Save" className="w-4 h-4" />
              {department ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default DepartmentForm;