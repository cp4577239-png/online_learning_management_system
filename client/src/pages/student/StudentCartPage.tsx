import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useEnrollment } from '../../context/EnrollmentContext';
import { ShoppingCart, Trash2, Tag, ShieldCheck, CreditCard, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentCartPageProps {
  navigate: (path: string) => void;
}

export const StudentCartPage: React.FC<StudentCartPageProps> = ({ navigate }) => {
  const {
    cart,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
    checkout,
  } = useCart();
  const { enrollInCourse } = useEnrollment();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; message?: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'card' | 'upi'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const order = await checkout(paymentMethod);
      await Promise.all(order.items.map((item) => {
        const cartItem = cart.find((entry) => entry.course.id === item.courseId);
        return cartItem ? enrollInCourse(cartItem.course) : Promise.resolve(undefined);
      }));
      clearCart();
      removeCoupon();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      navigate('/student/orders');
    } catch (error) {
      console.error('Unable to complete checkout:', error);
      alert(error instanceof Error ? error.message : 'Unable to complete checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Shopping Cart & Enrollment Checkout
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Review your selected courses, apply enterprise promotional codes, and secure your seat.
        </p>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Selected Programs ({cart.length})
            </div>

            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.course.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-start sm:items-center gap-4 truncate">
                    <img
                      src={item.course.thumbnail}
                      alt={item.course.title}
                      referrerPolicy="no-referrer"
                      className="w-24 aspect-video rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="truncate">
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                        {item.course.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.course.title}
                      </h3>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        By {item.course.instructor.name} · {item.course.durationHours}h total
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                    <div className="text-right">
                      <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                        ₹{item.course.price.toLocaleString('en-IN')}
                      </div>
                      {item.course.originalPrice > item.course.price && (
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 line-through font-mono tabular-nums">
                          ₹{item.course.originalPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.course.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                      title="Remove course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Reassurance */}
            <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                All purchases include lifetime access, all future syllabus updates, and an unconditional 30-day money-back guarantee.
              </span>
            </div>
          </div>

          {/* Checkout & Summary Card */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              
              <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Order Summary
              </h3>

              {/* Subtotal lines */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-white">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {coupon && (
                  <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Discount ({coupon.code} - {coupon.discountPercent}%)</span>
                    </span>
                    <span className="font-mono tabular-nums font-semibold">
                      -₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between text-base font-bold text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums text-xl text-indigo-600 dark:text-indigo-400">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Coupon Form */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Promotional or Campus Code
                </label>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. LEARNOVA20"
                    className="flex-1 px-3 py-1.5 text-xs uppercase font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 dark:text-white placeholder:normal-case placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-indigo-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {couponFeedback && (
                  <p className={`text-[11px] ${couponFeedback.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {couponFeedback.message}
                  </p>
                )}
                {coupon && !couponFeedback && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400">
                    <span>Coupon {coupon.code} active</span>
                    <button onClick={removeCoupon} className="text-slate-400 hover:text-rose-500 underline">
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Payment Gateway
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300 font-bold ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    Razorpay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300 font-bold ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300 font-bold ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    Cards
                  </button>
                </div>
              </div>

              {/* Complete Checkout CTA */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Verifying Transaction...</span>
                ) : (
                  <>
                    <span>Complete Enrollment · ₹{total.toLocaleString('en-IN')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto shadow-sm">
          <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Your cart is currently empty</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Explore our curriculum to find the right specialization for your engineering goals.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
          >
            Explore Masterclasses
          </button>
        </div>
      )}

    </div>
  );
};
