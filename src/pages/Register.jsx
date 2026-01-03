import React, { useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    country: 'India',
    additionalInfo: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await register(formData);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bone via-white to-sienna/5 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block pill bg-sienna/20 text-sienna mb-6">
            GT · GlobeTrotter
          </div>
          <h1 className="text-5xl font-serif font-bold text-moss mb-3">Join Us</h1>
          <p className="text-moss/60 text-sm">Create your account to start planning</p>
        </div>

        {/* Registration Form Card */}
        <div className="bento-card p-8 mb-6">
          {/* Photo Placeholder */}
          <div className="h-32 w-32 rounded-full bg-white border border-[0.5px] border-moss/20 flex items-center justify-center mx-auto mb-8 shadow-md">
            <div className="text-center">
              <div className="text-4xl mb-1">📸</div>
              <span className="text-xs text-moss/50 uppercase tracking-wide">Photo</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input w-full"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-sienna" strokeWidth={1.5} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input pl-10 w-full"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="label">Password</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-sienna" strokeWidth={1.5} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input pl-10 w-full"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Phone & Country */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="label">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 h-4 w-4 text-sienna" strokeWidth={1.5} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input pl-10 w-full"
                    placeholder="+91-9876543210"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="label">Country</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-sienna" strokeWidth={1.5} />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input pl-10 w-full bg-moss/5 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* City & Additional */}
            <div className="space-y-2">
              <label className="label">City</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-sienna" strokeWidth={1.5} />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input pl-10 w-full"
                  placeholder="Delhi"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <label className="label">Additional Information</label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 h-4 w-4 text-sienna" strokeWidth={1.5} />
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  className="input pl-10 w-full min-h-[120px] resize-none"
                  placeholder="Tell us about your travel preferences, bucket list destinations, or any other details..."
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-[0.5px] border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="cta w-full justify-center mt-6 bg-sienna hover:bg-sienna/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[0.5px] bg-moss/10" />
            <span className="text-xs text-moss/50 uppercase tracking-wide">or</span>
            <div className="flex-1 h-[0.5px] bg-moss/10" />
          </div>

          {/* Switch to Login */}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="w-full py-2.5 rounded-full border border-[0.5px] border-moss/20 bg-white/80 text-moss font-semibold hover:bg-white transition"
          >
            Already have an account? Login
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-moss/60">
          This is a demo. All data is stored locally—use any information to proceed.
        </p>
      </div>
    </div>
  );
}
