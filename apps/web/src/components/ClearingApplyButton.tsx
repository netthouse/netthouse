"use client";

import { useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

export default function ClearingApplyButton({
  userId,
  orgId,
  hasProposals,
  locale,
}: {
  userId: string;
  orgId: string;
  hasProposals: boolean;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const { getToken } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleApply = () => {
    startTransition(() => {
      getToken().then((token) =>
      apiFetch<{ created: number }>(
    userId,
    "/clearing/apply",
    {
      method: "POST",
      body: JSON.stringify({ orgId }),
    },
    token
  )
)

        .then((data) => {
          alert(
            locale === "ru"
              ? `Создано ${data.created} транзакций взаимозачёта`
              : `Created ${data.created} netting transaction(s)`
          );
          router.refresh();
        })
        .catch((err) =>
          alert(
            locale === "ru"
              ? `Ошибка: ${(err as Error).message}`
              : `Failed: ${(err as Error).message}`
          )
        );
    });
  };

  return (
    <button
      onClick={handleApply}
      disabled={!hasProposals || isPending}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {isPending ? t.pages.clearing.applying : t.pages.clearing.applyNetting}
    </button>
  );
}