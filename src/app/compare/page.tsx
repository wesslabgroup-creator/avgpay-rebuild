import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COMPANIES, LOCATIONS, ROLES } from "@/lib/data";
import { slugifyEntityName } from "@/lib/comparison";

function firstPair(values: string[]) {
  if (values.length < 2) return null;
  return `${slugifyEntityName(values[0])}-vs-${slugifyEntityName(values[1])}`;
}

export default function CompareLandingPage() {
  const rolePair = firstPair(ROLES);
  const companyPair = firstPair(COMPANIES);
  const locationPair = firstPair(LOCATIONS);

  const links = [
    rolePair ? { label: "Role vs Role comparison", href: `/compare/${rolePair}` } : null,
    companyPair ? { label: "Company vs Company comparison", href: `/compare/${companyPair}` } : null,
    locationPair ? { label: "Location vs Location comparison", href: `/compare/${locationPair}` } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Salary comparison pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-slate-700">
            <p>Explore side-by-side salary comparisons for roles, companies, and locations.</p>
            <ul className="list-disc space-y-1 pl-5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-emerald-700 hover:underline">{link.label}</Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
