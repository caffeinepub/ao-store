import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import OrderForm from '../components/OrderForm';
import { Loader2, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function ProductCatalogPage() {
  const { data: products, isLoading, error } = useGetAllProducts();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;

  // Create a function to add products to order
  const handleAddToOrder = (product: any) => {
    // This will be handled by OrderForm component
    const event = new CustomEvent('addToOrder', { detail: product });
    window.dispatchEvent(event);
  };

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
          <AlertDescription>Failed to load products. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Business Store"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-terracotta/80 to-sage/60 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Welcome to Business Store
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Discover quality products at great prices. Browse our collection and place your order today.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-sage-dark">Our Products</h2>
          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground">Log in to place orders</p>
          )}
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                onAddToOrder={handleAddToOrder}
                showAddButton={isAuthenticated}
              />
            ))}
          </div>
        )}
      </section>

      {/* Order Form (Floating Cart) */}
      {products && products.length > 0 && <OrderForm products={products} />}
    </div>
  );
}
