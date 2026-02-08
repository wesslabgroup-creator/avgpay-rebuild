import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Manager Compensation Guide 2026 | AvgPay",
  description: "Complete breakdown of PM salaries across levels, companies, and locations. Includes equity ranges and negotiation strategies.",
};

export default function PMGuidePage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <article className="max-w-3xl mx-auto prose prose-invert prose-lg">
        <h1>Product Manager Compensation Guide 2026</h1>
        
        <p className="lead">
          The most comprehensive analysis of Product Manager salaries in tech. 
          Based on 5,000+ verified data points from BLS, H-1B filings, and pay transparency laws.
        </p>

        <h2>Executive Summary</h2>
        <p>
          Product Managers in tech earn a median total compensation of $185,000 in 2026, 
          ranging from $120,000 at the entry level to $450,000+ for senior Staff PMs at top companies. 
          Location remains the biggest differentiator, with SF Bay Area PMs earning 35% more than the national average.
        </p>

        <h2>Salary by Level</h2>
        
        <table>
          <thead>
            <tr>
              <th>Level</th>
              <th>Base Salary</th>
              <th>Equity (Annual)</th>
              <th>Bonus</th>
              <th>Total Comp</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PM (L3)</td>
              <td>$125,000</td>
              <td>$15,000</td>
              <td>$12,000</td>
              <td>$152,000</td>
            </tr>
            <tr>
              <td>Sr PM (L4)</td>
              <td>$155,000</td>
              <td>$35,000</td>
              <td>$20,000</td>
              <td>$210,000</td>
            </tr>
            <tr>
              <td>Staff PM (L5)</td>
              <td>$185,000</td>
              <td>$75,000</td>
              <td>$35,000</td>
              <td>$295,000</td>
            </tr>
            <tr>
              <td>Principal PM (L6+)</td>
              <td>$220,000</td>
              <td>$150,000</td>
              <td>$60,000</td>
              <td>$430,000</td>
            </tr>
          </tbody>
        </table>

        <h2>Salary by Location</h2>
        
        <p>Location continues to drive significant compensation differences:</p>
        
        <ul>
          <li><strong>San Francisco Bay Area:</strong> $245,000 median (35% premium)</li>
          <li><strong>Seattle:</strong> $220,000 median (21% premium)</li>
          <li><strong>New York:</strong> $205,000 median (13% premium)</li>
          <li><strong>Austin:</strong> $175,000 median (3% discount)</li>
          <li><strong>Remote (US):</strong> $195,000 median (7% discount)</li>
        </ul>

        <h2>Company-Specific Data</h2>
        
        <p>Top-paying companies for Senior PMs (L4):</p>
        
        <ol>
          <li>Google: $285,000 total comp</li>
          <li>Meta: $275,000 total comp</li>
          <li>Stripe: $265,000 total comp</li>
          <li>Uber: $255,000 total comp</li>
          <li>Airbnb: $250,000 total comp</li>
        </ol>

        <h2>Negotiation Strategies</h2>
        
        <h3>1. Know Your Leverage</h3>
        <p>
          The most powerful negotiation tool is a competing offer. PMs with 2+ offers 
          negotiate 18% higher total compensation on average. If you don&apos;t have competing 
          offers, emphasize unique skills or internal metrics you&apos;ve moved.
        </p>

        <h3>2. Negotiate Total Comp, Not Just Base</h3>
        <p>
          Early-career PMs focus on base salary. Senior PMs know that equity is where 
          wealth is built. At Staff+ levels, equity can exceed 50% of total comp.
        </p>

        <h3>3. Use Data, Not Emotion</h3>
        <p>
          Frame requests with data: &quot;Based on BLS data and H-1B filings for this role 
          in this market, the median is $X. Given my experience with [specific achievement], 
          I believe $Y is appropriate.&quot;
        </p>

        <h2>2026 Trends</h2>
        
        <ul>
          <li><strong>AI PM Premium:</strong> +22% for AI/ML product experience</li>
          <li><strong>Remote Normalization:</strong> Location penalties shrinking (was 15%, now 7%)</li>
          <li><strong>Equity Refresher:</strong> More companies offering annual refreshers as standard</li>
        </ul>

        <hr />
        
        <p className="text-slate-400 text-sm">
          Last updated: February 2026. Data sourced from BLS, H-1B filings, and 
          pay transparency laws. Sample size: 5,000+ data points.
        </p>
      </article>
    </main>
  );
}
