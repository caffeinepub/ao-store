import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import ProductCatalogPage from './pages/ProductCatalogPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfileSetupModal from './components/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <ProfileSetupModal />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ProductCatalogPage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductCatalogPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: AdminProductsPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: AdminOrdersPage,
});

const myOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-orders',
  component: MyOrdersPage,
});

const orderSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-success',
  component: OrderSuccessPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  adminProductsRoute,
  adminOrdersRoute,
  myOrdersRoute,
  orderSuccessRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
