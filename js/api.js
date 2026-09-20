const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";
const API_USERNAME = "coalition";
const API_PASSWORD = "skills-test";

export async function fetchPatients() {
  let response;

  try {
    response = await fetch(API_URL, {
      headers: {
        Authorization: `Basic ${btoa(`${API_USERNAME}:${API_PASSWORD}`)}`,
      },
    });
  } catch (cause) {
    throw new Error("Could not reach the patient data service.", { cause });
  }

  if (response.status === 401) {
    throw new Error("The patient data service rejected the credentials.");
  }

  if (!response.ok) {
    throw new Error(
      `The patient data service responded with status ${response.status}.`
    );
  }

  let patients;

  try {
    patients = await response.json();
  } catch (cause) {
    throw new Error("The patient data service returned invalid JSON.", { cause });
  }

  if (!Array.isArray(patients)) {
    throw new Error("The patient data service returned an unexpected format.");
  }

  return patients;
}

export function findPatientByName(patients, name) {
  const patient = patients.find((candidate) => candidate.name === name);

  if (!patient) {
    throw new Error(`No patient record was found for ${name}.`);
  }

  return patient;
}