import { createContext, useState } from 'react';

export const CartContext = createContext(null);

// TODO: Implement full cart logic in Step 5
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
