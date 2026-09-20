import { renderBloodPressureChart } from "./chart.js";
import {
  formatDateOfBirth,
  formatGenderAndAge,
  formatInitials,
  getBloodPressureHistory,
  getLatestDiagnosis,
  getLevelIndicator,
} from "./format.js";

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function cloneTemplate(templateId) {
  return document.getElementById(templateId).content.firstElementChild.cloneNode(true);
}

function applyAvatar(container, patient) {
  const image = container.querySelector(".avatar__image");

  container.querySelector(".avatar__initials").textContent = formatInitials(patient.name);

  if (!patient.profile_picture) {
    image.remove();
    return;
  }

  image.addEventListener("error", () => image.remove(), { once: true });
  image.src = patient.profile_picture;
}

function setReading(name, reading) {
  setText(`${name}-value`, reading.value);
  setText(`${name}-indicator`, getLevelIndicator(reading.levels));
  setText(`${name}-level`, reading.levels);
}

function renderPatientList(patients, activePatientName) {
  const items = patients.map((patient) => {
    const item = cloneTemplate("patient-template");

    applyAvatar(item.querySelector(".avatar"), patient);
    item.querySelector(".patient__name").textContent = patient.name;
    item.querySelector(".patient__meta").textContent = formatGenderAndAge(patient);
    item
      .querySelector(".patient__options")
      .setAttribute("aria-label", `Options for ${patient.name}`);

    if (patient.name === activePatientName) {
      item.classList.add("patient--active");
      item.setAttribute("aria-current", "true");
    }

    return item;
  });

  document.getElementById("patient-list").replaceChildren(...items);
}

function renderPatientProfile(patient) {
  applyAvatar(document.getElementById("profile-avatar"), patient);

  setText("profile-name", patient.name);
  setText("profile-date-of-birth", formatDateOfBirth(patient.date_of_birth));
  setText("profile-gender", patient.gender);
  setText("profile-phone", patient.phone_number);
  setText("profile-emergency-contact", patient.emergency_contact);
  setText("profile-insurance", patient.insurance_type);
}

function renderBloodPressureTable(bloodPressureHistory) {
  const rows = bloodPressureHistory.map((reading) => {
    const row = cloneTemplate("blood-pressure-row-template");
    const [month, systolic, diastolic] = row.children;

    month.textContent = reading.label;
    systolic.textContent = reading.systolic;
    diastolic.textContent = reading.diastolic;

    return row;
  });

  document.getElementById("blood-pressure-rows").replaceChildren(...rows);
}

function renderDiagnosis(diagnosisHistory) {
  const hasHistory = diagnosisHistory.length > 0;

  document.getElementById("diagnosis-details").hidden = !hasHistory;
  document.getElementById("diagnosis-empty").hidden = hasHistory;

  if (!hasHistory) {
    return;
  }

  const latestDiagnosis = getLatestDiagnosis(diagnosisHistory);
  const bloodPressureHistory = getBloodPressureHistory(diagnosisHistory);

  setReading("systolic", latestDiagnosis.blood_pressure.systolic);
  setReading("diastolic", latestDiagnosis.blood_pressure.diastolic);
  setReading("respiratory", latestDiagnosis.respiratory_rate);
  setReading("temperature", latestDiagnosis.temperature);
  setReading("heart-rate", latestDiagnosis.heart_rate);

  renderBloodPressureTable(bloodPressureHistory);
  renderBloodPressureChart(bloodPressureHistory);
}

function renderDiagnosticList(diagnosticList) {
  const rows = diagnosticList.map((diagnostic) => {
    const row = cloneTemplate("diagnostic-row-template");

    row.querySelector(".diagnostic__problem").textContent = diagnostic.name ?? "";
    row.querySelector(".diagnostic__description").textContent = diagnostic.description ?? "";
    row.querySelector(".diagnostic__status").textContent = diagnostic.status ?? "";

    return row;
  });

  document.getElementById("diagnostic-rows").replaceChildren(...rows);
  document.getElementById("diagnostic-table").hidden = rows.length === 0;
  document.getElementById("diagnostic-empty").hidden = rows.length > 0;
}

function renderLabResults(labResults) {
  const items = labResults.map((labResult) => {
    const item = cloneTemplate("lab-result-template");

    item.querySelector(".lab-result__name").textContent = labResult;
    item
      .querySelector(".lab-result__download")
      .setAttribute("aria-label", `Download ${labResult}`);

    return item;
  });

  document.getElementById("lab-result-list").replaceChildren(...items);
  document.getElementById("lab-results-empty").hidden = items.length > 0;
}

export function renderDashboard(patient, patients) {
  document.getElementById("app-status").hidden = true;
  document.getElementById("dashboard").hidden = false;

  renderPatientList(patients, patient.name);
  renderPatientProfile(patient);
  renderDiagnosis(patient.diagnosis_history ?? []);
  renderDiagnosticList(patient.diagnostic_list ?? []);
  renderLabResults(patient.lab_results ?? []);
}

export function showError(message) {
  const status = document.getElementById("app-status");

  status.textContent = message;
  status.hidden = false;
  document.getElementById("dashboard").hidden = true;
}
