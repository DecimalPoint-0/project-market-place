import React, { useState, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.css';
import apiInstance from "../../utils/axios";
import Toast from "../../plugin/Toast";
import Cookies from 'js-cookie';

function Transactions(){
    
    const accessToken = Cookies.get('access_token')
    const [transactions, setTransactions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const fetchTransactions = async () => {
        try{
            setIsLoading(true)
            const response = await apiInstance.get('user/transactions', 
                { headers: { 
                    Authorization: `Bearer ${accessToken}`
                }}
            )
            setTransactions(response.data.results || [])
        }catch(error){
            console.log(error)
            Toast('error', 'Error loading transactions')
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    // Pagination
    const totalPages = Math.ceil(transactions.length / itemsPerPage)
    const startIdx = (currentPage - 1) * itemsPerPage
    const endIdx = startIdx + itemsPerPage
    const currentTransactions = transactions.slice(startIdx, endIdx)

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch (e) {
            return dateString
        }
    }

    const getTransactionIcon = (description) => {
        if (description?.toLowerCase().includes('cashout') || description?.toLowerCase().includes('withdrawal')) {
            return 'fa-arrow-down text-red-600 bg-red-100'
        }
        if (description?.toLowerCase().includes('purchase') || description?.toLowerCase().includes('purchase')) {
            return 'fa-arrow-up text-green-600 bg-green-100'
        }
        return 'fa-exchange-alt text-blue-600 bg-blue-100'
    }

    const getStatusBadge = (description) => {
        if (description?.toLowerCase().includes('pending')) {
            return 'bg-yellow-100 text-yellow-700'
        }
        if (description?.toLowerCase().includes('failed') || description?.toLowerCase().includes('declined')) {
            return 'bg-red-100 text-red-700'
        }
        return 'bg-green-100 text-green-700'
    }

    return (
        <>
            <main className="flex">
                
                {/* Main Content */}
                <div className="w-full pt-6 px-4 md:px-8 pb-8 bg-slate-50 min-h-[calc(100vh-64px)]">
                    <div className="max-w-6xl mx-auto">
                        
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Transaction History</h1>
                            <p className="text-slate-600">View all your cashouts, purchases, and payment activities</p>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
                                    <p className="text-slate-600">Loading transactions...</p>
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && transactions.length === 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
                                <div className="text-5xl text-slate-300 mb-4">
                                    <i className="fas fa-inbox"></i>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Transactions Yet</h3>
                                <p className="text-slate-600">Your transaction history will appear here once you start making purchases or cashouts.</p>
                            </div>
                        )}

                        {/* Transactions Table */}
                        {!isLoading && transactions.length > 0 && (
                            <>
                                {/* Desktop View */}
                                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Type</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Amount</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentTransactions.map((t, i) => (
                                                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                                    <td className="px-6 py-4">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTransactionIcon(t?.description)}`}>
                                                            <i className={`fas ${getTransactionIcon(t?.description).split(' ')[0]}`}></i>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-700 font-medium">{t?.description || 'Transaction'}</td>
                                                    <td className="px-6 py-4 text-slate-600">{formatDate(t?.date)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="font-semibold text-lg text-slate-800">
                                                            ₦{parseFloat(t?.amount || 0).toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(t?.description)}`}>
                                                            {t?.status || 'Completed'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile View */}
                                <div className="md:hidden space-y-4">
                                    {currentTransactions.map((t, i) => (
                                        <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-100 p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTransactionIcon(t?.description)}`}>
                                                        <i className={`fas ${getTransactionIcon(t?.description).split(' ')[0]}`}></i>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-700">{t?.description || 'Transaction'}</p>
                                                        <p className="text-xs text-slate-500">{formatDate(t?.date)}</p>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-lg text-slate-800">₦{parseFloat(t?.amount || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-end">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(t?.description)}`}>
                                                    {t?.status || 'Completed'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-8">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                        
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-4 py-2 rounded-lg border transition ${
                                                    currentPage === page
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'border-slate-300 hover:bg-slate-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

        </>
    );
}

export default Transactions;