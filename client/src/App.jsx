import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public routes wrapped in Layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes — will be added step by step */}
                {/* <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> */}
                {/* <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} /> */}
                {/* <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} /> */}
                {/* <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} /> */}

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
