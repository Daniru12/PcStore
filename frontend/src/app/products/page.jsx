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
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const router = useRouter();


  // Advertisement images without captions
  const ads = [
    {
      image: "https://i.postimg.cc/gJr4WdMg/image.png",
    },
    {
      image: "https://i.postimg.cc/C5VphDJK/image.png",
    },
    {
      image: "https://i.postimg.cc/J7KkBqVZ/image.png",
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
    if (product.stock <= 0) return;
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
    if (cart.length > 0) {
      // Create order summary
      const orderSummary = {
        items: cart,
        total: calculateTotal(),
        timestamp: new Date().toISOString()
      };
      
      // For demo purposes, show order summary in alert
      alert(`Order placed! Total: ${calculateTotal().toFixed(2)}\nItems: ${cart.length}`);
      
      // Clear cart after order
      setCart([]);
      setIsCartOpen(false);
    }
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
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
        Error loading products: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
      {/* Top Navigation and Advertisement Slider */}
      <nav className="bg-gradient-to-r from-purple-800 to-indigo-800 shadow-lg">
        {/* Advertisement Slider */}
        <div className="relative w-full h-100 overflow-hidden bg-gradient-to-r from-purple-700 to-indigo-700">
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
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
        className="fixed top-4 right-4 z-50 flex items-center bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-all duration-300 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span>Cart</span>
        {cartCount > 0 && (
          <span className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {cartCount}
          </span>
        )}
      </button>

      {/* Search and Filter Section */}
      <div className="container mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-gray-300 border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
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
              className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
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
                className="w-1/2 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-gray-300 border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: parseFloat(e.target.value) || 100000 })}
                className="w-1/2 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white placeholder-gray-300 border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md text-white border border-white/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <option value="name" className="text-gray-800">Sort by Name</option>
              <option value="price-low" className="text-gray-800">Price: Low to High</option>
              <option value="price-high" className="text-gray-800">Price: High to Low</option>
            </select>
          </div>

          {/* Filter Results and Clear Button */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-white">
              Showing {filteredProducts.length} of {products.length} products
            </span>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <h1 className="text-4xl font-extrabold text-center mb-12 text-white">
          Our Products
        </h1>
        {filteredProducts.length === 0 ? (
          <div className="text-center text-white text-xl">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 relative border border-white/20"
              >
                <div className="relative">
                  <img
                    src={product.imageUrl || "/placeholder-image.png"}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-gray-600/70 backdrop-blur-md flex items-center justify-center">
                      <span className="text-red-500 text-lg font-bold">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-2">{product.name}</h2>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
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
                      className="flex-1 py-2 px-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
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

      {/* Product Details Modal */}
      {isProductDetailsOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeProductDetails}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={selectedProduct.imageUrl || "/placeholder-image.png"}
                    alt={selectedProduct.name}
                    className="w-full h-96 object-cover rounded-xl"
                  />
                  {selectedProduct.stock <= 0 && (
                    <div className="absolute inset-0 bg-gray-600/70 backdrop-blur-md flex items-center justify-center rounded-xl">
                      <span className="text-red-500 text-xl font-bold">Out of Stock</span>
                    </div>
                  )}
                </div>
                
                {/* Additional Product Images (placeholder) */}
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={selectedProduct.imageUrl || "/placeholder-image.png"}
                      alt={`${selectedProduct.name} view ${i}`}
                      className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h1>
                  <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Product Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Product ID:</span>
                        <span className="ml-2 font-medium">{selectedProduct.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="ml-2 font-medium">{selectedProduct.category || 'Uncategorized'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Brand:</span>
                        <span className="ml-2 font-medium">{selectedProduct.brand || 'Generic'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">SKU:</span>
                        <span className="ml-2 font-medium">{selectedProduct.sku || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-3xl font-bold text-purple-600">
                        ${selectedProduct.price.toFixed(2)}
                      </span>
                      {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                        <span className="text-lg text-gray-500 line-through ml-2">
                          ${selectedProduct.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`text-sm ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700">Quantity:</label>
                      <select className="border rounded-lg px-3 py-2 text-sm">
                        {[...Array(Math.min(selectedProduct.stock, 10))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          closeProductDetails();
                        }}
                        className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                          selectedProduct.stock > 0
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={selectedProduct.stock <= 0}
                      >
                        {selectedProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      <button className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                        ♡ Wishlist
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Features */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Features</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• High-quality materials and construction</li>
                    <li>• Satisfaction guarantee</li>
                    <li>• Fast shipping available</li>
                    <li>• 30-day return policy</li>
                  </ul>
                </div>

                {/* Reviews Preview */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Customer Reviews</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex text-yellow-400">
                      {"★".repeat(5)}
                    </div>
                    <span className="text-sm text-gray-600">(4.8 out of 5 stars)</span>
                  </div>
                  <p className="text-sm text-gray-600">Based on 156 reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setIsCartOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="mb-6 border-b pb-4">
                    <div className="flex items-center">
                      <img
                        src={item.imageUrl || "/placeholder-image.png"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg mr-4"
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
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center mt-3 space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100 border rounded">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
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
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors mt-6 font-semibold"
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