"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, X } from "lucide-react";
// import { toast } from "sonner"; // Removed unused import
// Using alert for now to avoid dependency assumption

// Adding interface to fix linting
interface Submission {
    id: string;
    user_id: string;
    created_at: string;
    status: string;
    file_path: string;
}

export default function VerifyPage() {
    const params = useParams();
    const router = useRouter();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchSubmission = async () => {
            const { data } = await supabase
                .from('user_submissions')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) {
                setSubmission(data);
                // Get signed URL
                const { data: urlData } = await supabase
                    .storage
                    .from('offer-letters')
                    .createSignedUrl(data.file_path, 3600);

                if (urlData) setFileUrl(urlData.signedUrl);
            }
            setLoading(false);
        };
        fetchSubmission();
    }, [params.id, supabase]);

    const handleAction = async (status: 'verified' | 'rejected') => {
        const { error } = await supabase
            .from('user_submissions')
            .update({ status })
            .eq('id', params.id);

        if (!error) {
            router.push('/admin');
            router.refresh();
        } else {
            alert('Error updating status');
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (!submission) return <div className="p-8">Submission not found</div>;

    return (
        <div className="container py-8 grid lg:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
            {/* Document Viewer */}
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Document Viewer</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 bg-surface-muted p-0 overflow-hidden relative">
                    {fileUrl ? (
                        <iframe src={fileUrl} className="w-full h-full border-none" />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p>Unable to load document</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Controls */}
            <div className="space-y-4">
                <Card>
                    <CardHeader><CardTitle>Submission Details</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <p><span className="font-semibold">ID:</span> {submission.id}</p>
                        <p><span className="font-semibold">User ID:</span> {submission.user_id}</p>
                        <p><span className="font-semibold">Submitted:</span> {new Date(submission.created_at).toLocaleString()}</p>
                        <p><span className="font-semibold">Status:</span> <span className="uppercase">{submission.status}</span></p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="destructive"
                        className="h-16 text-lg"
                        onClick={() => handleAction('rejected')}
                    >
                        <X className="mr-2 h-6 w-6" /> Reject
                    </Button>
                    <Button
                        className="h-16 text-lg bg-primary hover:bg-primary-hover"
                        onClick={() => handleAction('verified')}
                    >
                        <Check className="mr-2 h-6 w-6" /> Verify & Approve
                    </Button>
                </div>
            </div>
        </div>
    );
}
