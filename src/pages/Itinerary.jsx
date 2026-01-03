import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Itinerary({ onNavigate, tripId }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [trip, setTrip] = useState(null);
  const [sections, setSections] = useState([
    {
      id: 1,
      title: 'Section 1',
      description: 'All the necessary information about this section. This can be anything like travel section, hotel or any other activity',
      dateRange: '',
      budget: '',
    },
  ]);

  useEffect(() => {
    // Load trip data
    const trips = JSON.parse(localStorage.getItem('globetrotter_trips') || '[]');
    const foundTrip = trips.find(t => t.id === tripId);
    if (foundTrip) {
      setTrip(foundTrip);
      // Load existing sections if any
      const savedSections = JSON.parse(localStorage.getItem(`trip_${tripId}_sections`) || 'null');
      if (savedSections && savedSections.length > 0) {
        setSections(savedSections);
      }
    }
  }, [tripId]);

  const handleSectionChange = (id, field, value) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: `Section ${sections.length + 1}`,
      description: 'All the necessary information about this section. This can be anything like travel section, hotel or any other activity',
      dateRange: '',
      budget: '',
    };
    setSections(prev => [...prev, newSection]);
  };

  const deleteSection = (id) => {
    if (sections.length > 1) {
      setSections(prev => prev.filter(section => section.id !== id));
    }
  };

  const saveSections = () => {
    localStorage.setItem(`trip_${tripId}_sections`, JSON.stringify(sections));
    alert('Itinerary saved successfully!');
  };

  if (!trip) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <p className="text-moss/60">Loading trip...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 md:px-10 bg-white/70 border-b border-[0.5px] border-moss/10 backdrop-blur">
        <div className="pill text-sm font-semibold font-serif bg-white/80">
          GT · GlobeTrotter
        </div>
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

      <main className="pt-24 pb-20 px-6 md:px-10 max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('landing')}
            className="text-sm text-moss/60 hover:text-moss mb-4 inline-flex items-center gap-1"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-serif font-bold text-moss mb-2">
            Build Itinerary
          </h1>
          <p className="text-moss/60">
            {trip.tripName} · {trip.place}
          </p>
        </div>

        {/* Itinerary Sections */}
        <div className="bento-card p-8 space-y-8">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="relative rounded-2xl border border-[0.5px] border-moss/20 p-6 bg-white/50"
            >
              {/* Delete Button */}
              {sections.length > 1 && (
                <button
                  onClick={() => deleteSection(section.id)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-50 text-red-600 transition"
                  title="Delete Section"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              {/* Section Title */}
              <div className="mb-4">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                  className="text-2xl font-serif font-bold text-moss bg-transparent border-none outline-none focus:border-b focus:border-sienna w-full"
                  placeholder="Section Title"
                />
              </div>

              {/* Section Description */}
              <div className="mb-6">
                <textarea
                  value={section.description}
                  onChange={(e) => handleSectionChange(section.id, 'description', e.target.value)}
                  className="w-full bg-white/80 rounded-xl border border-[0.5px] border-moss/10 px-4 py-3 text-sm text-moss/70 resize-none focus:border-sienna focus:outline-none focus:ring-2 focus:ring-sienna/30"
                  rows="3"
                  placeholder="Describe this section..."
                />
              </div>

              {/* Date Range and Budget */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="label flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Date Range
                  </label>
                  <input
                    type="text"
                    value={section.dateRange}
                    onChange={(e) => handleSectionChange(section.id, 'dateRange', e.target.value)}
                    className="input w-full"
                    placeholder="xxx to yyy"
                  />
                </div>
                <div className="space-y-2">
                  <label className="label flex items-center gap-2">
                    <DollarSign className="h-3 w-3" />
                    Budget of this section
                  </label>
                  <input
                    type="text"
                    value={section.budget}
                    onChange={(e) => handleSectionChange(section.id, 'budget', e.target.value)}
                    className="input w-full"
                    placeholder="$0.00"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Another Section Button */}
          <button
            onClick={addSection}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-moss/20 hover:border-sienna hover:bg-sienna/5 transition flex items-center justify-center gap-2 text-moss/70 hover:text-sienna font-semibold"
          >
            <Plus className="h-5 w-5" />
            Add another Section
          </button>

          {/* Save Button */}
          <button
            onClick={saveSections}
            className="cta w-full justify-center mt-6"
          >
            Save Itinerary
          </button>
        </div>
      </main>
    </div>
  );
}
