import { useState } from 'react';
import { Product, OrderedProduct } from '../backend';
import { usePlaceOrder } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShoppingCart, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface OrderItem {
  product: Product;
  quantity: number;
}

interface OrderFormProps {
  products: Product[];
}

export default function OrderForm({ products }: OrderFormProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const placeOrder = usePlaceOrder();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  const addToOrder = (product: Product) => {
    const existingItem = orderItems.find((item) => item.product.id === product.id);
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setOrderItems([...orderItems, { product, quantity: 1 }]);
    }
    setIsOpen(true);
    toast.success(`${product.name} added to order`);
  };

  const updateQuantity = (productId: bigint, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setOrderItems(
      orderItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeItem = (productId: bigint) => {
    setOrderItems(orderItems.filter((item) => item.product.id !== productId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to place an order');
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Your order is empty');
      return;
    }

    try {
      const orderedProducts: OrderedProduct[] = orderItems.map((item) => ({
        product: item.product,
        quantity: BigInt(item.quantity),
      }));

      await placeOrder.mutateAsync(orderedProducts);
      setOrderItems([]);
      setIsOpen(false);
      toast.success('Order placed successfully!');
      navigate({ to: '/order-success' });
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <>
      {/* Hidden component to expose addToOrder function */}
      <div style={{ display: 'none' }} data-add-to-order={JSON.stringify({ addToOrder })} />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg bg-terracotta hover:bg-terracotta-dark text-white z-40"
            size="icon"
          >
            <ShoppingCart className="w-6 h-6" />
            {orderItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-sage-dark text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {orderItems.length}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-terracotta">Your Order</DialogTitle>
            <DialogDescription>
              {isAuthenticated
                ? 'Review your order and place it when ready.'
                : 'Please log in to place an order.'}
            </DialogDescription>
          </DialogHeader>

          {orderItems.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Your order is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orderItems.map((item) => (
                <Card key={item.product.id.toString()} className="border-sage/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.image.getDirectURL()}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sage-dark">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.product.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.product.id, parseInt(e.target.value) || 0)
                          }
                          className="w-20 border-sage/30"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-right font-semibold text-terracotta">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-terracotta/30 bg-cream">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-sage-dark">Total:</span>
                    <span className="text-terracotta">${calculateTotal().toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handlePlaceOrder}
                disabled={!isAuthenticated || placeOrder.isPending}
                className="w-full bg-terracotta hover:bg-terracotta-dark text-white"
              >
                {placeOrder.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Expose addToOrder to ProductCard components */}
      {products.map((product) => (
        <div key={product.id.toString()} style={{ display: 'none' }}>
          <ProductCard product={product} onAddToOrder={addToOrder} />
        </div>
      ))}
    </>
  );
}

// Helper component for ProductCard integration
function ProductCard({ product, onAddToOrder }: { product: Product; onAddToOrder: (p: Product) => void }) {
  return null;
}
