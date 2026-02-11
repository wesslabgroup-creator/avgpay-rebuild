import { generatePageMeta } from "@/lib/meta";
import { Metadata } from "next";

export const metadata: Metadata = {
  ...generatePageMeta({
    title: "Not Found",
    description: "The page you are looking for does not exist.",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="text-center py-24">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-text-secondary mt-4">The page you requested could not be found.</p>
      </div>
    </main>
  );
}
