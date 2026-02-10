import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function VerifyRequestPage() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                        <Mail className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
                    <p className="text-sm text-muted-foreground">
                        A sign in link has been sent to your email address.
                    </p>
                </div>
                <Link href="/login">
                    <Button variant="outline" className="w-full">Back to Login</Button>
                </Link>
            </div>
        </div>
    );
}
