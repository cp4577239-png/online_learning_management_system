import React, { createContext, useContext, useEffect, useState } from 'react';
import { Course, CartItem, Order } from '../types';
import { createOrder, listMyOrders } from '../services/learningService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartItem[];
  wishlist: Course[];
  orders: Order[];
  coupon: { code: string; discountPercent: number } | null;
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  addToWishlist: (course: Course) => void;
  removeFromWishlist: (courseId: string) => void;
  isInWishlist: (courseId: string) => boolean;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  checkout: (paymentMethod: 'razorpay' | 'card' | 'upi') => Promise<Order>;
  subtotal: number;
  discountAmount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Course[]>([]);
  const [coupon, setCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let active = true;
    setOrders([]);
    if (!user) return () => { active = false; };

    void listMyOrders()
      .then((records) => { if (active) setOrders(records); })
      .catch((error: unknown) => console.error('Unable to load orders:', error));

    return () => { active = false; };
  }, [user?.id]);

  const addToCart = (course: Course) => {
    if (!cart.some((item) => item.course.id === course.id)) {
      setCart((previous) => [...previous, { course, addedAt: new Date().toISOString() }]);
    }
  };

  const removeFromCart = (courseId: string) => {
    setCart((previous) => previous.filter((item) => item.course.id !== courseId));
  };

  const clearCart = () => setCart([]);
  const isInCart = (courseId: string) => cart.some((item) => item.course.id === courseId);

  const addToWishlist = (course: Course) => {
    if (!wishlist.some((item) => item.id === course.id)) {
      setWishlist((previous) => [...previous, course]);
    }
  };

  const removeFromWishlist = (courseId: string) => {
    setWishlist((previous) => previous.filter((course) => course.id !== courseId));
  };

  const isInWishlist = (courseId: string) => wishlist.some((course) => course.id === courseId);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'LEARNOVA20') {
      setCoupon({ code: clean, discountPercent: 20 });
      return { success: true, message: '20% discount coupon applied successfully!' };
    }
    if (clean === 'ARCHITECT15') {
      setCoupon({ code: clean, discountPercent: 15 });
      return { success: true, message: '15% architect partner discount applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try LEARNOVA20 or ARCHITECT15' };
  };

  const removeCoupon = () => setCoupon(null);
  const subtotal = cart.reduce((sum, item) => sum + item.course.price, 0);
  const discountAmount = coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const checkout = async (paymentMethod: 'razorpay' | 'card' | 'upi'): Promise<Order> => {
    if (!user) throw new Error('You must be logged in to complete a purchase.');
    if (!cart.length) throw new Error('Your cart is empty.');

    const order = await createOrder({
      items: cart.map((item) => ({ courseId: item.course.id })),
      couponApplied: coupon?.code,
      paymentMethod,
    });
    setOrders((previous) => [order, ...previous]);
    return order;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        coupon,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        checkout,
        subtotal,
        discountAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
