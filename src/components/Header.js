import React, { useState } from 'react';
import AuthModal from './AuthModal';
import './Header.css';

const Header = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    const handleLogout = () => {
        // TODO: Implement logout logic
        setIsLoggedIn(false);
        setUsername('');
    };

    return (
        <header className="header">
            <div className="header-content">
                <h1>Workflow Builder</h1>
                <div className="header-controls">
                    {!isLoggedIn ? (
                        <button 
                            className="login-btn"
                            onClick={() => setIsAuthModalOpen(true)}
                            aria-label="Login"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                            </svg>
                        </button>
                    ) : (
                        <>
                            <span className="username">{username}</span>
                            <button 
                                className="logout-btn"
                                onClick={handleLogout}
                                aria-label="Logout"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
            <AuthModal 
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </header>
    );
};

export default Header;
