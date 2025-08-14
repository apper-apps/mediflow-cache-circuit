import doctors from "../mockData/doctors.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let doctorsData = [...doctors];

export const doctorService = {
  async getAll() {
    await delay(300);
    return [...doctorsData];
  },

  async getById(id) {
    await delay(200);
    const doctor = doctorsData.find(d => d.Id === parseInt(id));
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return { ...doctor };
  },

  async getByDepartment(departmentId) {
    await delay(250);
    return doctorsData.filter(doctor => doctor.departmentId === departmentId);
  },

  async create(doctorData) {
    await delay(400);
    const maxId = Math.max(...doctorsData.map(d => d.Id), 0);
    const newDoctor = {
      ...doctorData,
      Id: maxId + 1
    };
    doctorsData.push(newDoctor);
    return { ...newDoctor };
  },

  async update(id, doctorData) {
    await delay(350);
    const index = doctorsData.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    doctorsData[index] = { ...doctorsData[index], ...doctorData };
    return { ...doctorsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = doctorsData.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Doctor not found");
    }
    doctorsData.splice(index, 1);
    return true;
  }
};