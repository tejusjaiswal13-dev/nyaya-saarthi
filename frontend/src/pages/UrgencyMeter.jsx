import React, { useState } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Clock, Siren, FileText, Upload } from 'lucide-react';

const UrgencyMeter = () => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const analyzeUrgency = async () => {
        if (!description.trim()) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            // connecting to backend
            const response = await axios.post('http://localhost:5000/api/urgency/analyze', {
                text: description
            });
            setResult(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to analyze. Please try again or check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-2 flex items-center justify-center gap-2">
                    <AlertTriangle className="text-secondary" /> Urgency Meter
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Describe your legal situation below to understand how urgent it is according to Indian Law.
                </p>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
                    <label className="block text-gray-700 font-bold mb-2">What happened?</label>
                    <textarea
                        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-40 resize-none text-gray-800"
                        placeholder="e.g., My landlord is threatening to evict me without notice..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>

                    <div className="mt-4 flex justify-between items-center">
                        <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm">
                            <Upload className="h-4 w-4" /> Upload Document (Optional)
                        </button>

                        <button
                            onClick={analyzeUrgency}
                            disabled={loading || !description}
                            className={`bg-secondary text-white font-bold py-2 px-6 rounded-lg transition-all ${loading || !description ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700 hover:shadow-lg'
                                }`}
                        >
                            {loading ? 'Analyzing...' : 'Check Urgency'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}
                </div>

                {result && (
                    <div className="animate-fade-in-up">
                        <ResultCard result={result} />
                    </div>
                )}
            </div>
        </div>
    );
};

const ResultCard = ({ result }) => {
    const { urgency, level, reason, action } = result;

    // Color mapping based on level/urgency
    // Assuming API returns level: 'low', 'medium', 'high', 'critical'
    const getColor = (lvl) => {
        switch (lvl?.toLowerCase()) {
            case 'critical': return 'bg-red-100 border-red-500 text-red-800';
            case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
            case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
            case 'low': return 'bg-green-100 border-green-500 text-green-800';
            default: return 'bg-gray-100 border-gray-500 text-gray-800';
        }
    };

    const getIcon = (lvl) => {
        switch (lvl?.toLowerCase()) {
            case 'critical': return <Siren className="h-8 w-8 text-red-600" />;
            case 'high': return <AlertTriangle className="h-8 w-8 text-orange-600" />;
            case 'medium': return <Clock className="h-8 w-8 text-yellow-600" />;
            case 'low': return <CheckCircle className="h-8 w-8 text-green-600" />;
            default: return <FileText className="h-8 w-8 text-gray-600" />;
        }
    }

    const colorClass = getColor(level || urgency);

    return (
        <div className={`border-l-4 rounded-r-xl p-6 shadow-md ${colorClass} bg-white transition-all`}>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                    {getIcon(level || urgency)}
                </div>
                <div>
                    <h2 className="text-2xl font-bold capitalize mb-1">
                        {urgency} Priority
                    </h2>
                    <p className="font-medium opacity-90 mb-4">
                        Recommended Action: {action}
                    </p>
                    <div className="bg-white/50 p-4 rounded-lg">
                        <h3 className="font-bold text-sm uppercase tracking-wide opacity-70 mb-1">Why?</h3>
                        <p className="text-sm leading-relaxed">{reason}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default UrgencyMeter;
