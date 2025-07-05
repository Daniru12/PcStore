"use client";

import { useEffect, useState, useContext, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "../component/AuthContext"; // Adjust path if needed
import { gsap } from "gsap";

export default function OrderPage() {
  const { isLoggedIn, username, email: authEmail, phone: authPhone } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const containerRef = useRef(null);
  const cartItemsRef = useRef([]);
  const successRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse cart data from query params
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

  // GSAP animations
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (cartItemsRef.current.length > 0 && cart.length > 0) {
      gsap.fromTo(
        cartItemsRef.current.filter((ref) => ref !== null),
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
        }
      );
    }
  }, [cart]);

  useEffect(() => {
    if (successRef.current && orderPlaced) {
      gsap.fromTo(
        successRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
      );
    }
  }, [orderPlaced]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleConfirmOrder = () => {
    if (!isLoggedIn) {
      showToast("Please log in first to place an order.");
      return;
    }

    if (!customerEmail || !customerPhone) {
      showToast("Please enter your email and phone number.");
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

    fetch("http://localhost:8080/api/orders/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderDto),
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Failed to place order");
      })
      .then((data) => {
        setOrderDetails(data);
        setOrderPlaced(true);
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        showToast("Error placing order. Please try again.");
      });
  };

  const handleBackToShopping = () => {
    router.push("/");
  };

  const showToast = (message) => {
    setToastMessage(message);
    gsap.fromTo(
      ".toast",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
    setTimeout(() => {
      gsap.to(".toast", {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => setToastMessage(""),
      });
    }, 4000);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1614624532983-3546bc570814?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Circuit board overlay */}
      <div className="absolute inset-0 bg-[url('/circuit-pattern.png')] opacity-10 pointer-events-none"></div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast fixed top-6 right-6 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl shadow-2xl z-50 border border-red-400 backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      <div ref={containerRef} className="max-w-5xl mx-auto">
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-blue-500/30">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
              PC Build Order
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <p className="text-gray-300 text-xl font-medium">No components in your build.</p>
            </div>
          ) : !orderPlaced ? (
            <>
              {/* Cart Items */}
              <div className="space-y-6 mb-10">
                <h2 className="text-3xl font-bold text-gray-100 mb-6 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold mr-3">
                    {cart.length}
                  </span>
                  Your Build Components
                </h2>
                {cart.map((item, index) => (
                  <div
                    key={item.id}
                    ref={(el) => (cartItemsRef.current[index] = el)}
                    className="group relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center p-6">
                      <div className="relative">
                        <img
                          src={item.imageUrl || "/cpu-placeholder.png"}
                          alt={item.name}
                          className="w-28 h-28 object-cover rounded-lg shadow-md border-2 border-blue-500/50"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 ml-6">
                        <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-blue-400">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-gray-400">×</span>
                          <span className="text-lg font-semibold text-gray-300">
                            {item.quantity}
                          </span>
                          <span className="text-gray-400">=</span>
                          <span className="text-xl font-bold text-green-400">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Information */}
              <div className="bg-gray-800/50 rounded-xl shadow-inner p-8 border border-blue-500/30 mb-8">
                <h2 className="text-3xl font-bold text-gray-100 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Builder Information
                </h2>

                <div className="bg-gray-900/70 rounded-lg p-6 mb-6 border border-blue-500/50">
                  <p className="text-gray-300 text-lg">
                    <span className="font-semibold text-blue-400">Name:</span>
                    <span className="ml-2 font-medium">{customerName || "Guest"}</span>
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <label className="block">
                    <span className="text-gray-300 font-semibold mb-2 block flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Email
                    </span>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full border-2 border-blue-500/30 rounded-lg px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                      placeholder="Enter your email"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-300 font-semibold mb-2 block flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Phone Number
                    </span>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full border-2 border-blue-500/30 rounded-lg px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                      placeholder="Enter your phone number"
                      required
                    />
                  </label>
                </div>
              </div>

              {/* Total and Confirm Button */}
              <div className="bg-gray-800/50 rounded-xl p-8 border border-blue-500/30 flex justify-end items-center">
                <div className="text-right">
                  <p className="text-gray-300 text-lg mb-2">Build Total</p>
                  <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ${calculateTotal().toFixed(2)}
                  </p>
                  <button
                    onClick={handleConfirmOrder}
                    className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-blue-400/20 mt-6"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-2">
                      <span>Confirm Build Order</span>
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </>
          ) : orderDetails ? (
            <div ref={successRef} className="text-center">
              {/* Success Icon */}
              <div className="w-28 h-28 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <svg
                  className="w-14 h-14 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-8">
                Build Order Confirmed!
              </h2>

              <div className="bg-gray-800/50 rounded-xl p-8 shadow-inner border border-green-500/30 text-left max-w-2xl mx-auto mb-8">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center py-3 border-b border-green-500/30">
                    <span className="font-semibold text-gray-300">Order ID:</span>
                    <span className="font-bold text-green-400">#{orderDetails.id || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-green-500/30">
                    <span className="font-semibold text-gray-300">Customer Name:</span>
                    <span className="font-medium text-gray-100">{orderDetails.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-green-500/30">
                    <span className="font-semibold text-gray-300">Email:</span>
                    <span className="font-medium text-gray-100">{orderDetails.customerEmail}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-green-500/30">
                    <span className="font-semibold text-gray-300">Phone:</span>
                    <span className="font-medium text-gray-100">{orderDetails.customerPhone}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-green-500/30">
                    <span className="font-semibold text-gray-300">Order Date:</span>
                    <span className="font-medium text-gray-100">
                      {new Date(orderDetails.orderDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-green-500/30">
                    <span className="font-semibold text-gray-300">Status:</span>
                    <span className="px-3 py-1 bg-yellow-900/50 text-yellow-300 rounded-full text-sm font-medium">
                      {orderDetails.status}
                    </span>
                  </div>
                  <div className="py-3 border-b border-green-500/30">
                    <span className="font-semibold text-gray-300 block mb-2">Notes:</span>
                    <span className="text-gray-400 italic">{orderDetails.notes}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 text-green-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Build Components:
                  </h3>
                  {orderDetails.items && orderDetails.items.length > 0 ? (
                    <div className="space-y-2">
                      {orderDetails.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 px-4 bg-gray-900/70 rounded-lg border border-green-500/30"
                        >
                          <span className="text-gray-300">Component ID: {item.productId}</span>
                          <span className="font-semibold text-green-400">Qty: {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">No components found in order.</p>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-green-500/30 flex justify-end">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-100">Total Amount:</span>
                    <span className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent ml-2">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-lg text-center mt-4">
                  <p className="font-bold text-lg">
                    Build order placed successfully at{" "}
                    {new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}!
                  </p>
                </div>
              </div>

              <button
                onClick={handleBackToShopping}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16l-4-4m0 0l4-4m-4 4h18"
                    />
                  </svg>
                  <span>Back to Build Selection</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-blue-500/50 border-t-blue-400 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-300 text-xl font-medium">Loading build order details...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}