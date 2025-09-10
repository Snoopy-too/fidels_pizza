
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const RegisterPage: React.FC = () => {
    const { register, accessCode: correctAccessCode, showAlert } = useApp();
    const navigate = useNavigate();
    const [enteredCode, setEnteredCode] = useState('');
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleCodeCheck = (e: React.FormEvent) => {
        e.preventDefault();
        if (enteredCode === correctAccessCode) {
            setIsCodeVerified(true);
            setError('');
        } else {
            setError('Invalid access code.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser = register(formData.name, formData.email, formData.password);
        if (newUser) {
            // In a real app, this would be after email confirmation
            showAlert('Registration Successful!', 'You will be redirected to the menu.', () => {
                navigate('/menu');
            });
        } else {
            setError('An account with this email already exists.');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-stone-800 mb-6">Register for the Event</h2>
            
            {!isCodeVerified ? (
                <form onSubmit={handleCodeCheck} className="space-y-4">
                    <p className="text-center text-stone-600">Please enter the 4-digit access code to proceed.</p>
                    <div>
                        <label htmlFor="accessCode" className="block text-sm font-medium text-stone-700">Access Code</label>
                        <input
                            type="text"
                            id="accessCode"
                            value={enteredCode}
                            onChange={(e) => setEnteredCode(e.target.value)}
                            maxLength={4}
                            className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Verify Code
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                    <p className="text-center text-green-600 font-semibold">Code Verified! Please fill out your details.</p>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-700">Full Name</label>
                        <input type="text" id="name" name="name" onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-stone-700">Email Address</label>
                        <input type="email" id="email" name="email" onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-stone-700">Password</label>
                        <input type="password" id="password" name="password" onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <p className="text-xs text-stone-500">A confirmation link will be sent to your email (simulation). Your account will be active immediately for this demo.</p>
                    <button type="submit" className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Create Account
                    </button>
                </form>
            )}
        </div>
    );
};

export default RegisterPage;