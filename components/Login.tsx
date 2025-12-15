import React, { useState, useEffect } from 'react';
import { Mail, Phone, Lock, ArrowRight, CheckCircle, Trash2, Search, ShieldCheck, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [method, setMethod] = useState<'gmail' | 'whatsapp' | null>(null);
  
  // Verification State
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Timer Logic
  useEffect(() => {
    let interval: number;
    if (timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && step === 'verify') {
      setGeneratedOtp(null); // Expire OTP
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const identifyInput = (value: string): 'gmail' | 'whatsapp' | 'invalid' => {
    // Email Check
    if (value.includes('@')) {
      return value.endsWith('@gmail.com') ? 'gmail' : 'invalid';
    }
    // Phone Check (Allowing +, spaces, dashes, but checking digit count)
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 10) return 'whatsapp';
    
    // If it's just a partial string, we wait, but for final submission:
    return 'invalid';
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate Google OAuth
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  const handleGetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const type = identifyInput(identifier);

    if (type === 'invalid') {
      setIsLoading(false);
      if (identifier.includes('@')) {
        setError("Only @gmail.com addresses are supported for Smart City login.");
      } else {
        setError("Please enter a valid Gmail address or WhatsApp number.");
      }
      return;
    }

    setMethod(type);

    // Simulate API Call
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setTimer(300); // 5 mins
      setStep('verify');
      setIsLoading(false);
      
      const channelName = type === 'gmail' ? 'Gmail' : 'WhatsApp';
      alert(`[DEMO ${channelName} Gateway]\n\nYour Verification Code: ${code}`);
    }, 1500);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (!generatedOtp || timer === 0) {
        setError("Code expired. Please request a new one.");
        setIsLoading(false);
        return;
      }

      if (otp === generatedOtp) {
        onLogin();
      } else {
        setError("Invalid code. Please try again.");
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleResend = () => {
    setOtp('');
    setStep('input');
    setTimer(0);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-sm"></div>
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden m-4 border border-emerald-100">
        
        {/* Header */}
        <div className="p-8 pb-6 flex flex-col items-center">
           <div className="relative w-20 h-20 mb-4">
              <div className="absolute inset-0 rounded-full border-[4px] border-emerald-700 flex items-center justify-center bg-emerald-50 shadow-inner">
                <Trash2 className="w-10 h-10 text-emerald-700 mb-1" strokeWidth={2.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 border-[3px] border-emerald-700 shadow-md">
                <Search className="w-4 h-4 text-emerald-700" strokeWidth={3} />
              </div>
            </div>
            <h1 className="text-xl font-black text-emerald-900 tracking-tight">WASTE CONTROL SYSTEM</h1>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1">Smart City Portal</p>
        </div>

        <div className="px-8 pb-8">
          
          {step === 'input' ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Google Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold shadow-sm hover:bg-slate-50 hover:shadow-md transition-all flex items-center justify-center group"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                ) : (
                  <>
                     <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    Sign in with Google
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400 font-medium">Or continue with</span>
                </div>
              </div>

              <form onSubmit={handleGetOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 ml-1">Gmail or WhatsApp</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-emerald-500/50" />
                    </div>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                      placeholder="user@gmail.com or +123..."
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100 animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Get Verification Code
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-full mb-3 text-emerald-600">
                  {method === 'gmail' ? <Mail className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
                </div>
                <h4 className="text-lg font-bold text-slate-800">Check your {method === 'gmail' ? 'Inbox' : 'WhatsApp'}</h4>
                <p className="text-sm text-slate-500 max-w-[240px] mx-auto mt-1">
                  We sent a code to <span className="font-semibold text-slate-700">{identifier}</span>
                </p>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all tracking-[0.5em] font-mono text-center text-xl font-bold text-slate-800"
                    placeholder="000000"
                    autoFocus
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                   <button 
                    type="button"
                    onClick={handleResend}
                    className="text-xs text-slate-400 hover:text-emerald-600 flex items-center transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Change Method
                  </button>
                  <span className="text-xs font-mono text-slate-400">
                    Expires in {formatTime(timer)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="flex items-center text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:translate-y-[-1px] transition-all flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Verify & Login
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-[10px] text-slate-400 mt-6">
            Protected by Smart City Grid Security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;