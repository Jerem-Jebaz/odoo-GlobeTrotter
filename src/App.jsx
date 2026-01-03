import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Profile from './pages/Profile';

function Dashboard() {
  const [currentPage, setCurrentPage] = useState('landing');
  const { user } = useAuth();

  // Render different pages based on currentPage state
  if (currentPage === 'profile') {
    return <Profile onBack={() => setCurrentPage('landing')} />;
  }

  return (
    <div className="min-h-screen bg-bone text-moss">
      <Landing onNavigate={setCurrentPage} />
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
