import { useState } from 'react';
import { OrderStatus } from '../backend';
import { useUpdateOrderStatus } from '../hooks/useQueries';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UpdateOrderStatusFormProps {
  orderId: bigint;
  currentStatus: OrderStatus;
}

export default function UpdateOrderStatusForm({ orderId, currentStatus }: UpdateOrderStatusFormProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const updateStatus = useUpdateOrderStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === currentStatus) {
      toast.info('Status unchanged');
      return;
    }

    try {
      await updateStatus.mutateAsync({ orderId, status });
      toast.success('Order status updated successfully!');
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Select
        value={status}
        onValueChange={(value) => setStatus(value as OrderStatus)}
        disabled={updateStatus.isPending}
      >
        <SelectTrigger className="w-40 border-sage/30">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={OrderStatus.pending}>Pending</SelectItem>
          <SelectItem value={OrderStatus.processing}>Processing</SelectItem>
          <SelectItem value={OrderStatus.shipped}>Shipped</SelectItem>
          <SelectItem value={OrderStatus.delivered}>Delivered</SelectItem>
        </SelectContent>
      </Select>
      <Button
        type="submit"
        disabled={updateStatus.isPending || status === currentStatus}
        size="sm"
        className="bg-terracotta hover:bg-terracotta-dark text-white"
      >
        {updateStatus.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Update'
        )}
      </Button>
    </form>
  );
}
