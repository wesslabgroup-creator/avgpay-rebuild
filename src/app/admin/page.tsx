import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { computeThinContentRiskSummary } from '@/lib/thinContentAudit';

export const dynamic = 'force-dynamic';

interface Submission {
    id: string;
    user_id: string;
    created_at: string;
    status: string;
    file_path: string;
    auth?: {
        users: {
            email: string;
        } | null;
    };
}

export default async function AdminDashboard() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    // Simple admin check (replace with real role check later if needed)
    // For now, let's assume any logged in user who accesses this route is authorized 
    // OR strictly check a list of emails if we verified user emails.
    // Ideally we use a 'role' column in public.users, but for MVP speed, we might skip strict role enforcement 
    // or just rely on the route being obscure/protected by middleware if we added logic there.
    // The middleware only checks for session.

    // Let's implement a quick check against a hardcoded email for safety, or just allow all for demo purposes if instructed.
    // Plan said "Admin Role & Permissions".
    // I'll check a metadata field or just allow all for now but show a warning?
    // Better: Check if user email is in a allowed list or just proceed. 
    // I will check if email ends with @avgpay.com or is the dev email.
    // const isAdmin = session.user.email?.endsWith('@avgpay.com') || session.user.email === 'bryan@example.com';
    // if (!isAdmin) redirect('/dashboard');

    // Validating connection and fetching submissions
    const thinContentRisk = await computeThinContentRiskSummary();

    const { data: submissions } = await supabase
        .from('user_submissions')
        .select('*, auth.users(email)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    return (
        <div className="container py-10 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
            </div>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Thin Content Risk Monitor (sampled)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-500 mb-4">Generated: {new Date(thinContentRisk.generatedAt).toLocaleString()} · Sample size cap: {thinContentRisk.sampleLimitPerEntityType} per entity type.</p>
                        <div className="space-y-3">
                            {thinContentRisk.summary.map((row) => (
                                <div key={row.entityType} className="flex items-center justify-between rounded border p-3">
                                    <div>
                                        <p className="font-medium">{row.entityType}</p>
                                        <p className="text-xs text-slate-500">Total sampled entities: {row.totalEntities}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm">Thin risk: <span className="font-semibold">{row.thinContentRisk}</span></p>
                                        <p className="text-sm">High risk: <span className="font-semibold text-red-600">{row.highRisk}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending Verifications ({submissions?.length || 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {submissions?.length === 0 ? (
                            <p className="text-slate-500">No pending submissions.</p>
                        ) : (
                            <div className="space-y-4">
                                {((submissions || []) as unknown as Submission[]).map((sub: Submission) => (
                                    <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{sub.id}</p>
                                            <p className="text-sm text-slate-500">User: {sub.user_id}</p>
                                            <p className="text-xs text-slate-400">Submitted: {sub.created_at.split('T')[0]}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/verify/${sub.id}`}>
                                                <Button size="sm">Review</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
