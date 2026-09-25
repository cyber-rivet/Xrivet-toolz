import React, { useState } from 'react';
import { X, Copy, Check, Code } from 'lucide-react';
import { PublicApiItem } from '../data/publicApisData';

interface CodeSnippetModalProps {
  api: PublicApiItem | null;
  userApiKey: string;
  onClose: () => void;
}

export const CodeSnippetModal: React.FC<CodeSnippetModalProps> = ({
  api,
  userApiKey,
  onClose
}) => {
  const [lang, setLang] = useState<'curl' | 'js' | 'python' | 'go' | 'php'>('curl');
  const [copied, setCopied] = useState<boolean>(false);

  if (!api) return null;

  const keyVal = userApiKey || 'xrivet_live_free_demo_88a990';
  const url = api.GatewayUrl ? `${window.location.origin}${api.GatewayUrl}` : `${window.location.origin}/api/v1/gateway/${api.id}`;

  const snippets: Record<string, string> = {
    curl: `# cURL command using XRivet Secure Gateway Route
curl -X GET "${url}" \\
  -H "Authorization: Bearer ${keyVal}" \\
  -H "Accept: application/json"`,

    js: `// JavaScript (Fetch API) - Upstream URLs 100% masked server-side
async function fetchPublicApiData() {
  const response = await fetch("${url}", {
    method: "GET",
    headers: {
      "Authorization": "Bearer ${keyVal}",
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  console.log("XRivet Response:", data);
}

fetchPublicApiData();`,

    python: `# Python (requests library)
import requests

url = "${url}"
headers = {
    "Authorization": "Bearer ${keyVal}",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
data = response.json()
print("XRivet Output:", data)`,

    go: `// Go (net/http)
package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    client := &http.Client{}
    req, _ := http.NewRequest("GET", "${url}", nil)
    req.Header.Add("Authorization", "Bearer ${keyVal}")

    resp, err := client.Do(req)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}`,

    php: `<?php
// PHP cURL snippet
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${url}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer ${keyVal}",
    "Accept: application/json"
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-lg text-white">
              {api.API} Code Snippet (Shielded Route)
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto">
          {(['curl', 'js', 'python', 'go', 'php'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition-colors ${
                lang === l
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  : 'bg-slate-950 text-slate-400 border border-slate-900 hover:text-white'
              }`}
            >
              {l === 'curl' ? 'cURL' : l === 'js' ? 'JS / TS' : l}
            </button>
          ))}
        </div>

        {/* Code Box */}
        <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-900 font-mono text-xs text-cyan-300 overflow-x-auto">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <pre className="whitespace-pre-wrap leading-relaxed pr-16">{snippets[lang]}</pre>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono pt-1">
          <span>Auth Header: <strong className="text-white">Authorization: Bearer {keyVal}</strong></span>
          <span className="text-emerald-400">XRivet Server Shield Active</span>
        </div>

      </div>
    </div>
  );
};
