"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "../component/AuthContext"; // adjust path if needed

export default function OrderPage() {
  const { isLoggedIn, username, email: authEmail, phone: authPhone } = useContext(AuthContext);

  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const cartData = searchParams.get("cart");
    if (cartData) {
      try {
        setCart(JSON.parse(decodeURIComponent(cartData)));
      } catch (e) {
        console.error("Failed to parse cart query param", e);
      }
    }
  }, [searchParams]);

  // Pre-fill user data on login
  useEffect(() => {
    if (isLoggedIn) {
      setCustomerName(username);
      setCustomerEmail(authEmail);
      setCustomerPhone(authPhone);
    }
  }, [isLoggedIn, username, authEmail, authPhone]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleConfirmOrder = async () => {
    if (!customerEmail || !customerPhone) {
      alert("Please enter your email and phone number.");
      return;
    }

    const orderDto = {
      customerName: customerName || "Guest",
      customerEmail,
      customerPhone,
      orderDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      notes: "Please deliver between 9 AM - 5 PM",
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
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
            <div key={item.id} className="mb-4 border-b pb-4 flex items-center">
              <img
                src={item.imageUrl || "/placeholder-image.png"}
                alt={item.name}
                className="w-16 h-16 object-cover rounded mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
            </div>
          ))}

          <div className="my-6 p-4 border rounded bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">Customer Information</h2>
            <p>
              <strong>Name:</strong> {customerName || "Guest"}
            </p>

            <label className="block mt-3">
              <span className="text-gray-700">Email:</span>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter your email"
                required
              />
            </label>

            <label className="block mt-3">
              <span className="text-gray-700">Phone Number:</span>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter your phone number"
                required
              />
            </label>
          </div>

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
          <p><strong>Status:</strong> {orderDetails.status}</p>
          <p><strong>Notes:</strong> {orderDetails.notes}</p>
          <h3 className="text-xl font-semibold mt-4">Items:</h3>
          {orderDetails.items && orderDetails.items.length > 0 ? (
            orderDetails.items.map((item, index) => (
              <p key={index}>
                Product ID: {item.productId} - Quantity: {item.quantity}
              </p>
            ))
          ) : (
            <p>No items found in order.</p>
          )}
          <p className="text-lg font-semibold mt-4">Total: ${calculateTotal().toFixed(2)}</p>
          <p className="text-green-600 font-semibold mt-2">
            Order placed successfully at {new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}!
          </p>
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
