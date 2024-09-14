"use client"

import React, { useState } from 'react';
import { FaUser, FaLock, FaAmazon } from 'react-icons/fa';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="h-screen bg-black text-green-400 p-2 font-mono relative flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <FaAmazon className="text-green-500 text-6xl mx-auto mb-4 animate-pulse" />
          <h1 className="text-3xl font-bold text-green-500">Amazon Warehouse Mission Control</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-green-500" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            LOGIN
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="#" className="text-green-500 hover:text-green-400">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
