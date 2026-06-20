import { Outlet } from 'react-router-dom';

// TODO: Build full Navbar and Footer in next steps
const Layout = () => {
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
