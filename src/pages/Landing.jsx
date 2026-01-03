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
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef(null);

  const topRegionalSelections = [
    { 
      id: 1, 
      name: 'Jaipur', 
      place: 'Jaipur, Rajasthan',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=300&fit=crop&q=80'
    },
    { 
      id: 2, 
      name: 'Kerala', 
      place: 'Kochi, Kerala',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=400&h=300&fit=crop&q=80'
    },
    { 
      id: 3, 
      name: 'Goa', 
      place: 'Goa, Goa',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop&q=80'
    },
    { 
      id: 4, 
      name: 'Manali', 
      place: 'Manali, Himachal Pradesh',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop&q=80'
    },
    { 
      id: 5, 
      name: 'Udaipur', 
      place: 'Udaipur, Rajasthan',
      image: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=400&h=300&fit=crop&q=80'
    },
  ];

  // Fetch trips from API
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/trips', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTrips(data.trips || []);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

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
        <button
          onClick={() => onNavigate('landing')}
          className="rounded-full border border-[0.5px] border-moss/15 bg-white/90 px-4 py-2 shadow-sm hover:shadow-md hover:border-sienna/40 transition"
        >
          <span className="text-lg md:text-xl font-serif font-bold tracking-wide text-moss">GlobeTrotter</span>
        </button>
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
        <section className="relative overflow-hidden rounded-3xl border border-[0.5px] border-moss/15 shadow-xl h-[500px]">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1400&h=700&fit=crop&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-moss/80 via-moss/60 to-sienna/70" />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-6 z-10">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-bone mb-4 drop-shadow-lg">
              Explore Incredible India
            </h1>
            <p className="text-bone/90 text-lg md:text-xl mb-8 max-w-2xl drop-shadow">
              Discover majestic palaces, serene backwaters, snow-capped mountains, and golden beaches
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="pill bg-bone text-moss border-bone hover:bg-bone/90">
                Heritage Tours
              </button>
              <button className="pill bg-sienna text-bone border-sienna hover:bg-sienna/90">
                Adventure Trails
              </button>
              <button className="pill bg-white/20 backdrop-blur text-bone border-bone/50 hover:bg-white/30">
                Beach Escapes
              </button>
            </div>
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
            {topRegionalSelections.map((region) => {
              const [city = '', state = ''] = region.place.split(',').map((part) => part.trim());
              return (
              <div
                key={region.id}
                className="group relative overflow-hidden rounded-2xl border border-[0.5px] border-moss/15 h-48 transition-all"
                onClick={() =>
                  onNavigate('trips', {
                    prefillTripData: {
                      city,
                      state,
                      tripName: `${region.name} Escape`,
                    },
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate('trips', {
                      prefillTripData: {
                        city,
                        state,
                        tripName: `${region.name} Escape`,
                      },
                    });
                  }
                }}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-110"
                  style={{ backgroundImage: `url('${region.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-moss/90 via-moss/40 to-transparent" />
                <div className="absolute inset-0 flex items-end p-4">
                  <span className="text-xl font-serif font-semibold text-bone drop-shadow-lg">
                    {region.name}
                  </span>
                </div>
              </div>
              );
            })}
          </div>
        </section>

        {/* Previous Trips */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-serif font-bold text-moss">Previous Trips</h2>
            <div className="flex-1 h-[0.5px] bg-moss/10" />
            <button
              onClick={() => onNavigate('trips')}
              className="pill hover:bg-sienna hover:text-bone hover:border-sienna transition"
            >
              <Plus className="h-4 w-4" />
              Plan a trip
            </button>
          </div>
          {loading ? (
            <div className="text-center py-12 text-moss/60">
              Loading trips...
            </div>
          ) : trips.length === 0 ? (
            <div className="bento-card p-12 text-center">
              <p className="text-moss/60 mb-4">No previous trips yet</p>
              <button
                onClick={() => onNavigate('trips')}
                className="cta mx-auto"
              >
                <Plus className="h-4 w-4" />
                Create your first trip
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {trips.map((trip) => {
                const startDate = new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const endDate = new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                return (
                  <div key={trip.id} className="bento-card p-6 hover:shadow-xl transition-shadow">
                    <div 
                      className="h-48 w-full rounded-xl border border-[0.5px] border-moss/10 mb-4 bg-gradient-to-br from-sienna/20 to-moss/10 flex items-center justify-center"
                    >
                      <span className="text-4xl">✈️</span>
                    </div>
                    <h3 className="font-semibold text-moss mb-1">{trip.state} - {trip.city}</h3>
                    <p className="text-xs text-moss/60 mb-4">{startDate} – {endDate}</p>
                    <button 
                      onClick={() => onNavigate('itinerary', trip.id)}
                      className="cta w-full justify-center"
                    >
                      View
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
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
