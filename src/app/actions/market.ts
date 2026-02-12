"use server";

import { getMarketData } from "@/lib/data";

/**
 * Fetch market data for a given company, role, location, and level.
 * This is a Server Action that can be called directly from Client Components.
 */
export async function fetchMarketData(
    company: string,
    role: string,
    location: string,
    level: string
) {
    return await getMarketData(company, role, location, level);
}
