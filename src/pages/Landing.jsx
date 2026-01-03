import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowRight,
  Sliders,
  Plus,
  LogOut,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing({ onNavigate }) {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const topRegionalSelections = [
    { id: 1, name: 'Paris' },
    { id: 2, name: 'Tokyo' },
    { id: 3, name: 'New York' },
    { id: 4, name: 'Barcelona' },
    { id: 5, name: 'Dubai' },
  ];

  const previousTrips = [
    { id: 1, name: 'Kyoto → Seoul', dates: 'Feb 4–12' },
    { id: 2, name: 'Lisbon → Porto', dates: 'Jan 10–16' },
    { id: 3, name: 'Marrakesh Escape', dates: 'Dec 2–6' },
  ];

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

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-bone">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 md:px-10 bg-white/70 border-b border-[0.5px] border-moss/10 backdrop-blur">
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
                  onClick={() => {
                    onNavigate('profile');
                    setProfileOpen(false);
                  }}
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

      <main className="pt-24 pb-20 px-6 md:px-10 max-w-6xl mx-auto space-y-12">
        {/* Banner Section */}
        <section className="bento-card p-12 text-center bg-gradient-to-br from-sienna/10 to-moss/5">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-moss mb-4">
            Banner Image
          </h1>
          <p className="text-moss/60 mb-6">Discover and plan your next adventure</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="pill">Silky Woodpecker</button>
            <button className="pill">Great Owl</button>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
          <div className="flex-1 flex items-center gap-2 rounded-full border border-[0.5px] border-moss/10 bg-white/80 px-4 py-2">
            <Search className="h-4 w-4 text-moss/60" strokeWidth={1.5} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-moss/40"
              placeholder="Search bar ....."
            />
          </div>
          <button className="pill">
            <Sliders className="h-4 w-4" />
            Group by
          </button>
          <button className="pill">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="pill">Sort by...</button>
        </section>

        {/* Top Regional Selections */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-serif font-bold text-moss">Top Regional Selections</h2>
            <div className="flex-1 h-[0.5px] bg-moss/10" />
          </div>
          <div className="grid gap-6 md:grid-cols-5">
            {topRegionalSelections.map((region) => (
              <div
                key={region.id}
                className="bento-card p-6 h-32 flex items-center justify-center cursor-pointer hover:shadow-lg"
              >
                <span className="text-center font-semibold text-moss">{region.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Previous Trips */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-serif font-bold text-moss">Previous Trips</h2>
            <div className="flex-1 h-[0.5px] bg-moss/10" />
            <button
              onClick={() => onNavigate('createTrip')}
              className="pill hover:bg-sienna hover:text-bone hover:border-sienna transition"
            >
              <Plus className="h-4 w-4" />
              Plan a trip
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {previousTrips.map((trip) => (
              <div key={trip.id} className="bento-card p-6">
                <div className="h-40 w-full bg-white/80 rounded-xl border border-[0.5px] border-moss/10 mb-4" />
                <h3 className="font-semibold text-moss mb-1">{trip.name}</h3>
                <p className="text-xs text-moss/60 mb-4">{trip.dates}</p>
                <button className="cta w-full justify-center">
                  View
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-4 left-1/2 z-20 w-[90%] max-w-2xl -translate-x-1/2 rounded-full border border-[0.5px] border-moss/15 bg-white/80 px-4 py-2 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={() => onNavigate('landing')}
            className="flex flex-col items-center gap-1 rounded-full px-3 py-1 text-moss/70 hover:text-moss"
          >
            <span>🔍</span>
            <span>Discover</span>
          </button>
          <button
            onClick={() => onNavigate('trips')}
            className="flex flex-col items-center gap-1 rounded-full px-3 py-1 text-moss/70 hover:text-moss"
          >
            <span>✈️</span>
            <span>Trips</span>
          </button>
          <button
            onClick={() => onNavigate('calendar')}
            className="flex flex-col items-center gap-1 rounded-full px-3 py-1 text-moss/70 hover:text-moss"
          >
            <span>📅</span>
            <span>Calendar</span>
          </button>
          <button
            onClick={() => onNavigate('community')}
            className="flex flex-col items-center gap-1 rounded-full px-3 py-1 text-moss/70 hover:text-moss"
          >
            <span>👥</span>
            <span>Community</span>
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center gap-1 rounded-full px-3 py-1 text-moss/70 hover:text-moss"
          >
            <span>👤</span>
            <span>Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
