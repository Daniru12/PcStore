"use client";

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../component/AuthContext';
import { Search, Filter, Eye, MessageSquare, User, Mail, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Download, RefreshCw, ChevronDown, ChevronUp, Reply, Archive, Star, MoreVertical } from 'lucide-react';

export default function AdminInq() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [expandedInquiry, setExpandedInquiry] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [selectedInquiries, setSelectedInquiries] = useState([]);
    const { isLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        if (!isLoggedIn) {
            setError('User not logged in.');
            setLoading(false);
            return;
        }

        const fetchInquiries = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:8080/api/admin/inquiries', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setInquiries(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, [isLoggedIn]);

    const handleStatusChange = async (id, newStatus) => {
        if (!isLoggedIn) {
            console.error('Cannot update status: User not logged in.');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/api/admin/inquiries/${id}/status?status=${newStatus}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setInquiries(inquiries.map(inquiry =>
                inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
            ));
        } catch (error) {
            console.error('Error updating inquiry status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'RESOLVED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'RESOLVED':
                return <CheckCircle className="w-4 h-4" />;
            case 'IN_PROGRESS':
                return <Clock className="w-4 h-4" />;
            case 'PENDING':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <XCircle className="w-4 h-4" />;
        }
    };

    const getPriorityColor = (inquiry) => {
        const keywords = ['urgent', 'important', 'asap', 'emergency'];
        const hasUrgentKeywords = keywords.some(keyword => 
            inquiry.subject?.toLowerCase().includes(keyword) || 
            inquiry.message?.toLowerCase().includes(keyword)
        );
        return hasUrgentKeywords ? 'border-l-red-500' : 'border-l-blue-500';
    };

    const filteredInquiries = inquiries.filter(inquiry => {
        const matchesSearch = inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             inquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sortedInquiries = [...filteredInquiries].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        if (sortBy === 'createdAt') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }
        
        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const totalPages = Math.ceil(sortedInquiries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedInquiries = sortedInquiries.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleSelectInquiry = (id) => {
        setSelectedInquiries(prev => 
            prev.includes(id) 
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        setSelectedInquiries(
            selectedInquiries.length === paginatedInquiries.length 
                ? [] 
                : paginatedInquiries.map(i => i.id)
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading inquiries...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 text-center max-w-md">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Error Loading Inquiries</h2>
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

    if (inquiries.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                    <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">No Inquiries Found</h2>
                    <p className="text-slate-600">There are no customer inquiries at the moment.</p>
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
                            <h1 className="text-4xl font-bold text-slate-800 mb-2">Customer Inquiries</h1>
                            <p className="text-slate-600">Manage and respond to customer messages</p>
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
                                <p className="text-sm font-medium text-slate-600">Total Inquiries</p>
                                <p className="text-2xl font-bold text-slate-800">{inquiries.length}</p>
                            </div>
                            <MessageSquare className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Pending</p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {inquiries.filter(i => i.status === 'PENDING').length}
                                </p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">In Progress</p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {inquiries.filter(i => i.status === 'IN_PROGRESS').length}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Resolved</p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {inquiries.filter(i => i.status === 'RESOLVED').length}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
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
                                placeholder="Search inquiries by name, email, subject, or message..."
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
                                <option value="PENDING">Pending</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                            </select>
                            <Filter className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedInquiries.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">
                                {selectedInquiries.length} inquiries selected
                            </span>
                            <div className="flex items-center space-x-2">
                                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                    Mark as Resolved
                                </button>
                                <button className="px-3 py-1 text-sm bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200">
                                    Archive
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Inquiries Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedInquiries.length === paginatedInquiries.length}
                                            onChange={handleSelectAll}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        <button 
                                            onClick={() => handleSort('id')}
                                            className="flex items-center space-x-1 hover:text-slate-700"
                                        >
                                            <span>ID</span>
                                            {sortBy === 'id' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        <button 
                                            onClick={() => handleSort('createdAt')}
                                            className="flex items-center space-x-1 hover:text-slate-700"
                                        >
                                            <span>Date</span>
                                            {sortBy === 'createdAt' && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {paginatedInquiries.map((inquiry, index) => (
                                    <tr 
                                        key={inquiry.id} 
                                        className={`hover:bg-slate-50 transition-colors duration-150 border-l-4 ${getPriorityColor(inquiry)}`}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedInquiries.includes(inquiry.id)}
                                                onChange={() => handleSelectInquiry(inquiry.id)}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900">#{inquiry.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">{inquiry.name}</div>
                                                    <div className="text-sm text-slate-500 flex items-center">
                                                        <Mail className="w-3 h-3 mr-1" />
                                                        {inquiry.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-900 font-medium">{inquiry.subject}</div>
                                            <div className="text-sm text-slate-500 truncate max-w-xs">{inquiry.message}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-slate-900">{new Date(inquiry.createdAt).toLocaleDateString()}</div>
                                            <div className="text-sm text-slate-500">{new Date(inquiry.createdAt).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(inquiry.status)}`}>
                                                {getStatusIcon(inquiry.status)}
                                                <span className="ml-1">{inquiry.status.replace('_', ' ')}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={() => setExpandedInquiry(expandedInquiry === inquiry.id ? null : inquiry.id)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <select
                                                    value={inquiry.status}
                                                    onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                                                    className="text-xs border border-slate-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="RESOLVED">Resolved</option>
                                                </select>
                                                <button className="text-green-600 hover:text-green-800 transition-colors duration-200">
                                                    <Reply className="w-4 h-4" />
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
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedInquiries.length)} of {sortedInquiries.length} inquiries
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

                {/* Expanded Inquiry Details */}
                {expandedInquiry && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-slate-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-slate-900">Inquiry Details</h3>
                                    <button 
                                        onClick={() => setExpandedInquiry(null)}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                {inquiries.find(i => i.id === expandedInquiry) && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Inquiry ID</label>
                                                <p className="text-sm text-slate-900">#{inquiries.find(i => i.id === expandedInquiry).id}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(inquiries.find(i => i.id === expandedInquiry).status)}`}>
                                                    {getStatusIcon(inquiries.find(i => i.id === expandedInquiry).status)}
                                                    <span className="ml-1">{inquiries.find(i => i.id === expandedInquiry).status.replace('_', ' ')}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
                                            <p className="text-sm text-slate-900">{inquiries.find(i => i.id === expandedInquiry).name}</p>
                                            <p className="text-sm text-slate-500">{inquiries.find(i => i.id === expandedInquiry).email}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                            <p className="text-sm text-slate-900">{inquiries.find(i => i.id === expandedInquiry).subject}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                            <div className="bg-slate-50 p-4 rounded-lg">
                                                <p className="text-sm text-slate-900 whitespace-pre-wrap">{inquiries.find(i => i.id === expandedInquiry).message}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Created At</label>
                                            <p className="text-sm text-slate-900">{new Date(inquiries.find(i => i.id === expandedInquiry).createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className="flex space-x-3 pt-4">
                                            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                                <Reply className="w-4 h-4 mr-2 inline" />
                                                Reply
                                            </button>
                                            <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200">
                                                <Archive className="w-4 h-4" />
                                            </button>
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