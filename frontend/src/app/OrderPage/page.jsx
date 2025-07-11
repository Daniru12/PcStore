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
    <div className="relative min-h-screen px-4 py-8 pt-24 overflow-hidden sm:px-6 lg:px-8">
      {/* Blurred background image using ::before */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url('https://i.postimg.cc/J0yMcxFC/image.png')`,
        }}
      ></div>
      <div
        className="absolute inset-0 backdrop-blur-md bg-black/30"
      ></div>

      {/* Existing decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute rounded-full top-20 left-20 w-80 h-80 bg-blue-200/20 blur-3xl"></div>
        <div className="absolute rounded-full top-40 right-32 w-96 h-96 bg-purple-200/15 blur-3xl"></div>
        <div className="absolute rounded-full bottom-20 left-1/3 w-72 h-72 bg-indigo-200/20 blur-3xl"></div>
        <div className="absolute w-64 h-64 rounded-full top-1/2 right-1/4 bg-pink-200/15 blur-3xl"></div>
      </div>

      {/* Circuit pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(59,130,246,0.1)_50%,transparent_60%)]"></div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed z-50 px-6 py-4 text-white border border-red-300 shadow-lg toast top-6 right-6 bg-gradient-to-r from-red-500 to-red-600 rounded-xl backdrop-blur-sm">
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

      <div ref={containerRef} className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
       <div className="mb-12 text-center">
  <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-transparent md:text-6xl bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 bg-clip-text drop-shadow-md">
    PC Build Order
  </h1>
  <p className="text-lg font-medium text-gray-400 md:text-xl">
    Configure your dream gaming setup
  </p>
  <div className="w-32 h-1 mx-auto mt-4 rounded-full shadow-md bg-gradient-to-r from-blue-100 to-purple-100"></div>


        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center">
            <div className="max-w-2xl p-16 mx-auto border border-blue-100 shadow-xl bg-white/60 backdrop-blur-sm rounded-3xl">
              <div className="flex items-center justify-center w-32 h-32 mx-auto mb-8 bg-blue-100 rounded-full">
                <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-xl font-medium text-gray-600">No components in your build.</p>
            </div>
          </div>
        ) : !orderPlaced ? (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            {/* Left Side - Cart Items (8 columns) */}
            <div className="xl:col-span-8">
              <div className="p-8 border border-blue-100 shadow-xl bg-white/70 backdrop-blur-sm rounded-2xl">
                <h2 className="flex items-center mb-8 text-3xl font-bold text-gray-800">
                  <span className="flex items-center justify-center w-12 h-12 mr-4 text-lg font-bold text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                    {cart.length}
                  </span>
                  Your Build Components
                </h2>
                
                <div className="space-y-6">
                  {cart.map((item, index) => (
                    <div
                      key={item.id}
                      ref={(el) => (cartItemsRef.current[index] = el)}
                      className="relative overflow-hidden transition-all duration-300 transform border shadow-md group bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-xl hover:-translate-y-1 border-blue-200/50"
                    >
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 group-hover:opacity-100"></div>
                      <div className="relative flex items-center p-6">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.imageUrl || "/cpu-placeholder.png"}
                            alt={item.name}
                            className="object-cover border-2 border-blue-200 rounded-lg shadow-md w-28 h-28"
                          />
                          <div className="absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 ml-6">
                          <h3 className="mb-2 text-xl font-bold text-gray-800 transition-colors duration-200 group-hover:text-blue-600">
                            {item.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-lg">
                            <span className="text-2xl font-bold text-blue-600">${item.price.toFixed(2)}</span>
                            <span className="text-gray-400">×</span>
                            <span className="text-lg font-semibold text-gray-700">{item.quantity}</span>
                            <span className="text-gray-400">=</span>
                            <span className="text-xl font-bold text-green-600">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Customer Info & Summary (4 columns) */}
            <div className="space-y-6 xl:col-span-4">
              {/* Customer Information */}
              <div className="p-8 border border-blue-100 shadow-xl bg-white/70 backdrop-blur-sm rounded-2xl">
                <h2 className="flex items-center mb-6 text-2xl font-bold text-gray-800">
                  <div className="flex items-center justify-center w-10 h-10 mr-3 text-white rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Builder Information
                </h2>

                <div className="p-6 mb-6 border border-blue-200 rounded-lg bg-blue-50">
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold text-blue-600">Name:</span>
                    <span className="ml-2 font-medium">{customerName || "Guest"}</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="flex items-center block mb-2 font-semibold text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </span>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 transition-all duration-200 bg-white border-2 border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
                      placeholder="Enter your email"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="flex items-center block mb-2 font-semibold text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Phone Number
                    </span>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 transition-all duration-200 bg-white border-2 border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
                      placeholder="Enter your phone number"
                      required
                    />
                  </label>
                </div>
              </div>

              {/* Total and Confirm Button */}
              <div className="p-8 border border-blue-100 shadow-xl bg-white/70 backdrop-blur-sm rounded-2xl">
                <div className="text-center">
                  <p className="mb-2 text-lg text-gray-600">Build Total</p>
                  <p className="mb-6 text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                    ${calculateTotal().toFixed(2)}
                  </p>
                  <button
                    onClick={handleConfirmOrder}
                    className="relative w-full px-8 py-4 overflow-hidden text-lg font-bold text-white transition-all duration-300 transform border-2 border-transparent rounded-lg group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105 hover:shadow-xl hover:border-blue-300"
                  >
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white/20 to-transparent group-hover:opacity-100"></div>
                    <div className="relative flex items-center justify-center space-x-2">
                      <span>Confirm Build Order</span>
                      <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : orderDetails ? (
          <div ref={successRef} className="max-w-6xl mx-auto">
            <div className="p-12 border border-green-200 shadow-2xl bg-white/70 backdrop-blur-sm rounded-2xl">
              {/* Success Icon */}
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center mx-auto mb-6 rounded-full shadow-2xl w-28 h-28 bg-gradient-to-r from-green-500 to-teal-500">
                  <svg className="text-white w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mb-4 text-4xl font-extrabold text-transparent bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text">
                  Build Order Confirmed!
                </h2>
                <p className="text-lg text-gray-600">Your custom PC build is now being processed</p>
              </div>

              <div className="p-8 mb-8 text-left border border-green-200 shadow-inner bg-green-50 rounded-xl">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="mb-4 text-xl font-bold text-gray-800">Order Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-3 border-b border-green-300">
                        <span className="font-semibold text-gray-700">Order ID:</span>
                        <span className="font-bold text-green-600">#{orderDetails.id || "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-green-300">
                        <span className="font-semibold text-gray-700">Customer Name:</span>
                        <span className="font-medium text-gray-800">{orderDetails.customerName}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-green-300">
                        <span className="font-semibold text-gray-700">Email:</span>
                        <span className="font-medium text-gray-800">{orderDetails.customerEmail}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-green-300">
                        <span className="font-semibold text-gray-700">Phone:</span>
                        <span className="font-medium text-gray-800">{orderDetails.customerPhone}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-green-300">
                        <span className="font-semibold text-gray-700">Order Date:</span>
                        <span className="font-medium text-gray-800">
                          {new Date(orderDetails.orderDate).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-green-300">
                        <span className="font-semibold text-gray-700">Status:</span>
                        <span className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-full">
                          {orderDetails.status}
                        </span>
                      </div>
                      <div className="py-3 border-b border-green-300">
                        <span className="block mb-2 font-semibold text-gray-700">Notes:</span>
                        <span className="italic text-gray-600">{orderDetails.notes}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center mb-4 text-xl font-bold text-gray-800">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Build Components:
                    </h3>
                    {orderDetails.items && orderDetails.items.length > 0 ? (
                      <div className="space-y-2">
                        {orderDetails.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between px-4 py-2 bg-white border border-green-200 rounded-lg">
                            <span className="text-gray-700">Component ID: {item.productId}</span>
                            <span className="font-semibold text-green-600">Qty: {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="italic text-gray-500">No components found in order.</p>
                    )}
                    
                    <div className="pt-6 mt-6 border-t border-green-300">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-800">Total Amount:</span>
                        <span className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 mt-6 text-center text-white rounded-lg bg-gradient-to-r from-green-500 to-teal-500">
                  <p className="text-lg font-bold">
                    Build order placed successfully at{" "}
                    {new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}!
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleBackToShopping}
                  className="relative px-8 py-4 overflow-hidden text-lg font-bold text-white transition-all duration-300 transform rounded-lg group bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:scale-105 hover:shadow-xl"
                >
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white/20 to-transparent group-hover:opacity-100"></div>
                  <div className="relative flex items-center space-x-2">
                    <svg className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    <span>Back to Build Selection</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="max-w-md p-16 mx-auto border border-blue-100 shadow-xl bg-white/60 backdrop-blur-sm rounded-3xl">
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-blue-300 rounded-full border-t-blue-600 animate-spin"></div>
              <p className="text-xl font-medium text-gray-600">Loading build order details...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}