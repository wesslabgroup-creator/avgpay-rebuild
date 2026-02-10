
export interface EmailParams {
    recruiterName: string;
    companyName: string;
    role: string;
    currentOffer: number;
    targetOffer: number;
    marketDataMedian: number;
    competingOffer?: number;
    competingCompany?: string;
}

export type EmailStrategy = 'market-data' | 'competing-offer' | 'retention';

export const EMAIL_STRATEGIES = [
    { id: 'market-data', label: 'Use Market Data', description: 'Leverage AvgPay data to justify your ask.' },
    { id: 'competing-offer', label: 'Competing Offer', description: 'Leverage another offer to create urgency.' },
    { id: 'retention', label: 'Retention / Value', description: 'Focus on your unique value and existing team fit.' },
] as const;

export function generateEmail(strategy: EmailStrategy, params: EmailParams): string {
    const { recruiterName, companyName, role, targetOffer, marketDataMedian, competingOffer, competingCompany } = params;

    const formatCurrency = (n: number) => `$${n.toLocaleString()}`;

    const baseStructure = (body: string) => `Hi ${recruiterName || 'Team'},

Thank you for sending over the offer for the ${role} position. I'm incredibly excited about the opportunity to join ${companyName} and potential impact I can have on the team.

${body}

I am very keen to sign and join the team. If we can adjust the numbers to ${formatCurrency(targetOffer)}, I would be ready to sign immediately.

Best,
[Your Name]`;

    switch (strategy) {
        case 'market-data':
            return baseStructure(`I've reviewed the numbers, and based on recent market data for similar ${role} roles in this location (sourced from AvgPay/BLS), the market median is closer to ${formatCurrency(marketDataMedian)}.
      
Given my experience and the scope we discussed, I was aiming for a package closer to ${formatCurrency(targetOffer)} to be competitive with the current market.`);

        case 'competing-offer':
            return baseStructure(`I wanted to be transparent that I have received another offer from ${competingCompany || 'another company'} for ${formatCurrency(competingOffer || 0)}. 
      
However, ${companyName} remains my top choice because of the team and mission. If we can match the compensation to ${formatCurrency(targetOffer)}, I would be thrilled to decline the other opportunity and sign with you today.`);

        case 'retention':
            return baseStructure(`Reflecting on our conversations, I believe my background in [Specific Skill] will allow me to hit the ground running and deliver value immediately, saving ramp-up time.
      
To make this an easy "yes" for me and align with my expectations for the value I bring, I'm looking for a total compensation of ${formatCurrency(targetOffer)}.`);

        default:
            return baseStructure(`I've reviewed the offer and I am looking for a total compensation of ${formatCurrency(targetOffer)} to move forward.`);
    }
}
