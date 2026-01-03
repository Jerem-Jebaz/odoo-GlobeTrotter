import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Plus,
  ArrowRight,
  ChevronDown,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CreateTrip({ onNavigate, prefillPlace }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    tripName: '',
    place: prefillPlace || '',
    startDate: '',
    endDate: '',
  });

  // Update place when prefill changes
  React.useEffect(() => {
    if (prefillPlace) {
      setFormData((prev) => ({ ...prev, place: prefillPlace }));
    }
  }, [prefillPlace]);

  const suggestedPlaces = [
    { id: 1, name: 'Paris, France', image: '🗼' },
    { id: 2, name: 'Tokyo, Japan', image: '🗾' },
    { id: 3, name: 'Barcelona, Spain', image: '🏖️' },
    { id: 4, name: 'Dubai, UAE', image: '🏙️' },
    { id: 5, name: 'Bali, Indonesia', image: '🏝️' },
    { id: 6, name: 'New York, USA', image: '🗽' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTrip = (e) => {
    e.preventDefault();
    // Store trip data locally
    const trips = JSON.parse(localStorage.getItem('globetrotter_trips') || '[]');
    const newTrip = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      userId: user?.id,
    };
    trips.push(newTrip);
    localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
    
    // Navigate to itinerary builder
    onNavigate('itinerary', newTrip.id);
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
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="h-10 w-10 rounded-full bg-gradient-to-br from-sienna/30 to-sienna/10 border border-[0.5px] border-sienna flex items-center justify-center font-semibold text-sienna hover:shadow-lg transition"
          >
            {user?.firstName?.[0] || user?.name?.[0] || '👤'}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[0.5px] border-moss/10 bg-white shadow-xl overflow-hidden">
              <div className="p-4 border-b border-[0.5px] border-moss/10">
                <div className="font-semibold text-moss">{user?.firstName} {user?.lastName || user?.name}</div>
                <div className="text-xs text-moss/60">{user?.email}</div>
              </div>
              <button
                onClick={() => onNavigate('profile')}
                className="w-full px-4 py-3 text-left text-sm hover:bg-moss/5 transition"
              >
                My Account
              </button>
              <button
                onClick={logout}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 md:px-10 max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('landing')}
            className="text-sm text-moss/60 hover:text-moss mb-4 inline-flex items-center gap-1"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-serif font-bold text-moss mb-2">Create a new trip</h1>
          <p className="text-moss/60">Plan your next adventure with us</p>
        </div>

        {/* Create Trip Form */}
        <form onSubmit={handleCreateTrip} className="bento-card p-8 mb-8">
          <div className="space-y-6">
            {/* Trip Name */}
            <div className="space-y-2">
              <label className="label">Trip Name</label>
              <input
                type="text"
                name="tripName"
                value={formData.tripName}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g., Summer Europe Adventure"
                required
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="label">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-sienna" strokeWidth={1.5} />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="input pl-10 w-full"
                  required
                />
              </div>
            </div>

            {/* Select a Place */}
            <div className="space-y-2">
              <label className="label">Select a Place</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-sienna" strokeWidth={1.5} />
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  className="input pl-10 w-full"
                  placeholder="Where do you want to go?"
                  required
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="label">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-sienna" strokeWidth={1.5} />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="input pl-10 w-full"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="cta w-full justify-center mt-6"
            >
              Continue to Itinerary
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Suggestions Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-serif font-bold text-moss">
              Suggestion for Places to Visit/Activities
            </h2>
            <div className="flex-1 h-[0.5px] bg-moss/10" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {suggestedPlaces.map((place) => (
              <button
                key={place.id}
                onClick={() => setFormData((prev) => ({ ...prev, place: place.name }))}
                className="bento-card p-6 h-48 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:border-sienna/30 transition group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition">{place.image}</div>
                <span className="text-center font-semibold text-moss">{place.name}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
