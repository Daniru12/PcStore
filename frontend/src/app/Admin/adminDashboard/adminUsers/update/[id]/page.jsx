"use client";

import { useState, useEffect, } from "react";
import { useRouter } from "next/navigation";
import React from 'react'; // Import React

export default function UpdateUserAdmin({ params }) {
    const { id } = React.use(params); // Unwrap params with React.use()
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. User not authenticated.");
                setLoading(false);
                return;
            }

            try {
                // Assuming backend has an endpoint to fetch user by ID for admin
                const response = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error fetching user: ${response.status} ${response.statusText} - ${errorText}`);
                }

                const userData = await response.json();
                setUsername(userData.username);
                setEmail(userData.email);
                setFullname(userData.fullname);
                setRole(userData.role);

            } catch (err) {
                console.error("Error fetching user:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]); // Refetch if ID changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found. User not authenticated.");
            setSubmitting(false);
            return;
        }

        const updatedUser = {
            username,
            email,
            fullname,
            role
        };

        try {
            // Assuming backend has a PUT endpoint to update user by ID for admin
            const response = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error updating user: ${response.status} ${response.statusText} - ${errorText}`);
            }

            // Assuming backend returns the updated user
            const result = await response.json();
            console.log("User updated successfully:", result);
            setSuccess(true);
            // Redirect back to the user list after a short delay
            setTimeout(() => {
                router.push('/Admin/adminDashboard/adminUsers');
            }, 2000);

        } catch (err) {
            console.error("Error updating user:", err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading user data...</div>;
    }

    if (error && !username) { // Show error only if fetching failed and no user data is loaded
        return <div className="text-center text-red-500">Error loading user: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8 flex justify-center items-center">
            <div className="max-w-md w-full bg-white shadow-md rounded-2xl p-6 sm:p-10">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Update User</h1>

                {error && !success && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">User updated successfully!</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            id="fullname"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => router.push('/Admin/adminDashboard/adminUsers')}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={submitting}
                        >
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
