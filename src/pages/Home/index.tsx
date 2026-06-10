import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

import HrCalendar from '../HrCalendar';
import UserPermissions from '../UserPermissions';
import SystemConfig from '../SystemConfig';
import DevPermit from '../DevPermit';

// --- STYLES INJECTION ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700;800&display=swap');

  body {
    font-family: "Inter", "Noto Sans Thai", sans-serif;
    margin: 0;
    overflow: hidden;
  }
  
  /* Font Family Definitions */
  .font-mono { font-family: "JetBrains Mono", monospace; }
  .font-thai { font-family: "Noto Sans Thai", sans-serif; }
  .font-sans { font-family: "Inter", sans-serif; }

  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(147, 160, 82, 0.2); border-radius: 20px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(196, 155, 76, 0.5); }

  @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
      animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .shadow-soft { box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04); }
  .shadow-premium { box-shadow: 0 20px 50px rgba(46, 63, 40, 0.12); }
  
  /* Sidebar Gradient */
  .premium-sidebar-bg {
    background: radial-gradient(circle at top left, #0B1512 0%, #050a08 60%, #020806 100%);
  }

  /* Main Background */
  .premium-main-bg {
    background: radial-gradient(circle at center, #ffffff 0%, #f4f7f5 40%, #aea181 100%);
  }

  .toggle-button {
    position: absolute;
    right: -12px;
    top: 100px;
    width: 24px;
    height: 24px;
    background: #0B1512;
    border: 1px solid rgba(196, 155, 76, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c49b4c;
    z-index: 100;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .toggle-button:hover {
    background: #c49b4c;
    color: white;
    transform: scale(1.1);
  }
`;

// --- CONSTANTS & CONFIGURATION ---
const SYSTEM_MODULES = [
    { id: 'home', label: 'HOME', icon: 'home' },
    { id: 'calendar_main', label: 'CALENDAR', icon: 'calendar' },
    { id: 'inventory', label: 'INVENTORY', icon: 'package', isOpModule: true,
      subItems: [ { id: 'inv_additives', label: 'FEED ADDITIVES' }, { id: 'inv_vax', label: 'VACCINES & DRUGS' }, { id: 'inv_minerals', label: 'VITAMINS & MINERALS' } ] },
    { id: 'procurement', label: 'PROCUREMENT', icon: 'shopping-cart',
        subItems: [ { id: 'supplier_list', label: 'SUPPLIER HUB' }, { id: 'po_tracking', label: 'PO TRACKING' } ] },
    { id: 'qc_lab', label: 'QUALITY & LAB', icon: 'flask-conical',
        subItems: [ { id: 'lab_analysis', label: 'LAB ANALYSIS' }, { id: 'qc_cert', label: 'COA ISSUANCE' } ] },
    { id: 'sales', label: 'SALES HUB', icon: 'briefcase',
        subItems: [ { id: 'order_management', label: 'ORDER MGMT' }, { id: 'customer_database', label: 'CLIENT DATABASE' } ] },
    { id: 'production', label: 'MIXING CENTER', icon: 'factory',
        subItems: [ { id: 'formula_config', label: 'FORMULA MASTER' }, { id: 'batch_tracking', label: 'BATCH CONTROL' } ] },
    { id: 'setting', label: 'SYSTEM SETTING', icon: 'settings',
        subItems: [ { id: 'user_permissions', label: 'USER PERMISSION' }, { id: 'system_config', label: 'SYSTEM CONFIG' }, { id: 'audit_log', label: 'AUDIT LOG' }, { id: 'dev_permit', label: 'DEV PERMIT (BETA)' } ] }
];

const MOCK_DATA = {
    stats: [
        { label: 'DAILY OUTPUT', value: '2.4 Tons', sub: 'Premium Additives', icon: 'package', color: '#93a052' },
        { label: 'PENDING ORDER', value: '฿ 12.8M', sub: 'Livestock Sector', icon: 'shopping-cart', color: '#c49b4c' },
        { label: 'INGREDIENTS', value: 'Fresh', sub: 'COA Verified', icon: 'flask-conical', color: '#1b3a5e' },
        { label: 'HYGIENE SCORE', value: '99.8%', sub: 'GMP / HACCP Certified', icon: 'award', color: '#37462b' },
    ]
};

// --- HELPER COMPONENTS ---

const kebabToPascal = (str: string) => {
    if (!str) return '';
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
};

const LucideIcon = ({ name, size = 16, className = "", style, strokeWidth = 2 }: any) => {
    const pascalName = kebabToPascal(name);
    const iconKey = (pascalName === 'Pig') ? 'PiggyBank' : pascalName;
    const IconComponent = (Icons as any)[iconKey] || (Icons as any)[`${iconKey}Icon`] || Icons.HelpCircle;
    
    if (typeof IconComponent !== 'function' && typeof IconComponent !== 'object') {
        return <Icons.HelpCircle size={size} className={className} style={style} strokeWidth={strokeWidth} />;
    }
    
    return <IconComponent size={size} className={className} style={style} strokeWidth={strokeWidth} />;
};

const GlassCard = ({ children, className = '', hoverEffect = true }: any) => (
    <div className={`rounded-3xl p-6 backdrop-blur-xl shadow-soft border border-white/60 ${hoverEffect ? 'hover:-translate-y-1 transition-transform duration-300' : ''} ${className}`} style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}>{children}</div>
);

const KPICard = ({ title, val, color, icon, desc }: any) => (
    <div className="bg-white/75 backdrop-blur-md rounded-2xl p-6 shadow-soft hover:shadow-premium transition-all duration-500 border border-white/50 relative overflow-hidden group h-full">
        <div className="absolute -right-8 -bottom-8 opacity-[0.07] transform rotate-[15deg] group-hover:scale-110 transition-all duration-700 pointer-events-none">
            <LucideIcon name={icon} size={130} style={{color: color}} strokeWidth={1.2} />
        </div>
        <div className="relative z-10 flex flex-col gap-1">
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest font-mono">{title}</p>
            <div className="flex items-center justify-between">
                <h4 className="text-3xl font-black tracking-tight text-[#1b241a] mt-1 font-mono">{val}</h4>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white shadow-sm border border-gray-100 transition-colors">
                    <LucideIcon name={icon} size={22} style={{color: color}} strokeWidth={1.5} />
                </div>
            </div>
            {desc && <p className="text-[12px] text-gray-500 font-medium mt-3 flex items-center gap-2 font-thai"><span className="w-2 h-2 rounded-full" style={{backgroundColor: color}}></span>{desc}</p>}
        </div>
    </div>
);

const NavItem = ({ icon, label, active, onClick, isOpen, subItems, isExpanded, onToggleExpand }: any) => {
    const hasSubItems = subItems && subItems.length > 0;
    return (
        <div className="mb-1">
            <button onClick={hasSubItems ? onToggleExpand : onClick} className={`w-full flex items-center transition-all duration-300 group relative rounded-xl ${active ? 'text-white bg-gradient-to-r from-[#1b241a] to-[#37462b] shadow-lg shadow-black/30' : 'text-gray-400 hover:text-white hover:bg-white/5'} ${!isOpen ? 'justify-center w-12 h-12 px-0 mx-auto' : 'px-4 py-3.5 w-full'}`}>
                <LucideIcon name={icon} size={20} strokeWidth={active ? 2 : 1.5} className={active ? 'text-[#c49b4c]' : ''} />
                <div className={`transition-all duration-300 flex items-center justify-between flex-1 ${isOpen ? 'w-auto opacity-100 ml-3' : 'w-0 opacity-0 ml-0 overflow-hidden'}`}>
                    <span className={`text-[12px] tracking-wider uppercase font-mono ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
                    {hasSubItems && <LucideIcon name="chevron-down" size={12} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />}
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ${isExpanded && isOpen ? 'max-h-[350px] opacity-100 mt-1 pl-4' : 'max-h-0 opacity-0'}`}>
                {hasSubItems && subItems.map((sub: any, idx: number) => (
                    <button key={idx} onClick={(e) => { e.stopPropagation(); sub.onClick(); }} className={`w-full flex items-center px-4 py-2 rounded-lg text-[11px] uppercase group/sub mb-1 font-mono ${sub.active ? 'text-[#c49b4c] font-bold' : 'text-gray-500 hover:text-gray-300'}`}>
                        <span className={`w-1 h-1 rounded-full mr-2 ${sub.active ? 'bg-[#c49b4c] scale-125' : 'bg-gray-600'}`}></span>
                        {sub.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- VIEWS ---
const DashboardView = ({ user }: any) => (
    <div className="animate-fadeIn space-y-7 pb-4">
        <div className="mb-2">
            <h1 className="text-[32px] font-black text-[#1b241a] uppercase tracking-tight leading-none font-mono">WELCOME, {user?.name.split(' ')[0]}!</h1>
            <p className="text-[#37462b] text-[12px] mt-2 font-semibold font-thai">Real-time monitoring & Control • Status: <span className="text-[#93a052] font-bold font-mono">Line A-B Active</span></p>
        </div>

        <div className="relative w-full rounded-[32px] overflow-hidden shadow-premium h-[240px] flex flex-col justify-center px-12 border border-white/20">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" 
                 style={{ backgroundImage: `url('https://static.vecteezy.com/system/resources/thumbnails/071/461/690/small/mother-pig-and-piglets-feeding-on-farm-livestock-concept-photo.jpg')` }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#2e1a11]/90 via-[#2e1a11]/40 to-transparent"></div>
            <div className="relative z-10 max-w-2xl">
                <h2 className="text-[44px] font-black text-white uppercase tracking-tight leading-[0.95] mb-4 drop-shadow-2xl font-mono">
                    NUTRITION FOR<br/>
                    <span className="text-[#c49b4c]">SUSTAINABILITY.</span>
                </h2>
                <p className="text-white/85 text-[14px] font-medium max-w-lg leading-relaxed font-mono tracking-tight text-shadow">
                    Precision nutrition for future farming. Monitor your livestock's health and optimize feed efficiency with our real-time intelligent system.
                </p>
            </div>
        </div>

        {/* UNIFIED CRITICAL ALERTS */}
        <GlassCard className="bg-gradient-to-b from-white via-[#8b1a1a]/5 to-[#8b1a1a]/10 border-[#8b1a1a]/20 relative overflow-hidden group">
            <div className="absolute -bottom-8 -right-8 text-[#8b1a1a] opacity-[0.05] transform -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <LucideIcon name="bell" size={140} strokeWidth={1} />
            </div>
            
            <div className="flex justify-between items-center mb-5 relative z-10">
                <h2 className="text-lg font-bold text-[#1b241a] flex items-center gap-2 uppercase font-mono">
                    <div className="p-2 bg-[#8b1a1a]/10 rounded-lg text-[#8b1a1a] animate-pulse">
                        <LucideIcon name="alert-circle" size={18} strokeWidth={1.5} />
                    </div>
                    Critical Alerts
                </h2>
                <span className="text-[10px] font-bold text-white bg-[#8b1a1a] px-3 py-1 rounded-full font-mono uppercase tracking-tight">Immediate Action Required</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10 font-thai">
                <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-dashed border-[#8b1a1a]/30 flex gap-4 items-start hover:bg-white transition-all">
                    <div className="bg-[#8b1a1a]/10 p-2.5 rounded-lg text-[#8b1a1a]"><LucideIcon name="users" size={18} strokeWidth={1.5}/></div>
                    <div>
                        <p className="text-[12px] font-bold text-[#8b1a1a] uppercase tracking-wide font-mono">Shift Handover</p>
                        <p className="text-[12px] text-gray-500 mt-1 font-medium leading-snug">กรุณาตรวจสอบระบบจ่ายวิตามินหลักอย่างละเอียดก่อนเริ่มดำเนินการ</p>
                    </div>
                </div>
                <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-[#8b1a1a]/10 flex gap-4 items-start hover:bg-white transition-all">
                    <div className="bg-[#8b1a1a]/10 p-2.5 rounded-lg text-[#8b1a1a]"><LucideIcon name="thermometer" size={18} strokeWidth={1.5}/></div>
                    <div>
                        <p className="text-[12px] font-bold text-[#8b1a1a] uppercase tracking-wide font-mono">Storage Temp</p>
                        <p className="text-[12px] text-gray-500 mt-1 font-medium leading-snug">คลังยา Zone C อุณหภูมิสูงกว่า 8°C ตรวจสอบระบบทำความเย็นด่วน</p>
                    </div>
                </div>
                <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-[#954806]/10 flex gap-4 items-start hover:bg-white transition-all">
                    <div className="bg-[#954806]/10 p-2.5 rounded-lg text-[#954806]"><LucideIcon name="database" size={18} strokeWidth={1.5}/></div>
                    <div>
                        <p className="text-[12px] font-bold text-[#954806] uppercase tracking-wide font-mono">Additive Stock</p>
                        <p className="text-[12px] text-gray-500 mt-1 font-medium leading-snug">Lysine reserve below 100kg. Automatic reorder initiated.</p>
                    </div>
                </div>
            </div>
        </GlassCard>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_DATA.stats.map((stat, idx) => (
                <KPICard key={idx} title={stat.label} val={stat.value} color={stat.color} icon={stat.icon} desc={stat.sub} />
            ))}
        </div>

        {/* OPERATIONAL PROGRESS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            <GlassCard className="flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[#1b241a] flex items-center gap-3 uppercase font-mono">
                        <LucideIcon name="activity" className="text-[#93a052]" strokeWidth={1.5} /> Daily Batch Progress
                    </h3>
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#93a052] animate-pulse"></div>
                        <span className="text-[10px] font-bold text-[#93a052] uppercase font-mono">Real-time</span>
                    </div>
                </div>
                <div className="space-y-4 font-mono text-[12px]">
                    {[
                        { name: "Lot.V-2401 (Vitamin A)", progress: 85, status: "Mixing", color: "#93a052" },
                        { name: "Lot.M-2402 (Mineral Mix)", progress: 40, status: "Grinding", color: "#c49b4c" },
                        { name: "Lot.D-2403 (Drug Injectable)", progress: 95, status: "Final QC", color: "#1b3a5e" },
                    ].map((batch, i) => (
                        <div key={i} className="p-3.5 bg-white/50 border border-white/80 rounded-2xl hover:bg-white transition-all shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-[#1b241a]">{batch.name}</span>
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white shadow-sm border border-gray-100" style={{color: batch.color}}>{batch.status}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full transition-all duration-1000" style={{ width: `${batch.progress}%`, backgroundColor: batch.color }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

            <GlassCard className="flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[#1b241a] flex items-center gap-3 uppercase font-mono">
                        <LucideIcon name="truck" className="text-[#1b3a5e]" strokeWidth={1.5} /> Incoming Supply Chain
                    </h3>
                    <button className="text-[10px] font-bold text-[#1b3a5e] uppercase tracking-widest font-mono hover:underline transition-all">View Logistics</button>
                </div>
                <div className="space-y-3 font-mono text-[12px]">
                    {[
                        { supplier: "Global Bio-Tech", item: "Methionine Pure", eta: "In 2 hrs", status: "On Way", icon: "truck", color: "#1b3a5e" },
                        { supplier: "VetCare Lab", item: "Live Vaccines", eta: "Tomorrow", status: "In Transit", icon: "package", color: "#c49b4c" },
                        { supplier: "Agri-Mineral Co.", item: "Zinc Oxide", eta: "In 4 hrs", status: "Verified", icon: "check-circle", color: "#93a052" },
                    ].map((ship, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:shadow-md transition-all shadow-sm group border border-white/10" style={{ backgroundColor: `${ship.color}40`, borderLeft: `1px solid ${ship.color}20` }}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm bg-white" style={{ color: ship.color }}>
                                    <LucideIcon name={ship.icon} size={20} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="font-bold text-[#1b241a] leading-tight">{ship.item}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-tight font-sans mt-0.5">{ship.supplier}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-[#1b241a]">{ship.eta}</p>
                                <div className="mt-1 flex items-center justify-end gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ship.color }}></span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: ship.color }}>{ship.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    </div>
);

// --- MAIN APP COMPONENT ---
const App = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ inventory: false, procurement: false, qc_lab: false, sales: false, production: false, setting: false });
    
    const currentUser = { 
        name: 'T-DCC Developer', 
        email: 'tallintelligence.dcc@gmail.com', 
        position: 'Lead Developer', 
        avatar: 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400' 
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleMenu = (menuKey: string) => {
        setExpandedMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
        if (!isSidebarOpen) setSidebarOpen(true);
    };

    const renderContent = () => {
        const module = SYSTEM_MODULES.find(m => m.id === activeTab || (m.subItems && m.subItems.some(s => s.id === activeTab)));
        const activeSub = module?.subItems?.find(s => s.id === activeTab);
        if (activeTab === 'home') return <DashboardView user={currentUser} />;
        if (activeTab === 'calendar_main') {
            return (
                <div className="animate-fadeIn pb-8">
                    <HrCalendar />
                </div>
            );
        }
        if (activeTab === 'user_permissions') {
            return (
                <div className="animate-fadeIn pb-8">
                    <UserPermissions />
                </div>
            );
        }
        if (activeTab === 'system_config') {
            return (
                <div className="animate-fadeIn pb-8">
                    <SystemConfig />
                </div>
            );
        }
        if (activeTab === 'dev_permit') {
            return (
                <div className="animate-fadeIn pb-8">
                    <DevPermit />
                </div>
            );
        }
        return (
            <div className="animate-fadeIn">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-[#1b241a] uppercase tracking-tight font-mono">{activeSub ? activeSub.label : module?.label}</h2>
                        <p className="text-[12px] text-[#37462b] mt-1 font-medium font-thai">ระบบจัดการฐานข้อมูลระดับพรีเมี่ยมสำหรับ Animal Additive</p>
                    </div>
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-[#c49b4c]/50 to-transparent mx-8 mb-2 rounded-full"></div>
                </div>
                <div className="bg-white/60 rounded-[32px] p-20 text-center border-2 border-dashed border-[#c49b4c]/20">
                    <div className="w-20 h-20 bg-white shadow-premium rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <LucideIcon name={module?.icon || 'circle-dot'} size={40} className="text-[#c49b4c]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-black text-[#1b241a] uppercase tracking-widest font-mono">Active Database Ready</h3>
                    <p className="text-[12px] text-gray-500 max-w-sm mx-auto mt-4 font-medium leading-relaxed font-thai">ขณะนี้ฐานข้อมูลพร้อมให้คุณจัดการข้อมูลพรีเมี่ยมเกรดสำหรับอุตสาหกรรมปศุสัตว์แล้ว</p>
                    <button className="mt-8 px-12 py-3.5 bg-[#1b241a] text-white rounded-2xl font-bold uppercase tracking-widest font-mono hover:bg-[#37462b] transition-all shadow-xl">Load Data Source</button>
                </div>
            </div>
        );
    };

    return (
        <>
            <style>{globalStyles}</style>
            <div className="flex h-screen w-full font-sans overflow-hidden premium-main-bg text-[#1b241a]">
                
                {/* SIDEBAR */}
                <aside className={`flex-shrink-0 flex flex-col transition-all duration-500 z-50 shadow-2xl relative premium-sidebar-bg ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="toggle-button shadow-xl">
                        <LucideIcon name={isSidebarOpen ? "chevron-left" : "chevron-right"} size={14} strokeWidth={3} />
                    </button>

                    <div className="h-28 flex flex-col items-center justify-center border-b border-white/5 relative">
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-[#c49b4c] blur-[10px] opacity-30 rounded-full"></div>
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1b241a] to-[#37462b] flex items-center justify-center shadow-lg border border-white/10 relative z-10">
                                    <LucideIcon name="pig" size={28} className="text-[#c49b4c]" strokeWidth={1.5} />
                                </div>
                            </div>
                            {isSidebarOpen && (
                                <div className="animate-fadeIn">
                                    <h1 className="text-white font-black text-[22px] tracking-tighter uppercase leading-none font-mono">AMIMAL <span className="text-[#c49b4c]">ADDED</span></h1>
                                    <p className="text-[#899265] text-[10px] font-bold uppercase tracking-[0.25em] leading-none mt-2 font-mono">Health Hub System</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <nav className="flex-1 px-4 py-7 space-y-1 overflow-y-auto custom-scrollbar">
                        {SYSTEM_MODULES.map((module) => {
                            const isParentActive = activeTab === module.id || (module.subItems?.some(s => s.id === activeTab));
                            const renderHeader = module.isOpModule && (
                                <div key={`header-${module.id}`} className={`px-4 mt-10 mb-4 py-2 transition-all duration-300 ${!isSidebarOpen ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
                                    <p className="text-[10px] font-black text-[#c49b4c] uppercase tracking-[0.2em] font-mono leading-none">Operational Modules</p>
                                </div>
                            );
                            return (
                                <React.Fragment key={module.id}>
                                    {renderHeader}
                                    <NavItem icon={module.icon} label={module.label} active={isParentActive} onClick={() => { if (!module.subItems) setActiveTab(module.id); else toggleMenu(module.id); }} isOpen={isSidebarOpen} isExpanded={expandedMenus[module.id]} onToggleExpand={() => toggleMenu(module.id)} subItems={module.subItems?.map(sub => ({ label: sub.label, active: activeTab === sub.id, onClick: () => setActiveTab(sub.id) }))} />
                                </React.Fragment>
                            );
                        })}
                    </nav>

                    <div className="p-5 py-7 border-t border-white/5 bg-black/20 font-mono">
                        <div className={`flex items-center gap-3 transition-all duration-300 ${!isSidebarOpen ? 'justify-center' : 'justify-between'}`}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-11 h-11 rounded-xl border border-white/10 overflow-hidden shrink-0 bg-white/5 p-0.5 hover:border-[#c49b4c]/50 transition-colors">
                                    <img src={currentUser.avatar} alt="User Profile" className="w-full h-full object-cover rounded-lg" />
                                </div>
                                {isSidebarOpen && (
                                    <div className="overflow-hidden animate-fadeIn min-w-0">
                                        <p className="text-white text-[12px] font-bold truncate uppercase tracking-tight">{currentUser.name}</p>
                                        <p className="text-[#c49b4c] text-[10px] font-black uppercase truncate tracking-[0.15em] mt-0.5 opacity-90">Lead Developer</p>
                                    </div>
                                )}
                            </div>
                            {isSidebarOpen && <button className="text-gray-500 hover:text-[#da5e5e] p-2.5 transition-all hover:scale-125 active:scale-90 shrink-0" title="Sign Out"><LucideIcon name="log-out" size={18} strokeWidth={1.5} /></button>}
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT Area */}
                <main className="flex-1 flex flex-col min-w-0 relative">
                    <header className="h-24 px-10 flex items-center justify-between z-40 relative">
                        <div className="flex items-center gap-7 group cursor-default">
                            <div className="relative flex items-center justify-center w-14 h-14 transition-transform duration-500 group-hover:scale-110">
                                <div className="absolute inset-0 bg-[#c49b4c] blur-[16px] opacity-30 rounded-full animate-pulse"></div>
                                <LucideIcon name="pig" size={42} className="text-[#1b241a] relative z-10" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h2 className="text-[22px] lg:text-[26px] font-bold text-[#1b241a] tracking-tighter leading-none uppercase font-mono">World Class <span className="text-[#c49b4c] font-semibold">Animal Health Hub</span></h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="h-[2px] w-12 bg-[#c49b4c] rounded-full shadow-[0_0_5px_rgba(196,155,76,0.4)]"></div>
                                    <p className="text-[12px] font-black text-[#37462b] tracking-[0.2em] uppercase font-mono">High Quality & Safety Product for Consumption</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center bg-white/75 rounded-[16px] border border-gray-200/50 shadow-premium p-1 gap-4 pr-1.5 backdrop-blur-xl transition-all hover:shadow-xl font-mono">
                                <div className="flex flex-col items-center px-4 leading-none border-r border-gray-200 mr-[-4px]">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{currentTime.toLocaleDateString('en-GB', { weekday: 'long' })}</span>
                                    <span className="text-[12px] font-black text-[#1b241a] mt-1">{currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="bg-[#b53036] text-white flex items-center gap-4 px-6 py-3 rounded-2xl font-mono text-[14px] font-bold tracking-[0.1em] shadow-lg shadow-[#b53036]/20">
                                    <LucideIcon name="clock" size={14} className="animate-pulse" strokeWidth={2} />
                                    {currentTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <button className="p-4 rounded-full bg-white shadow-premium border border-gray-100 relative hover:shadow-2xl transition-all active:scale-95 group">
                                <LucideIcon name="bell" size={20} className="text-[#1b241a] group-hover:text-[#c49b4c]" strokeWidth={1.5} />
                                <span className="absolute top-3 right-3 w-3 h-3 bg-[#b53036] rounded-full border-2 border-white shadow-sm"></span>
                            </button>
                        </div>
                    </header>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-10 pt-4 flex flex-col">
                        <div className="max-w-[1600px] mx-auto flex-1 flex flex-col w-full">
                            <div className="flex-1">
                                {renderContent()}
                            </div>

                            {/* STANDARD FOOTER - TRANSPARENT & FIXED PADDING */}
                            <footer className="mt-8 py-[14px] text-center w-full">
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="p-1 bg-[#c49b4c]/10 rounded-md">
                                            <LucideIcon name="award" size={14} className="text-[#c49b4c]" strokeWidth={2} />
                                        </div>
                                        <span className="text-[12px] font-black text-[#52796F] uppercase tracking-widest font-mono leading-none">
                                            Animal Added Enterprise • Premium Feed Additive & Vaccine for your Animal
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-[#52796F] flex items-center justify-center flex-wrap gap-x-3 gap-y-1 font-mono leading-none">
                                        <span className="font-light tracking-tight">
                                            System by <span className="font-black text-[#1b241a] uppercase tracking-tighter">T All Intelligence</span>
                                        </span>
                                        <span className="opacity-20 hidden sm:inline">|</span>
                                        <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#1b241a] transition-colors">
                                            <LucideIcon name="phone" size={12} className="text-[#c49b4c]" strokeWidth={2} />
                                            <span className="font-mono">082-5695654</span>
                                        </div>
                                        <span className="opacity-20 hidden sm:inline">|</span>
                                        <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#1b241a] transition-colors">
                                            <LucideIcon name="mail" size={12} className="text-[#c49b4c]" strokeWidth={2} />
                                            <span className="font-mono">tallintelligence.ho@gmail.com</span>
                                        </div>
                                    </div>
                                </div>
                            </footer>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default App;
