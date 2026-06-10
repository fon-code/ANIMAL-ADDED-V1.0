import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, LayoutDashboard, Users, Plus, Settings2, ChevronDown, 
  UserCog, Image as ImageIcon, Save, Ban, Eye, Edit, CheckSquare, 
  Award, XCircle, ShoppingCart, Package, Truck, ClipboardList, 
  Factory, ShieldCheck, Wallet, Coins, FileJson, Database, 
  CalendarDays, Settings, Lock, Search, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Trash2, HelpCircle, CheckCircle2, Clock, 
  Zap, Info, Globe, AlertTriangle, LayoutGrid, X, Leaf,
  GraduationCap, Target, UserPlus, Heart, BarChart3
} from 'lucide-react';
import KpiCard from '../../components/shared/KpiCard';
import UserGuideButton from '../../components/shared/UserGuideButton';

// --- HR MASTER Palette ---
const palette = {
    primary: '#4F868C',      // Brand Teal
    accent: '#D95032',       // Brand Orange
    gold: '#F2B705',         // Brand Gold
    bg: '#F2F0EB',           // Background Page
    bgGradient: 'linear-gradient(135deg, #F2F0EB 0%, #E8E6E1 100%)', 
    success: '#16778C',      // Brand Blue
    warning: '#D95032',      // Brand Orange
    danger: '#D91604',       // Brand Red
    muted: '#9295A6',        // Brand Muted
    dark: '#141A26',         // Sidebar Background / Headers
    textMain: '#3F4859'      // Text Main
};

// --- Permission Level Definition ---
const PERMISSION_LEVELS = [
  { level: 0, label: 'No Access', icon: Ban, color: '#94A3B8', bg: '#F1F5F9' },
  { level: 1, label: 'Viewer', icon: Eye, color: palette.primary, bg: '#E0F2FE' },
  { level: 2, label: 'Editor', icon: Edit, color: palette.gold, bg: '#FEF3C7' },
  { level: 3, label: 'Verifier', icon: CheckSquare, color: palette.success, bg: '#E0F2FE' },
  { level: 4, label: 'Approver', icon: Award, color: palette.danger, bg: '#FEE2E2' },
];

import { SYSTEM_MODULES } from '../../config/modules';

