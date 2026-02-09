import { generatePageMeta } from "@/lib/meta";
import Head from "next/head";

export const metadata = generatePageMeta({
  title: "Not Found",
  description: "The page you are looking for does not exist.",
});

export default function NotFound() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="text-center py-24">
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="text-slate-400 mt-4">The page you requested could not be found.</p>
        </div>
      </main>
    </>
  );
}
