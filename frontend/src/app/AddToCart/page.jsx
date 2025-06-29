"use client";

import { useState, useContext } from "react";
import { CartContext } from "./CartContext"; // Assuming CartContext is in app/

export default function AddToCart({ product }) {
  const { addToCart } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = async () => {
    if (quantity <= 0) return;
    setIsAdding(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToCart({ ...product, quantity });
      setQuantity(0);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value >= 0 ? value : 0);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        value={quantity}
        onChange={handleQuantityChange}
        className="w-16 p-2 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Qty"
      />
      <button
        onClick={handleAddToCart}
        disabled={isAdding || quantity <= 0}
        className={`px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 
          ${isAdding || quantity <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}