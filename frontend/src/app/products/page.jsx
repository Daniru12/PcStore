"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handlePlaceOrder = () => {
    if (cart.length > 0) {
      router.push(`/OrderPage?cart=${encodeURIComponent(JSON.stringify(cart))}`);
      setIsCartOpen(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading products: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 relative">
      <button
        onClick={() => setIsCartOpen(true)}
        className="absolute top-4 right-4 flex items-center bg-blue-500 text-white px-3 py-2 rounded-full hover:bg-blue-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {cartCount > 0 && <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{cartCount}</span>}
      </button>

      {isCartOpen && (
        <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 h-3/4 overflow-y-auto">
            <button
              onClick={() => setIsCartOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
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
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="bg-gray-300 px-3 py-1 rounded-l"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-white border-t border-b">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="bg-gray-300 px-3 py-1 rounded-r"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-4">
                  <p className="text-lg font-semibold">Total: ${calculateTotal().toFixed(2)}</p>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors mt-4"
                >
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold text-center mb-8 mt-12">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.imageUrl || "/placeholder-image.png"}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="p-4 pt-0 flex justify-between items-center">
              <button
                onClick={() => router.push(`/products/${product.id}`)}
                className="text-blue-600 hover:underline text-sm"
              >
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}