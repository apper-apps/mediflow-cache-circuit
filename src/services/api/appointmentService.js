import appointments from "../mockData/appointments.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let appointmentsData = [...appointments];

export const appointmentService = {
  async getAll() {
    await delay(300);
    return [...appointmentsData];
  },

  async getById(id) {
    await delay(200);
    const appointment = appointmentsData.find(a => a.Id === parseInt(id));
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return { ...appointment };
  },

  async getByDate(date) {
    await delay(250);
    return appointmentsData.filter(appointment => appointment.date === date);
  },

  async getToday() {
    await delay(250);
    const today = new Date().toISOString().split("T")[0];
    return appointmentsData.filter(appointment => appointment.date === today);
  },

  async create(appointmentData) {
    await delay(400);
    const maxId = Math.max(...appointmentsData.map(a => a.Id), 0);
    const newAppointment = {
      ...appointmentData,
      Id: maxId + 1,
      status: "scheduled"
    };
    appointmentsData.push(newAppointment);
    return { ...newAppointment };
  },

  async update(id, appointmentData) {
    await delay(350);
    const index = appointmentsData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    appointmentsData[index] = { ...appointmentsData[index], ...appointmentData };
    return { ...appointmentsData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = appointmentsData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    appointmentsData.splice(index, 1);
    return true;
  },

  async updateStatus(id, status) {
    await delay(200);
    const index = appointmentsData.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    appointmentsData[index].status = status;
    return { ...appointmentsData[index] };
  }
};