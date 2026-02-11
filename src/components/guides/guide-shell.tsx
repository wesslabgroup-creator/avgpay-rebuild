import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExpandableFAQ } from "@/components/ExpandableFAQ";
import { Breadcrumbs } from "@/components/breadcrumbs";

type GuideIconCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName: string;
};

type GuideHeroProps = {
  title: string;
  description: string;
  learnIcon: LucideIcon;
  learnItems: string[];
  summaryIcon: LucideIcon;
  summary: string;
};

type KeyTakeaway = GuideIconCardProps;

type GuideKeyTakeawaysProps = {
  title: string;
  takeaways: KeyTakeaway[];
};

type GuideFaq = {
  question: string;
  answer: string;
};

type GuideFaqSectionProps = {
  faqs: GuideFaq[];
};

type GuideCtaSectionProps = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

type GuideFooterLinksProps = {
  currentGuide: string;
};

type ResourceLink = {
  label: string;
  href: string;
  description: string;
};

type GuideResourceLinksProps = {
  title?: string;
  description?: string;
  links: ResourceLink[];
};

const GuideIconCard = ({ icon: Icon, title, description, iconClassName }: GuideIconCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="mb-3 flex items-center">
        <Icon className={`mr-2 h-6 w-6 ${iconClassName}`} />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-700">{description}</p>
    </CardContent>
  </Card>
);

export const GuideHero = ({
  title,
  description,
  learnIcon,
  learnItems,
  summaryIcon,
  summary,
}: GuideHeroProps) => {
  const LearnIcon = learnIcon;
  const SummaryIcon = summaryIcon;

  return (
    <>
      <Breadcrumbs className="mb-6" items={[{ label: "Guides", href: "/guides" }, { label: title }]} />
      <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">{title}</h1>
      <p className="mb-8 text-lg text-gray-600">{description}</p>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center">
              <LearnIcon className="mr-2 h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">What You&apos;ll Learn</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              {learnItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="border border-blue-200 bg-blue-50 p-6 shadow-inner">
            <div className="mb-3 flex items-center">
              <SummaryIcon className="mr-2 h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-blue-800">Executive Summary</h3>
            </div>
            <p className="text-gray-800">{summary}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export const GuideKeyTakeaways = ({ title, takeaways }: GuideKeyTakeawaysProps) => (
  <section className="mb-12">
    <h2 className="mb-6 text-3xl font-bold text-gray-900">{title}</h2>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {takeaways.map((takeaway) => (
        <GuideIconCard key={takeaway.title} {...takeaway} />
      ))}
    </div>
  </section>
);

export const GuideFaqSection = ({ faqs }: GuideFaqSectionProps) => (
  <section className="mb-12">
    <h2 className="mb-6 text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
    {faqs.map((faq) => (
      <ExpandableFAQ key={faq.question} question={faq.question} answer={faq.answer} />
    ))}
  </section>
);

export const GuideResourceLinks = ({
  title = "Build your next move",
  description = "Use these pages to pressure-test your assumptions with real market data.",
  links,
}: GuideResourceLinksProps) => (
  <section className="mb-12 rounded-lg border border-gray-200 bg-white p-6">
    <h2 className="mb-3 text-2xl font-bold text-gray-900">{title}</h2>
    <p className="mb-4 text-gray-700">{description}</p>
    <div className="grid gap-3 sm:grid-cols-2">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="rounded-md border border-gray-200 p-4 transition-colors hover:border-blue-400 hover:bg-blue-50">
          <p className="font-semibold text-blue-700">{link.label}</p>
          <p className="mt-1 text-sm text-gray-700">{link.description}</p>
        </Link>
      ))}
    </div>
  </section>
);

export const GuideCtaSection = ({ title, description, ctaLabel, ctaHref }: GuideCtaSectionProps) => (
  <section className="rounded-lg bg-gray-50 py-12 text-center">
    <h2 className="mb-6 text-3xl font-bold text-gray-900">{title}</h2>
    <p className="mb-8 text-lg text-gray-700">{description}</p>
    <Link href={ctaHref}>
      <Button className="group px-8 py-3 text-lg">
        {ctaLabel} <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Button>
    </Link>
  </section>
);

const guideLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/guides/swe-compensation-2026", label: "SWE Compensation 2026" },
  { href: "/guides/pm-compensation-2026", label: "PM Compensation 2026" },
  { href: "/guides/negotiation", label: "Negotiation Guide" },
  { href: "/guides/equity", label: "Equity Guide" },
  { href: "/guides/remote-pay", label: "Remote Pay Guide" },
  { href: "/guides/startup-vs-bigtech", label: "Startup vs. Big Tech" },
  { href: "/tools", label: "Compensation Tools" },
  { href: "/salaries", label: "Salary Database" },
];

export const GuideFooterLinks = ({ currentGuide }: GuideFooterLinksProps) => (
  <footer className="mt-16 text-center text-sm text-gray-500">
    <p>© 2026 AvgPay. All rights reserved.</p>
    <div className="mt-2 flex flex-wrap justify-center gap-2">
      {guideLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={link.href === currentGuide ? "font-semibold text-blue-600" : "hover:underline"}
        >
          {link.label}
        </Link>
      ))}
    </div>
  </footer>
);
