import { AppShell } from "@/components/app-shell";
import { MockTestRunner } from "@/components/mock-test-hub";

export default async function MockTestDetailPage({
  params,
}: {
  params: Promise<{ mockId: string }>;
}) {
  const { mockId } = await params;
  return (
    <AppShell>
      <MockTestRunner mockId={mockId} />
    </AppShell>
  );
}

