import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { ResumeBuilderStudio } from "@/components/resume-builder/resume-builder-studio";

export const metadata: Metadata = {
  title: "AI Resume Builder — PlacePrep AI",
  description: "Create, polish with AI, and export ATS-friendly placement resumes with multiple templates.",
};

export default function ResumeBuilderPage() {
  return (
    <AppShell>
      <ResumeBuilderStudio />
    </AppShell>
  );
}

