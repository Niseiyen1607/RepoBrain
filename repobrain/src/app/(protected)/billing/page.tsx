"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { createCheckoutSession } from "@/lib/stripe";
import { api } from "@/trpc/react";
import { Info } from "lucide-react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const BillingPage = () => {
  const { data: user, isLoading } = api.project.getMyCredits.useQuery();
  const [creditsToBuy, setCreditsToBuy] = React.useState<number[]>([100]);
  const creditsToBuyAmount = creditsToBuy[0]!;
  const price = (creditsToBuyAmount / 50).toFixed(2);

  return (
    <div>
      <h1 className="text-xl font-semibold">Billing</h1>
      <div className="h-2"></div>
      {isLoading ? (
        <Skeleton className="h-5 w-48" />
      ) : (
        <p className="text-sm text-gray-500">
          you currently have {user?.credits ?? 0} credits.
        </p>
      )}
      <div className="h-2"></div>
      <div className="borde-blue-200 rounded-md border bg-blue-50 px-5 py-2 text-blue-700">
        <div className="flex items-center gap-2">
          <Info className="size-4" />
          <p className="text-sm">
            {" "}
            Each credit allows you to index 1 files in a repository
          </p>
        </div>
        <p className="text-sm">
          E.g. If your project has 100 files, you will need 100 credits to index
          it.
        </p>
      </div>
      <div className="h-4"></div>
      <Slider
        defaultValue={[100]}
        max={1000}
        step={10}
        onValueChange={(value) =>
          setCreditsToBuy(Array.isArray(value) ? [...value] : [value])
        }
        value={creditsToBuy}
      />
      <div className="h-4"></div>
      <Button
        onClick={() => {
          createCheckoutSession(creditsToBuyAmount);
        }}
      >
        Buy {creditsToBuyAmount} credits for ${price}
      </Button>
    </div>
  );
};

export default BillingPage;
