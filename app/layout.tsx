import type { Metadata } from "next";
import "./globals.css";
import "./profile-menu.css";
import "@/components/dashboard-ui.css";
import "@/components/interview-prep.css";

export const metadata: Metadata = {
  title: "PlacePrep AI — Your placement journey, made clearer",
  description: "A focused workspace for placement preparation, learning, and progress.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
