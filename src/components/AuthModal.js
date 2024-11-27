import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: Implement authentication logic
        if (activeTab === 'login') {
            // Handle login
            console.log('Login with:', email, password);
        } else {
            // Handle signup
            console.log('Signup with:', email, password);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="auth-modal">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <div className="auth-tabs">
                    <button 
                        className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                    <button 
                        className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                        onClick={() => setActiveTab('signup')}
                    >
                        Sign Up
                    </button>
                </div>
                
                <div className="auth-forms">
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="auth-submit">
                            {activeTab === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                </div>
                
                <div className="auth-divider">
                    <span>or</span>
                </div>
                <button className="play-guest-btn" onClick={onClose}>
                    Play as Guest
                </button>
            </div>
        </div>
    );
};

export default AuthModal;
