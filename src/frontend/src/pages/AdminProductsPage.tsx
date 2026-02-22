import { useGetAllProducts } from '../hooks/useQueries';
import AdminGuard from '../components/AdminGuard';
import AddProductForm from '../components/AddProductForm';
import ProductCard from '../components/ProductCard';
import { Loader2, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

function AdminProductsContent() {
  const { data: products, isLoading, error } = useGetAllProducts();

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
        <AlertDescription>Failed to load products. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <AddProductForm />

      <div>
        <h2 className="text-2xl font-bold text-sage-dark mb-6">All Products</h2>
        {!products || products.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-sage/30 rounded-lg">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No products yet. Add your first product above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id.toString()} product={product} showAddButton={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-terracotta mb-8">Manage Products</h1>
        <AdminProductsContent />
      </div>
    </AdminGuard>
  );
}
