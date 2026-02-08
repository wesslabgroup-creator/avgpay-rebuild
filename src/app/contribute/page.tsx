import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contribute Salary Data | AvgPay",
  description: "Help others by sharing your compensation anonymously.",
};

export default function ContributePage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Contribute Your Salary</h1>
          <p className="text-xl text-slate-400">
            Help others negotiate better. Your data stays anonymous.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <Input placeholder="Google, Meta, etc." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Input placeholder="Software Engineer" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input placeholder="San Francisco, CA" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Level</label>
                  <Select>
                    <option value="">Select level...</option>
                    <option value="junior">Junior (L1-L2)</option>
                    <option value="mid">Mid (L3-L4)</option>
                    <option value="senior">Senior (L5-L6)</option>
                    <option value="staff">Staff+ (L7+)</option>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Base Salary</label>
                  <Input type="number" placeholder="150000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Annual Equity</label>
                  <Input type="number" placeholder="50000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Annual Bonus</label>
                  <Input type="number" placeholder="20000" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience</label>
                <Input type="number" placeholder="5" />
              </div>

              <div className="p-4 bg-slate-800/50 rounded-lg text-sm text-slate-400">
                <p className="font-medium text-slate-200 mb-2">Privacy Promise</p>
                <ul className="space-y-1">
                  <li>• Your submission is anonymized immediately</li>
                  <li>• We never share individual data points</li>
                  <li>• Only aggregated statistics are shown publicly</li>
                  <li>• You can request deletion anytime</li>
                </ul>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-violet-600">
                Submit Anonymously
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