export default function UserPermissions() {
  const [activeTab, setActiveTab] = useState('step1'); // 'step1' | 'step2'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'matrix'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  
  // User Management
  const [users] = useState([
    { id: 1, name: 'Somchai Jaidee', position: 'HR Manager', email: 'somchai@hrmaster.com', avatar: 'https://i.pravatar.cc/150?img=11', isDev: false },
    { id: 2, name: 'Suda Rakdee', position: 'Recruitment Lead', email: 'suda@hrmaster.com', avatar: 'https://i.pravatar.cc/150?img=5', isDev: false },
    { id: 3, name: 'Developer Team', position: 'System Admin', email: 'admin@hrmaster.com', avatar: 'https://i.pravatar.cc/150?img=12', isDev: true },
  ]);

  const [formData, setFormData] = useState({ name: '', position: '', email: '', avatar: '' });
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Step 1: Confidentiality Map
  const [confidentialityMap, setConfidentialityMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    SYSTEM_MODULES.forEach(mod => {
      initial[mod.id] = false;
      if (mod.subItems) mod.subItems.forEach(sub => { initial[sub.id] = false; });
    });
    return initial;
  });

  // Matrix Permissions
  const [matrixPermissions, setMatrixPermissions] = useState<Record<number, any>>({});
  const [currentPermissions, setCurrentPermissions] = useState<Record<string, any>>({});

  useEffect(() => {
    const initial: Record<number, any> = {};
    users.forEach(user => {
        initial[user.id] = {};
        SYSTEM_MODULES.forEach(mod => {
            initial[user.id][mod.id] = user.isDev ? [1, 2, 3, 4] : [1];
            if (mod.subItems) {
                mod.subItems.forEach(sub => {
                    initial[user.id][sub.id] = user.isDev ? [1, 2, 3, 4] : [1];
                });
            }
        });
    });
    setMatrixPermissions(initial);
  }, [users]);

  const toggleConfidentiality = (id: string) => {
    setConfidentialityMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditUser = (user: any) => {
    setFormData({ name: user.name, position: user.position, email: user.email, avatar: user.avatar });
    setSelectedUserId(user.id);
    setCurrentPermissions(matrixPermissions[user.id] || {});
    setModalStep(1);
    setIsEditModalOpen(true);
  };

  const toggleExpand = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePermissionChange = (menuId: string, level: number) => {
    setCurrentPermissions(prev => {
      const currentLevels = (prev[menuId] as number[]) || [];
      let newLevels: number[];
      if (level === 0) newLevels = [];
      else {
        if (currentLevels.includes(level)) newLevels = currentLevels.filter(l => l !== level);
        else newLevels = [...currentLevels, level].filter(l => l !== 0);
      }
      return { ...prev, [menuId]: newLevels };
    });
  };

  const handleSavePermissions = () => {
    if (selectedUserId) {
        setMatrixPermissions(prev => ({ ...prev, [selectedUserId]: currentPermissions }));
    }
    setIsEditModalOpen(false);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.position.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [users, searchQuery]);

  return (
      <div className="flex flex-col w-full text-[#141A26] pt-0">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
          * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(79, 134, 140, 0.2); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(79, 134, 140, 0.6); }
          .minimal-th { font-size: 12px !important; text-transform: uppercase; letter-spacing: 0.1em; color: white; padding: 18px 16px; font-weight: 800; background-color: #141A26; border-bottom: 3px solid ${palette.gold}; white-space: nowrap; }
          .minimal-td { padding: 14px 16px; vertical-align: middle; color: #3F4859; font-size: 12px !important; font-weight: 500; border-bottom: 1px solid rgba(20, 26, 38, 0.05); }
          .sticky-col { position: sticky; left: 0; z-index: 10; background: white; border-right: 1px solid rgba(20, 26, 38, 0.05); }
        `}</style>

        {/* Header - Transparent */}
        <header className="flex flex-wrap items-center justify-between pb-4 gap-4 shrink-0 bg-transparent">
        <div className="flex items-center gap-4">
            <div className="sys-header-icon-box">
                <Shield className="sys-header-icon" strokeWidth={2.5} />
            </div>
            <div>
                <h2 className="sys-title-main">
                    USER <span className="text-[#D91604]">PERMISSIONS</span>
                </h2>
                <p className="sys-title-sub">Security Control & Access Authorization</p>
            </div>
        </div>

        <div className="flex items-center gap-3 text-thai">
          <div className="flex bg-[#4F868C]/10 p-1 rounded-xl border border-[#4F868C]/20 shadow-inner">
            <button onClick={() => setActiveTab('step1')} className={`px-5 py-2 text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 rounded-lg ${activeTab === 'step1' ? 'bg-[#141A26] text-white shadow-md' : 'text-[#4F868C] hover:bg-white/50'}`}>
                <Lock size={14} /> Confidentiality
            </button>
            <button onClick={() => setActiveTab('step2')} className={`px-5 py-2 text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 rounded-lg ${activeTab === 'step2' ? 'bg-[#141A26] text-white shadow-md' : 'text-[#4F868C] hover:bg-white/50'}`}>
                <UserCog size={14} /> Operational
            </button>
          </div>
        </div>
      </header>

      {/* Guide Toggle Button (Right Edge) */}
      {!isGuideOpen && (
          <UserGuideButton 
              onClick={() => setIsGuideOpen(true)} 
              className="bg-[#D6E0E1] text-[#4A7F85] hover:bg-[#4A7F85] hover:text-white"
          />
      )}

      <div className="flex-1 space-y-6 w-full relative pt-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <KpiCard title="Active Users" value={users.length.toString()} color={palette.primary} icon={Users} description="Registered Personnel" />
            <KpiCard title="System Modules" value={SYSTEM_MODULES.length.toString()} color={palette.accent} icon={LayoutGrid} description="Active Functional Areas" />
            <KpiCard title="Restricted Zones" value={Object.values(confidentialityMap).filter(v=>v).length.toString()} color={palette.danger} icon={Lock} description="Confidential Areas" />
            <KpiCard title="Security Status" value="VERIFIED" color={palette.success} icon={ShieldCheck} description="Enterprise Protection" />
        </div>

        {/* STEP 1: GLOBAL CONFIDENTIALITY */}
        {activeTab === 'step1' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-[#141A26]/5">
                <h3 className="text-sm font-black text-[#141A26] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Lock size={18} className="text-[#D95032]" /> Confidentiality Registry
                </h3>
                <div className="space-y-4">
                   <div className="p-4 bg-[#4F868C]/10 rounded-2xl border border-[#4F868C]/20 text-thai">
                      <div className="flex items-center gap-2 text-[#16778C] font-black text-[10px] uppercase tracking-widest mb-1"><Eye size={14}/> Public Access</div>
                      <p className="text-[11px] text-[#4F868C] leading-relaxed font-bold">เมนูทั่วไป: พนักงานทุกคนจะได้รับสิทธิ์ "Viewer" ทันทีที่เข้าสู่ระบบ</p>
                   </div>
                   <div className="p-4 bg-[#D91604]/5 rounded-2xl border border-[#D91604]/20 text-thai">
                      <div className="flex items-center gap-2 text-[#D91604] font-black text-[10px] uppercase tracking-widest mb-1"><Lock size={14}/> Confidential Area</div>
                      <p className="text-[11px] text-[#D91604]/80 leading-relaxed font-bold">พื้นที่จำกัด: จะถูกปิดกั้นสิทธิ์ "Viewer" พื้นฐาน ต้องระบุสิทธิ์เป็นรายบุคคลเท่านั้น</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-[#141A26]/5 flex flex-col overflow-hidden h-[65vh]">
              <div className="p-5 border-b border-[#141A26]/5 flex justify-between items-center bg-[#141A26]/5">
                 <h3 className="text-sm font-black text-[#141A26] uppercase tracking-widest flex items-center gap-2">
                    <LayoutGrid size={18} className="text-[#D95032]" /> Master Module Registry
                 </h3>
                 <span className="text-[10px] font-bold text-[#4F868C] bg-white px-2 py-1 rounded-md shadow-sm border border-[#141A26]/10">Synced with Sidebar</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
                 {SYSTEM_MODULES.map(mod => (
                    <div key={mod.id} className="space-y-2">
                        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${confidentialityMap[mod.id] ? 'bg-[#D91604]/5 border-[#D91604]/20' : 'bg-white border-[#141A26]/10'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${confidentialityMap[mod.id] ? 'bg-[#D91604]/10 text-[#D91604]' : 'bg-[#4F868C]/10 text-[#4F868C]'}`}><mod.icon size={20}/></div>
                                <div>
                                    <div className="font-black text-[#141A26] text-[13px] uppercase tracking-tight flex items-center gap-2">
                                        {mod.label} 
                                        {confidentialityMap[mod.id] && <Lock size={12} className="text-[#D91604]"/>}
                                        {mod.subItems && <button onClick={()=>toggleExpand(mod.id)} className="p-1 hover:bg-[#141A26]/5 rounded-lg"><ChevronDown size={14} className={`transition-transform ${expandedModules[mod.id] ? 'rotate-180' : ''}`} /></button>}
                                    </div>
                                    <div className="text-[10px] text-[#9295A6] font-bold uppercase">{confidentialityMap[mod.id] ? 'Restricted Access' : 'Public Access'}</div>
                                </div>
                            </div>
                            <button onClick={()=>toggleConfidentiality(mod.id)} className={`p-2.5 rounded-xl transition-all shadow-sm ${confidentialityMap[mod.id] ? 'bg-[#D91604] text-white' : 'bg-[#F2F0EB] text-[#4F868C] hover:bg-[#E8E6E1] border border-[#141A26]/10'}`}>
                                {confidentialityMap[mod.id] ? <Lock size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                        {mod.subItems && expandedModules[mod.id] && (
                            <div className="ml-12 space-y-2 animate-in slide-in-from-top-2 duration-300">
                                {mod.subItems.map(sub => (
                                    <div key={sub.id} className={`flex items-center justify-between p-3 rounded-xl border ${confidentialityMap[sub.id] ? 'bg-[#D91604]/5 border-[#D91604]/20 text-[#D91604]' : 'bg-white/50 border-[#141A26]/5 text-[#4F868C]'}`}>
                                        <span className="text-[11px] font-bold uppercase tracking-wide flex items-center gap-2"><div className={`w-1 h-1 rounded-full ${confidentialityMap[sub.id] ? 'bg-[#D91604]' : 'bg-[#F2B705]'}`}></div> {sub.label}</span>
                                        <button onClick={()=>toggleConfidentiality(sub.id)} className={`p-1.5 rounded-lg ${confidentialityMap[sub.id] ? 'text-[#D91604]' : 'text-[#4F868C] hover:text-[#141A26]'}`}>{confidentialityMap[sub.id] ? <Lock size={14}/> : <Eye size={14}/>}</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: OPERATIONAL RIGHTS */}
        {activeTab === 'step2' && (
          <div className="bg-white/90 backdrop-blur-xl rounded-none shadow-sm border border-[#141A26]/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[600px]">
            <div className="px-6 py-4 border-b border-[#141A26]/10 flex flex-col lg:flex-row items-center justify-between gap-4 bg-[#141A26]/5">
               <div className="flex bg-white/80 p-1 rounded-xl border border-[#141A26]/10 shadow-sm">
                  <button onClick={()=>setViewMode('list')} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${viewMode==='list'?'bg-[#141A26] text-white shadow-md':'text-[#4F868C]'}`}>Staff List</button>
                  <button onClick={()=>setViewMode('matrix')} className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${viewMode==='matrix'?'bg-[#141A26] text-white shadow-md':'text-[#4F868C]'}`}>Summary Matrix</button>
               </div>
               <div className="relative flex-1 lg:max-w-md">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4F868C]" />
                  <input type="text" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search personnel..." className="w-full pl-10 pr-4 py-2 text-[11px] font-bold rounded-xl border border-[#141A26]/10 focus:outline-none focus:border-[#F2B705] bg-white h-11 shadow-sm" />
               </div>
            </div>

            <div className="flex-1 overflow-x-auto custom-scrollbar">
               {viewMode === 'list' ? (
                  <table className="w-full text-left whitespace-nowrap">
                     <thead>
                        <tr>
                           <th className="minimal-th">Personnel</th>
                           <th className="minimal-th">Position</th>
                           <th className="minimal-th">Identity</th>
                           <th className="minimal-th text-center">Status</th>
                           <th className="minimal-th text-center w-24">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#141A26]/5 text-thai">
                        {filteredUsers.map(user => (
                           <tr key={user.id} className="hover:bg-[#4F868C]/5 transition-colors group">
                              <td className="minimal-td">
                                 <div className="flex items-center gap-3">
                                    <img src={user.avatar} className="w-10 h-10 rounded-full border border-[#141A26]/10 object-cover" />
                                    <span className="font-black text-[#141A26] uppercase">{user.name}</span>
                                 </div>
                              </td>
                              <td className="minimal-td font-bold text-[#4F868C] uppercase text-[11px] tracking-widest">{user.position}</td>
                              <td className="minimal-td font-mono text-[11px] text-[#4F868C]">{user.email}</td>
                              <td className="minimal-td text-center">
                                 <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${user.isDev ? 'bg-[#F2B705]/20 text-[#D95032] border border-[#F2B705]/50' : 'bg-[#F2F0EB] border border-[#141A26]/10 text-[#4F868C]'}`}>
                                    {user.isDev ? 'DEVELOPER' : 'USER'}
                                 </span>
                              </td>
                              <td className="minimal-td text-center">
                                 <div className="flex items-center justify-center gap-[0.5px]">
                                    <button onClick={()=>handleEditUser(user)} className="w-8 h-8 flex items-center justify-center border border-[#141A26]/20 rounded-md text-[#D95032] hover:bg-[#D95032] hover:text-white transition-all shadow-sm bg-white"><Settings2 size={15} /></button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               ) : (
                  <div className="overflow-x-auto custom-scrollbar">
                     <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead>
                           <tr>
                              <th className="sticky left-0 z-20 min-w-[240px] minimal-th shadow-md">Module / Sub-Module</th>
                              {users.map(u => (
                                 <th key={u.id} className="minimal-th text-center min-w-[120px] border-l border-white/10" style={{backgroundColor: '#141A26'}}>
                                    <div className="flex flex-col items-center gap-1">
                                       <img src={u.avatar} className="w-6 h-6 rounded-full border border-white/20 shadow-sm" />
                                       <span className="text-[10px] font-black text-white">{u.name.split(' ')[0]}</span>
                                    </div>
                                 </th>
                              ))}
                           </tr>
                        </thead>
                        <tbody className="text-[12px]">
                           {SYSTEM_MODULES.map(mod => {
                              const isExp = expandedModules[mod.id];
                              return (
                              <React.Fragment key={mod.id}>
                                <tr 
                                  className="bg-[#F2F0EB]/50 hover:bg-[#E8E6E1] group border-b border-[#141A26]/5 cursor-pointer transition-colors"
                                  onClick={() => mod.subItems && toggleExpand(mod.id)}
                                >
                                    <td className="sticky-col p-4 font-black text-[#141A26] uppercase tracking-tight flex items-center gap-2">
                                        <mod.icon size={14} className={(confidentialityMap[mod.id] as any) ? "text-[#D91604]" : "text-[#F2B705]"} /> 
                                        <span className="flex-1">{mod.label}</span>
                                        {(confidentialityMap[mod.id] as any) && <Lock size={10} className="text-[#D91604]" />}
                                        {mod.subItems && <ChevronDown size={14} className={`transition-transform text-[#4F868C] ml-auto ${isExp ? 'rotate-180' : ''}`} />}
                                    </td>
                                    {users.map(u => (
                                        <td key={u.id} className="text-center p-2 border-l border-[#141A26]/5">
                                            <div className="flex justify-center gap-0.5 flex-wrap">
                                                {(matrixPermissions[u.id]?.[mod.id] || []).map((lvl: number) => {
                                                    const p = PERMISSION_LEVELS.find(pl => pl.level === lvl);
                                                    return p ? <div key={lvl} className="w-6 h-6 rounded flex items-center justify-center shadow-sm" style={{backgroundColor: p.bg}} title={p.label}><p.icon size={11} style={{color: p.color}}/></div> : null;
                                                })}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                                {mod.subItems && isExp && mod.subItems.map(sub => (
                                    <tr key={sub.id} className="bg-white hover:bg-[#F2F0EB]/80 group border-b border-[#141A26]/5 animate-in slide-in-from-top-1 duration-200">
                                        <td className="sticky-col p-3 pl-10 font-bold text-[#4F868C] uppercase text-[10px] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#D95032]"></div> {sub.label}
                                            {(confidentialityMap[sub.id] as any) && <Lock size={10} className="text-[#D91604]" />}
                                        </td>
                                        {users.map(u => (
                                            <td key={u.id} className="text-center p-1 border-l border-[#141A26]/5">
                                                <div className="flex justify-center gap-0.5 flex-wrap">
                                                    {(matrixPermissions[u.id]?.[sub.id] || []).map((lvl: number) => {
                                                        const p = PERMISSION_LEVELS.find(pl => pl.level === lvl);
                                                        return p ? <div key={lvl} className="w-5 h-5 rounded flex items-center justify-center shadow-sm" style={{backgroundColor: p.bg}} title={p.label}><p.icon size={10} style={{color: p.color}}/></div> : null;
                                                    })}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                              </React.Fragment>
                              )
                           })}
                        </tbody>
                     </table>
                  </div>
               )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: PERMISSION EDITOR */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-[#141A26]/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-[#F2F0EB] w-full h-[85vh] rounded-[32px] overflow-hidden shadow-2xl border-t-[8px] border-[#F2B705] flex flex-col animate-in zoom-in-95">
              <div className="bg-[#141A26] px-8 py-5 flex justify-between items-center text-white shrink-0">
                 <div className="flex items-center gap-4">
                    <img src={formData.avatar} className="w-12 h-12 rounded-2xl border-2 border-[#F2B705] object-cover shadow-lg" />
                    <div>
                       <h3 className="text-lg font-black uppercase tracking-widest text-thai">{formData.name}</h3>
                       <p className="text-[10px] font-bold text-[#F2B705] uppercase tracking-[0.2em]">{formData.position} • Access Control</p>
                    </div>
                 </div>
                 <button onClick={()=>setIsEditModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white"><X size={24}/></button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                 {/* Sidebar Stepper */}
                 <div className="w-56 bg-white border-r border-[#141A26]/10 p-6 flex flex-col gap-3 shrink-0 text-thai">
                    <button onClick={()=>setModalStep(1)} className={`w-full p-4 rounded-2xl text-left transition-all ${modalStep===1?'bg-[#141A26] text-[#F2B705] shadow-lg':'text-[#4F868C] hover:bg-[#F2F0EB]'}`}>
                       <div className="text-[10px] font-black uppercase mb-1">Step 01</div>
                       <div className="text-xs font-bold uppercase tracking-tight flex items-center gap-2"><Lock size={14}/> Confidentiality</div>
                    </button>
                    <button onClick={()=>setModalStep(2)} className={`w-full p-4 rounded-2xl text-left transition-all ${modalStep===2?'bg-[#141A26] text-[#F2B705] shadow-lg':'text-[#4F868C] hover:bg-[#F2F0EB]'}`}>
                       <div className="text-[10px] font-black uppercase mb-1">Step 02</div>
                       <div className="text-xs font-bold uppercase tracking-tight flex items-center gap-2"><UserCog size={14}/> Operational</div>
                    </button>
                 </div>

                 {/* Content Area */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white">
                    <div className="mb-6 pb-4 border-b border-[#141A26]/10 flex justify-between items-center">
                       <div className="text-thai">
                          <h4 className="font-black text-[#141A26] uppercase text-sm">{modalStep===1?'Visibility & Discovery Control':'Functional Capability Matrix'}</h4>
                          <p className="text-[11px] text-[#4F868C] font-bold uppercase mt-1">{modalStep===1?'Determine which restricted areas are visible':'Assign Create, Edit, Verify or Approve rights'}</p>
                       </div>
                       <div className="flex gap-1">
                          {PERMISSION_LEVELS.filter(p => modalStep === 1 ? p.level <= 1 : p.level === 0 || p.level >= 2).map(p => (
                             <div key={p.level} className="flex items-center gap-1.5 bg-[#F2F0EB] px-2 py-1 rounded-lg border border-[#141A26]/5">
                                <p.icon size={10} style={{color: p.color}}/>
                                <span className="text-[8px] font-black uppercase text-[#141A26]">{p.label}</span>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4">
                       {SYSTEM_MODULES.map(mod => {
                          const currentLevels = (currentPermissions[mod.id] as number[]) || [];
                          const isExp = expandedModules[`edit_${mod.id}`];
                          return (
                             <div key={mod.id} className="space-y-2">
                                <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${(mod as any).isConfidential ? 'border-[#D91604]/20 bg-[#D91604]/5' : 'border-[#141A26]/10 bg-white'}`}>
                                    <div className="flex items-center gap-3">
                                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${(mod as any).isConfidential?'bg-[#D91604]/10 text-[#D91604]':'bg-[#F2F0EB] text-[#4F868C]'}`}><mod.icon size={16}/></div>
                                       <span className="text-[12px] font-black text-[#141A26] uppercase tracking-tight flex items-center gap-1.5">
                                            {mod.label} 
                                            {(mod as any).isConfidential && <Lock size={10}/>}
                                            {mod.subItems && <button onClick={()=>setExpandedModules(p=>({...p, [`edit_${mod.id}`]: !isExp}))} className="p-1 hover:bg-[#F2F0EB] rounded-lg"><ChevronDown size={14} className={isExp?'rotate-180':''}/></button>}
                                       </span>
                                    </div>
                                    <div className="flex bg-[#F2F0EB] p-1 rounded-xl gap-0.5">
                                       {PERMISSION_LEVELS.filter(p => modalStep === 1 ? p.level <= 1 : p.level === 0 || p.level >= 2).map(p => {
                                          const active = p.level === 0 ? currentLevels.length === 0 : currentLevels.includes(p.level);
                                          return (
                                             <button key={p.level} onClick={()=>handlePermissionChange(mod.id, p.level)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${active ? 'bg-white shadow-sm scale-110 ring-1 ring-[#141A26]/10' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                                                <p.icon size={14} style={{color: active ? p.color : '#4F868C'}} />
                                             </button>
                                          )
                                       })}
                                    </div>
                                </div>
                                {mod.subItems && isExp && (
                                    <div className="ml-8 space-y-2 animate-in slide-in-from-top-2">
                                        {mod.subItems.map(sub => {
                                            const subLevels = (currentPermissions[sub.id] as number[]) || [];
                                            return (
                                                <div key={sub.id} className="flex items-center justify-between p-2 pl-4 bg-[#F2F0EB]/50 rounded-xl border border-[#141A26]/5">
                                                    <span className="text-[10px] font-bold text-[#4F868C] uppercase">{sub.label}</span>
                                                    <div className="flex bg-white p-0.5 rounded-lg border border-[#141A26]/10 gap-0.5">
                                                        {PERMISSION_LEVELS.filter(p => modalStep === 1 ? p.level <= 1 : p.level === 0 || p.level >= 2).map(p => {
                                                            const active = p.level === 0 ? subLevels.length === 0 : subLevels.includes(p.level);
                                                            return (
                                                                <button key={p.level} onClick={()=>handlePermissionChange(sub.id, p.level)} className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${active ? 'bg-[#F2F0EB] shadow-inner' : 'opacity-20 grayscale hover:opacity-100'}`}>
                                                                    <p.icon size={12} style={{color: active ? p.color : '#4F868C'}} />
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                             </div>
                          )
                       })}
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-[#F2F0EB] border-t border-[#141A26]/10 flex justify-between items-center shrink-0">
                 <button onClick={()=>setIsEditModalOpen(false)} className="px-8 py-3 text-[11px] font-black uppercase text-[#4F868C] hover:text-[#141A26] transition-colors">Discard</button>
                 <div className="flex gap-3 text-thai">
                    {modalStep === 1 ? (
                       <button onClick={()=>setModalStep(2)} className="px-10 py-3 bg-[#141A26] text-[#F2B705] rounded-2xl font-black uppercase text-[11px] shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-all">Operational Rights <ChevronRight size={16}/></button>
                    ) : (
                       <button onClick={handleSavePermissions} className="px-12 py-3 bg-[#D95032] text-white rounded-2xl font-black uppercase text-[11px] shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-all font-mono"><Save size={16}/> Finalize Permissions</button>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* User Guide Drawer */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[600] flex justify-end animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-[#141A26]/40 backdrop-blur-sm" onClick={() => setIsGuideOpen(false)} />
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                <div className="bg-[#141A26] px-8 py-6 flex justify-between items-center text-white border-b-4 border-[#F2B705]">
                    <div className="flex items-center gap-3"><HelpCircle size={22} className="text-[#F2B705]" /><h3 className="text-lg font-black uppercase tracking-widest text-thai">Security Guide</h3></div>
                    <button onClick={() => setIsGuideOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-10 text-[#4F868C] leading-relaxed text-thai">
                    <section><h4 className="font-black text-[#141A26] border-b border-[#141A26]/10 pb-2 mb-4 flex items-center gap-2"><span className="bg-[#F2B705] text-[#141A26] font-mono w-6 h-6 rounded-full flex items-center justify-center text-[12px]">01</span> การซิงค์เมนูอัตโนมัติ</h4><p className="text-[13px]">Master Module Registry ถูกออกแบบให้ดึงค่าจาก Source of Truth เดียวกับ Sidebar ของ HR MASTER เพื่อให้มั่นใจว่าทุกฟังก์ชันใหม่จะถูกกำหนดสิทธิ์ก่อนใช้งานเสมอ</p></section>
                    <section><h4 className="font-black text-[#141A26] border-b border-[#141A26]/10 pb-2 mb-4 flex items-center gap-2"><span className="bg-[#D95032] text-white font-mono w-6 h-6 rounded-full flex items-center justify-center text-[12px]">02</span> ลำดับสิทธิ์ (Hierarchy)</h4><p className="text-[13px]">สิทธิ์ระดับ Verifier (3) และ Approver (4) จะมีอำนาจการจัดการในขั้นตอนสุดท้ายของ Workflow เอกสาร HR เสมอ</p></section>
                </div>
                <div className="p-6 border-t border-[#141A26]/10 bg-white flex justify-end"><button onClick={() => setIsGuideOpen(false)} className="px-8 py-3 bg-[#141A26] text-white rounded-xl font-black text-[11px] uppercase shadow-lg text-thai">ปิดคู่มือ</button></div>
            </div>
        </div>
      )}
    </div>
  );
}
