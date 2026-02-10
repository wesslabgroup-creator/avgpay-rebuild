"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, Calendar } from "lucide-react";

interface Submission {
    id: string;
    file_path: string;
    status: 'pending' | 'verified' | 'rejected';
    created_at: string;
}

export function SubmissionsList() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchSubmissions = async () => {
            const { data } = await supabase
                .from('user_submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setSubmissions(data);
            setLoading(false);
        };

        fetchSubmissions();
    }, [supabase]);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>;
    }

    if (submissions.length === 0) {
        return (
            <div className="text-center p-8 border rounded-lg bg-slate-50 border-dashed">
                <FileText className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">No documents uploaded yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {submissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="bg-slate-100 p-2 rounded">
                            <FileText className="h-5 w-5 text-slate-600" />
                        </div>
                        <div>
                            <p className="font-medium text-slate-900 truncate max-w-[200px]">{sub.file_path.split('/').pop()}</p>
                            <div className="flex items-center text-xs text-slate-500 mt-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                {sub.created_at.split('T')[0]}
                            </div>
                        </div>
                    </div>
                    <div>
                        <Badge variant={sub.status === 'verified' ? 'success' : sub.status === 'rejected' ? 'destructive' : 'secondary'}>
                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </Badge>
                    </div>
                </div>
            ))}
        </div>
    );
}
