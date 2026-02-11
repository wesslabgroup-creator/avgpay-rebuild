import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExpandableFAQ } from "@/components/ExpandableFAQ";

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
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      </div>
      <p className="text-text-secondary">{description}</p>
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
      <h1 className="mb-4 text-4xl font-bold text-text-primary sm:text-5xl lg:text-6xl">{title}</h1>
      <p className="mb-8 text-lg text-text-muted">{description}</p>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center">
              <LearnIcon className="mr-2 h-6 w-6 text-info" />
              <h3 className="text-xl font-semibold text-text-primary">What You&apos;ll Learn</h3>
            </div>
            <ul className="space-y-2 text-text-secondary">
              {learnItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="border border-info-subtle bg-info-subtle p-6 shadow-inner">
            <div className="mb-3 flex items-center">
              <SummaryIcon className="mr-2 h-6 w-6 text-info" />
              <h3 className="text-xl font-semibold text-info-foreground">Executive Summary</h3>
            </div>
            <p className="text-text-primary">{summary}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export const GuideKeyTakeaways = ({ title, takeaways }: GuideKeyTakeawaysProps) => (
  <section className="mb-12">
    <h2 className="mb-6 text-3xl font-bold text-text-primary">{title}</h2>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {takeaways.map((takeaway) => (
        <GuideIconCard key={takeaway.title} {...takeaway} />
      ))}
    </div>
  </section>
);

export const GuideFaqSection = ({ faqs }: GuideFaqSectionProps) => (
  <section className="mb-12">
    <h2 className="mb-6 text-3xl font-bold text-text-primary">Frequently Asked Questions</h2>
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
  <section className="mb-12 rounded-lg border border-border bg-surface p-6">
    <h2 className="mb-3 text-2xl font-bold text-text-primary">{title}</h2>
    <p className="mb-4 text-text-secondary">{description}</p>
    <div className="grid gap-3 sm:grid-cols-2">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="rounded-md border border-border p-4 transition-colors hover:border-info hover:bg-info-subtle">
          <p className="font-semibold text-info">{link.label}</p>
          <p className="mt-1 text-sm text-text-secondary">{link.description}</p>
        </Link>
      ))}
    </div>
  </section>
);

export const GuideCtaSection = ({ title, description, ctaLabel, ctaHref }: GuideCtaSectionProps) => (
  <section className="rounded-lg bg-surface-subtle py-12 text-center">
    <h2 className="mb-6 text-3xl font-bold text-text-primary">{title}</h2>
    <p className="mb-8 text-lg text-text-secondary">{description}</p>
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
  <footer className="mt-16 text-center text-sm text-text-muted">
    <p>© 2026 AvgPay. All rights reserved.</p>
    <div className="mt-2 flex flex-wrap justify-center gap-2">
      {guideLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={link.href === currentGuide ? "font-semibold text-info" : "hover:underline"}
        >
          {link.label}
        </Link>
      ))}
    </div>
  </footer>
);
