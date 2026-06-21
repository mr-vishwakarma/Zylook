import { Outlet, useLocation } from 'react-router-dom';

// Layout component wraps the route contents and conditionally renders the Navbar/Footer
const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <div className="app-layout" style={{ minHeight: '100vh', justifyContent: 'center', background: '#09090b' }}>
        <main className="main-content" style={{ padding: '1rem', width: '100%' }}>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <header className="navbar">
        <div className="navbar-brand">
          <a href="/">Zylook</a>
        </div>
        <nav className="navbar-links">
          {/* Navigation links will be added in subsequent steps */}
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2026 Zylook. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
