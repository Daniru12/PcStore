"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductDetail({ params }) {
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/products/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setProduct(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg text-gray-700">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error loading product details: {error}</div>;
  }

  if (!product) {
    return <div className="text-center text-gray-500 mt-10">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 text-sm text-gray-500">
        <span className="hover:underline cursor-pointer text-blue-600">Home</span> / <span className="capitalize">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 bg-white shadow-xl rounded-2xl overflow-hidden p-6 md:p-10 transition-all duration-300">
        {/* Product Image */}
        <div className="md:w-1/2 group overflow-hidden rounded-xl">
          <img
            src={product.imageUrl || "/placeholder-image.png"}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">{product.description}</p>

            <div className="text-2xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600"><span className="font-medium">Category:</span> {product.category}</p>
              <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                <span className="font-medium">In Stock:</span> {product.stock}
              </p>
            </div>
          </div>

          {/* Add to Cart Button (optional) */}
          <div className="mt-6">
            <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition duration-200">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
