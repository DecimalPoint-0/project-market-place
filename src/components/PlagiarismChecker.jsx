import React, { useState } from 'react';
import { runPlagiarismCheck } from '../utils/plagiarism';
import Toast from '../plugin/Toast';

function PlagiarismChecker({ projectId, projectTitle, onCheckComplete, onClose }) {
    const [checkType, setCheckType] = useState('local');
    const [premiumProvider, setPremiumProvider] = useState('copyscape');
    const [isChecking, setIsChecking] = useState(false);
    const [result, setResult] = useState(null);

    const handleRunCheck = async () => {
        try {
            setIsChecking(true);

            const response = await runPlagiarismCheck(
                projectId,
                checkType,
                checkType === 'premium' ? premiumProvider : null
            );

            setResult(response);
            Toast('success', 'Plagiarism check completed!');

            // Call callback if provided
            if (onCheckComplete) {
                onCheckComplete(response);
            }
        } catch (error) {
            Toast('error', error.message || 'Failed to run plagiarism check');
            console.error(error);
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-screen overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-primary">
                        <i className="fas fa-search mr-3"></i>Plagiarism Checker
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 text-2xl"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {!result ? (
                        <div className="space-y-6">
                            {/* Project Info */}
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <p className="text-xs text-slate-600 mb-1">Checking project:</p>
                                <p className="font-semibold text-slate-900 line-clamp-2">{projectTitle}</p>
                            </div>

                            {/* Check Type Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-3">
                                    <i className="fas fa-filter mr-2"></i>Check Type
                                </label>

                                <div className="space-y-3">
                                    {/* Local Check Option */}
                                    <div
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                                            checkType === 'local'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                        onClick={() => setCheckType('local')}
                                    >
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="radio"
                                                name="checkType"
                                                value="local"
                                                checked={checkType === 'local'}
                                                onChange={(e) => setCheckType(e.target.value)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-900">
                                                    <i className="fas fa-database mr-2 text-primary"></i>Local Check
                                                </p>
                                                <p className="text-xs text-slate-600 mt-1">
                                                    Free • Fast • Checks against your database • 70% similarity threshold
                                                </p>
                                            </div>
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                                FREE
                                            </span>
                                        </div>
                                    </div>

                                    {/* Premium Check Option */}
                                    <div
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                                            checkType === 'premium'
                                                ? 'border-primary bg-primary/5'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                        onClick={() => setCheckType('premium')}
                                    >
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="radio"
                                                name="checkType"
                                                value="premium"
                                                checked={checkType === 'premium'}
                                                onChange={(e) => setCheckType(e.target.value)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-900">
                                                    <i className="fas fa-crown mr-2 text-yellow-500"></i>Premium Check
                                                </p>
                                                <p className="text-xs text-slate-600 mt-1">
                                                    Higher accuracy • Checks against internet • Premium API service
                                                </p>
                                            </div>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                PAID
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Premium Provider Selection */}
                            {checkType === 'premium' && (
                                <div>
                                    <label className="block text-sm font-semibold text-primary mb-3">
                                        <i className="fas fa-building mr-2"></i>Select Provider
                                    </label>

                                    <select
                                        value={premiumProvider}
                                        onChange={(e) => setPremiumProvider(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="copyscape">Copyscape - Document Similarity Detection</option>
                                        <option value="turnitin">Turnitin - Academic Plagiarism Detection</option>
                                        <option value="plagscan">PlagScan - Comprehensive Text Matching</option>
                                    </select>

                                    <p className="text-xs text-slate-500 mt-2">
                                        <i className="fas fa-info-circle mr-1"></i>
                                        Make sure you have API keys configured for your chosen provider
                                    </p>
                                </div>
                            )}

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <i className="fas fa-lightbulb mr-2"></i>
                                    <strong>Tip:</strong> {checkType === 'local'
                                        ? 'Local checks are instant and free. Use them for quick plagiarism detection.'
                                        : 'Premium checks provide higher accuracy by comparing against internet sources.'}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4 border-t border-slate-200">
                                <button
                                    onClick={handleRunCheck}
                                    disabled={isChecking}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isChecking ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i> Checking...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-play"></i> Run Check
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={onClose}
                                    disabled={isChecking}
                                    className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Result Display */
                        <div className="space-y-6">
                            {/* Success Message */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                                <i className="fas fa-check-circle text-4xl text-green-600 mb-4 block"></i>
                                <h3 className="text-xl font-bold text-green-900 mb-2">Check Completed!</h3>
                                <p className="text-green-800 text-sm">
                                    Plagiarism check has been completed and saved
                                </p>
                            </div>

                            {/* Results Summary */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                    <p className="text-xs text-slate-600 mb-1">Plagiarism %</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {result.plagiarism_percentage || 0}%
                                    </p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                    <p className="text-xs text-slate-600 mb-1">Check Type</p>
                                    <p className="text-lg font-bold text-slate-900 capitalize">
                                        {result.check_type}
                                    </p>
                                </div>
                            </div>

                            {/* Status Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <i className="fas fa-info-circle mr-2"></i>
                                    <strong>Status:</strong> {result.status}
                                </p>
                                <p className="text-xs text-blue-700 mt-2">
                                    Created: {new Date(result.created_at).toLocaleString()}
                                </p>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg"
                            >
                                <i className="fas fa-times mr-2"></i> Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PlagiarismChecker;
