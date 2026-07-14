import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Shop from './pages/Shop';
import Collections from './pages/Collections';

// Seller Mocks
import SellerOnboarding from './pages/seller/SellerOnboarding';
import VendorDashboard from './pages/seller/VendorDashboard';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';

import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOutfits from './pages/admin/AdminOutfits';
import { OutfitComboBuilder } from './pages/admin/OutfitComboBuilder';
import AdminDashboard from './pages/admin/AdminDashboard';

// Real Admin Pages (Phase 2)
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#16171d',
                color: '#fff',
                borderRadius: '10px',
              },
            }}
          />
          <Router>
            <Routes>
              {/* Public routes wrapped in Layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

                {/* Protected routes — will be added step by step */}
                {/* <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> */}
                {/* <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} /> */}
                {/* <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} /> */}
                {/* <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} /> */}

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Seller Mock Routes */}
              <Route path="/seller/onboarding" element={<SellerOnboarding />} />
              <Route path="/seller/dashboard" element={<VendorDashboard />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/:id/edit" element={<AdminProductForm />} />
                <Route path="outfits" element={<AdminOutfits />} />
                <Route path="outfits/builder" element={<OutfitComboBuilder />} />
                <Route path="outfits/:id/edit" element={<OutfitComboBuilder />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="analytics" element={<AdminAnalytics />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
