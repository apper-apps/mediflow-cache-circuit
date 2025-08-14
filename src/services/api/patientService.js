import patients from "../mockData/patients.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let patientsData = [...patients];

export const patientService = {
  async getAll() {
    await delay(300);
    return [...patientsData];
  },

  async getById(id) {
    await delay(200);
    const patient = patientsData.find(p => p.Id === parseInt(id));
    if (!patient) {
      throw new Error("Patient not found");
    }
    return { ...patient };
  },

  async create(patientData) {
    await delay(400);
    const maxId = Math.max(...patientsData.map(p => p.Id), 0);
    const newPatient = {
      ...patientData,
      Id: maxId + 1,
      registrationDate: new Date().toISOString().split("T")[0]
    };
    patientsData.push(newPatient);
    return { ...newPatient };
  },

  async update(id, patientData) {
    await delay(350);
    const index = patientsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    patientsData[index] = { ...patientsData[index], ...patientData };
    return { ...patientsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = patientsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    patientsData.splice(index, 1);
    return true;
  },

  async search(query) {
    await delay(200);
    if (!query.trim()) {
      return [...patientsData];
    }
    
    const searchTerm = query.toLowerCase();
    return patientsData.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm)
    );
  }
};