"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { generateProjectFromLeadAction } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast/toast";

interface GenerateProjectButtonProps {
  leadId: string;
}

export function GenerateProjectButton({
  leadId,
}: GenerateProjectButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleGenerate() {
    startTransition(async () => {
      const result = await generateProjectFromLeadAction(leadId);

      if (!result.success || !result.projectId) {
        toast.error(result.message);
        return;
      }

      router.push(`/obras/${result.projectId}`);
    });
  }

  return (
    <Button
      type="button"
      onClick={handleGenerate}
      disabled={isPending}
      className="flex w-full"
    >
      {isPending ? "Generando..." : "Generar obra"}
    </Button>
  );
}
