import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conocimiento del Lab — YOL1",
  robots: { index: false, follow: false },
};

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
