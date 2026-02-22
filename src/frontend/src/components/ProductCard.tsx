import { Product } from '../backend';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToOrder?: (product: Product) => void;
  showAddButton?: boolean;
}

export default function ProductCard({ product, onAddToOrder, showAddButton = true }: ProductCardProps) {
  const imageUrl = product.image.getDirectURL();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-sage/20">
      <div className="aspect-square overflow-hidden bg-cream">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-sage-dark">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <p className="text-2xl font-bold text-terracotta mt-4">${product.price.toFixed(2)}</p>
      </CardContent>
      {showAddButton && onAddToOrder && (
        <CardFooter>
          <Button
            onClick={() => onAddToOrder(product)}
            className="w-full bg-terracotta hover:bg-terracotta-dark text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Order
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
