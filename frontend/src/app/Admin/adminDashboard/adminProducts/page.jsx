"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const router = useRouter();
    const [error, setError] = useState(null);

    const handleAddNewProduct = () => {
        router.push('/Admin/adminDashboard/adminProducts/create');
    };

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. User not authenticated.");
                console.error("No token found. User not authenticated.");
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/admin/products", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorBody = await response.text();
                    setError(`Error fetching products: ${response.status} ${response.statusText}. Details: ${errorBody}`);
                    console.error('Error fetching products:', response.status, response.statusText, errorBody);
                    return;
                }

                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError(`Error fetching products: ${error.message}`);
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto bg-white shadow-md rounded-2xl p-6 sm:p-10">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Product Management</h1>

                <div className="flex justify-end mb-4">
                    <button
                        onClick={handleAddNewProduct}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                        Add New Product
                    </button>
                </div>

                {error && (
                    <div className="text-red-600 bg-red-100 border border-red-300 p-4 rounded mb-6 text-sm">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left table-auto border border-gray-200 rounded">
                        <thead className="bg-gray-200 uppercase text-gray-700">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Price ($)</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                products.map(product => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
                                    >
                                        <td className="px-4 py-3">{product.id}</td>
                                        <td className="px-4 py-3">{product.name}</td>
                                        <td className="px-4 py-3 max-w-xs truncate">{product.description}</td>
                                        <td className="px-4 py-3 text-green-600 font-semibold">${product.price}</td>
                                        <td className="px-4 py-3">{product.stock}</td>
                                        <td className="px-4 py-3">{product.category}</td>
                                        <td className="px-4 py-3 text-blue-600 underline break-all">
                                            <a href={product.imageUrl} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
