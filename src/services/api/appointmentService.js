import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'appointment_c';

export const appointmentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "time_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "Tags" } },
          { 
            field: { Name: "patient_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "doctor_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "department_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching appointments:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "time_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "Tags" } },
          { 
            field: { Name: "patient_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "doctor_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "department_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Appointment not found");
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching appointment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getByDate(date) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "time_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "reason_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "Tags" } },
          { 
            field: { Name: "patient_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "doctor_id_c" },
            referenceField: { field: { Name: "Name" } }
          },
          { 
            field: { Name: "department_id_c" },
            referenceField: { field: { Name: "Name" } }
          }
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [date]
          }
        ],
        orderBy: [
          { fieldName: "time_c", sorttype: "ASC" }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching appointments by date:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getToday() {
    const today = new Date().toISOString().split("T")[0];
    return await this.getByDate(today);
  },

  async create(appointmentData) {
    try {
      const params = {
        records: [{
          Name: appointmentData.name || `Appointment - ${appointmentData.reason || appointmentData.reason_c}`,
          date_c: appointmentData.date || appointmentData.date_c,
          time_c: appointmentData.time || appointmentData.time_c,
          duration_c: parseInt(appointmentData.duration || appointmentData.duration_c || 30),
          reason_c: appointmentData.reason || appointmentData.reason_c,
          notes_c: appointmentData.notes || appointmentData.notes_c || '',
          status_c: "scheduled",
          patient_id_c: parseInt(appointmentData.patientId || appointmentData.patient_id_c),
          doctor_id_c: parseInt(appointmentData.doctorId || appointmentData.doctor_id_c),
          department_id_c: parseInt(appointmentData.departmentId || appointmentData.department_id_c)
        }]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create appointments ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating appointment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, appointmentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: appointmentData.name || appointmentData.Name || `Appointment - ${appointmentData.reason || appointmentData.reason_c}`,
          date_c: appointmentData.date || appointmentData.date_c,
          time_c: appointmentData.time || appointmentData.time_c,
          duration_c: parseInt(appointmentData.duration || appointmentData.duration_c || 30),
          reason_c: appointmentData.reason || appointmentData.reason_c,
          notes_c: appointmentData.notes || appointmentData.notes_c || '',
          status_c: appointmentData.status || appointmentData.status_c,
          patient_id_c: parseInt(appointmentData.patientId || appointmentData.patient_id_c),
          doctor_id_c: parseInt(appointmentData.doctorId || appointmentData.doctor_id_c),
          department_id_c: parseInt(appointmentData.departmentId || appointmentData.department_id_c)
        }]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update appointments ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating appointment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete appointments ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting appointment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update appointment status ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating appointment status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};