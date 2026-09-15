/* store — 실험 기록 저장. 개인 식별 정보 없이 실험 기록만.
   저장 불가 시 현재 세션 메모리 + JSON 내보내기를 제공한다. */

export interface ExperimentRecord {
  schemaVersion: 1;
  appId: 'unknown-script-lab';
  createdAt: string;
  scenarioId: string;
  parameters: Record<string, unknown>;
  seed: string;
  observations: string[];
  prediction: string;
  explanation: string;
}

const KEY = 'unknown-script-lab/records/v1';

let memoryFallback: ExperimentRecord[] = [];
let storageOK = true;

function readAll(): ExperimentRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [...memoryFallback];
    const parsed = JSON.parse(raw) as ExperimentRecord[];
    return Array.isArray(parsed) ? parsed : [...memoryFallback];
  } catch {
    storageOK = false;
    return [...memoryFallback];
  }
}

export function isStorageAvailable(): boolean {
  return storageOK;
}

export function saveRecord(r: ExperimentRecord): void {
  memoryFallback = [...memoryFallback.filter((x) => x.createdAt !== r.createdAt), r];
  try {
    localStorage.setItem(KEY, JSON.stringify(memoryFallback));
  } catch {
    storageOK = false;
  }
}

export function loadRecords(): ExperimentRecord[] {
  return readAll();
}

export function exportRecordsJSON(): string {
  return JSON.stringify(readAll(), null, 2);
}

export function makeRecord(
  scenarioId: string,
  parameters: Record<string, unknown>,
  fields: Pick<ExperimentRecord, 'observations' | 'prediction' | 'explanation'>,
): ExperimentRecord {
  return {
    schemaVersion: 1,
    appId: 'unknown-script-lab',
    createdAt: new Date().toISOString(),
    scenarioId,
    parameters,
    seed: 'p0-deterministic',
    ...fields,
  };
}
