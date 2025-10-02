import { Header } from "@/components/header";
import { WishlistDisplay } from "@/components/wishlist-display";
import placeholderData from "@/lib/placeholder-images.json";
import type { WishlistItem } from "@/lib/types";

export default function Home() {
  const wishlistItems: WishlistItem[] = placeholderData.placeholderImages;

  return (
    <main className="container mx-auto px-4 py-8">
      <Header />
      <WishlistDisplay items={wishlistItems} />
    </main>
  );
}
