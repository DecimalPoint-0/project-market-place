import React, { useState, useEffect } from 'react';
import { getPlagiarismSeverity } from '../utils/plagiarism';
import Toast from '../plugin/Toast';
import Cookies from 'js-cookie';

function PlagiarismResults({ projectId, onClose }) {

    const accessToken = Cookies.get('access_token');
    const [checks, setChecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCheckId, setExpandedCheckId] = useState(null);

    useEffect(() => {
        fetchProjectChecks();
    }, [projectId]);

    const fetchProjectChecks = async () => {
        try {
            setLoading(true);
            // Note: You may need to implement this endpoint in your backend
            // For now, we'll show a placeholder for the structure
            const response = await fetch(
                `https://project-market-place-backend.onrender.com/api/v1/plagiarism/project/${projectId}/`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setChecks(data.results || data);
            }
        } catch (error) {
            Toast('error', 'Failed to fetch plagiarism checks');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4 block"></i>
                    <p className="text-slate-600 font-semibold">Loading plagiarism reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-primary">
                    <i className="fas fa-search mr-2"></i>Plagiarism Reports
                </h3>
                <button
                    onClick={onClose}
                    className="text-slate-500 hover:text-slate-700 text-2xl"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {checks.length === 0 ? (
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-8 text-center">
                    <i className="fas fa-inbox text-4xl text-slate-300 mb-4 block"></i>
                    <p className="text-slate-600 font-semibold">No plagiarism checks yet</p>
                    <p className="text-slate-500 text-sm">Run a plagiarism check to see the results here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {checks.map((check) => {
                        const severity = getPlagiarismSeverity(check.plagiarism_percentage || 0);
                        const isExpanded = expandedCheckId === check.id;

                        return (
                            <div
                                key={check.id}
                                className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Check Header - Clickable */}
                                <button
                                    onClick={() => setExpandedCheckId(isExpanded ? null : check.id)}
                                    className="w-full px-6 py-4 bg-white hover:bg-slate-50 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4 flex-1 text-left">
                                        {/* Severity Badge */}
                                        <div className={`text-${severity.color}-600 bg-${severity.color}-100 px-4 py-2 rounded-lg`}>
                                            <i className={`fas ${severity.icon} mr-2`}></i>
                                            <span className="font-bold">{check.plagiarism_percentage || 0}%</span>
                                        </div>

                                        {/* Check Info */}
                                        <div>
                                            <p className="font-semibold text-slate-900 capitalize">{check.check_type} Check</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {check.premium_provider && `Provider: ${check.premium_provider} • `}
                                                Status: <span className={`font-semibold ${
                                                    check.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                                }`}>{check.status}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Expand Icon */}
                                    <i className={`fas fa-chevron-down text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}></i>
                                </button>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 space-y-4">
                                        {/* Check Status */}
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700 mb-2">Status Details</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white p-3 rounded border border-slate-200">
                                                    <p className="text-xs text-slate-500">Status</p>
                                                    <p className="font-semibold text-slate-900 capitalize">{check.status}</p>
                                                </div>
                                                <div className="bg-white p-3 rounded border border-slate-200">
                                                    <p className="text-xs text-slate-500">Risk Level</p>
                                                    <p className={`font-semibold text-${severity.color}-600`}>{severity.label}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Matched Sources */}
                                        {check.matched_sources && check.matched_sources.length > 0 && (
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700 mb-2">Matched Sources</p>
                                                <div className="bg-white rounded border border-slate-200 max-h-48 overflow-y-auto">
                                                    {check.matched_sources.map((source, index) => (
                                                        <div key={index} className="p-3 border-b border-slate-100 last:border-b-0">
                                                            <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                                                                {source.project_title || source.url || `Match ${index + 1}`}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                Similarity: <span className="font-bold">{source.similarity_percentage}%</span>
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Timestamps */}
                                        <div className="flex gap-4 text-xs text-slate-500">
                                            <span>Created: {new Date(check.created_at).toLocaleDateString()}</span>
                                            <span>Updated: {new Date(check.updated_at).toLocaleDateString()}</span>
                                        </div>

                                        {/* Error Message */}
                                        {check.status === 'failed' && check.error_message && (
                                            <div className="bg-red-50 border border-red-200 rounded p-3">
                                                <p className="text-xs text-red-800">
                                                    <i className="fas fa-exclamation-circle mr-2"></i>
                                                    {check.error_message}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default PlagiarismResults;
