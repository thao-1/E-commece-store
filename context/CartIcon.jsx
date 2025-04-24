import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/router';
import { Badge } from "@/components/ui/badge";

export default function CartIcon() {
  const { itemCount } = useCart();
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.push('/cart')}
      className="relative"
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-orange-500">
          {itemCount > 9 ? '9+' : itemCount}
        </Badge>
      )}
    </Button>
  );
}