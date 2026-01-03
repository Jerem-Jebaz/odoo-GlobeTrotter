import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import CreateTrip from './pages/CreateTrip';
import Itinerary from './pages/Itinerary';
import Trips from './pages/Trips';

function Dashboard() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentTripId, setCurrentTripId] = useState(null);
  const [prefillPlace, setPrefillPlace] = useState(null);
  const [prefillTripData, setPrefillTripData] = useState(null);
  const { user } = useAuth();

  const handleNavigate = (page, payload = null) => {
    setCurrentPage(page);

    // Support legacy tripId number or payload object
    if (typeof payload === 'number') {
      setCurrentTripId(payload);
    } else if (payload && typeof payload === 'object') {
      if (payload.tripId) setCurrentTripId(payload.tripId);
      if (payload.prefillPlace) setPrefillPlace(payload.prefillPlace);
      if (payload.prefillTripData) setPrefillTripData(payload.prefillTripData);
    }

    // Clear prefill when leaving createTrip
    if (page !== 'createTrip') {
      setPrefillPlace(null);
    }

    // Clear trip prefill when leaving trips
    if (page !== 'trips') {
      setPrefillTripData(null);
    }
  };

  // Render different pages based on currentPage state
  if (currentPage === 'profile') {
    return <Profile onBack={() => handleNavigate('landing')} />;
  }

  if (currentPage === 'trips') {
    return <Trips onNavigate={handleNavigate} prefillTripData={prefillTripData} />;
  }

  if (currentPage === 'createTrip') {
    return <CreateTrip onNavigate={handleNavigate} prefillPlace={prefillPlace} />;
  }

  if (currentPage === 'itinerary') {
    return <Itinerary onNavigate={handleNavigate} tripId={currentTripId} />;
  }

  return (
    <div className="min-h-screen bg-bone text-moss">
      <Landing onNavigate={handleNavigate} />
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();
  const [authScreen, setAuthScreen] = useState('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block pill bg-sienna/20 text-sienna mb-4">GT · GlobeTrotter</div>
          <p className="text-moss/60">Loading your travel companion...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show auth pages
  if (!user) {
    return authScreen === 'login' ? (
      <Login onSwitchToRegister={() => setAuthScreen('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthScreen('login')} />
    );
  }

  // If logged in, show dashboard
  return <Dashboard />;
}

export default App;
