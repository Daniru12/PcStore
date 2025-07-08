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
    <div className="min-h-screen p-6 pt-24 text-white bg-gray-900">
      <div className="flex flex-col gap-8 mx-auto max-w-7xl md:flex-row">
        {/* Sidebar */}
        <div className="p-6 bg-gray-800 rounded-lg md:w-1/4">
          <h2 className="mb-4 text-xl font-bold">PRICE RANGE</h2>
          <input
            type="range"
            min="15500"
            max="29500"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([15500, parseInt(e.target.value)])}
            className="w-full accent-yellow-400"
          />
          <p className="mt-2 text-sm">{`${priceRange[0]} LKR - ${priceRange[1]} LKR`}</p>

          <h2 className="mt-6 mb-4 text-xl font-bold">AVAILABILITY</h2>
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

          <h2 className="mt-6 mb-4 text-xl font-bold">GRAPHICS TABLET BRAND</h2>
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

          <h2 className="mt-6 mb-4 text-xl font-bold">GRAPHICS TABLET TYPE</h2>
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
        <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="overflow-hidden transition-transform duration-300 bg-gray-800 border border-yellow-400 rounded-lg shadow-md hover:scale-105">
              <img src={product.image} alt={product.name} className="object-cover w-full h-48" />
              <div className="p-4 text-center">
                <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
                <p className="mb-2 text-xl font-bold text-yellow-400">{product.price} LKR</p>
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