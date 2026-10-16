"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function ClearingApplyButton({
  userId,
  orgId,
  hasProposals,
}: {
  userId: string;
  orgId: string;
  hasProposals: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleApply = () => {
    startTransition(() => {
      apiFetch<{ created: number }>(userId, "/clearing/apply", {
        method: "POST",
        body: JSON.stringify({ orgId }),
      })
        .then((data) => {
          alert(`Created ${data.created} netting transaction(s)`);
          router.refresh();
        })
        .catch((err) => alert(`Failed: ${(err as Error).message}`));
    });
  };

  return (
    <button
      onClick={handleApply}
      disabled={!hasProposals || isPending}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {isPending ? "Applying..." : "Apply netting"}
    </button>
  );
}