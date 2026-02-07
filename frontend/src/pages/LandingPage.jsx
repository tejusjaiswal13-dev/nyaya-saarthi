import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Shield, Gavel } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            {/* Hero Section */}
            <section className="bg-primary text-white py-24 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                    <Gavel size={400} />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                        Indian Legal Help, <span className="text-accent">Democratized.</span>
                    </h1>
                    <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
                        Instantly assess your legal situation's urgency and get guidance in simple language backed by the Indian Constitution & Penal Codes.
                    </p>
                    <div className="flex justify-center">
                        <Link to="/chat" className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-10 rounded-xl transition-all shadow-lg flex items-center gap-3 text-lg">
                            Start Legal Assessment <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Nyaya Saarthi?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">We combine advanced AI with Indian legal frameworks to provide immediate, actionable guidance.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<AlertTriangle className="h-8 w-8 text-secondary" />}
                            title="Urgency Detection"
                            description="Our system automatically flags critical situations (Arrest, Violence) to suggest immediate actions."
                        />
                        <FeatureCard
                            icon={<Gavel className="h-8 w-8 text-primary" />}
                            title="Simplified Law"
                            description="Complex IPC & CrPC sections explained in plain English, so you know exactly where you stand."
                        />
                        <FeatureCard
                            icon={<Shield className="h-8 w-8 text-accent" />}
                            title="Zero Cost Access"
                            description="Professional legal context should be a right, not a privilege. Get started instantly without fees."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-left">
        <div className="mb-6 bg-gray-50 h-16 w-16 rounded-xl flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
    </div>
);

export default LandingPage;
