import { Metadata } from "next";
import { SubmitSalaryForm } from "./SubmitSalaryForm";

export const metadata: Metadata = {
  title: "Submit Salary | AvgPay",
  description: "Share your salary anonymously to help build a more transparent compensation landscape.",
};

export default function SubmitSalaryPage() {
  return <SubmitSalaryForm />;
}
