import React, { useState } from 'react';
import { X, Zap, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Form states
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (mode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usernameOrEmail: usernameInput,
            password: passwordInput
          })
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Authentication failed');
        }

        setSuccessMsg(json.message);
        setTimeout(() => {
          onLoginSuccess(json.user);
          onClose();
        }, 800);

      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: usernameInput,
            email: emailInput,
            password: passwordInput
          })
        });

        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Registration failed');
        }

        setSuccessMsg(json.message);
        setTimeout(() => {
          onLoginSuccess(json.user);
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server response error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      
      {/* UIVerse Animated Cyber Card Container */}
      <div className="relative w-full max-w-md uiverse-animated-cyber-card shadow-2xl">
        
        <div className="uiverse-cyber-card-inner space-y-6">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo & Title */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-400 to-indigo-500 p-0.5 mx-auto shadow-lg shadow-cyan-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                <Zap className="w-6 h-6" />
              </div>
            </div>

            <h2 className="font-display font-bold text-2xl text-white">
              {mode === 'login' ? 'Sign In to XRivet' : 'Create Developer Account'}
            </h2>
            <p className="text-slate-400 text-xs">
              {mode === 'login'
                ? 'Access your API keys, usage dashboard, and proxy gateway.'
                : 'Get instant free sandbox quota across 500+ Public APIs.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / Identifier */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                {mode === 'login' ? 'Username or Email' : 'Username'}
              </label>
              <div className="uiverse-input-group">
                <input
                  type="text"
                  required
                  placeholder={mode === 'login' ? 'Username or email' : 'Choose a username'}
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="uiverse-cyber-input"
                />
              </div>
            </div>

            {/* Email Field (Register Only) */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Email Address</label>
                <div className="uiverse-input-group">
                  <input
                    type="email"
                    required
                    placeholder="developer@company.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="uiverse-cyber-input"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <div className="relative uiverse-input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="uiverse-cyber-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full uiverse-button-primary py-3 font-bold text-sm shadow-xl flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLoading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};
