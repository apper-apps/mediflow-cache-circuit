import departments from "../mockData/departments.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let departmentsData = [...departments];

export const departmentService = {
  async getAll() {
    await delay(300);
    return [...departmentsData];
  },

  async getById(id) {
    await delay(200);
    const department = departmentsData.find(d => d.Id === parseInt(id));
    if (!department) {
      throw new Error("Department not found");
    }
    return { ...department };
  },

  async create(departmentData) {
    await delay(400);
    const maxId = Math.max(...departmentsData.map(d => d.Id), 0);
    const newDepartment = {
      ...departmentData,
      Id: maxId + 1
    };
    departmentsData.push(newDepartment);
    return { ...newDepartment };
  },

  async update(id, departmentData) {
    await delay(350);
    const index = departmentsData.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    departmentsData[index] = { ...departmentsData[index], ...departmentData };
    return { ...departmentsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = departmentsData.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    departmentsData.splice(index, 1);
    return true;
  }
};