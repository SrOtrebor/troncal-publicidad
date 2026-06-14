import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Admin panel has its own layout
  if (isAdmin) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
