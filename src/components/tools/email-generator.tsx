"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail, EMAIL_STRATEGIES, EmailStrategy, EmailParams } from "@/lib/email-templates";
import { Copy, Check, Sparkles } from "lucide-react";
import { usePostHog } from "posthog-js/react";

export function EmailGenerator() {
    const posthog = usePostHog();
    const [formData, setFormData] = useState<Partial<EmailParams>>({
        recruiterName: "",
        companyName: "",
        role: "Software Engineer",
        currentOffer: 0,
        targetOffer: 0,
        marketDataMedian: 0,
    });

    const [strategy, setStrategy] = useState<EmailStrategy>("market-data");
    const [generatedEmail, setGeneratedEmail] = useState("");
    const [copied, setCopied] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name.includes("Offer") || name.includes("Median") ? Number(value) : value,
        }));
    };

    const handleGenerate = () => {
        const params = formData as EmailParams; // In a real app, validate this
        const email = generateEmail(strategy, params);
        setGeneratedEmail(email);
        setCopied(false);

        posthog?.capture('email_generated', {
            strategy: strategy,
            company: formData.companyName,
            role: formData.role
        });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        posthog?.capture('email_copied', {
            strategy: strategy
        });
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Offer Details</CardTitle>
                    <CardDescription>Enter the details of your current offer to generate a counter-email.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="recruiterName">Recruiter Name</Label>
                            <Input id="recruiterName" name="recruiterName" placeholder="e.g. Sarah" onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Company</Label>
                            <Input id="companyName" name="companyName" placeholder="e.g. Google" onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" name="role" placeholder="e.g. Senior Software Engineer" defaultValue={formData.role} onChange={handleInputChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentOffer">Current Offer ($)</Label>
                            <Input id="currentOffer" name="currentOffer" type="number" placeholder="200000" onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="targetOffer">Target Ask ($)</Label>
                            <Input id="targetOffer" name="targetOffer" type="number" placeholder="240000" onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Negotiation Strategy</Label>
                        <Select value={strategy} onValueChange={(v) => setStrategy(v as EmailStrategy)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {EMAIL_STRATEGIES.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {EMAIL_STRATEGIES.find(s => s.id === strategy)?.description}
                        </p>
                    </div>

                    {strategy === "market-data" && (
                        <div className="space-y-2">
                            <Label htmlFor="marketDataMedian">Market Median for Role ($)</Label>
                            <Input id="marketDataMedian" name="marketDataMedian" type="number" placeholder="e.g. 235000" onChange={handleInputChange} />
                        </div>
                    )}

                    {strategy === "competing-offer" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="competingCompany">Other Company</Label>
                                <Input id="competingCompany" name="competingCompany" placeholder="e.g. Meta" onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="competingOffer">Other Offer ($)</Label>
                                <Input id="competingOffer" name="competingOffer" type="number" placeholder="250000" onChange={handleInputChange} />
                            </div>
                        </div>
                    )}

                    <Button onClick={handleGenerate} className="w-full bg-primary hover:bg-primary-hover text-text-inverse">
                        <Sparkles className="w-4 h-4 mr-2" /> Generate Email
                    </Button>
                </CardContent>
            </Card>

            {/* Preview */}
            <Card className="bg-surface-subtle border-dashed">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Email Preview
                        {generatedEmail && (
                            <Button variant="outline" size="sm" onClick={handleCopy}>
                                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? "Copied" : "Copy to Clipboard"}
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {generatedEmail ? (
                        <Textarea
                            className="min-h-[400px] font-mono text-sm bg-surface"
                            value={generatedEmail}
                            readOnly
                        />
                    ) : (
                        <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
                            <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                            <p>Fill out the form to generate your negotiation email.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
