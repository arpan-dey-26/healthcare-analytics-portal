const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const LEVEL_INDICATORS = {
  "Higher than Average": "▲",
  "Lower than Average": "▼",
};

const CHART_MONTH_COUNT = 6;

/* The API mixes MM/DD/YYYY and YYYY-MM-DD. Date parses the second form as UTC,
   which can shift the day backwards for viewers west of Greenwich. */
function parsePatientDate(value) {
  const monthFirst = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);

  if (monthFirst) {
    return {
      year: Number(monthFirst[3]),
      month: Number(monthFirst[1]),
      day: Number(monthFirst[2]),
    };
  }

  const yearFirst = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);

  if (yearFirst) {
    return {
      year: Number(yearFirst[1]),
      month: Number(yearFirst[2]),
      day: Number(yearFirst[3]),
    };
  }

  return null;
}

export function formatDateOfBirth(dateOfBirth) {
  const date = parsePatientDate(dateOfBirth);

  if (!date) {
    return "";
  }

  return `${MONTH_NAMES[date.month - 1]} ${date.day}, ${date.year}`;
}

export function formatGenderAndAge(patient) {
  return [patient.gender, patient.age].filter(Boolean).join(", ");
}

export function formatInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function getLevelIndicator(levels) {
  return LEVEL_INDICATORS[levels] ?? "";
}

/* diagnosis_history arrives newest first. */
export function getLatestDiagnosis(diagnosisHistory) {
  return diagnosisHistory[0];
}

export function getBloodPressureHistory(diagnosisHistory) {
  return diagnosisHistory
    .slice(0, CHART_MONTH_COUNT)
    .reverse()
    .map((entry) => ({
      label: `${entry.month.slice(0, 3)}, ${entry.year}`,
      systolic: entry.blood_pressure.systolic.value,
      diastolic: entry.blood_pressure.diastolic.value,
    }));
}