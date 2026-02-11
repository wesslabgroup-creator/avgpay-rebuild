import { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
    title: 'Sign In | AvgPay',
    description: 'Sign in to access advanced salary data and verified insights.',
};

export default function LoginPage() {
    return (
        <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-surface-subtle">
            <div className="relative hidden h-full flex-col bg-secondary p-10 text-text-inverse dark:border-r lg:flex">
                <div className="absolute inset-0 bg-emerald-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Link href="/">Are You Paid Fairly?</Link>
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Using verified offer data gave me the leverage I needed to negotiate an extra $40k in equity. The transparency is a game changer.&rdquo;
                        </p>
                        <footer className="text-sm">Sofia Davis</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email to sign in to your account
                        </p>
                    </div>

                    <AuthForm view="login" />

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link
                            href="/signup"
                            className="hover:text-brand underline underline-offset-4"
                        >
                            Don&apos;t have an account? Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
