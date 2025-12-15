import React, { useState, useEffect } from 'react';
import { Mail, Phone, Lock, ArrowRight, User, MessageCircle, Clock, CheckCircle, Building2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'contact' | 'gmail'>('gmail');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [demoOtp, setDemoOtp] = useState('');

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  const handleGetOtp = () => {
    // Generate a random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoOtp(code);
    setOtpSent(true);
    setCountdown(60);
    
    // Simulate sending delay and "receiving" the message via Alert
    setTimeout(() => {
      alert(`[DEMO] Waste Control System\n\nYour WhatsApp Verification Code is: ${code}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2613&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden m-4">
        <div className="p-8 pb-0">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 p-0.5 shadow-xl mb-4">
               <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                 <Building2 className="w-12 h-12 text-pink-600" />
               </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 text-center leading-tight">
              Waste Control System
            </h2>
            <p className="text-sm font-bold text-pink-600 mt-1 uppercase tracking-wide bg-pink-50 px-3 py-1 rounded-full">
              Smart City Resident Portal
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab('gmail')}
              className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'gmail' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Gmail
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'contact' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-8 pt-0">
          <div className="space-y-4">
            {activeTab === 'gmail' ? (
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                    placeholder="name@gmail.com"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                    placeholder="Gmail Password"
                  />
                </div>
                <div className="flex justify-end">
                    <a href="#" className="text-xs text-pink-600 hover:underline">Forgot password?</a>
                </div>
              </>
            ) : (
              <>
                 <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                    placeholder="WhatsApp Number"
                  />
                </div>
                
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleGetOtp}
                    disabled={countdown > 0}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center ${
                      countdown > 0 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : 'bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 border border-[#25D366]/30'
                    }`}
                  >
                    {countdown > 0 ? (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Resend in {countdown}s
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {otpSent ? 'Resend to WhatsApp' : 'Get OTP on WhatsApp'}
                      </>
                    )}
                  </button>
                  
                  {otpSent && (
                    <div className="flex flex-col items-start justify-center text-xs text-green-700 bg-green-50 p-3 rounded-lg animate-fadeIn border border-green-100">
                      <div className="flex items-center font-medium mb-1">
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                        <span>Code sent to WhatsApp</span>
                      </div>
                      <p className="pl-5 opacity-90">
                        Demo code: <span className="font-bold select-all bg-green-200 px-1 rounded">{demoOtp}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all tracking-widest"
                    placeholder="000000"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:opacity-90 transition-all flex items-center justify-center group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {activeTab === 'gmail' ? 'Sign in with Gmail' : 'Verify & Login'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-4">
              Protected by Smart City Grid Security.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;