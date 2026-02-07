import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary text-white py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center bg-transparent">
                <div className="mb-4 md:mb-0">
                    <span className="font-bold text-lg">Nyaya Saarthi</span>
                    <p className="text-sm text-gray-300">Democratizing Legal Access for India</p>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                    <span>Made with </span>
                    <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" />
                    <span> for Justice</span>
                </div>
                <div className="mt-4 md:mt-0 text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} Nyaya Saarthi. Hackathon Project.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
