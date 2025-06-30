"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OrderPage() {
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const cartData = searchParams.get("cart");
    if (cartData) {
      setCart(JSON.parse(decodeURIComponent(cartData)));
    }
  }, [searchParams]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleConfirmOrder = async () => {
    const orderDto = {
      customerName: "John Doe", // Replace with dynamic user data if available
      customerEmail: "john.doe@example.com", // Replace with dynamic user data if available
      customerPhone: "123-456-7890", // Replace with dynamic user data if available
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      status: "Pending",
      parts: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl || "/placeholder-image.png",
        description: item.description || ""
      })),
      pcs: [], // Assuming no PC items for now; adjust if needed
      notes: "Standard delivery"
    };

    try {
      const response = await fetch("http://localhost:8080/api/orders/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDto),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
        setOrderPlaced(true);
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    }
  };

  const handleBackToShopping = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Order Confirmation</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">No items in the order.</p>
      ) : !orderPlaced ? (
        <>
          {cart.map((item) => (
            <div key={item.id} className="mb-4 border-b pb-4">
              <div className="flex items-center">
                <img
                  src={item.imageUrl || "/placeholder-image.png"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-4 text-right">
            <p className="text-lg font-semibold">Total: ${calculateTotal().toFixed(2)}</p>
          </div>
          <button
            onClick={handleConfirmOrder}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors mt-4"
          >
            Confirm Order
          </button>
        </>
      ) : orderDetails ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Details</h2>
          <p><strong>Order ID:</strong> {orderDetails.id || "N/A"}</p>
          <p><strong>Customer Name:</strong> {orderDetails.customerName}</p>
          <p><strong>Email:</strong> {orderDetails.customerEmail}</p>
          <p><strong>Phone:</strong> {orderDetails.customerPhone}</p>
          <p><strong>Order Date:</strong> {new Date(orderDetails.orderDate).toLocaleString()}</p>
          <p><strong>Estimated Delivery:</strong> {new Date(orderDetails.estimatedDelivery).toLocaleString()}</p>
          <p><strong>Status:</strong> {orderDetails.status}</p>
          <p><strong>Notes:</strong> {orderDetails.notes}</p>
          <h3 className="text-xl font-semibold mt-4">Items:</h3>
          {orderDetails.parts.map((item) => (
            <div key={item.id} className="mb-2">
              <p>{item.name} - ${item.price.toFixed(2)} x {item.quantity}</p>
            </div>
          ))}
          <p className="text-lg font-semibold mt-4">Total: ${calculateTotal().toFixed(2)}</p>
          <p className="text-green-600 font-semibold mt-2">Order placed successfully at {new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}!</p>
          <button
            onClick={handleBackToShopping}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Back to Shopping
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading order details...</p>
      )}
    </div>
  );
}