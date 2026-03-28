import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Database,
  Settings,
  Bell,
  Search,
  Mic,
  Video,
  PhoneOff,
  Check,
  CheckCircle,
  X,
  Activity,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Send,
  BrainCircuit,
  Mail,
  FileText,
  ChevronRight,
  MoreVertical,
  Star,
  Bot,
  LineChart,
  Eye,
  Settings2,
  Pause,
  Trash2,
  Heart
} from 'lucide-react';

// --- Mock Data ---
const TRANSCRIPTION = [
  { speaker: 'Dr. Smith', text: "I'm interested in the new cardiovascular imaging system, but I'm concerned about the integration time with our current Epic setup.", time: '10:02 AM', isRisk: true },
  { speaker: 'You', text: "I completely understand that concern, Dr. Smith. Our new API actually reduces integration time by about 40% compared to the previous model.", time: '10:03 AM', isRisk: false },
  { speaker: 'Dr. Smith', text: "That sounds promising. What does the training process look like for my staff?", time: '10:04 AM', isRisk: false },
  { speaker: 'You', text: "We provide a comprehensive 3-day on-site training, followed by 24/7 virtual support for the first month.", time: '10:05 AM', isRisk: false },
  { speaker: 'Dr. Smith', text: "Okay, and regarding the pricing structure... is there flexibility if we commit to a multi-year contract?", time: '10:06 AM', isRisk: false, isIntent: true },
];

const PENDING_ACTIONS = [
  { id: 1, type: 'email', title: 'Draft Follow-up Email', desc: 'Summarize API integration benefits and training schedule.', agent: 'Communication Agent' },
  { id: 2, type: 'calendar', title: 'Schedule Technical Deep Dive', desc: 'Propose meeting with our integration engineer next week.', agent: 'Scheduler Agent' },
  { id: 3, type: 'crm', title: 'Update CRM: High Intent', desc: 'Update deal stage to "Negotiation" based on pricing questions.', agent: 'Analytics Agent' },
];

const SIGNALS = [
  { type: 'intent', label: 'Pricing Flexibility Requested', confidence: 'High' },
  { type: 'objection', label: 'Epic Integration Time', confidence: 'Resolved' },
  { type: 'competitor', label: 'Mentioned GE Healthcare', confidence: 'Low' },
];

const AGENTS = [
  { id: 'head', name: 'Head Agent', role: 'Orchestrator', icon: Bot, color: 'bg-blue-100 text-blue-600', rating: '5.0' },
  { id: 'scheduler', name: 'Scheduler Agent', role: 'Calendar Management', icon: Calendar, color: 'bg-amber-100 text-amber-600', rating: '4.8' },
  { id: 'analytics', name: 'Analytics Agent', role: 'Data & CRM', icon: LineChart, color: 'bg-purple-100 text-purple-600', rating: '4.9' },
  { id: 'comm', name: 'Communication Agent', role: 'Drafts & Follow-ups', icon: MessageSquare, color: 'bg-green-100 text-green-600', rating: '5.0' },
];

// --- Components ---

const Sidebar = () => (
  <div className="w-20 bg-white border-r border-gray-100 flex flex-col items-center py-6 gap-8 z-10">
    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">
      M
    </div>
    <nav className="flex flex-col gap-6 flex-1">
      <button className="p-3 bg-gray-100 text-gray-900 rounded-xl"><LayoutDashboard size={20} /></button>
      <button className="p-3 text-gray-400 hover:text-gray-900 transition-colors"><Users size={20} /></button>
      <button className="p-3 text-gray-400 hover:text-gray-900 transition-colors"><Calendar size={20} /></button>
      <button className="p-3 text-gray-400 hover:text-gray-900 transition-colors"><Database size={20} /></button>
    </nav>
    <div className="flex flex-col gap-6">
      <button className="p-3 text-gray-400 hover:text-gray-900 transition-colors"><Settings size={20} /></button>
      <button className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"><PhoneOff size={20} /></button>
    </div>
  </div>
);

