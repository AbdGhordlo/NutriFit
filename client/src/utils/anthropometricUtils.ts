// Anthropometric measurement calculation and merging utilities
// Types
type Measurement = { value: number; date: string; unit: string };

// Find the closest measurement within a window (in ms)
function findClosestInWindow(
  arr: Measurement[],
  targetDate: Date,
  windowMs: number
): Measurement | null {
  let closest: Measurement | null = null;
  let minDiff = windowMs + 1;
  for (const entry of arr) {
    const diff = Math.abs(new Date(entry.date).getTime() - targetDate.getTime());
    if (diff <= windowMs && diff < minDiff) {
      closest = entry;
      minDiff = diff;
    }
  }
  return closest;
}

// Find the latest measurement up to a date
function findLatestUpTo(
  arr: Measurement[],
  targetDate: Date
): Measurement | null {
  let latest: Measurement | null = null;
  for (const entry of arr) {
    if (new Date(entry.date) <= targetDate) {
      if (!latest || new Date(entry.date) > new Date(latest.date)) {
        latest = entry;
      }
    }
  }
  return latest;
}

// Generate waist/hip ratio history
export function getWaistToHipRatioHistory(
  waistHistory: Measurement[],
  hipHistory: Measurement[]
): Measurement[] {
  if (!waistHistory || !hipHistory) return [];
  const sortedWaist = [...waistHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const sortedHip = [...hipHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let hipIdx = 0;
  const result: Measurement[] = [];
  for (let i = 0; i < sortedWaist.length; i++) {
    const waistEntry = sortedWaist[i];
    while (
      hipIdx < sortedHip.length - 1 &&
      new Date(sortedHip[hipIdx + 1].date) <= new Date(waistEntry.date)
    ) {
      hipIdx++;
    }
    const hipEntry = sortedHip[hipIdx];
    if (hipEntry && hipEntry.value > 0) {
      result.push({
        value: parseFloat((waistEntry.value / hipEntry.value).toFixed(2)),
        date: waistEntry.date,
        unit: "ratio",
      });
    }
  }
  return result;
}

// Generate BMI history
export function getBMIHistory(
  weightHistory: Measurement[],
  heightHistory: Measurement[]
): Measurement[] {
  if (!weightHistory || !heightHistory) return [];
  const sortedWeight = [...weightHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const sortedHeight = [...heightHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let heightIdx = 0;
  const result: Measurement[] = [];
  for (let i = 0; i < sortedWeight.length; i++) {
    const weightEntry = sortedWeight[i];
    while (
      heightIdx < sortedHeight.length - 1 &&
      new Date(sortedHeight[heightIdx + 1].date) <= new Date(weightEntry.date)
    ) {
      heightIdx++;
    }
    const heightEntry = sortedHeight[heightIdx];
    if (heightEntry && heightEntry.value > 0) {
      const heightInMeters = heightEntry.value / 100;
      const bmi = weightEntry.value / (heightInMeters * heightInMeters);
      result.push({
        value: parseFloat(bmi.toFixed(1)),
        date: weightEntry.date,
        unit: "kg/m²",
      });
    }
  }
  return result;
}

// Generate merged fat mass history (fetched + derived)
export function getMergedFatMassHistory(
  fatMassHistory: Measurement[] = [],
  leanMassHistory: Measurement[] = [],
  weightHistory: Measurement[] = []
): Measurement[] {
  const MS_2WEEKS = 14 * 24 * 60 * 60 * 1000;
  const allDates = [
    ...fatMassHistory.map((e) => e.date),
    ...leanMassHistory.map((e) => e.date),
  ];
  const uniqueDates = Array.from(new Set(allDates)).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const result: Measurement[] = [];
  for (const dateStr of uniqueDates) {
    const date = new Date(dateStr);
    const fetched = findClosestInWindow(fatMassHistory, date, MS_2WEEKS);
    if (fetched) {
      result.push({ value: fetched.value, date: dateStr, unit: fetched.unit });
      continue;
    }
    const lean = findClosestInWindow(leanMassHistory, date, MS_2WEEKS);
    const weight = findLatestUpTo(weightHistory, date);
    if (lean && weight) {
      const derivedValue = weight.value - lean.value;
      result.push({ value: parseFloat(derivedValue.toFixed(1)), date: dateStr, unit: weight.unit });
    }
  }
  return result;
}

// Generate merged lean mass history (fetched + derived)
export function getMergedLeanMassHistory(
  leanMassHistory: Measurement[] = [],
  fatMassHistory: Measurement[] = [],
  weightHistory: Measurement[] = []
): Measurement[] {
  const MS_2WEEKS = 14 * 24 * 60 * 60 * 1000;
  const allDates = [
    ...leanMassHistory.map((e) => e.date),
    ...fatMassHistory.map((e) => e.date),
  ];
  const uniqueDates = Array.from(new Set(allDates)).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const result: Measurement[] = [];
  for (const dateStr of uniqueDates) {
    const date = new Date(dateStr);
    const fetched = findClosestInWindow(leanMassHistory, date, MS_2WEEKS);
    if (fetched) {
      result.push({ value: fetched.value, date: dateStr, unit: fetched.unit });
      continue;
    }
    const fat = findClosestInWindow(fatMassHistory, date, MS_2WEEKS);
    const weight = findLatestUpTo(weightHistory, date);
    if (fat && weight) {
      const derivedValue = weight.value - fat.value;
      result.push({ value: parseFloat(derivedValue.toFixed(1)), date: dateStr, unit: weight.unit });
    }
  }
  return result;
}
