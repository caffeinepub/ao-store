import { ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Store, ShoppingBag, Package, Heart } from 'lucide-react';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <header className="bg-white border-b border-terracotta/20 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/assets/generated/store-icon.dim_64x64.png" alt="Store" className="w-10 h-10" />
              <span className="text-2xl font-bold text-terracotta group-hover:text-terracotta-dark transition-colors">
                A Store
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/products"
                className="text-sage-dark hover:text-terracotta transition-colors font-medium"
              >
                Products
              </Link>
              {isAuthenticated && (
                <Link
                  to="/my-orders"
                  className="flex items-center gap-2 text-sage-dark hover:text-terracotta transition-colors font-medium"
                >
                  <ShoppingBag className="w-4 h-4" />
                  My Orders
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link
                    to="/admin/products"
                    className="flex items-center gap-2 text-sage-dark hover:text-terracotta transition-colors font-medium"
                  >
                    <Package className="w-4 h-4" />
                    Manage Products
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="flex items-center gap-2 text-sage-dark hover:text-terracotta transition-colors font-medium"
                  >
                    <Store className="w-4 h-4" />
                    Manage Orders
                  </Link>
                </>
              )}
            </nav>

            <div className="flex items-center gap-4">
              <LoginButton />
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex flex-wrap gap-4 mt-4 pt-4 border-t border-terracotta/10">
            <Link
              to="/products"
              className="text-sm text-sage-dark hover:text-terracotta transition-colors font-medium"
            >
              Products
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-orders"
                className="text-sm text-sage-dark hover:text-terracotta transition-colors font-medium"
              >
                My Orders
              </Link>
            )}
            {isAdmin && (
              <>
                <Link
                  to="/admin/products"
                  className="text-sm text-sage-dark hover:text-terracotta transition-colors font-medium"
                >
                  Manage Products
                </Link>
                <Link
                  to="/admin/orders"
                  className="text-sm text-sage-dark hover:text-terracotta transition-colors font-medium"
                >
                  Manage Orders
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-sage-dark text-cream py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span>© {new Date().getFullYear()} A Store. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-terracotta fill-terracotta" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terracotta hover:text-terracotta-light transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