const TopBar = () => (
  <div className="flex justify-between items-center mb-8">
    {/* Active Call Pill */}
    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="font-semibold text-sm text-gray-800">Live: Dr. Smith</span>
      </div>
      <div className="w-px h-4 bg-gray-200"></div>
      <span className="text-sm font-mono text-gray-500">14:23</span>
      <div className="w-px h-4 bg-gray-200"></div>
      <div className="flex gap-2">
        <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-50"><Mic size={16} /></button>
        <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-50"><Video size={16} /></button>
      </div>
    </div>

    {/* Sentiment Bar */}
    <div className="flex items-center gap-4 bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100 flex-1 max-w-md mx-8">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Call Health</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
        <div className="h-full bg-red-400 w-1/4"></div>
        <div className="h-full bg-yellow-400 w-1/4"></div>
        <div className="h-full bg-green-400 w-1/2"></div>
      </div>
      <span className="text-sm font-medium text-green-600">Positive</span>
    </div>

    {/* Right Controls */}
    <div className="flex items-center gap-4">
      <button className="p-2.5 bg-white text-gray-600 rounded-full shadow-sm border border-gray-100 hover:bg-gray-50">
        <Bell size={18} />
      </button>
      <button className="p-2.5 bg-white text-gray-600 rounded-full shadow-sm border border-gray-100 hover:bg-gray-50">
        <Search size={18} />
      </button>
      <div className="flex items-center gap-3 bg-white pl-2 pr-4 py-1.5 rounded-full shadow-sm border border-gray-100">
        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
          ER
        </div>
        <span className="text-sm font-medium text-gray-700">Erlina Rizky</span>
      </div>
    </div>
  </div>
);

