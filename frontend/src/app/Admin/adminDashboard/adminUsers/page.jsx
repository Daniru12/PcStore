"use client";

import { useState, useEffect } from "react";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. User not authenticated.");
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/admin/users", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    console.error('Error fetching users:', response.status, response.statusText);
                    const errorText = await response.text();
                    console.error('Response body:', errorText);
                    return;
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8">
            <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-6 sm:p-10">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">User Management</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-200 rounded-md shadow-sm">
                        <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
                            <tr>
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Username</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Full Name</th>
                                <th className="px-4 py-3 text-left">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-200"
                                >
                                    <td className="px-4 py-3">{user.id}</td>
                                    <td className="px-4 py-3">{user.username}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3">{user.fullname}</td>
                                    <td className="px-4 py-3 capitalize text-blue-600 font-medium">{user.role}</td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-6 text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
