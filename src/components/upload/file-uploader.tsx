"use client";

import { useState } from "react";
// import { useDropzone } from "react-dropzone"; // Removed to avoid dependency
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Upload, FileText, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const supabase = createClientComponentClient();
    const router = useRouter();


    // Simple drag/drop implementation without react-dropzone dependency for now to avoid install if possible
    // Actually, standard input is safer if I don't want to install more deps, but plan said "Drag & Drop".
    // I'll implement a simple drag & drop area using standard events.

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf" || droppedFile.type.startsWith("image/")) {
                setFile(droppedFile);
                setError(null);
            } else {
                setError("Please upload a PDF or Image file.");
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("You must be logged in to upload.");

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('offer-letters')
                .upload(fileName, file);

            if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

            // 2. Insert record
            const { error: dbError } = await supabase
                .from('user_submissions')
                .insert({
                    user_id: user.id,
                    file_path: fileName,
                    status: 'pending'
                });

            if (dbError) throw new Error(`Database record failed: ${dbError.message}`);

            setSuccess(true);
            setFile(null);
            // Refresh dashboard data eventually
            router.refresh();

        } catch (err: unknown) {
            setError((err as Error).message || "Something went wrong.");
        } finally {
            setUploading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-4 p-6 border rounded-lg bg-emerald-50 border-emerald-100">
                <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-medium text-emerald-900">Upload Successful!</h3>
                <p className="text-emerald-700">Your offer has been submitted for verification. Check your dashboard for updates.</p>
                <Button onClick={() => setSuccess(false)} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-100">
                    Upload Another
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${file ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
            >
                <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    accept=".pdf,image/*"
                    onChange={handleFileChange}
                />

                {file ? (
                    <div className="flex flex-col items-center space-y-2">
                        <FileText className="w-10 h-10 text-emerald-600" />
                        <p className="font-medium text-slate-900">{file.name}</p>
                        <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p className="text-xs text-emerald-600 font-medium">Click to change</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                            <Upload className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="font-medium text-slate-900">Click to upload or drag and drop</p>
                        <p className="text-sm text-slate-500">PDF, PNG, JPG (max 10MB)</p>
                    </div>
                )}
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full"
            >
                {uploading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                    </>
                ) : (
                    "Submit for Verification"
                )}
            </Button>

            <p className="text-xs text-center text-slate-500">
                Your document is encrypted and only visible to our verification team.
                Please redact sensitive info (SSN, Bank Info) before uploading.
            </p>
        </div>
    );
}
