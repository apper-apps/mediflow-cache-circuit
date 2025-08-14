import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'patient_c';

export const patientService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "blood_type_c" } },
          { field: { Name: "allergies_c" } },
          { field: { Name: "registration_date_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
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
        console.error("Error fetching patients:", error?.response?.data?.message);
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
          { field: { Name: "phone_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "blood_type_c" } },
          { field: { Name: "allergies_c" } },
          { field: { Name: "registration_date_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Patient not found");
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching patient with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async create(patientData) {
    try {
      const params = {
        records: [{
          Name: patientData.name || patientData.Name,
          phone_c: patientData.phone,
          email_c: patientData.email,
          date_of_birth_c: patientData.dateOfBirth || patientData.date_of_birth_c,
          blood_type_c: patientData.bloodType || patientData.blood_type_c,
          allergies_c: Array.isArray(patientData.allergies) ? patientData.allergies.join(',') : patientData.allergies || '',
          registration_date_c: new Date().toISOString().split("T")[0]
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
          console.error(`Failed to create patients ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating patient:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async update(id, patientData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: patientData.name || patientData.Name,
          phone_c: patientData.phone,
          email_c: patientData.email,
          date_of_birth_c: patientData.dateOfBirth || patientData.date_of_birth_c,
          blood_type_c: patientData.bloodType || patientData.blood_type_c,
          allergies_c: Array.isArray(patientData.allergies) ? patientData.allergies.join(',') : patientData.allergies || ''
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
          console.error(`Failed to update patients ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating patient:", error?.response?.data?.message);
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
          console.error(`Failed to delete patients ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting patient:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async search(query) {
    try {
      if (!query.trim()) {
        return await this.getAll();
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "date_of_birth_c" } },
          { field: { Name: "blood_type_c" } },
          { field: { Name: "allergies_c" } },
          { field: { Name: "registration_date_c" } },
          { field: { Name: "Tags" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: ""
              },
              {
                conditions: [
                  {
                    fieldName: "phone_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: ""
              },
              {
                conditions: [
                  {
                    fieldName: "email_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: ""
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching patients:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};