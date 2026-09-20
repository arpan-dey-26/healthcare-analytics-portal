import { fetchPatients, findPatientByName } from "./api.js";
import { renderDashboard, showError } from "./render.js";

const PATIENT_NAME = "Jessica Taylor";
const UNEXPECTED_ERROR_MESSAGE = "Something went wrong while loading the dashboard.";

async function startDashboard() {
  let patient;
  let patients;

  try {
    patients = await fetchPatients();
    patient = findPatientByName(patients, PATIENT_NAME);
  } catch (error) {
    showError(error.message);
    return;
  }

  try {
    renderDashboard(patient, patients);
  } catch {
    showError(UNEXPECTED_ERROR_MESSAGE);
  }
}

startDashboard();