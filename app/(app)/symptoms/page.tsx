"use client";

import * as React from "react";
import { Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { RiskLevelLegend } from "@/components/RiskLevelLegend";
import { SymptomAssessmentForm } from "@/components/SymptomAssessmentForm";
import { AssessmentResultCard } from "@/components/AssessmentResultCard";
import { RecentAssessments } from "@/components/RecentAssessments";
import { requestSymptomAssessment } from "@/lib/symptom-assessment-service";
import { useAssessmentHistory } from "@/lib/assessment-history";
import { useHealthProfile } from "@/lib/health-profile-context";
import type { StructuredSymptomInput, SymptomAssessmentResult } from "@/types/assessment";

export default function SymptomsPage() {
  const { profile } = useHealthProfile();
  const { records, addRecord } = useAssessmentHistory();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<SymptomAssessmentResult | null>(null);
  const [profileConsidered, setProfileConsidered] = React.useState<string[]>([]);
  const resultRef = React.useRef<HTMLDivElement>(null);

  async function handleSubmit(symptomText: string, structured: StructuredSymptomInput) {
    setIsLoading(true);
    setResult(null);

    const considered: string[] = [];
    if (profile.personalInfo.age !== null) considered.push("age");
    if (profile.medicalInfo.allergies.length) considered.push("allergies");
    if (profile.medicalInfo.conditions.length) considered.push("existing conditions");
    if (profile.medications.length) considered.push("current medications");

    const assessment = await requestSymptomAssessment({
      symptomText,
      structured,
      profileContext: {
        age: profile.personalInfo.age,
        allergies: profile.medicalInfo.allergies,
        conditions: profile.medicalInfo.conditions,
        medications: profile.medications.map((m) => m.name),
      },
    });

    setResult(assessment);
    setProfileConsidered(considered);
    addRecord({
      symptomText,
      structured,
      riskLevel: assessment.risk.riskLevel,
      summary: assessment.content.summary,
    });
    setIsLoading(false);

    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleReassess() {
    setResult(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Stethoscope}
        title="AI Symptom Assessment"
        description="Describe how you're feeling and Medix will help you understand what to do next."
      />

      <RiskLevelLegend />

      <SymptomAssessmentForm onSubmit={handleSubmit} isLoading={isLoading} />

      {result && (
        <div ref={resultRef} className="scroll-mt-6 animate-fade-up">
          <AssessmentResultCard result={result} profileConsidered={profileConsidered} onReassess={handleReassess} />
        </div>
      )}

      <RecentAssessments records={records} />
    </div>
  );
}
