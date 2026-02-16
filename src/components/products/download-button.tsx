import Link from "next/link";
import { Download } from "lucide-react";
import { ProductDeliverable } from "@/lib/products";

export function DownloadButton({ deliverable }: { deliverable: ProductDeliverable }) {
  return (
    <Link
      href={deliverable.path}
      download={deliverable.fileName}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
    >
      <Download className="h-4 w-4" />
      {deliverable.label}
    </Link>
  );
}
