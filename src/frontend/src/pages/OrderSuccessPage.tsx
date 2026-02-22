import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto border-sage/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <CardTitle className="text-3xl text-terracotta">Order Placed Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            Thank you for your order. We've received it and will process it shortly.
          </p>
          <p className="text-sm text-muted-foreground">
            You can track your order status in the "My Orders" section.
          </p>
        </CardContent>
        <CardFooter className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate({ to: '/my-orders' })}
            className="bg-terracotta hover:bg-terracotta-dark text-white"
          >
            View My Orders
          </Button>
          <Button
            onClick={() => navigate({ to: '/products' })}
            variant="outline"
            className="border-sage hover:bg-sage/10"
          >
            Continue Shopping
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
