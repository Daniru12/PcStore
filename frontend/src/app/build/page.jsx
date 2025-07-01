// pages/index.js
"use client";
import { useState } from 'react';

export default function build() {
  const products = [
    {
      id: 1,
      name: "XPPen Star G640 Digital Graphic Tablet 6x4 Inch Art Tablet",
      price: 16000,
      stockStatus: "Out of Stock",
      brand: "XP-PEN",
      type: "Pen Tablet",
      image: "/product1.jpg"
    },
    {
      id: 2,
      name: "Huion HS611 Pen & Drawing Tablet",
      price: 29500,
      stockStatus: "Out of Stock",
      brand: "HUION",
      type: "Pen Tablet",
      image: "/product2.jpg"
    },
    {
      id: 3,
      name: "Huion HS64 Pen Tablet",
      price: 15500,
      stockStatus: "In Stock",
      brand: "HUION",
      type: "Pen Tablet",
      image: "/product3.jpg"
    }
  ];

  // Filter states
  const [priceRange, setPriceRange] = useState([15500, 29500]);
  const [availability, setAvailability] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);

  // Apply filters
  const filteredProducts = products.filter((product) => {
    const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchAvailability = availability.length === 0 || availability.includes(product.stockStatus);
    const matchBrand = brands.length === 0 || brands.includes(product.brand);
    const matchType = types.length === 0 || types.includes(product.type);

    return inPriceRange && matchAvailability && matchBrand && matchType;
  });

  // Toggle checkbox values
  const toggleFilter = (array, setArray, value) => {
    if (array.includes(value)) {
      setArray(array.filter((item) => item !== value));
    } else {
      setArray([...array, value]);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">PRICE RANGE</h2>
          <input
            type="range"
            min="15500"
            max="29500"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([15500, parseInt(e.target.value)])}
            className="w-full accent-yellow-400"
          />
          <p className="text-sm mt-2">{`${priceRange[0]} LKR - ${priceRange[1]} LKR`}</p>

          <h2 className="text-xl font-bold mt-6 mb-4">AVAILABILITY</h2>
          {["Out of Stock", "In Stock", "Coming Soon", "Pre-order"].map((status) => (
            <label key={status} className="block">
              <input
                type="checkbox"
                checked={availability.includes(status)}
                onChange={() => toggleFilter(availability, setAvailability, status)}
                className="mr-2 accent-yellow-400"
              />
              {status}
            </label>
          ))}

          <h2 className="text-xl font-bold mt-6 mb-4">GRAPHICS TABLET BRAND</h2>
          {["HUION", "XP-PEN"].map((brand) => (
            <label key={brand} className="block">
              <input
                type="checkbox"
                checked={brands.includes(brand)}
                onChange={() => toggleFilter(brands, setBrands, brand)}
                className="mr-2 accent-yellow-400"
              />
              {brand}
            </label>
          ))}

          <h2 className="text-xl font-bold mt-6 mb-4">GRAPHICS TABLET TYPE</h2>
          {["Pen Tablet"].map((type) => (
            <label key={type} className="block">
              <input
                type="checkbox"
                checked={types.includes(type)}
                onChange={() => toggleFilter(types, setTypes, type)}
                className="mr-2 accent-yellow-400"
              />
              {type}
            </label>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-800 border border-yellow-400 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-300">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-yellow-400 font-bold text-xl mb-2">{product.price} LKR</p>
                <button
                  className={`px-4 py-1 rounded-full text-sm ${
                    product.stockStatus === "In Stock"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-400 text-black"
                  }`}
                >
                  {product.stockStatus}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}