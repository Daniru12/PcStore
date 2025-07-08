"use client";

import { useState, useEffect } from "react";


export default function OrderSummaryPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // For demo purposes, using sample data since localStorage isn't available
    const sampleOrder = [
      { id: 1, name: "Wireless Bluetooth Headphones", price: 89.99, quantity: 1 },
      { id: 2, name: "USB-C Cable (3ft)", price: 12.99, quantity: 2 },
      { id: 3, name: "Laptop Stand", price: 34.50, quantity: 1 }
    ];
    
    // In real app, uncomment this line:
    // const savedOrder = JSON.parse(localStorage.getItem("orderSummary"));
    // if (savedOrder) {
    //   setOrder(savedOrder);
    // }
    
    // Using sample data for demo
    setOrder(sampleOrder);
  }, []);

  if (!order) {
    return (
      <div className="container px-4 py-8 mx-auto text-center">
        <h2 className="mb-4 text-2xl font-bold">No order found</h2>
        <a href="/products" className="text-blue-600 hover:underline">
          ← Back to Products
        </a>
      </div>
    );
  }

  const subtotal = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  // Generate order details
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="container max-w-2xl px-4 py-8 pt-16 mx-auto ">
      {/* Header */}
      <div className="p-8 mb-6 bg-white rounded-lg shadow-lg">
        <div className="pb-6 mb-6 text-center border-b">
          <h1 className="mb-2 text-4xl font-bold text-gray-800">INVOICE</h1>
          <div className="w-16 h-1 mx-auto bg-blue-600"></div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-700">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-mono font-medium">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{currentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{currentTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">Credit Card</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-700">Bill To</h3>
            <div className="text-sm text-gray-600">
              <p className="font-medium">John Doe</p>
              <p>123 Main Street</p>
              <p>New York, NY 10001</p>
              <p>United States</p>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
          <div className="flex items-center">
            <div className="w-3 h-3 mr-3 bg-green-500 rounded-full"></div>
            <span className="font-semibold text-green-800">Order Confirmed</span>
          </div>
          <p className="mt-1 text-sm text-green-700">Thank you for your purchase! Your order has been successfully processed.</p>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-2 py-3 text-sm font-semibold text-left text-gray-700">Item</th>
                  <th className="px-2 py-3 text-sm font-semibold text-center text-gray-700">Qty</th>
                  <th className="px-2 py-3 text-sm font-semibold text-right text-gray-700">Unit Price</th>
                  <th className="px-2 py-3 text-sm font-semibold text-right text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item, index) => (
                  <tr key={item.id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="px-2 py-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">SKU: {item.id.toString().padStart(6, '0')}</div>
                    </td>
                    <td className="px-2 py-4 text-center text-gray-700">{item.quantity}</td>
                    <td className="px-2 py-4 text-right text-gray-700">${item.price.toFixed(2)}</td>
                    <td className="px-2 py-4 font-medium text-right text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="pt-4 border-t-2 border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping:</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="pt-2 mt-4 border-t border-gray-300">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 mt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 gap-6 text-sm text-gray-600 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold text-gray-800">Shipping Information</h4>
              <p>Estimated delivery: 3-5 business days</p>
              <p>Tracking number will be sent via email</p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-800">Return Policy</h4>
              <p>30-day return policy</p>
              <p>Items must be in original condition</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
          <button className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
            Print Invoice
          </button>
          <button className="px-6 py-3 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50">
            Download PDF
          </button>
          <a 
            href="/products" 
            className="inline-block px-6 py-3 font-medium text-center text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Continue Shopping
          </a>
        </div>
      </div>

      {/* Additional Information */}
      <div className="p-6 text-center rounded-lg bg-gray-50">
        <p className="mb-2 text-gray-600">Questions about your order?</p>
        <p className="text-sm text-gray-500">
          Contact us at <span className="text-blue-600">support@example.com</span> or call <span className="text-blue-600">(555) 123-4567</span>
        </p>
      </div>
    </div>
  );
}