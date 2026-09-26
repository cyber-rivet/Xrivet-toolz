import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ApiCatalog } from './components/ApiCatalog';
import { ApiPlayground } from './components/ApiPlayground';
import { TierPricing } from './components/TierPricing';
import { KeyManagerDashboard } from './components/KeyManagerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { KeyStoreModal } from './components/KeyStoreModal';
import { CodeSnippetModal } from './components/CodeSnippetModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { PUBLIC_APIS_DATABASE, PublicApiItem } from './data/publicApisData';
import { Zap, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

import { syncUserToFirestore } from './lib/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'playground' | 'pricing' | 'dashboard' | 'admin'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [codeSnippetApi, setCodeSnippetApi] = useState<PublicApiItem | null>(null);
  const [playgroundApi, setPlaygroundApi] = useState<PublicApiItem | null>(null);

  // Dynamic Public APIs catalog
  const [apisCatalog, setApisCatalog] = useState<PublicApiItem[]>(PUBLIC_APIS_DATABASE);

  // Auth User State with Persistence
  const [currentUser, setCurrentUser] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem('xrivet_session_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const saveUserSession = (user: any | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('xrivet_session_user', JSON.stringify(user));
      syncUserToFirestore(user);
    } else {
      localStorage.removeItem('xrivet_session_user');
    }
  };
  const [userKeys, setUserKeys] = useState<any[]>([]);
  const [activeUserApiKey, setActiveUserApiKey] = useState<string>('xrivet_live_free_demo_88a990');

  // Initial Full-Screen Login Page States
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // Fetch Public APIs from server
  const fetchApisCatalog = async () => {
    try {
      const res = await fetch('/api/directory/apis');
      const json = await res.json();
      if (json.apis && Array.isArray(json.apis)) {
        setApisCatalog(json.apis);
      }
    } catch (err) {
      console.error('Error loading APIs catalog:', err);
    }
  };

  // Fetch user keys
  const fetchUserKeys = async () => {
    try {
      const url = currentUser ? `/api/keys?userId=${currentUser.id}` : '/api/keys';
      const res = await fetch(url);
      const json = await res.json();
      if (json.keys) {
        setUserKeys(json.keys);
        if (json.keys.length > 0) {
          const active = json.keys.find((k: any) => k.status === 'active');
          if (active) {
            setActiveUserApiKey(active.key);
          }
        }
      }
    } catch (err) {
      console.error('Error loading keys:', err);
    }
  };

  useEffect(() => {
    fetchApisCatalog();
    if (currentUser) {
      fetchUserKeys();
    }
  }, [currentUser]);

  // Standalone Full-Screen Login Handler
  const handlePageLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    setLoginSuccess(null);

    try {
      if (loginMode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usernameOrEmail: loginUsername,
            password: loginPassword
          })
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Authentication failed');

        setLoginSuccess(json.message);
        setTimeout(() => {
          saveUserSession(json.user);
          if (json.user.role === 'admin') {
            setActiveTab('admin');
          } else {
            setActiveTab('catalog');
          }
        }, 600);

      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: loginUsername,
            email: loginEmail,
            password: loginPassword
          })
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Registration failed');

        setLoginSuccess(json.message);
        setTimeout(() => {
          saveUserSession(json.user);
          setActiveTab('catalog');
        }, 800);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Error authenticating user');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLoginSuccess = (user: any) => {
    saveUserSession(user);
    if (user.role === 'admin') {
      setActiveTab('admin');
    }
  };

  const handleLogout = () => {
    saveUserSession(null);
    setLoginUsername('');
    setLoginPassword('');
    setLoginError(null);
  };

  const handleKeyGenerated = (newKeyRecord: any) => {
    setUserKeys(prev => [newKeyRecord, ...prev]);
    setActiveUserApiKey(newKeyRecord.key);
  };

  const handleRevokeKey = async (keyStr: string) => {
    try {
      await fetch('/api/keys/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: keyStr })
      });
      fetchUserKeys();
    } catch (err) {
      console.error('Error revoking key:', err);
    }
  };

  const handleSelectApiForPlayground = (api: PublicApiItem) => {
    setPlaygroundApi(api);
    setActiveTab('playground');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- MANDATORY LOGIN SCREEN (No Guest Bypass) ---
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-cyan-500 selection:text-slate-950">
        
        {/* Background Grid & Radial Lighting */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-radial-gradient pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 uiverse-animated-cyber-card shadow-2xl my-8">
          <div className="uiverse-cyber-card-inner space-y-6">
            
            {/* Header Brand */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-400 to-indigo-500 p-0.5 mx-auto shadow-xl shadow-cyan-500/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                  <Zap className="w-7 h-7" />
                </div>
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                XRivet<span className="text-cyan-400">Tool</span> Portal
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                Sign in or register to access universal public API keys & developer gateway.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => { setLoginMode('login'); setLoginError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  loginMode === 'login'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode('register'); setLoginError(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  loginMode === 'register'
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error / Success Alerts */}
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            {loginSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{loginSuccess}</span>
              </div>
            )}

            {/* Login / Register Form */}
            <form onSubmit={handlePageLogin} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  {loginMode === 'login' ? 'Username or Email' : 'Username'}
                </label>
                <div className="uiverse-input-group">
                  <input
                    type="text"
                    required
                    placeholder={loginMode === 'login' ? 'Enter username or email' : 'Choose a username'}
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="uiverse-cyber-input"
                  />
                </div>
              </div>

              {loginMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Email Address</label>
                  <div className="uiverse-input-group">
                    <input
                      type="email"
                      required
                      placeholder="developer@company.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="uiverse-cyber-input"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <div className="relative uiverse-input-group">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="uiverse-cyber-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-200"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full uiverse-button-primary py-3 font-bold text-sm shadow-xl flex items-center justify-center gap-2 mt-2"
              >
                <span>{loginLoading ? 'Authenticating...' : loginMode === 'login' ? 'Sign In to XRivet' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

          </div>
        </div>

      </div>
    );
  }

  // --- LOGGED IN FULL APP VIEW ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      
      <div>
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openKeyModal={() => setIsKeyModalOpen(true)}
          openAuthModal={() => setIsAuthModalOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
          activeKeysCount={userKeys.filter(k => k.status === 'active').length}
        />

        {/* Hero Banner (Catalog Tab) */}
        {activeTab === 'catalog' && (
          <HeroSection
            onSearch={(term) => setSearchTerm(term)}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            openKeyModal={() => setIsKeyModalOpen(true)}
            onExploreClick={() => {
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            totalApisCount={apisCatalog.length}
          />
        )}

        {/* Main Tabs */}
        <main>
          {activeTab === 'catalog' && (
            <div id="catalog-section">
              <ApiCatalog
                apis={apisCatalog}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSelectApiForPlayground={handleSelectApiForPlayground}
                onOpenCodeSnippet={(api) => setCodeSnippetApi(api)}
                openKeyModal={() => setIsKeyModalOpen(true)}
              />
            </div>
          )}

          {activeTab === 'playground' && (
            <ApiPlayground
              selectedApi={playgroundApi}
              userApiKey={activeUserApiKey}
              onOpenKeyModal={() => setIsKeyModalOpen(true)}
            />
          )}

          {activeTab === 'pricing' && (
            <TierPricing openKeyModal={() => setIsKeyModalOpen(true)} />
          )}

          {activeTab === 'dashboard' && (
            <KeyManagerDashboard
              userKeys={userKeys}
              onRevokeKey={handleRevokeKey}
              openKeyModal={() => setIsKeyModalOpen(true)}
              onTestKeyInPlayground={(keyStr) => {
                setActiveUserApiKey(keyStr);
                setActiveTab('playground');
              }}
            />
          )}

          {activeTab === 'admin' && currentUser?.role === 'admin' && (
            <AdminPanel
              adminUser={currentUser}
              onApiAddedSuccess={fetchApisCatalog}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        openKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Modals */}
      <KeyStoreModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeyGenerated={handleKeyGenerated}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CodeSnippetModal
        api={codeSnippetApi}
        userApiKey={activeUserApiKey}
        onClose={() => setCodeSnippetApi(null)}
      />

    </div>
  );
}