const TabBar = ({ active, setActive }: { active: string, setActive: (tab: string) => void }) => {
  const tabs = ['Live Dashboard', 'Active Agents', 'Meeting Notes', 'CRM & Data'];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            active === tab 
              ? 'bg-[#FBBF24] text-gray-900 shadow-sm' 
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const LiveDashboard = ({ actions, handleAction }: { actions: any[], handleAction: (id: number, approved: boolean) => void }) => (
  <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
    {/* Left Column: Live View & Copilot */}
    <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-h-0">
      
      {/* Transcription Card */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity size={20} className="text-blue-500" />
            Live Transcription
          </h2>
          <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
            Auto-scrolling
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar">
          {TRANSCRIPTION.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.speaker === 'You' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900">{msg.speaker}</span>
                <span className="text-xs text-gray-400">{msg.time}</span>
              </div>
              <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                msg.speaker === 'You' 
                  ? 'bg-gray-900 text-white rounded-tr-sm' 
                  : msg.isRisk 
                    ? 'bg-red-50 text-red-900 border border-red-100 rounded-tl-sm'
                    : msg.isIntent
                      ? 'bg-green-50 text-green-900 border border-green-100 rounded-tl-sm'
                      : 'bg-gray-50 text-gray-800 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
              {msg.isRisk && (
                <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> Objection Detected
                </span>
              )}
              {msg.isIntent && (
                <span className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp size={12} /> Buying Signal
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Copilot Chat Card */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 h-64 flex flex-col shrink-0">
          <div className="flex items-center gap-2 mb-4">
          <BrainCircuit size={20} className="text-purple-500" />
          <h2 className="text-lg font-semibold text-gray-900">Agent Copilot</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-4">
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-sm text-purple-900">
            <p className="font-medium mb-1">Suggested Answer for Epic Integration:</p>
            <p className="opacity-90">"Our standard SLA for Epic integration is 14 days. We have a dedicated technical team that handles the HL7/FHIR mapping."</p>
          </div>
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask copilot to pull data or suggest answers..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
            <Send size={14} />
          </button>
        </div>
      </div>

    </div>

    {/* Right Column: Actions & Signals */}
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 min-h-0">
      
      {/* Action Panel (Human-in-the-loop) */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle size={20} className="text-green-500" />
            Pending Actions
          </h2>
          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
            {actions.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
          {actions.length === 0 ? (
            <div className="text-center text-gray-400 text-sm mt-10">
              No pending actions. Agents are listening...
            </div>
          ) : (
            actions.map(action => (
              <div key={action.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 transition-all hover:shadow-md hover:border-gray-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    action.type === 'email' ? 'bg-blue-100 text-blue-600' :
                    action.type === 'calendar' ? 'bg-amber-100 text-amber-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {action.type === 'email' ? <Mail size={18} /> :
                      action.type === 'calendar' ? <Calendar size={18} /> :
                      <Database size={18} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{action.desc}</p>
                    <p className="text-[10px] font-medium text-gray-400 mt-2 uppercase tracking-wider">Generated by {action.agent}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => handleAction(action.id, true)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button 
                    onClick={() => handleAction(action.id, false)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 py-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <X size={14} /> Deny
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Key Signals Card */}
      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity size={20} className="text-amber-500" />
          Key Signals
        </h2>
        
        <div className="space-y-3">
          {SIGNALS.map((signal, idx) => (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100" key={idx}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  signal.type === 'intent' ? 'bg-green-500' :
                  signal.type === 'objection' ? 'bg-red-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-800">{signal.label}</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                  signal.confidence === 'High' ? 'bg-green-100 text-green-700' :
                  signal.confidence === 'Resolved' ? 'bg-gray-200 text-gray-600' :
                  'bg-gray-200 text-gray-600'
              }`}>
                {signal.confidence}
              </span>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
          View All Signals <ChevronRight size={16} />
        </button>
      </div>

    </div>
  </div>
);

const ActiveAgents = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Active Agents</h1>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <Bot size={16} /> Add Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {AGENTS.map((agent) => (
          <div key={agent.id} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative flex flex-col items-center text-center transition-all hover:shadow-md">
            
            {/* Top Row: Rating & Menu */}
            <div className="w-full flex justify-between items-start mb-4">
              <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-bold">
                <Star size={12} className="fill-yellow-500 text-yellow-500" /> {agent.rating}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setOpenMenuId(openMenuId === agent.id ? null : agent.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical size={18} />
                </button>

                {/* Dropdown Menu */}
                {openMenuId === agent.id && (
                  <div ref={menuRef} className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 animate-in fade-in zoom-in duration-150">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 transition-colors">
                      <Eye size={14} /> View Activity
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 transition-colors">
                      <Settings2 size={14} /> Configure Agent
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 transition-colors">
                      <Pause size={14} /> Pause Agent
                    </button>
                    <div className="h-px bg-gray-100 my-1.5"></div>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                      <Trash2 size={14} /> Disable Agent
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Avatar */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${agent.color}`}>
              <agent.icon size={32} />
            </div>

            {/* Info */}
            <h3 className="text-lg font-bold text-gray-900 mb-1">{agent.name}</h3>
            <p className="text-sm text-gray-500 mb-6">{agent.role}</p>

            {/* Bottom Actions */}
            <div className="w-full flex justify-center gap-4 pt-4 border-t border-gray-50">
              <button className="text-gray-400 hover:text-red-500 transition-colors"><Heart size={18} /></button>
              <button className="text-gray-400 hover:text-blue-500 transition-colors"><Calendar size={18} /></button>
              <button className="text-gray-400 hover:text-green-500 transition-colors"><MessageSquare size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [actions, setActions] = useState(PENDING_ACTIONS);
  const [activeTab, setActiveTab] = useState('Live Dashboard');

  const handleAction = (id: number, approved: boolean) => {
    // In a real app, this would trigger the background agent
    setActions(actions.filter(a => a.id !== id));
  };

  return (
    <div className="flex h-screen bg-[#F4F5F7] font-sans overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        <TopBar />
        <TabBar active={activeTab} setActive={setActiveTab} />

        {/* Dynamic Content Based on Tab */}
        {activeTab === 'Live Dashboard' && (
          <LiveDashboard actions={actions} handleAction={handleAction} />
        )}

        {activeTab === 'Active Agents' && (
          <ActiveAgents />
        )}

        {/* Placeholders for other tabs */}
        {(activeTab === 'Meeting Notes' || activeTab === 'CRM & Data') && (
          <div className="flex-1 flex items-center justify-center bg-white rounded-[24px] border border-gray-100 shadow-sm">
            <div className="text-center">
              <Database size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{activeTab}</h2>
              <p className="text-gray-500">This section is under construction.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Global styles for custom scrollbar to match clean aesthetic */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E5E7EB;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #D1D5DB;
        }
      `}} />
    </div>
  );
}
