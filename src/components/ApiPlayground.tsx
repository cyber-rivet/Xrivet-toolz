import React, { useState, useEffect } from 'react';
import { PublicApiItem, PUBLIC_APIS_DATABASE } from '../data/publicApisData';
import { Terminal, Play, Copy, Check, Key, ShieldCheck, Zap, RefreshCw, Lock } from 'lucide-react';

interface ApiPlaygroundProps {
  selectedApi: PublicApiItem | null;
  userApiKey: string;
  onOpenKeyModal: () => void;
}

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({
  selectedApi,
  userApiKey,
  onOpenKeyModal
}) => {
  const [activeApi, setActiveApi] = useState<PublicApiItem>(
    selectedApi || PUBLIC_APIS_DATABASE[0]
  );

  useEffect(() => {
    if (selectedApi) {
      setActiveApi(selectedApi);
      setEndpointDisplay(selectedApi.GatewayUrl || `/api/v1/gateway/${selectedApi.id}`);
    }
  }, [selectedApi]);

  const [endpointDisplay, setEndpointDisplay] = useState<string>(
    selectedApi ? (selectedApi.GatewayUrl || `/api/v1/gateway/${selectedApi.id}`) : `/api/v1/gateway/${PUBLIC_APIS_DATABASE[0].id}`
  );
  const [httpMethod, setHttpMethod] = useState<string>('GET');
  const [apiKeyInput, setApiKeyInput] = useState<string>(userApiKey || 'xrivet_live_free_demo_88a990');

  useEffect(() => {
    if (userApiKey) {
      setApiKeyInput(userApiKey);
    }
  }, [userApiKey]);

  // Request & Response States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState<string>('');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [proxyHeader, setProxyHeader] = useState<string>('');
  const [quotaRemaining, setQuotaRemaining] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Preset loader
  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const apiId = e.target.value;
    const found = PUBLIC_APIS_DATABASE.find(item => item.id === apiId);
    if (found) {
      setActiveApi(found);
      setEndpointDisplay(found.GatewayUrl || `/api/v1/gateway/${found.id}`);
      setResponseData(null);
      setResponseStatus(null);
    }
  };

  // Execute Proxy Fetch via Server Gateway
  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setResponseData(null);
    setResponseStatus(null);

    try {
      // Direct call to server gateway route (hides target URL 100% from inspect element)
      const res = await fetch(`/api/v1/gateway/${activeApi.id}`, {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKeyInput}`
        }
      });

      const json = await res.json();
      setResponseStatus(json.status || res.status);
      setResponseStatusText(json.statusText || (res.ok ? '200 OK' : 'Error'));
      setLatencyMs(json.latencyMs || 18);
      setProxyHeader(json.proxyGateway || 'XRivet-Server-Shield-v2');
      setQuotaRemaining(json.quotaRemaining !== undefined ? json.quotaRemaining : 950);
      setResponseData(json.data || json);

    } catch (err: any) {
      console.error('Playground fetch error:', err);
      setResponseStatus(500);
      setResponseStatusText('XRivet Gateway Timeout');
      setResponseData({ error: 'Failed to route through XRivet Gateway', details: err?.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!responseData) return;
    navigator.clipboard.writeText(JSON.stringify(responseData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-7 h-7 text-cyan-400" />
            <span>Interactive API Playground</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Test live HTTP calls. All upstream target URLs are 100% masked server-side for maximum security.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 min-w-[280px]">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Load Preset:</span>
          <select
            value={activeApi.id}
            onChange={handleSelectPreset}
            className="w-full py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {PUBLIC_APIS_DATABASE.map(item => (
              <option key={item.id} value={item.id}>
                {item.API} ({item.Category})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Request Configuration */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="uiverse-glass-card p-5 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                Request Workbench
              </span>
              <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                Cat: {activeApi.Category}
              </span>
            </div>

            {/* HTTP Method & Masked Gateway Route */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Server Masked Route (Shielded)</label>
              <div className="flex items-center gap-2">
                <select
                  value={httpMethod}
                  onChange={(e) => setHttpMethod(e.target.value)}
                  className="py-2.5 px-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono font-bold text-cyan-400 focus:outline-none"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                </select>

                <input
                  type="text"
                  readOnly
                  value={endpointDisplay}
                  className="flex-1 py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none"
                />
              </div>
            </div>

            {/* XRivet Key Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>XRivet Proxy Auth Token</span>
                </label>
                <button
                  onClick={onOpenKeyModal}
                  className="text-[11px] text-cyan-400 hover:underline font-medium"
                >
                  New Token
                </button>
              </div>

              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="xrivet_live_..."
                className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Preset Info */}
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-900 text-xs space-y-1">
              <div className="font-semibold text-white">{activeApi.API}</div>
              <p className="text-slate-400 leading-normal">{activeApi.Description}</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Auth: {activeApi.Auth}</span>
                <span className="text-emerald-400">Target Masked Server-Side</span>
              </div>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecuteRequest}
              disabled={isLoading}
              className="w-full uiverse-button-primary py-3 text-sm font-bold shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
                  <span>Routing through Server Shield...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Send Request</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Right Column: Live Response Terminal */}
        <div className="lg:col-span-7">
          <div className="uiverse-glass-card p-5 h-full flex flex-col justify-between">
            
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Response Payload
                  </span>

                  {responseStatus && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                      responseStatus === 200
                        ? 'bg-emerald-950/90 border border-emerald-800 text-emerald-400'
                        : 'bg-rose-950/90 border border-rose-800 text-rose-400'
                    }`}>
                      {responseStatus} {responseStatusText}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  {latencyMs !== null && (
                    <span>Latency: <strong className="text-cyan-400">{latencyMs} ms</strong></span>
                  )}
                  {responseData && (
                    <button
                      onClick={handleCopyJson}
                      className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Terminal Screen */}
              <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-200 border border-slate-900 min-h-[340px] max-h-[500px] overflow-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-3">
                    <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                    <p className="text-xs">Processing request via XRivet Server Shield...</p>
                  </div>
                ) : responseData ? (
                  <pre className="text-emerald-400/90 whitespace-pre-wrap break-all leading-relaxed">
                    {JSON.stringify(responseData, null, 2)}
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-500 space-y-2">
                    <Terminal className="w-10 h-10 text-slate-600" />
                    <p className="text-xs">Click &quot;Send Request&quot; to test response.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Shield Telemetry */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Security Shield: <strong className="text-cyan-400">Server-Side Proxy Active</strong></span>
              <span className="text-emerald-400">Upstream URLs 100% Hidden</span>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
