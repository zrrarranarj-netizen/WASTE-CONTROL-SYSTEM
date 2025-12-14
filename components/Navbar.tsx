import React from 'react';
import { Leaf, LogOut } from 'lucide-react';

interface NavbarProps {
  onLogout: () => void;
  currentPage: 'dashboard' | 'detector';
  onNavigate: (page: 'dashboard' | 'detector') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, currentPage, onNavigate }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer max-w-[60%]" onClick={() => onNavigate('dashboard')}>
            <div className="bg-pink-600 p-2 rounded-lg flex-shrink-0">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-sm md:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-500 leading-tight">
              Waste Control System with Deep Learning in Smart City
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`hidden md:block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'dashboard' 
                  ? 'text-pink-600 bg-pink-50' 
                  : 'text-slate-600 hover:text-pink-600'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('detector')}
              className={`hidden md:block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'detector' 
                  ? 'text-pink-600 bg-pink-50' 
                  : 'text-slate-600 hover:text-pink-600'
              }`}
            >
              Waste Detector
            </button>
            {/* Mobile simplified nav */}
             <div className="md:hidden flex space-x-2">
                 <button
                  onClick={() => onNavigate('detector')}
                  className={`p-2 rounded-md ${currentPage === 'detector' ? 'text-pink-600 bg-pink-50' : 'text-slate-600'}`}
                >
                  <span className="text-xs font-bold">AI</span>
                </button>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;