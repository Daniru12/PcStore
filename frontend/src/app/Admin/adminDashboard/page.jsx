"use client";

import Link from 'next/link';

export default function AdminDashboard() {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <nav>
                <ul>
                    <li>
                        <Link href="/Admin/adminDashboard/adminUsers">
                            View Users
                        </Link>
                    </li>
                    <li>
                        <Link href="/Admin/adminDashboard/adminProducts">
                            View Products
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}