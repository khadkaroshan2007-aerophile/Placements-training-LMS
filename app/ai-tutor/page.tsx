import { AppShell } from "@/components/app-shell";
import { AiTutorHub } from "@/components/ai-tutor-hub";

export const metadata = {
  title: "AI Placement Tutor | PlacePrep AI",
  description: "24/7 interactive technical mentor and placement tutor powered by Gemini AI.",
};

export default function AiTutorPage() {
  return (
    <AppShell>
      <AiTutorHub />
    </AppShell>
  );
}

