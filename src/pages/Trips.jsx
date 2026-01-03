import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  MapPin,
  Plus,
  ArrowRight,
  X,
  Edit,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Trips({ onNavigate }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    tripName: '',
    city: '',
    state: '',
    country: 'India',
    startDate: '',
    endDate: '',
  });
  const [dateError, setDateError] = useState('');

  // Indian states list
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  // Static Indian city list (popular hubs)
  const indianCities = [
    // Andhra Pradesh
    { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { city: 'Vijayawada', state: 'Andhra Pradesh' },
    { city: 'Tirupati', state: 'Andhra Pradesh' },
    { city: 'Araku Valley', state: 'Andhra Pradesh' },
    { city: 'Lambasingi', state: 'Andhra Pradesh' },
    // Arunachal Pradesh
    { city: 'Tawang', state: 'Arunachal Pradesh' },
    { city: 'Ziro', state: 'Arunachal Pradesh' },
    { city: 'Bomdila', state: 'Arunachal Pradesh' },
    { city: 'Itanagar', state: 'Arunachal Pradesh' },
    // Assam
    { city: 'Guwahati', state: 'Assam' },
    { city: 'Kaziranga', state: 'Assam' },
    { city: 'Jorhat', state: 'Assam' },
    { city: 'Majuli', state: 'Assam' },
    { city: 'Tezpur', state: 'Assam' },
    // Bihar
    { city: 'Patna', state: 'Bihar' },
    { city: 'Gaya', state: 'Bihar' },
    { city: 'Nalanda', state: 'Bihar' },
    { city: 'Rajgir', state: 'Bihar' },
    // Chhattisgarh
    { city: 'Raipur', state: 'Chhattisgarh' },
    { city: 'Jagdalpur', state: 'Chhattisgarh' },
    { city: 'Chitrakote', state: 'Chhattisgarh' },
    // Goa
    { city: 'Panaji', state: 'Goa' },
    { city: 'Calangute', state: 'Goa' },
    { city: 'Palolem', state: 'Goa' },
    { city: 'Baga', state: 'Goa' },
    { city: 'Candolim', state: 'Goa' },
    // Gujarat
    { city: 'Ahmedabad', state: 'Gujarat' },
    { city: 'Surat', state: 'Gujarat' },
    { city: 'Vadodara', state: 'Gujarat' },
    { city: 'Dwarka', state: 'Gujarat' },
    { city: 'Gir National Park', state: 'Gujarat' },
    { city: 'Somnath', state: 'Gujarat' },
    // Haryana
    { city: 'Gurugram', state: 'Haryana' },
    { city: 'Kurukshetra', state: 'Haryana' },
    { city: 'Karnal', state: 'Haryana' },
    // Himachal Pradesh
    { city: 'Shimla', state: 'Himachal Pradesh' },
    { city: 'Manali', state: 'Himachal Pradesh' },
    { city: 'Dharamshala', state: 'Himachal Pradesh' },
    { city: 'McLeod Ganj', state: 'Himachal Pradesh' },
    { city: 'Kasol', state: 'Himachal Pradesh' },
    { city: 'Kasauli', state: 'Himachal Pradesh' },
    { city: 'Kufri', state: 'Himachal Pradesh' },
    { city: 'Spiti Valley', state: 'Himachal Pradesh' },
    // Jharkhand
    { city: 'Ranchi', state: 'Jharkhand' },
    { city: 'Jamshedpur', state: 'Jharkhand' },
    { city: 'Deoghar', state: 'Jharkhand' },
    // Karnataka
    { city: 'Bengaluru', state: 'Karnataka' },
    { city: 'Mysuru', state: 'Karnataka' },
    { city: 'Hampi', state: 'Karnataka' },
    { city: 'Coorg', state: 'Karnataka' },
    { city: 'Chikmagalur', state: 'Karnataka' },
    { city: 'Gokarna', state: 'Karnataka' },
    { city: 'Udupi', state: 'Karnataka' },
    { city: 'Badami', state: 'Karnataka' },
    // Kerala
    { city: 'Kochi', state: 'Kerala' },
    { city: 'Thiruvananthapuram', state: 'Kerala' },
    { city: 'Munnar', state: 'Kerala' },
    { city: 'Alappuzha', state: 'Kerala' },
    { city: 'Kumarakom', state: 'Kerala' },
    { city: 'Wayanad', state: 'Kerala' },
    { city: 'Varkala', state: 'Kerala' },
    // Madhya Pradesh
    { city: 'Bhopal', state: 'Madhya Pradesh' },
    { city: 'Indore', state: 'Madhya Pradesh' },
    { city: 'Khajuraho', state: 'Madhya Pradesh' },
    { city: 'Gwalior', state: 'Madhya Pradesh' },
    { city: 'Ujjain', state: 'Madhya Pradesh' },
    { city: 'Pachmarhi', state: 'Madhya Pradesh' },
    { city: 'Bandhavgarh', state: 'Madhya Pradesh' },
    // Maharashtra
    { city: 'Mumbai', state: 'Maharashtra' },
    { city: 'Pune', state: 'Maharashtra' },
    { city: 'Aurangabad', state: 'Maharashtra' },
    { city: 'Nashik', state: 'Maharashtra' },
    { city: 'Lonavala', state: 'Maharashtra' },
    { city: 'Mahabaleshwar', state: 'Maharashtra' },
    { city: 'Alibaug', state: 'Maharashtra' },
    { city: 'Igatpuri', state: 'Maharashtra' },
    { city: 'Matheran', state: 'Maharashtra' },
    // Manipur
    { city: 'Imphal', state: 'Manipur' },
    { city: 'Ukhrul', state: 'Manipur' },
    // Meghalaya
    { city: 'Shillong', state: 'Meghalaya' },
    { city: 'Cherrapunji', state: 'Meghalaya' },
    { city: 'Mawlynnong', state: 'Meghalaya' },
    // Mizoram
    { city: 'Aizawl', state: 'Mizoram' },
    { city: 'Lunglei', state: 'Mizoram' },
    // Nagaland
    { city: 'Kohima', state: 'Nagaland' },
    { city: 'Dimapur', state: 'Nagaland' },
    { city: 'Mokokchung', state: 'Nagaland' },
    // Odisha
    { city: 'Bhubaneswar', state: 'Odisha' },
    { city: 'Puri', state: 'Odisha' },
    { city: 'Cuttack', state: 'Odisha' },
    { city: 'Konark', state: 'Odisha' },
    // Punjab
    { city: 'Amritsar', state: 'Punjab' },
    { city: 'Chandigarh', state: 'Chandigarh' },
    { city: 'Ludhiana', state: 'Punjab' },
    { city: 'Patiala', state: 'Punjab' },
    // Rajasthan
    { city: 'Jaipur', state: 'Rajasthan' },
    { city: 'Udaipur', state: 'Rajasthan' },
    { city: 'Jaisalmer', state: 'Rajasthan' },
    { city: 'Jodhpur', state: 'Rajasthan' },
    { city: 'Mount Abu', state: 'Rajasthan' },
    { city: 'Pushkar', state: 'Rajasthan' },
    // Sikkim
    { city: 'Gangtok', state: 'Sikkim' },
    { city: 'Pelling', state: 'Sikkim' },
    { city: 'Lachung', state: 'Sikkim' },
    { city: 'Yuksom', state: 'Sikkim' },
    // Tamil Nadu
    { city: 'Chennai', state: 'Tamil Nadu' },
    { city: 'Coimbatore', state: 'Tamil Nadu' },
    { city: 'Madurai', state: 'Tamil Nadu' },
    { city: 'Ooty', state: 'Tamil Nadu' },
    { city: 'Kodaikanal', state: 'Tamil Nadu' },
    { city: 'Kanyakumari', state: 'Tamil Nadu' },
    { city: 'Mahabalipuram', state: 'Tamil Nadu' },
    // Telangana
    { city: 'Hyderabad', state: 'Telangana' },
    { city: 'Warangal', state: 'Telangana' },
    { city: 'Nizamabad', state: 'Telangana' },
    // Tripura
    { city: 'Agartala', state: 'Tripura' },
    { city: 'Udaipur (Tripura)', state: 'Tripura' },
    // Uttar Pradesh
    { city: 'Lucknow', state: 'Uttar Pradesh' },
    { city: 'Varanasi', state: 'Uttar Pradesh' },
    { city: 'Agra', state: 'Uttar Pradesh' },
    { city: 'Prayagraj', state: 'Uttar Pradesh' },
    { city: 'Mathura', state: 'Uttar Pradesh' },
    { city: 'Ayodhya', state: 'Uttar Pradesh' },
    // Uttarakhand
    { city: 'Dehradun', state: 'Uttarakhand' },
    { city: 'Rishikesh', state: 'Uttarakhand' },
    { city: 'Nainital', state: 'Uttarakhand' },
    { city: 'Mussoorie', state: 'Uttarakhand' },
    { city: 'Haridwar', state: 'Uttarakhand' },
    { city: 'Auli', state: 'Uttarakhand' },
    // West Bengal
    { city: 'Kolkata', state: 'West Bengal' },
    { city: 'Darjeeling', state: 'West Bengal' },
    { city: 'Siliguri', state: 'West Bengal' },
    { city: 'Digha', state: 'West Bengal' },
    // Union Territories
    { city: 'Delhi', state: 'Delhi' },
    { city: 'Puducherry', state: 'Puducherry' },
    { city: 'Auroville', state: 'Puducherry' },
    { city: 'Port Blair', state: 'Andaman and Nicobar Islands' },
    { city: 'Havelock Island', state: 'Andaman and Nicobar Islands' },
    { city: 'Neil Island', state: 'Andaman and Nicobar Islands' },
    { city: 'Leh', state: 'Ladakh' },
    { city: 'Kargil', state: 'Ladakh' },
  ];

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const suggestedPlaces = [
    { id: 1, city: 'Goa', state: 'Goa', image: '🏖️' },
    { id: 2, city: 'Jaipur', state: 'Rajasthan', image: '🏰' },
    { id: 3, city: 'Mumbai', state: 'Maharashtra', image: '🏙️' },
    { id: 4, city: 'Shimla', state: 'Himachal Pradesh', image: '⛰️' },
    { id: 5, city: 'Varanasi', state: 'Uttar Pradesh', image: '🕉️' },
    { id: 6, city: 'Kochi', state: 'Kerala', image: '🌴' },
  ];

  useEffect(() => {
    // Load trips from localStorage
    const storedTrips = JSON.parse(localStorage.getItem('globetrotter_trips') || '[]');
    const userTrips = storedTrips.filter(trip => trip.userId === user?.id);
    setTrips(userTrips);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate start date
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setDateError('');
    
    // Check if date is in the past
    if (newStartDate < today) {
      setDateError('Start date cannot be in the past');
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      startDate: newStartDate,
      // Reset end date if it's before new start date
      endDate: prev.endDate && prev.endDate < newStartDate ? '' : prev.endDate
    }));
  };

  // Validate end date
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setDateError('');
    
    // Check if end date is before start date
    if (formData.startDate && newEndDate < formData.startDate) {
      setDateError('End date must be after start date');
      return;
    }
    
    // Check if end date is in the past
    if (newEndDate < today) {
      setDateError('End date cannot be in the past');
      return;
    }
    
    setFormData((prev) => ({ ...prev, endDate: newEndDate }));
  };

  const handleCreateTrip = (e) => {
    e.preventDefault();
    const allTrips = JSON.parse(localStorage.getItem('globetrotter_trips') || '[]');
    const newTrip = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      userId: user?.id,
    };
    allTrips.push(newTrip);
    localStorage.setItem('globetrotter_trips', JSON.stringify(allTrips));
    setTrips([...trips, newTrip]);
    
    // Reset form
    setFormData({
      tripName: '',
      city: '',
      state: '',
      country: 'India',
      startDate: '',
      endDate: '',
    });
    setDateError('');
    setShowCreateForm(false);
    
    // Navigate to itinerary builder
    onNavigate('itinerary', newTrip.id);
  };

  const deleteTrip = (tripId) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      const allTrips = JSON.parse(localStorage.getItem('globetrotter_trips') || '[]');
      const updatedTrips = allTrips.filter(trip => trip.id !== tripId);
      localStorage.setItem('globetrotter_trips', JSON.stringify(updatedTrips));
      setTrips(trips.filter(trip => trip.id !== tripId));
    }
  };

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

      <main className="pt-24 pb-20 px-6 md:px-10 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-moss mb-2">My Trips</h1>
            <p className="text-moss/60">Plan and manage your adventures</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="cta"
          >
            <Plus className="h-4 w-4" />
            {showCreateForm ? 'Cancel' : 'Create New Trip'}
          </button>
        </div>

        {/* Create Trip Form (Collapsible) */}
        {showCreateForm && (
          <form onSubmit={handleCreateTrip} className="bento-card p-8 mb-8">
            <h2 className="text-2xl font-serif font-bold text-moss mb-6">Create a new trip</h2>
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

              {/* Country (Fixed) */}
              <div className="space-y-2">
                <label className="label">Country</label>
                <input
                  type="text"
                  value="India"
                  className="input w-full bg-moss/5 cursor-not-allowed"
                  disabled
                />
              </div>

              {/* State Dropdown */}
              <div className="space-y-2">
                <label className="label">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input w-full"
                  required
                >
                  <option value="">Select a state</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Dropdown (static list) */}
              <div className="space-y-2">
                <label className="label">City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-sienna z-10" strokeWidth={1.5} />
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input pl-10 w-full"
                    required
                  >
                    <option value="">Select a city</option>
                    {(formData.state ? indianCities.filter(c => c.state === formData.state) : indianCities).map((city, index) => (
                      <option key={`${city.city}-${index}`} value={city.city}>
                        {city.city} {city.state ? `, ${city.state}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-moss/60">Filtered by the selected state</p>
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
                    onChange={handleStartDateChange}
                    min={today}
                    className="input pl-10 w-full"
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
                    onChange={handleEndDateChange}
                    min={formData.startDate || today}
                    className="input pl-10 w-full"
                    required
                  />
                </div>
              </div>

              {/* Date Error Message */}
              {dateError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {dateError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="cta w-full justify-center mt-6"
              >
                Create Trip & Build Itinerary
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Suggestions Section */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-serif font-semibold text-moss">
                  Suggested Destinations
                </h3>
                <div className="flex-1 h-[0.5px] bg-moss/10" />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {suggestedPlaces.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, city: place.city, state: place.state }))}
                    className="bento-card p-4 h-32 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:border-sienna/30 transition group"
                  >
                    <div className="text-4xl mb-2 group-hover:scale-110 transition">{place.image}</div>
                    <span className="text-center text-sm font-semibold text-moss">{place.city}, {place.state}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* Trips List */}
        <section>
          {trips.length === 0 ? (
            <div className="bento-card p-12 text-center">
              <div className="text-6xl mb-4">✈️</div>
              <h3 className="text-2xl font-serif font-bold text-moss mb-2">No trips yet</h3>
              <p className="text-moss/60 mb-6">Start planning your first adventure!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="cta"
              >
                <Plus className="h-4 w-4" />
                Create Your First Trip
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <div key={trip.id} className="bento-card p-6 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-serif font-bold text-moss mb-1">{trip.tripName}</h3>
                      <p className="text-sm text-moss/60 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {trip.city}, {trip.state}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-red-50 text-red-600 transition"
                      title="Delete trip"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-moss/60 mb-4">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => onNavigate('itinerary', trip.id)}
                    className="cta w-full justify-center"
                  >
                    View Itinerary
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
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
            className="flex flex-col items-center gap-1 rounded-full px-3 py-1 bg-sienna/10 text-sienna"
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
