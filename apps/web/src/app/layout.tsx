import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PANOKIT — Initialisation technique",
  description: "Prototype technique de la plateforme PANOKIT.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
