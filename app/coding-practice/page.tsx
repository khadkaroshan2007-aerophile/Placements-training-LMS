import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { CodingPracticeHub } from "@/components/coding-practice-hub";

export const metadata: Metadata = {
  title: "Coding Practice — PlacePrep AI",
  description: "Solve placement coding questions in Python, Java, C++, and JavaScript with automated test runner.",
};

export default function CodingPracticePage() {
  return (
    <AppShell>
      <CodingPracticeHub />
    </AppShell>
  );
}

