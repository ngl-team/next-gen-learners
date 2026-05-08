import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shared Todos — NGL",
  robots: { index: false, follow: false },
};

export default function TodosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
