import { AppShell } from "@/components/app-shell";
import { AssessmentRunner } from "@/components/learning-workspace";

export default async function AssessmentPage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  return <AppShell><AssessmentRunner assessmentId={assessmentId} /></AppShell>;
}
