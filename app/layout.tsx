import type { Metadata } from "next";
import "./globals.css";
import "./profile-menu.css";
import "@/components/dashboard-ui.css";
import "@/components/interview-prep.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "PlacePrep AI — Your placement journey, made clearer",
  description: "A focused workspace for placement preparation, learning, and progress.",
};

const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('placeprep-theme');
      var isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches) || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      var theme = isDark ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      document.documentElement.style.colorScheme = theme;
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
