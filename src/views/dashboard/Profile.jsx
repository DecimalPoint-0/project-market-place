import React, { useState, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.css';
import apiInstance from "../../utils/axios";
import Cookies from 'js-cookie';
import Toast from "../../plugin/Toast";
import useAxios from "../../utils/useAxios";
import Loader from "../../components/Loader";
import { useAuthStore } from "../../store/auth";

function Profile(){

    const accessToken = Cookies.get('access_token');
    const [profile, setProfile] = useState({
        name: "",
        contact: "",
        specialization: "",
        email: "",
        projects: 0,
        likes: 0
    })

    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchProfile = async () => {
        try {
            setIsLoading(true)
            const response = await apiInstance.get(`user/me`)
            setProfile(response.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const handleChange = (event) => {
        setProfile({
            ...profile,
            [event.target.name]: event.target.value,
        });
    }

    const handleUpdateData = async (event) => {
        event.preventDefault();
        setIsLoading(true)

        const formData = new FormData()
        formData.append("name", profile.name)
        formData.append("specialization", profile.specialization)
        formData.append("contact", profile.contact)
        if (password) {
            formData.append("password", password)
        }

        try {
            const response = await apiInstance.patch(`user/me`, formData, {
                headers: { 
                    "Content-Type": "multipart/form-data"
                },
            })
            Toast('success', "Profile Updated Successfully")
            setPassword("")
            setIsLoading(false)
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        } catch (error) {
            console.log(error)
            Toast('error', "Error updating profile")
            setIsLoading(false)
        }
    }

    useEffect(() =>{
        fetchProfile()
    }, [])

    return (
        <>

            <main className="flex">
                
                {/* Main Content */}
                <div className="w-full pt-6 px-4 md:px-8 pb-8 bg-slate-50 min-h-[calc(100vh-64px)]">
                    <div className="max-w-6xl mx-auto">
                        
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Profile Settings</h1>
                            <p className="text-slate-600">Update your profile information and preferences</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Profile Card */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
                                    {/* Avatar */}
                                    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    
                                    {/* Profile Info */}
                                    <h2 className="text-xl font-bold text-primary mb-1">{profile?.name || 'User'}</h2>
                                    <p className="text-slate-600 text-sm mb-4">{profile?.email}</p>
                                    
                                    {profile?.specialization && (
                                        <p className="inline-block bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full mb-6">
                                            {profile?.specialization}
                                        </p>
                                    )}
                                    
                                    {/* Stats */}
                                    <div className="space-y-3 pt-6 border-t border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600 text-sm">Projects</span>
                                            <span className="text-primary font-bold text-lg">{profile?.projects || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-600 text-sm">Likes</span>
                                            <span className="text-red-600 font-bold text-lg">{profile?.likes || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Form */}
                            <div className="lg:col-span-2">
                                <form onSubmit={handleUpdateData} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                    
                                    {/* Form Title */}
                                    <h3 className="text-lg font-bold text-primary mb-6">Edit Profile</h3>

                                    {/* Form Fields */}
                                    <div className="space-y-5">
                                        
                                        {/* Full Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                <i className="fas fa-user mr-2 text-primary"></i>Full Name
                                            </label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                value={profile.name} 
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                            />
                                        </div>

                                        {/* Email (Read-only) */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                <i className="fas fa-envelope mr-2 text-primary"></i>Email Address
                                            </label>
                                            <input 
                                                type="email" 
                                                value={profile.email || ''} 
                                                disabled
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Cannot be changed</p>
                                        </div>

                                        {/* Specialization */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                <i className="fas fa-briefcase mr-2 text-primary"></i>Specialization
                                            </label>
                                            <input 
                                                type="text" 
                                                name="specialization" 
                                                value={profile.specialization} 
                                                onChange={handleChange}
                                                placeholder="e.g., Machine Learning, Web Development"
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                            />
                                        </div>

                                        {/* Contact */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                <i className="fas fa-phone mr-2 text-primary"></i>Contact Number
                                            </label>
                                            <input 
                                                type="tel" 
                                                name="contact" 
                                                value={profile.contact} 
                                                onChange={handleChange}
                                                placeholder="Enter your contact number"
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                            />
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                <i className="fas fa-lock mr-2 text-primary"></i>Password
                                            </label>
                                            <input 
                                                type="password" 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Leave blank to keep current password"
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Only change if you want a new password</p>
                                        </div>

                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-6 border-t border-slate-100 mt-6">
                                        <button 
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin"></i>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save"></i>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>

                                </form>
                            </div>

                        </div>

                    </div>
                </div>

            </main>
        
        </>
    );
}

export default Profile;