import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WasteDetector from './components/WasteDetector';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'detector'>('dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar 
        onLogout={handleLogout} 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      <main className="transition-opacity duration-300 ease-in-out animate-fadeIn">
        {currentPage === 'dashboard' ? (
          <Dashboard />
        ) : (
          <WasteDetector />
        )}
      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2024 Waste Control System with Deep Learning in Smart City. Powered by Google Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;