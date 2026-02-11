import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, Shield } from 'lucide-react';
import { SubmissionsList } from '@/components/dashboard/submissions-list';

export const metadata: Metadata = {
    title: 'Dashboard | AvgPay',
    description: 'Manage your verified profile and submissions.',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const user = session.user;

    return (
        <div className="container py-10 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user.email}</p>
                </div>
                <form action="/auth/signout" method="post">
                    <Button variant="outline">Sign Out</Button>
                </form>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Verification Status</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="h-48 flex items-center justify-center text-center">
                        <p className="text-muted-foreground">You haven&apos;t submitted any documents yet.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Salaries contributed</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Your Submissions</CardTitle>
                        <CardDescription>Status of your verified offers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SubmissionsList />
                    </CardContent>
                </Card>

                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Next Steps</CardTitle>
                        <CardDescription>Complete these tasks to unlock full access.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center p-4 border rounded-lg bg-surface-subtle">
                            <div className="flex-1">
                                <h4 className="font-semibold">Verify your offer</h4>
                                <p className="text-sm text-text-secondary">Upload a redacted offer letter to get the &quot;Verified&quot; badge and see deep-tier data.</p>
                            </div>
                            <Link href="/submit">
                                <Button>Upload Offer</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
