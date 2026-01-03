import React, { useState } from 'react';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    try {
      login(email, password);
      setError('');
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bone via-white to-sienna/5 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block pill bg-sienna/20 text-sienna mb-6">
            GT · GlobeTrotter
          </div>
          <h1 className="text-5xl font-serif font-bold text-moss mb-3">Login</h1>
          <p className="text-moss/60 text-sm">Plan your next adventure</p>
        </div>

        {/* Login Form Card */}
        <div className="bento-card p-8 mb-6">
          {/* Photo Placeholder */}
          <div className="h-32 w-32 rounded-full bg-white border border-[0.5px] border-moss/20 flex items-center justify-center mx-auto mb-8 shadow-md">
            <div className="text-center">
              <div className="text-4xl mb-1">📸</div>
              <span className="text-xs text-moss/50 uppercase tracking-wide">Photo</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-sienna" strokeWidth={1.5} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10 w-full"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-sienna" strokeWidth={1.5} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 w-full"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-[0.5px] border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="cta w-full justify-center mt-6 bg-sienna hover:bg-sienna/90"
            >
              Login
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[0.5px] bg-moss/10" />
            <span className="text-xs text-moss/50 uppercase tracking-wide">or</span>
            <div className="flex-1 h-[0.5px] bg-moss/10" />
          </div>

          {/* Switch to Register */}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="w-full py-2.5 rounded-full border border-[0.5px] border-moss/20 bg-white/80 text-moss font-semibold hover:bg-white transition"
          >
            Create New Account
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-moss/60">
          This is a demo. No real password validation yet—use any email/password to proceed.
        </p>
      </div>
    </div>
  );
}
