import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, Menu, X, MessageSquare, Home } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-50 top-0 left-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <Scale className="h-8 w-8 text-secondary" />
                            <span className="text-2xl font-bold text-primary tracking-tight">Nyaya Saarthi</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" active={isActive('/')}>
                            <div className="flex items-center gap-1">
                                <Home className="h-4 w-4" />
                                Home
                            </div>
                        </NavLink>
                        <NavLink to="/chat" active={isActive('/chat')}>
                            <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                AI Legal Assistant
                            </div>
                        </NavLink>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-secondary focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
                        <MobileNavLink to="/chat" onClick={() => setIsOpen(false)}>AI Legal Assistant</MobileNavLink>
                    </div>
                </div>
            )}
        </nav>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link
        to={to}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${active ? 'text-secondary font-bold' : 'text-gray-700 hover:text-secondary'
            }`}
    >
        {children}
    </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-secondary hover:bg-gray-50"
    >
        {children}
    </Link>
);

export default Navbar;
