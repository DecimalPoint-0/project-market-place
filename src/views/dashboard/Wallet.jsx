import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import LeftNavBar from "./LeftNavBar";
import '@fortawesome/fontawesome-free/css/all.css';
import Cookies from 'js-cookie';
import Toast from "../../plugin/Toast";
import useAxios from "../../utils/useAxios";
import apiInstance from "../../utils/axios";
import Loader from "../../components/Loader";


function Wallet(){

    const accessToken = Cookies.get('access_token');
    const [wallet, setWallet] = useState({
        balance: 0,
        account_name: '',
        account_number: '',
        bank: ''
    })

    const [cashout, setCashout] = useState({
        amount: '',
    })

    const [account, setAccount] = useState({
        account_name: '',
        account_number: '',
        bank: ''
    })

    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [cashoutHistory, setCashoutHistory] = useState([]);

    const handleAmountChange = (event) => {
        setCashout({
            ...cashout,
            [event.target.name]: event.target.value,
        });
    }

    const handlecashOut = async (event) => {
        event.preventDefault();

        if (!cashout.amount || cashout.amount <= 0) {
            Toast('error', 'Please enter a valid amount')
            return
        }

        const formData = new FormData()
        formData.append("amount", cashout.amount)

        try {
            setIsLoading(true)
            const response = await apiInstance.post(`user/cashout`, formData,
                { headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`
                }}
            )
            Toast('success', "Cashout Processed Successfully")
            setCashout({ amount: '' })
            setIsLoading(false)
            fetchWallet()
        } catch (error) {
            console.log(error)
            Toast('error', error.response?.data?.message || 'An error occurred')
            setIsLoading(false)
        }
    }

    const handleChange = (event) => {
        setAccount({
            ...account,
            [event.target.name]: event.target.value,
        });
    }

    const handleUpdateData = async (event) => {
        event.preventDefault();
        
        const formData = new FormData()
        formData.append("account_name", account.account_name)
        formData.append("account_number", account.account_number)
        formData.append("bank", account.bank)
        
        try {
            setIsLoading(true)
            const response = await apiInstance.post(`user/wallet`, formData,
                { headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`
                }}
            )
            Toast('success', "Account Details Updated Successfully")
            setIsLoading(false)
            fetchWallet()
        } catch (error) {
            console.log(error)
            Toast('error', 'Error updating account details')
            setIsLoading(false)
        }
    }

    const fetchWallet = async () => {
        try {
            const response = await apiInstance.get('user/wallet',
                // includes JWT 
                { headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`
                }}
            )
            setWallet(response.data)
            setAccount({
                account_name: response.data.account_name || '',
                account_number: response.data.account_number || '',
                bank: response.data.bank || ''
            })
        } catch (error) {
            console.log(error)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(wallet.account_number || '')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const fetchCashoutHistory = async () => {
        try {
            const response = await apiInstance.get('user/cashout',
                { headers: { 
                    Authorization: `Bearer ${accessToken}`
                }}
            )
            setCashoutHistory(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getStatusBadgeColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'approved':
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-slate-100 text-slate-800'
        }
    }

    useEffect(() =>{
        fetchWallet()
        fetchCashoutHistory()
    }, [])
    
    return (
        <>
            {isLoading && <Loader />}
            <AdminNavBar />

            <main className="flex">
                <LeftNavBar />

                {/* Main Content */}
                <div className="flex-1 md:ml-64 pt-6 px-4 md:px-8 pb-8 bg-slate-50 min-h-[calc(100vh-64px)]">
                    <div className="max-w-6xl mx-auto">
                        
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Wallet & Payments</h1>
                            <p className="text-slate-600">Manage your earnings and withdrawal requests</p>
                        </div>

                        {/* Balance Card */}
                        <div className="bg-gradient-primary text-white rounded-xl p-8 mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-200 mb-2">Available Balance</p>
                                    <h2 className="text-4xl md:text-5xl font-bold">₦{wallet.balance?.toLocaleString() || 0}</h2>
                                </div>
                                <div className="text-6xl opacity-10">
                                    <i className="fas fa-wallet"></i>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            
                            {/* Cashout Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                        <i className="fas fa-money-bill-wave"></i>
                                    </div>
                                    <h3 className="text-lg font-bold text-primary">Request Withdrawal</h3>
                                </div>

                                <form onSubmit={handlecashOut} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Amount (₦)</label>
                                        <input 
                                            type="number" 
                                            name="amount" 
                                            value={cashout.amount} 
                                            onChange={handleAmountChange}
                                            placeholder="Enter amount to withdraw"
                                            min="1"
                                            step="0.01"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-arrow-down"></i>
                                                Request Withdrawal
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-slate-500">
                                        <i className="fas fa-info-circle mr-1"></i>
                                        Withdrawals are processed within 2-3 business days
                                    </p>
                                </form>
                            </div>

                            {/* Bank Details Display */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        <i className="fas fa-bank"></i>
                                    </div>
                                    <h3 className="text-lg font-bold text-primary">Bank Details</h3>
                                </div>

                                <div className="space-y-4">
                                    {wallet.account_name ? (
                                        <>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase">Account Name</p>
                                                <p className="text-lg font-semibold text-slate-800">{wallet.account_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase">Account Number</p>
                                                <p className="text-lg font-semibold text-slate-800">{wallet.bank}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase">Bank Name</p>
                                                <p className="text-lg font-semibold text-slate-800">{wallet.bank}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-6">
                                            <i className="fas fa-exclamation-circle text-3xl text-slate-400 mb-2"></i>
                                            <p className="text-slate-600">No bank details set up yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Update Bank Details Form */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                                    <i className="fas fa-edit"></i>
                                </div>
                                <h3 className="text-lg font-bold text-primary">Update Bank Information</h3>
                            </div>

                            <form onSubmit={handleUpdateData} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <i className="fas fa-user mr-2 text-primary"></i>Account Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name="account_name" 
                                        value={account.account_name} 
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <i className="fas fa-building mr-2 text-primary"></i>Bank Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name="bank" 
                                        value={account.bank} 
                                        onChange={handleChange}
                                        placeholder="e.g., GTBank, Access Bank"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <i className="fas fa-credit-card mr-2 text-primary"></i>Account Number
                                    </label>
                                    <input 
                                        type="text" 
                                        name="account_number" 
                                        value={account.account_number} 
                                        onChange={handleChange}
                                        placeholder="10 digits"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>

                                <div className="md:col-span-3">
                                    <button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold py-2 px-6 rounded-lg transition flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save"></i>
                                                Save Bank Details
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Cashout History Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                    <i className="fas fa-history"></i>
                                </div>
                                <h3 className="text-lg font-bold text-primary">Withdrawal History</h3>
                            </div>

                            {cashoutHistory && cashoutHistory.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Date</th>
                                                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Amount</th>
                                                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Bank Details</th>
                                                <th className="text-left py-4 px-4 text-sm font-semibold text-slate-700">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cashoutHistory.map((cashout, index) => (
                                                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                                    <td className="py-4 px-4">
                                                        <p className="text-sm text-slate-700">
                                                            {new Date(cashout.created_at || cashout.date).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {new Date(cashout.created_at || cashout.date).toLocaleTimeString()}
                                                        </p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="text-sm font-semibold text-slate-800">₦{parseFloat(cashout.amount || 0).toLocaleString('en-NG', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="text-sm text-slate-700">{cashout.account_number || '-'}</p>
                                                        <p className="text-xs text-slate-500">{cashout.bank || '-'}</p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeColor(cashout.status)}`}>
                                                            {cashout.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <i className="fas fa-inbox text-4xl text-slate-300 mb-4"></i>
                                    <p className="text-slate-600">No withdrawal requests yet</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}

export default Wallet;
