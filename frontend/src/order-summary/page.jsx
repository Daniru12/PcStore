"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function OrderSummaryPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("orderSummary"));
    if (savedOrder) {
      setOrder(savedOrder);
    }
  }, []);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No order found</h2>
        <Link href="/products" className="text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Summary</h1>
      <p className="mb-4 text-green-600">Thank you for your purchase!</p>

      {order.map((item) => (
        <div key={item.id} className="border-b py-4 flex justify-between">
          <span>{item.name}</span>
          <span>{item.quantity} x ${item.price.toFixed(2)}</span>
        </div>
      ))}

      <div className="mt-4 text-right">
        <strong>Total: ${total.toFixed(2)}</strong>
      </div>

      <div className="mt-8 text-center">
        <Link href="/products" className="text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </div>
    </div>
  );
}