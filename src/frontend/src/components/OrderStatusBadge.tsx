import { OrderStatus } from '../backend';
import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case OrderStatus.pending:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case OrderStatus.processing:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case OrderStatus.shipped:
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case OrderStatus.delivered:
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusLabel = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Badge variant="secondary" className={getStatusColor()}>
      {getStatusLabel()}
    </Badge>
  );
}
