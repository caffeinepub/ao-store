import { useGetAllOrders, useGetUserProfile } from '../hooks/useQueries';
import AdminGuard from '../components/AdminGuard';
import OrderStatusBadge from '../components/OrderStatusBadge';
import UpdateOrderStatusForm from '../components/UpdateOrderStatusForm';
import { Loader2, ShoppingBag } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function CustomerName({ customerId }: { customerId: string }) {
  const { data: profile } = useGetUserProfile(customerId);
  return <span>{profile?.name || 'Unknown Customer'}</span>;
}

function AdminOrdersContent() {
  const { data: orders, isLoading, error } = useGetAllOrders();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load orders. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-sage/30 rounded-lg">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id.toString()} className="border-sage/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sage-dark">
                Order #{order.id.toString()}
              </CardTitle>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Customer: <CustomerName customerId={order.customer.toString()} />
            </p>
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

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Update Status:</span>
              <UpdateOrderStatusForm orderId={order.id} currentStatus={order.status} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-terracotta mb-8">Manage Orders</h1>
        <AdminOrdersContent />
      </div>
    </AdminGuard>
  );
}
