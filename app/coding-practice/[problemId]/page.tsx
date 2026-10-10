import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CodeEditorStudio } from "@/components/code-editor-studio";
import { codingProblems } from "@/lib/coding-problems-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ problemId: string }>;
}): Promise<Metadata> {
  const { problemId } = await params;
  const problem = codingProblems.find(
    (p) => p.slug === problemId || p.id === problemId
  );
  if (!problem) return { title: "Problem Not Found — PlacePrep AI" };

  return {
    title: `${problem.title} — Coding Practice — PlacePrep AI`,
    description: `Solve ${problem.title} in Python, Java, C++, or JavaScript.`,
  };
}

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = await params;
  const problem = codingProblems.find(
    (p) => p.slug === problemId || p.id === problemId
  );

  if (!problem) {
    notFound();
  }

  return (
    <AppShell>
      <CodeEditorStudio problem={problem} />
    </AppShell>
  );
}
