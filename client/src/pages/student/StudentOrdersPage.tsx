import React from 'react';
import { useCart } from '../../context/CartContext';
import { Receipt, Download, CheckCircle, ExternalLink } from 'lucide-react';

export const StudentOrdersPage: React.FC = () => {
  const { orders } = useCart();

  const handleDownloadInvoice = (orderNumber: string) => {
    // In-browser mock PDF generation receipt
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Tax Invoice - ${orderNumber}</title></head>
          <body style="font-family: sans-serif; padding: 40px; color: #1e293b;">
            <h2>Learnova Technologies Ltd. - Official Tax Invoice</h2>
            <p>Invoice / Order Reference: <strong>${orderNumber}</strong></p>
            <p>Status: Payment Authorized & Captured</p>
            <hr/>
            <p>Thank you for advancing your technical career with Learnova.</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Orders & Payment Receipts
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Review transaction receipts, download GST-compliant tax invoices, and track payment authorizations.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{order.orderNumber}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle className="w-3 h-3" />
                    <span>Completed</span>
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Placed on {order.createdAt} · Gateway: {order.paymentMethod.toUpperCase()}
                </div>
              </div>

              <button
                onClick={() => handleDownloadInvoice(order.orderNumber)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Invoice</span>
              </button>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="font-medium text-slate-900 dark:text-white">{item.title}</span>
                  <span className="font-mono tabular-nums">₹{item.price.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="text-slate-500 dark:text-slate-400 font-mono">
                {order.couponApplied && (
                  <span>Promo code applied: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">{order.couponApplied}</strong></span>
                )}
              </div>
              <div className="text-right">
                <span className="text-slate-500 dark:text-slate-400 mr-2">Total Paid:</span>
                <span className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-500 dark:text-slate-400">
            <Receipt className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p>No orders on file yet. Enroll in courses to review invoices and transaction logs here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
