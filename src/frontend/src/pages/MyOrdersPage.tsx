import { useGetCustomerOrders } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { Loader2, ShoppingBag } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ShieldAlert } from 'lucide-react';

export default function MyOrdersPage() {
  const { identity } = useInternetIdentity();
  const { data: orders, isLoading, error } = useGetCustomerOrders();
  const navigate = useNavigate();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert className="max-w-2xl mx-auto border-terracotta/30">
          <ShieldAlert className="h-5 w-5 text-terracotta" />
          <AlertTitle className="text-terracotta">Authentication Required</AlertTitle>
          <AlertDescription>Please log in to view your orders.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertDescription>Failed to load your orders. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-terracotta mb-8">My Orders</h1>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-sage/30 rounded-lg">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
          <Button
            onClick={() => navigate({ to: '/products' })}
            className="bg-terracotta hover:bg-terracotta-dark text-white"
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id.toString()} className="border-sage/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sage-dark">Order #{order.id.toString()}</CardTitle>
                  <OrderStatusBadge status={order.status} />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.products.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell className="text-right">${item.product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.quantity.toString()}</TableCell>
                        <TableCell className="text-right">
                          ${(item.product.price * Number(item.quantity)).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Total:
                      </TableCell>
                      <TableCell className="text-right font-bold text-terracotta">
                        ${order.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
