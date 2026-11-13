import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PANOKIT | Enseignes et signalétique en kit",
  description: "Découvrez les enseignes, drapeaux, signalétiques et supports de communication PANOKIT : une sélection de solutions en kit à personnaliser.",
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
