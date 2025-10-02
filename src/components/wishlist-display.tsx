"use client";

import { useState } from "react";
import Image from "next/image";
import { Gift, Check } from "lucide-react";

import type { WishlistItem } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PledgeGiftForm } from "./pledge-gift-form";

export function WishlistDisplay({ items }: { items: WishlistItem[] }) {
  const [pledgedItems, setPledgedItems] = useState<Set<string>>(new Set());
  const [activeItem, setActiveItem] = useState<WishlistItem | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handlePledgeSuccess = (itemId: string) => {
    setPledgedItems((prev) => new Set(prev).add(itemId));
    setActiveItem(null);
    setShowConfirmation(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => {
          const isPledged = pledgedItems.has(item.id);
          return (
            <Card key={item.id} className="group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl rounded-lg">
              <div className="overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  data-ai-hint={item.imageHint}
                />
              </div>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => setActiveItem(item)}
                  disabled={isPledged}
                  variant={isPledged ? 'secondary' : 'default'}
                >
                  {isPledged ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Pledged
                    </>
                  ) : (
                    <>
                      <Gift className="mr-2 h-4 w-4" />
                      Pledge this Gift
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={activeItem !== null} onOpenChange={(isOpen) => !isOpen && setActiveItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          {activeItem && (
            <>
              <DialogHeader>
                <DialogTitle>Pledge: {activeItem.title}</DialogTitle>
                <DialogDescription>
                  Enter your details to pledge this gift. We'll send you a reminder before the birthday.
                </DialogDescription>
              </DialogHeader>
              <PledgeGiftForm item={activeItem} onPledgeSuccess={handlePledgeSuccess} />
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thank you for your generosity!</AlertDialogTitle>
            <AlertDialogDescription>
              You've successfully pledged a gift. A reminder will be sent to you closer to the date.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowConfirmation(false)}>
              Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
