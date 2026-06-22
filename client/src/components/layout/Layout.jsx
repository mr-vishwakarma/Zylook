import { Outlet, useLocation } from 'react-router-dom';

// Layout component wraps the route contents and conditionally renders the Navbar/Footer
const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-black">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full max-w-[1126px] mx-auto border-x border-[var(--border)] text-center box-border">
      <header className="flex justify-between items-center px-8 py-6 border-b border-[var(--border)] bg-white/70 dark:bg-[#16171d]/70 backdrop-blur-md">
        <div className="text-2xl font-bold tracking-tight text-[var(--text-h)]">
          <a href="/" className="hover:opacity-85 transition-opacity">
            Zylook<span className="text-[var(--accent)]">.</span>
          </a>
        </div>
        <nav className="flex items-center gap-4">
          {/* Navigation links will be added in subsequent steps */}
        </nav>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center p-8">
        <Outlet />
      </main>

      <footer className="px-8 py-6 border-t border-[var(--border)] text-sm text-[var(--text)] bg-white/50 dark:bg-[#16171d]/50 backdrop-blur-md">
        <p>&copy; {new Date().getFullYear()} Zylook. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
