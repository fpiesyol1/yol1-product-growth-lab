import type { Metadata } from "next";

import { DesignPreview } from "./preview";

export const metadata: Metadata = {
  title: "YOL1 — Mockup del design system",
  description: "Tres pantallas conectadas para evaluar la próxima expresión visual de YOL1.",
};

export default function DesignPreviewPage() {
  return <DesignPreview />;
}
