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
      className="min-h-11 w-full rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
    >
      {isPending ? t.pages.clearing.applying : t.pages.clearing.applyNetting}
    </button>
  );
}
