import { AppShell } from "@/components/app-shell";
import { CourseRoom } from "@/components/learning-workspace";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <AppShell><CourseRoom courseId={courseId} /></AppShell>;
}
