"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);

  const router = useRouter();

  // Advertisement images without captions
  const ads = [
    {
      image: "https://i.postimg.cc/gJr4WdMg/image.png ",
    },
    {
      image: "https://i.postimg.cc/C5VphDJK/image.png ",
    },
    {
      image: "https://i.postimg.cc/J7KkBqVZ/image.png ",
    },
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and search products
  useEffect(() => {
    let filtered = products;
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const addToCart = (product) => {
    if (product.stock <= 0)
      return;
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) return prevCart;
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
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = Math.max(1, Math.min(item.quantity + delta, item.stock));
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const viewProductDetails = (product) => {
    router.push(`/products/${product.id}`); // Now `router` is defined ✅
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    // Create order summary
    const orderSummary = {
      items: cart,
      total: calculateTotal(),
      timestamp: new Date().toISOString()
    };

    // Encode cart data for URL
    const encodedCart = encodeURIComponent(JSON.stringify(orderSummary.items));

    // Navigate to order page with cart data
    router.push(`/OrderPage?cart=${encodedCart}`);

    // Optional: Clear cart after navigating
    setCart([]);
    setIsCartOpen(false);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange({ min: 0, max: 1000 });
    setSortBy("name");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        <div className="w-12 h-12 border-t-4 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 rounded-lg bg-red-50">
        Error loading products: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
      {/* Top Navigation and Advertisement Slider */}
      <nav className="shadow-lg bg-gradient-to-r from-purple-800 to-indigo-800">
        {/* Advertisement Slider */}
        <div className="relative w-full overflow-hidden h-80 bg-gradient-to-r from-purple-700 to-indigo-700">
          {ads.map((ad, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={ad.image}
                alt={`Advertisement ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
          <button
            onClick={prevSlide}
            className="absolute p-2 text-white transition-colors transform -translate-y-1/2 bg-purple-600 rounded-full left-4 top-1/2 hover:bg-purple-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute p-2 text-white transition-colors transform -translate-y-1/2 bg-purple-600 rounded-full right-4 top-1/2 hover:bg-purple-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? "bg-white" : "bg-gray-400"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </nav>

      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed top-1.5 right-4 z-50 flex items-center bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-all duration-300 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 mr-2 h-" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span>Cart</span>
        {cartCount > 0 && (
          <span className="flex items-center justify-center w-6 h-6 ml-2 text-xs text-white bg-red-500 rounded-full">
            {cartCount}
          </span>
        )}
      </button>

      {/* Search and Filter Section */}
      <div className="container p-6 mx-auto">
        <div className="p-6 mb-8 shadow-xl bg-white/10 backdrop-blur-md rounded-2xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 text-white placeholder-gray-300 border rounded-lg bg-white/20 backdrop-blur-md border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-300 absolute left-3 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 text-white border rounded-lg bg-white/20 backdrop-blur-md border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="all" className="text-gray-800">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category} className="text-gray-800">
                  {category}
                </option>
              ))}
            </select>
            {/* Price Range */}
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: parseFloat(e.target.value) || 0 })}
                className="w-1/2 px-3 py-2 text-white placeholder-gray-300 border rounded-lg bg-white/20 backdrop-blur-md border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseFloat(e.target.value) || 100000 })}
                className="w-1/2 px-3 py-2 text-white placeholder-gray-300 border rounded-lg bg-white/20 backdrop-blur-md border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 text-white border rounded-lg bg-white/20 backdrop-blur-md border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="name" className="text-gray-800">Sort by Name</option>
              <option value="price-low" className="text-gray-800">Price: Low to High</option>
              <option value="price-high" className="text-gray-800">Price: High to Low</option>
            </select>
          </div>
          {/* Filter Results and Clear Button */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-white">
              Showing {filteredProducts.length} of {products.length} products
            </span>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <h1 className="mb-12 text-4xl font-extrabold text-center text-white">
          Our Products
        </h1>
        {filteredProducts.length === 0 ? (
          <div className="text-xl text-center text-white">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="relative overflow-hidden transition-transform duration-300 transform border shadow-lg bg-white/10 backdrop-blur-md rounded-xl hover:scale-105 border-white/20"
              >
                <div className="relative">
                  <img
                    src={product.imageUrl || "/placeholder-image.png"}
                    alt={product.name}
                    className="object-cover w-full h-56"
                  />
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-600/70 backdrop-blur-md">
                      <span className="text-lg font-bold text-red-500">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="mb-2 text-xl font-semibold text-white">{product.name}</h2>
                  <p className="mb-4 text-sm text-gray-300 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-purple-300">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/products/${product.id}`)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                        product.stock > 0
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setIsCartOpen(false)}
              className="absolute text-gray-500 transition-colors top-4 right-4 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="mb-6 text-3xl font-bold text-gray-800">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="pb-4 mb-6 border-b">
                    <div className="flex items-center">
                      <img
                        src={item.imageUrl || "/placeholder-image.png"}
                        alt={item.name}
                        className="object-cover w-20 h-20 mr-4 rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-gray-600">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">Stock: {item.stock}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 transition-colors hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center mt-3 space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1 text-gray-700 transition-colors bg-gray-200 rounded-l-lg hover:bg-gray-300 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100 border rounded">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1 text-gray-700 transition-colors bg-gray-200 rounded-r-lg hover:bg-gray-300 disabled:opacity-50"
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-6">
                  <p className="text-xl font-semibold text-gray-800">
                    Total: ${calculateTotal().toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3 mt-6 font-semibold text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}