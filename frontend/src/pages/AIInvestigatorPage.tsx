import React, { useState } from 'react';
import { api } from '../services/api';
import { Bot, Send, Sparkles, Shield, Clock, HelpCircle, CheckCircle, Terminal } from 'lucide-react';

interface ChatMessage {
  sender: 'analyst' | 'ai';
  text: string;
  supportingEvidence?: string[];
  timestamp: string;
}

export const AIInvestigatorPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Greetings Analyst. I am the SmartHive AI Investigator, directly connected to the telemetry ingestion pipeline and database records. What would you like to examine regarding incident SH-2026-001 or session SH-104?',
      timestamp: 'Ready',
    },
  ]);

  // Exact questions from Section 36
  const suggestedQuestions = [
    'Why is this incident critical?',
    'What happens next?',
    'Why did risk increase?',
    'What evidence supports the prediction?',
    'Why was this decoy selected?',
    'What happens if we do nothing?',
    'Which response team is nearest?',
    'How early did SmartHive predict the attack?',
  ];

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'analyst',
      text: questionText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.askInvestigator(questionText, 'SH-104');
      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: res.data.answer || 'INSUFFICIENT TELEMETRY AVAILABLE',
        supportingEvidence: res.data.supportingEvidence || [],
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'INSUFFICIENT TELEMETRY AVAILABLE. Unable to query stored security telemetry for this metric.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-[1720px] mx-auto pb-8">
      {/* Header */}
      <div className="soc-panel rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              SmartHive AI Investigator — Explainable Forensic Assistant
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Inquire about threat session SH-104, counterfactual predictions, deceptive diversion rationale, and
            forensic integrity. All responses are derived strictly from database records — zero hallucinations.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300">Ground Truth Verification Active</span>
        </div>
      </div>

      {/* Suggested Inquiries Pills matching Section 36 */}
      <div className="soc-panel rounded-lg p-3.5 space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 font-mono">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Section 36 Standard SOC Inquiries</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleAsk(q)}
              className="text-xs font-mono bg-[#09101F] hover:bg-cyan-950/60 hover:text-cyan-300 hover:border-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-md text-slate-300 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="soc-panel rounded-lg flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                m.sender === 'analyst' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 border font-mono text-xs font-bold ${
                  m.sender === 'analyst'
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-cyan-950 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                }`}
              >
                {m.sender === 'analyst' ? 'SOC' : 'AI'}
              </div>

              <div
                className={`max-w-2xl rounded-lg p-3.5 space-y-2 border text-xs font-mono ${
                  m.sender === 'analyst'
                    ? 'bg-blue-950/50 border-blue-500/40 text-blue-100'
                    : 'bg-[#09101F] border-cyan-500/20 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-semibold">{m.sender === 'analyst' ? 'Lead Analyst' : 'SmartHive Engine'}</span>
                  <span>{m.timestamp}</span>
                </div>

                <div className="leading-relaxed whitespace-pre-wrap">{m.text}</div>

                {m.supportingEvidence && m.supportingEvidence.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] text-cyan-400 font-bold block uppercase">
                      Ground Truth Supporting Evidence:
                    </span>
                    <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                      {m.supportingEvidence.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 animate-pulse">
              <Bot className="w-4 h-4" />
              <span>Querying telemetry tables and computing statistical rationale...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-cyan-500/15 bg-[#080E1A]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(query);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask the AI Investigator anything about the incident, predictions, or response..."
              className="flex-1 bg-[#0D1527] border border-cyan-500/20 rounded-md px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-900 rounded-md font-mono text-xs font-bold flex items-center space-x-1.5 transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]"
            >
              <span>SEND</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
