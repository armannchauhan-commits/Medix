"use client";

import * as React from "react";
import type { AssessmentHistoryRecord, StructuredSymptomInput, RiskLevel } from "@/types/assessment";

/**
 * Local persistence for past symptom assessments. Deliberately stores only
 * what's needed to show a history list and reopen a summary — not full AI
 * responses or profile data — matching Step 3's "don't store unnecessary
 * sensitive information" requirement. Shaped so a later step can swap this
 * for a Supabase table with minimal changes (same record shape, keyed by id).
 */

const STORAGE_KEY = "medix:assessment-history:v1";
const MAX_RECORDS = 20;

function generateId(): string {
  return `assess-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function readAll(): AssessmentHistoryRecord[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(records: AssessmentHistoryRecord[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECORDS)));
  } catch {
    // Storage unavailable — history just won't persist across reloads.
  }
}

export function useAssessmentHistory() {
  const [records, setRecords] = React.useState<AssessmentHistoryRecord[]>([]);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setRecords(readAll());
    setIsHydrated(true);
  }, []);

  const addRecord = React.useCallback(
    (entry: { symptomText: string; structured: StructuredSymptomInput; riskLevel: RiskLevel; summary: string }) => {
      const record: AssessmentHistoryRecord = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        ...entry,
      };
      setRecords((prev) => {
        const next = [record, ...prev].slice(0, MAX_RECORDS);
        writeAll(next);
        return next;
      });
      return record;
    },
    []
  );

  const clearHistory = React.useCallback(() => {
    setRecords([]);
    writeAll([]);
  }, []);

  return { records, isHydrated, addRecord, clearHistory };
}
