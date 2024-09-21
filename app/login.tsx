"use client"

import React, { useState } from 'react';
import { FaUser, FaLock, FaAmazon } from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

// Your web app's Firebase configuration
const firebaseConfig = { 
  apiKey: "AIzaSyAJnVaYTptukqw3caGiFe9myj7JC5O0dOU",
  authDomain: "dashboard-dd1af.firebaseapp.com",
  projectId: "dashboard-dd1af",
  storageBucket: "dashboard-dd1af.appspot.com",
  messagingSenderId: "601191475221",
  appId: "1:601191475221:web:498f10c332f6e499cc861c"
  // Add your Firebase config here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      // Store user email in localStorage
      localStorage.setItem('userEmail', userCredential.user.email || '');
      // Redirect to dashboard after successful login or signup
      router.push('/dashboard');
    } catch (error) {
      setError('Failed to authenticate. Please check your credentials.');
      console.error(error);
    }
  };

  return (
    <div className="h-screen bg-black text-green-400 p-2 font-mono relative flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <FaAmazon className="text-green-500 text-6xl mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl font-bold text-green-500">Amazon Warehouse Mission Control</h1>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-green-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 pl-10 bg-gray-800 text-green-400 border border-green-500 rounded"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-green-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 pl-10 bg-gray-800 text-green-400 border border-green-500 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-black p-2 rounded font-bold hover:bg-green-400 transition-colors"
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-green-500 hover:text-green-400"
          >
            {isSignUp ? 'Already have an account? Log in' : 'Need an account? Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}
