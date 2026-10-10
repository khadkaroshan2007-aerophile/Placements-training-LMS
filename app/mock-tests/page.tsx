import { AppShell } from "@/components/app-shell";
import { MockTestCatalogue } from "@/components/mock-test-hub";

export default function MockTestsPage() {
  return (
    <AppShell>
      <MockTestCatalogue />
    </AppShell>
  );
}

