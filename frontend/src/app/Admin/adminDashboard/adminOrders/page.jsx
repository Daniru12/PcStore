"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Download, RefreshCw, Package, Calendar, User, Mail, CheckCircle, Clock, XCircle, AlertCircle, ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('orderDate');
    const [sortOrder, setSortOrder] = useState('desc');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/orders/');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled':
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'shipped':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return <CheckCircle className="w-4 h-4" />;
            case 'pending':
            case 'processing':
                return <Clock className="w-4 h-4" />;
            case 'cancelled':
            case 'failed':
                return <XCircle className="w-4 h-4" />;
            case 'shipped':
                return <Package className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             order.id?.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || order.status?.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        if (sortBy === 'orderDate') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }
        
        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = sortedOrders.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 text-center max-w-md">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Error Loading Orders</h2>
                    <p className="text-slate-600">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                    <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">No Orders Found</h2>
                    <p className="text-slate-600">There are no orders in the system yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-800 mb-2">Order Management</h1>
                            <p className="text-slate-600">Manage and track all customer orders</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </button>
                            <button 
                                onClick={() => window.location.reload()}
                                className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Total Orders</p>
                                <p className="text-2xl font-bold text-slate-800">{orders.length}</p>
                            </div>
                            <Package className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Pending</p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {orders.filter(o => o.status?.toLowerCase() === 'pending').length}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Completed</p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {orders.filter(o => o.status?.toLowerCase() === 'completed').length}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">This Month</p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {orders.filter(o => {
                                        const orderDate = new Date(o.orderDate);
                                        const now = new Date();
                                        return orderDate.getMonth() === now.getMonth() && 
                                               orderDate.getFullYear() === now.getFullYear();
                                    }).length}
                                </p>
                            </div>
                            <Calendar className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search orders by customer name, email, or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <Filter className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        <button 
                                            onClick={() => handleSort('id')}
                                            className="flex items-center space-x-1 hover:text-slate-700"
                                        >
                                            <span>Order ID</span>
                                            {sortBy === 'id' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        <button 
                                            onClick={() => handleSort('orderDate')}
                                            className="flex items-center space-x-1 hover:text-slate-700"
                                        >
                                            <span>Order Date</span>
                                            {sortBy === 'orderDate' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {paginatedOrders.map((order, index) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors duration-150" style={{ animationDelay: `${index * 50}ms` }}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">#{order.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">{order.customerName}</div>
                                                    <div className="text-sm text-slate-500 flex items-center">
                                                        <Mail className="w-3 h-3 mr-1" />
                                                        {order.customerEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-900">{new Date(order.orderDate).toLocaleDateString()}</div>
                                            <div className="text-sm text-slate-500">{new Date(order.orderDate).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="ml-1 capitalize">{order.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Package className="w-4 h-4 text-slate-400 mr-1" />
                                                <span className="text-sm text-slate-900">{order.items?.length || 0} items</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="text-green-600 hover:text-green-800 transition-colors duration-200">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-800 transition-colors duration-200">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-700">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedOrders.length)} of {sortedOrders.length} orders
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-slate-700">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-slate-900">Order Details</h3>
                                    <button 
                                        onClick={() => setExpandedOrder(null)}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {orders.find(o => o.id === expandedOrder) && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Order ID</label>
                                                <p className="text-sm text-slate-900">#{orders.find(o => o.id === expandedOrder).id}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(orders.find(o => o.id === expandedOrder).status)}`}>
                                                    {getStatusIcon(orders.find(o => o.id === expandedOrder).status)}
                                                    <span className="ml-1 capitalize">{orders.find(o => o.id === expandedOrder).status}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
                                            <p className="text-sm text-slate-900">{orders.find(o => o.id === expandedOrder).customerName}</p>
                                            <p className="text-sm text-slate-500">{orders.find(o => o.id === expandedOrder).customerEmail}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Order Date</label>
                                            <p className="text-sm text-slate-900">{new Date(orders.find(o => o.id === expandedOrder).orderDate).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Items</label>
                                            <p className="text-sm text-slate-900">{orders.find(o => o.id === expandedOrder).items?.length || 0} items</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                                            <p className="text-sm text-slate-900">{orders.find(o => o.id === expandedOrder).notes || 'No notes'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}