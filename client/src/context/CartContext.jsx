import { createContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import toast from 'react-hot-toast';

export const CartContext = createContext(null);

/**
 * CartProvider — dual mode:
 *  • Guest (no token): items stored in localStorage only
 *  • Logged in:        items synced with backend, localStorage as cache
 */
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const isLoggedIn = () => !!localStorage.getItem('token');

  const recalculate = (items) => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    setCartCount(count);
    setCartTotal(total);
  };

  const setItemsFromBackend = (cart) => {
    const items = cart.items || [];
    setCartItems(items);
    recalculate(items);
    // cache locally
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  // ── Load cart on mount ────────────────────────────────────────────────────
  useEffect(() => {
    const loadCart = async () => {
      if (isLoggedIn()) {
        try {
          setLoading(true);
          const { data } = await cartService.getCart();
          if (data.success) setItemsFromBackend(data.cart);
        } catch {
          // fallback to localStorage
          const cached = localStorage.getItem('cartItems');
          if (cached) {
            const items = JSON.parse(cached);
            setCartItems(items);
            recalculate(items);
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Guest — load from localStorage
        const cached = localStorage.getItem('cartItems');
        if (cached) {
          const items = JSON.parse(cached);
          setCartItems(items);
          recalculate(items);
        }
      }
    };
    loadCart();
  }, []);

  // ── addToCart ─────────────────────────────────────────────────────────────
  const addToCart = useCallback(async (product, selectedSize, quantity = 1) => {
    if (isLoggedIn()) {
      try {
        const { data } = await cartService.addToCart(product._id, selectedSize, quantity);
        if (data.success) {
          setItemsFromBackend(data.cart);
        }
      } catch (error) {
        const msg = error.response?.data?.message || 'Failed to add to cart';
        toast.error(msg);
      }
    } else {
      // Guest mode — manipulate local state
      const itemPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      setCartItems((prev) => {
        const existing = prev.findIndex(
          (i) => i.product?._id === product._id && i.selectedSize === selectedSize
        );
        let next;
        if (existing > -1) {
          next = prev.map((item, idx) =>
            idx === existing ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          next = [
            ...prev,
            {
              product,
              selectedSize,
              quantity,
              price: itemPrice,
              isOutfit: false,
            },
          ];
        }
        recalculate(next);
        localStorage.setItem('cartItems', JSON.stringify(next));
        return next;
      });
    }
  }, []);

  // ── updateQty ─────────────────────────────────────────────────────────────
  const updateQty = useCallback(async (productId, selectedSize, quantity) => {
    if (quantity < 1) return;

    if (isLoggedIn()) {
      try {
        const { data } = await cartService.updateCartItem(productId, selectedSize, quantity);
        if (data.success) setItemsFromBackend(data.cart);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update quantity');
      }
    } else {
      setCartItems((prev) => {
        const next = prev.map((item) =>
          item.product?._id === productId && item.selectedSize === selectedSize
            ? { ...item, quantity }
            : item
        );
        recalculate(next);
        localStorage.setItem('cartItems', JSON.stringify(next));
        return next;
      });
    }
  }, []);

  // ── removeFromCart ────────────────────────────────────────────────────────
  const removeFromCart = useCallback(async (productId, selectedSize) => {
    if (isLoggedIn()) {
      try {
        const { data } = await cartService.removeFromCart(productId, selectedSize);
        if (data.success) setItemsFromBackend(data.cart);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to remove item');
      }
    } else {
      setCartItems((prev) => {
        const next = prev.filter(
          (item) => !(item.product?._id === productId && item.selectedSize === selectedSize)
        );
        recalculate(next);
        localStorage.setItem('cartItems', JSON.stringify(next));
        return next;
      });
    }
  }, []);

  // ── clearCart ─────────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (isLoggedIn()) {
      try {
        await cartService.clearCart();
      } catch {
        // silent — still clear locally
      }
    }
    setCartItems([]);
    setCartCount(0);
    setCartTotal(0);
    localStorage.removeItem('cartItems');
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        loading,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
