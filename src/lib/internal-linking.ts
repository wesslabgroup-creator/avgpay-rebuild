
import { supabaseAdmin } from './supabaseClient';

export interface InternalLink {
    text: string;
    url: string;
    type: 'City' | 'Company' | 'Job';
}

export async function getNearbyCities(city: string, state: string, currentId: string): Promise<InternalLink[]> {
    // Simple "nearby" implementation: other cities in the same state
    const { data } = await supabaseAdmin
        .from('Location')
        .select('city, slug')
        .eq('state', state)
        .neq('id', currentId)
        .limit(10); // Limit to 10

    if (!data) return [];

    return data.map(loc => ({
        text: loc.city,
        url: `/salaries/city/${loc.slug}`,
        type: 'City'
    }));
}

export async function getSimilarJobs(jobTitle: string, currentId: string): Promise<InternalLink[]> {
    // This logic is partially in the API already, but we can centralize strict "Related" logic here
    // For now, let's just return a placeholder or reuse specific query logic if we want to replace API logic
    // But since API has it, we might not need this unless we want "Other Jobs in this Department"
    return [];
}
