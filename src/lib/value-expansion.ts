export interface ValueBlock {
    title: string;
    type: 'market_position' | 'trend' | 'geographic_context' | 'top_payers' | 'related_entities';
    data: unknown;
    narrative?: string;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function buildPageValueBlocks(
    _entityType: 'Company' | 'Role' | 'Location',
    _entityId: string,
    _entityName: string
): Promise<ValueBlock[]> {
    // All previous blocks (Market Position, Top Payers, Geographic Context, Role Breakdown)
    // have been deemed redundant with existing page content.
    // Returning empty array for now to keep the interface contract valid.
    return [];
}
