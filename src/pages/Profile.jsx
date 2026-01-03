import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Edit2, Save, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile({ onBack }) {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    country: user?.country || '',
    additionalInfo: user?.additionalInfo || '',
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Update localStorage with new data
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('globetrotter_user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-bone">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 md:px-10 bg-white/70 border-b border-[0.5px] border-moss/10 backdrop-blur">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-moss hover:text-sienna transition"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <div className="pill text-sm font-semibold font-serif bg-white/80">
          GT · GlobeTrotter
        </div>
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="h-10 w-10 rounded-full bg-gradient-to-br from-sienna/30 to-sienna/10 border border-[0.5px] border-sienna flex items-center justify-center font-semibold text-sienna hover:border-sienna hover:shadow-lg transition"
            title="View Profile"
          >
            {user?.firstName?.[0] || user?.name?.[0] || '👤'}
          </button>

          {/* Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-2xl border border-[0.5px] border-moss/15 bg-white/95 shadow-xl backdrop-blur-md overflow-hidden">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-[0.5px] border-moss/10">
                <p className="text-xs uppercase tracking-wider text-moss/60 mb-1">Logged in as</p>
                <p className="text-sm font-semibold text-moss">{user?.firstName} {user?.lastName || user?.name}</p>
                <p className="text-xs text-moss/60">{user?.email}</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-moss hover:bg-sienna/10 transition"
                >
                  <User className="h-4 w-4 text-sienna" strokeWidth={1.5} />
                  My Account
                </button>

                <div className="h-[0.5px] bg-moss/10 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.5} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 md:px-10 max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-moss mb-2">User Profile</h1>
          <p className="text-moss/60">Manage your account information</p>
        </div>

        {/* User Avatar & Info Header */}
        <div className="bento-card p-8 mb-8 flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="h-40 w-40 rounded-full bg-gradient-to-br from-sienna/30 to-sienna/10 border border-[0.5px] border-sienna flex items-center justify-center shadow-lg">
              <div className="text-6xl">
                {formData.firstName?.[0] || '👤'}
              </div>
            </div>
            <button className="pill text-sienna border-sienna/30">
              Change Photo
            </button>
          </div>

          {/* User Details Info Box */}
          <div className="flex-1 rounded-2xl border border-[0.5px] border-moss/10 bg-white/80 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-serif font-semibold text-moss">Account Details</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 text-sienna hover:text-sienna/80 transition"
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </>
                )}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input w-full"
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
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input w-full"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="input w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="label">Additional Information</label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    className="input w-full min-h-[100px] resize-none"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="cta w-full justify-center bg-sienna hover:bg-sienna/90"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-[0.5px] border-moss/10">
                  <span className="text-moss/70">Name</span>
                  <span className="font-semibold">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[0.5px] border-moss/10">
                  <span className="text-moss/70">Email</span>
                  <span className="font-semibold">{formData.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[0.5px] border-moss/10">
                  <span className="text-moss/70">Phone</span>
                  <span className="font-semibold">{formData.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[0.5px] border-moss/10">
                  <span className="text-moss/70">Location</span>
                  <span className="font-semibold">{formData.city}, {formData.country}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preplanned Trips */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-semibold text-moss mb-4">Preplanned Trips</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bento-card p-6 flex flex-col">
                <div className="h-40 w-full bg-white/80 rounded-xl border border-[0.5px] border-moss/10 mb-4" />
                <button className="mt-auto cta w-full justify-center bg-white/80 text-moss border border-[0.5px] border-moss/20 hover:bg-white">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Previous Trips */}
        <div>
          <h2 className="text-2xl font-serif font-semibold text-moss mb-4">Previous Trips</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bento-card p-6 flex flex-col">
                <div className="h-40 w-full bg-white/80 rounded-xl border border-[0.5px] border-moss/10 mb-4" />
                <button className="mt-auto cta w-full justify-center bg-white/80 text-moss border border-[0.5px] border-moss/20 hover:bg-white">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
