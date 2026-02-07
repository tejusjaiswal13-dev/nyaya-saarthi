import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot, AlertCircle, Shield, ArrowRight, Gavel } from 'lucide-react';

const LegalChat = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            type: 'intro',
            text: 'Namaste! I am Nyaya Saarthi. Describe your legal situation or ask a question. I will assess its urgency and provide guidance based on Indian Law.'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Using the unified chat endpoint (formerly urgency/analyze logic merged)
            const response = await axios.post('http://localhost:5000/api/chat', {
                message: userMsg.text
            });

            const botMsg = {
                id: Date.now() + 1,
                sender: 'bot',
                type: 'analysis',
                data: response.data
            };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                type: 'error',
                text: 'Connection unavailable. Please verify your internet connection or try again later.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen pt-16 bg-gray-50">
            <div className="flex-grow overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>

                        {msg.sender === 'bot' && (
                            <div className="flex-shrink-0 mr-3">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md">
                                    <Gavel size={20} />
                                </div>
                            </div>
                        )}

                        <div className={`max-w-[90%] md:max-w-[75%] ${msg.sender === 'user' ? 'bg-white border-l-4 border-primary shadow-sm' : ''} rounded-lg overflow-hidden`}>
                            {msg.sender === 'user' ? (
                                <div className="p-4 text-gray-800 font-medium">{msg.text}</div>
                            ) : (
                                <BotResponse msg={msg} />
                            )}
                        </div>

                        {msg.sender === 'user' && (
                            <div className="flex-shrink-0 ml-3">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                    <User size={20} />
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start items-center ml-14">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                        <span className="ml-3 text-sm text-gray-500 font-medium">Analyzing legal context...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-white p-4 border-t shadow-lg z-10">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your legal question or situation here..."
                        className="flex-grow p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 font-medium transition-all"
                        disabled={loading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="bg-primary hover:bg-blue-900 text-white p-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center"
                    >
                        <Send size={24} />
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">
                    AI responses are for satisfying informational purposes only. Consult a lawyer for professional advice.
                </p>
            </div>
        </div>
    );
};

const BotResponse = ({ msg }) => {
    if (msg.type === 'intro') {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <p className="text-gray-800 leading-relaxed font-medium">{msg.text}</p>
            </div>
        );
    }

    if (msg.type === 'error') {
        return (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-700 text-sm">
                {msg.text}
            </div>
        );
    }

    const { urgency, urgencyLevel, insight, implications, action } = msg.data;

    // Color Logic
    const getColors = (level) => {
        switch (level?.toLowerCase()) {
            case 'critical': return 'bg-red-50 border-red-500 text-red-900 icon-red-600';
            case 'high': return 'bg-orange-50 border-orange-500 text-orange-900 icon-orange-600';
            case 'medium': return 'bg-yellow-50 border-yellow-500 text-yellow-900 icon-yellow-600';
            case 'low': return 'bg-green-50 border-green-500 text-green-900 icon-green-600';
            default: return 'bg-gray-50 border-gray-400 text-gray-900 icon-gray-600';
        }
    }

    const theme = getColors(urgencyLevel);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Urgency Badge Header */}
            <div className={`px-4 py-2 border-l-4 flex items-center justify-between ${theme.split(' ').slice(0, 2).join(' ')}`}>
                <div className="flex items-center gap-2">
                    <AlertCircle className={`h-5 w-5 ${theme.split(' ').slice(2).join(' ')}`} />
                    <span className="font-bold uppercase tracking-wider text-sm">{urgency} Urgency</span>
                </div>
            </div>

            <div className="p-5 space-y-4">
                {/* Legal Insight */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Legal Insight</h4>
                    <p className="text-gray-800 leading-relaxed font-medium">
                        {insight}
                    </p>
                </div>

                {/* Implications */}
                {implications && implications.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">What This Means</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {implications.map((imp, idx) => (
                                <li key={idx} className="text-sm text-gray-600">{imp}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Recommended Action */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                        <span className="block text-xs font-bold text-primary uppercase mb-0.5">Recommended Action</span>
                        <p className="text-sm text-gray-800 font-medium">{action}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalChat;
