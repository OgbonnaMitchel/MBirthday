"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { User, Mail, MessageCircle, Gift } from "lucide-react";

import { pledgeGift } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WishlistItem } from "@/lib/types";
import { Label } from "@/components/ui/label";

const initialState = {
  message: "",
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        "Pledging..."
      ) : (
        <>
          <Gift className="mr-2 h-4 w-4" />
          Pledge Gift
        </>
      )}
    </Button>
  );
}

export function PledgeGiftForm({
  item,
  onPledgeSuccess,
}: {
  item: WishlistItem;
  onPledgeSuccess: (itemId: string) => void;
}) {
  const [state, formAction] = useFormState(pledgeGift, initialState);

  useEffect(() => {
    if (state.success) {
      onPledgeSuccess(item.id);
    }
  }, [state, onPledgeSuccess, item.id]);

  return (
    <form action={formAction} className="grid gap-6 pt-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Your Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="name" name="name" placeholder="Jane Doe" required className="pl-10" aria-describedby="name-error" />
        </div>
        {state.errors?.name && <p id="name-error" className="text-sm text-destructive">{state.errors.name[0]}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="whatsapp">WhatsApp Number</Label>
        <div className="relative">
          <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="whatsapp" name="whatsapp" placeholder="+1 555-555-5555" required className="pl-10" aria-describedby="whatsapp-error" />
        </div>
        {state.errors?.whatsapp && <p id="whatsapp-error" className="text-sm text-destructive">{state.errors.whatsapp[0]}</p>}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="email" name="email" type="email" placeholder="jane.doe@example.com" required className="pl-10" aria-describedby="email-error" />
        </div>
        {state.errors?.email && <p id="email-error" className="text-sm text-destructive">{state.errors.email[0]}</p>}
      </div>

      {state.message && !state.success && <p className="text-sm text-destructive text-center">{state.message}</p>}
      
      <SubmitButton />
    </form>
  );
}
