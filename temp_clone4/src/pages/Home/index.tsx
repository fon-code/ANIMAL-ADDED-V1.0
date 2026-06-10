import React, { useState, useEffect } from 'react';
import UserPermissions from '../UserPermissions';
import HrCalendar from '../HrCalendar';
import SystemConfig from '../SystemConfig';
import { SYSTEM_MODULES } from '../../config/modules';
import DateTimeBadge from '../../components/shared/DateTimeBadge';
import KpiCard from '../../components/shared/KpiCard';
import GlassCard from '../../components/shared/GlassCard';
import DevPermit from '../DevPermit';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, Clock, Sparkles, ShieldCheck, 
    GraduationCap, Target, UserPlus, Heart, BarChart3, 
    Database, CalendarDays, Settings, Home as HomeIcon, AlertCircle, 
    UserCheck, Cake, PartyPopper, Send, ClipboardCheck, 
    CheckSquare, FileText, Megaphone, Calendar, Info, 
    ChevronLeft, ChevronRight, ChevronDown, Search, Bell,
    Phone, Mail, LogOut
} from 'lucide-react';

const PALETTE = {
    bgMain: '#F2F0EB', 
    glassWhite: 'rgba(255, 255, 255, 0.90)',
    red: '#D91604',
    orange: '#D95032',
    gold: '#F2B705',
    teal: '#4F868C',
    blue: '#16778C',
    sidebar: '#141A26',
    text: '#3F4859', 
};

const MOCK_DATA = {
    stats: [
        { label: 'Total Employees', value: '1,248', sub: 'Talent Pool', icon: Users, color: PALETTE.teal },
        { label: 'Attendance Rate', value: '98.2%', sub: 'Active Members', icon: Clock, color: PALETTE.blue },
        { label: 'Open Vacancies', value: '14', sub: 'Finding Innovation', icon: Sparkles, color: PALETTE.orange },
        { label: 'Labor Case Status', value: 'Resolved', sub: 'Friendly Workspace', icon: ShieldCheck, color: PALETTE.red },
    ],
    newMembers: [
        { name: 'พิมพ์พรรณ สวยงาม', pos: 'UX/UI Designer', dept: 'Innovation', joinDate: '01 Jan', avatar: 'https://i.pravatar.cc/150?img=47' },
        { name: 'ธนวัฒน์ มาดี', pos: 'Fullstack Dev', dept: 'Digital Tech', joinDate: '02 Jan', avatar: 'https://i.pravatar.cc/150?img=12' },
        { name: 'เกริกพล ขยันงาน', pos: 'HR Specialist', dept: 'People', joinDate: '05 Jan', avatar: 'https://i.pravatar.cc/150?img=68' },
    ],
    birthdays: [
        { name: 'อภิรดี มีสุข', dept: 'Accounting', date: '10 Jan', avatar: 'https://i.pravatar.cc/150?img=32' },
        { name: 'ชวาล ยิ่งใหญ่', dept: 'Logistics', date: '12 Jan', avatar: 'https://i.pravatar.cc/150?img=13' },
    ],
    approvals: [
        { id: 'LV-2024-001', type: 'Leave Request', requester: 'สมชาย รักดี', detail: 'Sick Leave (3 Days)', status: 'Pending', icon: FileText },
        { id: 'TR-2024-015', type: 'Training Approval', requester: 'วิภาดา แสงงาม', detail: 'Innovation Camp', status: 'In Review', icon: GraduationCap },
        { id: 'MP-2024-002', type: 'Manpower Request', requester: 'IT Manager', detail: 'Lead Talent (1)', status: 'Processing', icon: UserPlus },
    ],
};

const StatusBadge = ({ status }) => {
    const styles: Record<string, { bg: string, text: string }> = {
        'Pending': { bg: '#FEF3C7', text: '#D97706' },
        'In Review': { bg: '#E0F2FE', text: '#0284C7' },
        'Approved': { bg: '#DCFCE7', text: '#16A34A' },
        'Rejected': { bg: '#FEE2E2', text: '#DC2626' },
        'Processing': { bg: '#F3E8FF', text: '#9333EA' },
    };
    const currentStyle = styles[status] || { bg: '#F1F5F9', text: '#475569' };
    return (
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/50"
            style={{ backgroundColor: currentStyle.bg, color: currentStyle.text }}>
            {status}
        </span>
    );
};

const NavItem = ({ icon: IconComponent, label, active, onClick, isOpen, subItems, isExpanded, onToggleExpand }: any) => {
    const hasSubItems = subItems && subItems.length > 0;
    const isDirectActive = active && !hasSubItems;
    const isParentActive = active && hasSubItems;

    return (
        <div className="mb-1">
            <button
                onClick={hasSubItems ? onToggleExpand : onClick}
                className={`sys-nav-item mx-auto
                    ${isDirectActive ? 'sys-nav-item-active sys-animate-shimmer shadow-lg' : ''}
                    ${isParentActive ? 'bg-[#4F868C]/10' : ''}
                    ${!isOpen ? 'justify-center w-12 px-0 rounded-xl' : 'w-[95%] px-4 justify-start rounded-xl'} 
                `}
            >
                <IconComponent 
                    className={`sys-nav-icon relative z-10 transition-transform duration-300 
                        ${isDirectActive ? 'scale-110 text-[#F2B705] drop-shadow-[0_0_8px_rgba(242,183,5,0.4)]' : ''} 
                        ${isParentActive ? 'text-[#F2B705]' : 'text-[#8F9FBF]'}
                    `}
                    strokeWidth={isDirectActive || isParentActive ? 2.5 : 2}
                />
                
                <div className={`relative z-10 overflow-hidden transition-all duration-300 ease-in-out flex items-center justify-between flex-1 ${isOpen ? 'w-auto opacity-100 ml-3' : 'w-0 opacity-0 ml-0'}`}>
                    <span className={`sys-nav-label truncate ${isDirectActive ? 'text-white' : isParentActive ? 'text-[#4F868C]' : 'text-[#8F9FBF]'}`}>
                        {label}
                    </span>
                    {hasSubItems && (
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${isDirectActive ? 'text-white' : isParentActive ? 'text-[#4F868C]' : 'text-[#8F9FBF]'}`} />
                    )}
                </div>
            </button>

            {/* Sub-Items Container */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded && isOpen ? 'max-h-[500px] opacity-100 mt-1 pl-4' : 'max-h-0 opacity-0'}`}>
                <div className="sys-sub-container">
                    {hasSubItems && subItems.map((sub, idx) => (
                        <button 
                            key={idx} 
                            onClick={(e) => { e.stopPropagation(); sub.onClick(); }}
                            className={`sys-sub-item rounded-lg ${sub.active ? 'sys-sub-item-active' : 'text-[#8F9FBF]'}`}
                        >
                            <span className={`sys-sub-bullet ${sub.active ? 'bg-white' : 'opacity-30'}`}></span>
                            <span className="truncate">{sub.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DashboardView = () => (
    <div className="space-y-6 animate-fadeIn pb-4">
        <div className="flex justify-between items-center mb-2">
            <div>
                <h1 className="text-[24px] font-bold text-[#3F4859] uppercase tracking-tight">SAWASDEE, HR TEAM!</h1>
                <p className="text-[#4F868C] text-[11px] font-bold mt-0.5 uppercase tracking-widest">Strategic Talent Hub • <span className="text-[#D95032] animate-pulse font-bold">Innovation Active</span></p>
            </div>
            <div className="flex gap-2">
                <button className="bg-white/80 text-[#4F868C] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-white transition-all flex items-center gap-2 border border-white">
                    <HomeIcon size={16} /> Our Second Home
                </button>
                <button className="bg-[#D91604] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-transform flex items-center gap-2 hover:shadow-glow-red">
                    <AlertCircle size={16} /> Alert Request
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_DATA.stats.map((stat, idx) => (
                <KpiCard 
                    key={idx} 
                    title={stat.label} 
                    value={stat.value} 
                    color={stat.color} 
                    icon={stat.icon} 
                    description={stat.sub} 
                />
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New Members Board */}
            <GlassCard className="lg:col-span-2 relative overflow-hidden group bg-gradient-to-br from-white to-[#4F868C]/5 border-[#4F868C]/20">
                <div className="absolute -bottom-10 -right-10 text-[#4F868C] opacity-5 transform -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Users size={240} />
                </div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h2 className="text-xl font-bold text-[#3F4859] flex items-center gap-2 uppercase">
                        <UserCheck size={20} className="text-[#4F868C]" /> 
                        Our New Family Members
                    </h2>
                    <span className="text-[10px] text-[#4F868C] font-bold bg-[#4F868C]/10 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-[#4F868C]/10">Welcome Home</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                    {MOCK_DATA.newMembers.map((member, idx) => (
                        <div key={idx} className="p-4 bg-white/60 rounded-2xl border border-white/60 hover:bg-white hover:shadow-md transition-all text-center">
                            <div className="relative inline-block mb-3">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#4F868C]/30 shadow-sm mx-auto p-0.5">
                                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-xl" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-[#4F868C] text-white p-1 rounded-lg border-2 border-white">
                                    <Sparkles size={10} />
                                </div>
                            </div>
                            <h4 className="text-sm font-bold text-[#3F4859]">{member.name}</h4>
                            <p className="text-[10px] text-[#4F868C] font-bold mt-1 uppercase tracking-tight">{member.pos}</p>
                            <p className="text-[9px] text-[#9295A6] mt-0.5">{member.dept}</p>
                            <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center px-1">
                                <span className="text-[9px] text-[#9295A6]">Join</span>
                                <span className="text-[9px] font-bold text-[#3F4859]">{member.joinDate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Birthday Board */}
            <GlassCard className="relative overflow-hidden group bg-gradient-to-br from-white to-[#F2B705]/5 border-[#F2B705]/20">
                <div className="absolute -bottom-6 -right-6 text-[#F2B705] opacity-10 transform rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Cake size={120} />
                </div>
                <h2 className="text-xl font-bold text-[#3F4859] mb-6 flex items-center gap-2 uppercase relative z-10">
                    <PartyPopper size={20} className="text-[#D95032]" /> 
                    Birthday Wishes
                </h2>
                <div className="space-y-4 relative z-10">
                    {MOCK_DATA.birthdays.map((bday, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-white/70 rounded-2xl border border-white/80 hover:scale-[1.02] transition-transform shadow-sm">
                            <div className="w-10 h-10 rounded-full border-2 border-[#D95032]/50 overflow-hidden shrink-0">
                                <img src={bday.avatar} alt={bday.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-[#3F4859] truncate">{bday.name}</h4>
                                <p className="text-[9px] text-[#9295A6]">{bday.dept}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-[11px] font-bold text-[#D95032]">{bday.date}</p>
                                <div className="flex gap-1 justify-end">
                                    <span className="w-1 h-1 rounded-full bg-[#F2B705] animate-ping"></span>
                                    <span className="w-1 h-1 rounded-full bg-[#D95032] animate-ping delay-75"></span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="w-full py-3 mt-2 bg-gradient-to-r from-[#D95032] to-[#F2B705] text-white text-[10px] font-bold uppercase rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                        <Send size={12} /> Post Greeting Card
                    </button>
                </div>
            </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Approvals Board */}
            <GlassCard className="lg:col-span-2 relative overflow-hidden group bg-gradient-to-br from-white to-[#16778C]/5 border-[#186B8C]/10">
                <div className="absolute -bottom-10 -right-10 text-[#16778C] opacity-5 transform rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <ClipboardCheck size={240} />
                </div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h2 className="text-xl font-bold text-[#3F4859] flex items-center gap-2 uppercase">
                        <CheckSquare size={20} className="text-[#D95032]" /> 
                        Pending Approvals
                    </h2>
                    <span className="text-xs text-[#16778C] font-bold bg-[#16778C]/10 px-3 py-1 rounded-full border border-[#16778C]/10 shadow-sm uppercase tracking-tight">Requires Action</span>
                </div>
                <div className="space-y-3 relative z-10">
                    {MOCK_DATA.approvals.map((req, idx) => {
                        const ReqIcon = req.icon;
                        return (
                        <div key={idx} className="flex items-center p-3 bg-white/70 rounded-2xl border border-white hover:bg-white transition-colors cursor-pointer group shadow-sm">
                            <div className="h-12 w-12 rounded-xl bg-[#F2F0EB] flex items-center justify-center text-[#3F4859] group-hover:scale-110 transition-transform shadow-inner border border-gray-200">
                                <ReqIcon size={20} />
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="flex justify-between mb-1">
                                    <h4 className="font-bold text-[#3F4859] text-sm">{req.requester}</h4>
                                    <span className="text-[10px] font-bold text-[#4F868C]">{req.id}</span>
                                </div>
                                <p className="text-[10px] text-[#9295A6] uppercase font-bold">{req.type} • {req.detail}</p>
                            </div>
                            <div className="ml-4">
                                <StatusBadge status={req.status} />
                            </div>
                        </div>
                    )})}
                </div>
            </GlassCard>

            <GlassCard className="bg-gradient-to-b from-white/95 to-[#D91604]/5 border-[#D91604]/10 relative overflow-hidden group">
                <div className="absolute -bottom-6 -right-6 text-[#D91604] opacity-5 transform -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Bell size={120} />
                </div>
                <h2 className="text-xl font-bold text-[#3F4859] mb-4 flex items-center gap-2 uppercase relative z-10">
                    <Megaphone size={20} className="text-[#D91604]" />
                    Corporate Alert
                </h2>
                <div className="space-y-4 relative z-10">
                    <div className="p-4 bg-[#D91604]/5 rounded-2xl border border-[#D91604]/10 flex gap-3 items-start hover:bg-white transition-all">
                        <div className="bg-white/90 p-1.5 rounded-full text-[#D91604] shadow-sm"><Calendar size={14}/></div>
                        <div>
                            <p className="text-xs font-bold text-[#D91604]">การประเมินผลงานรอบครึ่งปี</p>
                            <p className="text-[10px] text-[#D91604]/80 mt-1 font-medium">Mid-year review starts Monday. Ensure all self-evaluations are done.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-[#16778C]/5 rounded-2xl border border-[#16778C]/10 flex gap-3 items-start hover:bg-white transition-all">
                        <div className="bg-white/90 p-1.5 rounded-full text-[#16778C] shadow-sm"><Info size={14}/></div>
                        <div>
                            <p className="text-xs font-bold text-[#16778C]">สวัสดิการประกันกลุ่มใหม่</p>
                            <p className="text-[10px] text-[#16778C]/80 mt-1 font-medium">Update on group insurance plan for FY2025 available now.</p>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    </div>
);

const GenericView = ({ title, icon: IconComponent, desc }: any) => (
    <div className="animate-fadeIn">
        <div className="flex justify-between items-end mb-6">
            <div>
                <h2 className="text-2xl font-bold text-[#3F4859] uppercase tracking-tight">{title}</h2>
                <p className="text-xs text-[#4F868C] mt-1 font-medium italic">{desc || 'HR Master Innovation Module'}</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="flex flex-col items-center justify-center min-h-[400px] text-center border-[#4F868C]/10">
                <div className="p-10 bg-[#F2F0EB] rounded-[2rem] mb-6 shadow-inner border border-gray-200">
                    <IconComponent size={64} className="text-[#D95032]" />
                </div>
                <h3 className="text-xl font-bold text-[#3F4859] uppercase tracking-widest">{title} Interface Ready</h3>
                <p className="text-sm text-[#9295A6] max-w-sm mt-4 font-medium">
                    Welcome to the {title} management module. Full CRUD operations, innovation tables, and talent tracking will be initialized here.
                </p>
                <button className="mt-8 px-10 py-3 bg-[#186B8C] text-white rounded-2xl text-xs font-bold uppercase hover:bg-[#4F868C] transition-all shadow-lg hover:-translate-y-1">
                    Access Talent Database
                </button>
            </GlassCard>
        </div>
    </div>
);

export default function Home() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
    const [visitedTabs, setVisitedTabs] = useState(['dashboard']);
    const [activeModulesConfig, setActiveModulesConfig] = useState<Record<string, boolean>>({});
    
    // We'll use the authenticated user instead of hardcoded currentUser
    const currentUser = {
        name: user?.name || 'T-DCC Developer',
        email: user?.employeeId || 'tallintelligence.dcc@gmail.com', // just a fallback
        position: user?.role || 'Lead Developer',
        avatar: 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400'
    };

    useEffect(() => {
        const loadConfig = () => {
            const stored = localStorage.getItem('DEV_PERMIT_MODULES');
            if (stored) {
                setActiveModulesConfig(JSON.parse(stored));
            } else {
                const defaults: Record<string, boolean> = {};
                SYSTEM_MODULES.forEach(m => {
                    defaults[m.id] = true;
                    m.subItems?.forEach(s => defaults[s.id] = true);
                });
                setActiveModulesConfig(defaults);
            }
        };
        
        loadConfig();
        window.addEventListener('sysConfigUpdate', loadConfig);
        return () => window.removeEventListener('sysConfigUpdate', loadConfig);
    }, []);

    const isDev = user?.role === 'Developer' || currentUser.position === 'Lead Developer';

    const visibleModules = SYSTEM_MODULES.filter(mod => {
        // If Dev, they see everything logically allowed
        return activeModulesConfig[mod.id] !== false;
    }).map(mod => {
        if (!mod.subItems) return mod;
        return {
            ...mod,
            subItems: mod.subItems.filter(sub => {
                if (sub.id === 'dev_permit') return isDev;
                return activeModulesConfig[sub.id] !== false;
            })
        };
    }).filter(mod => !mod.subItems || mod.subItems.length > 0);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!visitedTabs.includes(activeTab)) setVisitedTabs(prev => [...prev, activeTab]);
    }, [activeTab]);

    const toggleMenu = (menuKey: string) => {
        setExpandedMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
        if (!isSidebarOpen) setSidebarOpen(true);
    };

    const getTabContent = (tabId: string) => {
        const module = visibleModules.find(m => m.id === tabId || m.subItems?.some(s => s.id === tabId));
        let title = tabId.replace(/_/g, ' ').toUpperCase();
        let icon = Users;

        if (tabId === 'dashboard') return <DashboardView />;
        if (tabId === 'hr_calendar' || tabId === 'HR_CALENDAR') return <HrCalendar />;
        if (tabId === 'user_permission' || tabId === 'USER_PERMISSION') return <UserPermissions />;
        if (tabId === 'system_config' || tabId === 'SYSTEM_CONFIG') return <SystemConfig />;
        if (tabId === 'dev_permit') return isDev ? <DevPermit /> : <div className="p-8 text-center text-slate-500">Access Denied</div>;
        
        if (module) {
            const subItem = module.subItems?.find(s => s.id === tabId);
            title = subItem ? subItem.label : module.label;
            icon = module.icon;
        }

        return <GenericView title={title} icon={icon} />;
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F2F0EB] text-[#3F4859]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
                * { font-family: 'JetBrains Mono', 'Noto Sans Thai', sans-serif !important; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(79, 134, 140, 0.1); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4F868C; }
                .animate-shimmer { animation: shimmer 1.5s infinite; }
                .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes shimmer { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
                .shadow-glow-teal { box-shadow: 0 0 15px rgba(79, 134, 140, 0.3); }
                .shadow-glow-red { box-shadow: 0 0 15px rgba(217, 22, 4, 0.3); }
                .shadow-soft { box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04); }
                .shadow-grand { box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15); }
            `}</style>
            
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-500 shadow-grand bg-[#141A26]
                lg:relative lg:flex
                ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
                ${isSidebarOpen ? 'lg:w-72' : 'lg:w-24'}
            `}>
                <button 
                    onClick={() => setSidebarOpen(!isSidebarOpen)} 
                    className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 bg-[#4F868C] text-white rounded-full items-center justify-center shadow-lg z-50 border-2 border-[#141A26] hover:bg-[#D91604] transition-colors"
                >
                    {isSidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
                </button>

                <div className="h-32 flex flex-col items-center justify-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F868C]/20 to-[#186B8C]/30 flex items-center justify-center shadow-lg transform rotate-3 relative overflow-hidden group border border-white/10">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#F2B705]/30"></div>
                            <div className="relative">
                                <Users 
                                    size={26} 
                                    style={{ color: '#F2B705' }} 
                                    strokeWidth={2.5} 
                                />
                                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#D91604] rounded-full border-2 border-[#141A26] shadow-glow-red animate-pulse"></div>
                            </div>
                        </div>

                        <div className={`transition-all duration-500 overflow-hidden flex flex-col ${(isSidebarOpen || isMobileMenuOpen) ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                            <h1 className="text-white text-xl tracking-widest whitespace-nowrap">
                                <span className="font-light">HR</span><span className="font-extrabold text-[#D91604]">MASTER</span>
                            </h1>
                            <p className="text-[#4F868C] text-[9px] font-bold uppercase tracking-[0.74em] mt-0.5 whitespace-nowrap">Talent Hub</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar py-4 relative z-10">
                    {visibleModules.map(module => (
                        <React.Fragment key={module.id}>
                            {module.id === 'hrm' && (isSidebarOpen || isMobileMenuOpen) && (
                                <div className="mt-6 mb-2 px-3">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F2B705]">
                                        OPERATIONAL MODULES
                                    </h3>
                                </div>
                            )}
                            <NavItem 
                                icon={module.icon} 
                                label={module.label} 
                                active={activeTab === module.id || module.subItems?.some(s => s.id === activeTab)} 
                                onClick={() => {
                                    if (module.subItems) {
                                        toggleMenu(module.id);
                                    } else {
                                        setActiveTab(module.id);
                                        if (window.innerWidth < 1024) setMobileMenuOpen(false);
                                    }
                                }} 
                                isOpen={isSidebarOpen || isMobileMenuOpen}
                                isExpanded={expandedMenus[module.id]}
                                onToggleExpand={() => toggleMenu(module.id)}
                                subItems={module.subItems?.map(sub => ({
                                    label: sub.label,
                                    active: activeTab === sub.id,
                                    onClick: () => {
                                        setActiveTab(sub.id);
                                        if (window.innerWidth < 1024) setMobileMenuOpen(false);
                                    }
                                }))}
                            />
                        </React.Fragment>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5 bg-black/20 shrink-0">
                    <div className={`flex items-center gap-3 ${(!isSidebarOpen && !isMobileMenuOpen) && 'justify-center'}`}>
                        <div 
                            className="w-11 h-11 rounded-2xl border-2 border-[#4F868C]/30 bg-cover bg-center shrink-0 shadow-sm p-0.5" 
                        >
                            <img src={currentUser.avatar} className="w-full h-full object-cover rounded-xl" alt="user" />
                        </div>
                        {(isSidebarOpen || isMobileMenuOpen) && (
                            <div className="overflow-hidden">
                                <p className="text-white text-sm font-bold truncate w-32">{currentUser.name}</p>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-[#4F868C] rounded-full animate-pulse"></span>
                                    <p className="text-[#8F9FBF] text-[10px] uppercase font-bold tracking-wider">Logged in</p>
                                </div>
                            </div>
                        )}
                        {(isSidebarOpen || isMobileMenuOpen) && <LogOut size={18} className="ml-auto text-[#9295A6] hover:text-[#D91604] cursor-pointer transition-colors" onClick={logout} title="Log Out" />}
                    </div>
                </div>
            </aside>

            <main className="flex-1 relative overflow-hidden bg-[#F2F0EB] flex flex-col w-full">
                <header className="h-20 lg:h-24 px-4 sm:px-6 md:px-8 flex items-center justify-between z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2.5 bg-white shadow-sm border border-gray-100 rounded-xl text-[#3F4859]"
                        >
                            <LayoutDashboard size={20} />
                        </button>
                        <div className="hidden sm:flex items-center gap-3 lg:gap-4 ml-2">
                            <div className="relative flex items-center justify-center w-10 h-10">
                                <div className="absolute inset-0 bg-[#FF4D4D] blur-[10px] opacity-50 rounded-full"></div>
                                <Users size={28} className="text-[#FF4D4D] relative z-10" strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="text-[13px] lg:text-[17px] font-black uppercase tracking-widest leading-none flex items-center gap-1.5 lg:gap-2">
                                    <span className="text-[#141A26]">INNOVATIVE</span>
                                    <span className="text-[#D95032]/80 italic font-serif">&</span>
                                    <span className="text-[#141A26]">STRATEGIC</span>
                                    <span className="text-[#4F868C]">HR SYSTEM</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="w-8 h-[2px] bg-[#F2B705]"></div>
                                    <span className="text-[8px] lg:text-[9.5px] font-bold text-[#186B8C] uppercase tracking-[0.2em] leading-none pt-0.5">
                                        Empowering Talent & Driving Organizational Excellence
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 lg:gap-5">
                        <DateTimeBadge />
                        <button className="relative p-2.5 lg:p-3 rounded-2xl bg-white/70 border border-white text-[#186B8C] shadow-sm">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#D91604] rounded-full border-2 border-white shadow-glow-red"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 px-4 sm:px-6 md:px-8 pt-2 pb-4 custom-scrollbar overflow-y-auto flex flex-col">
                    <div className="flex-1">
                        {visitedTabs.map(tabId => (
                            <div key={tabId} style={{ display: activeTab === tabId ? 'block' : 'none' }}>
                                {getTabContent(tabId)}
                            </div>
                        ))}
                    </div>
                    <footer className="mt-8 py-3.5 text-center border-t border-[#4F868C]/10 w-full shrink-0">
                        <div className="flex flex-col items-center justify-center gap-1">
                            <div className="flex items-center gap-2">
                                <Sparkles size={11} className="text-[#F2B705]" />
                                <span className="text-[11px] font-bold text-[#186B8C] uppercase tracking-[0.15em]">
                                    HR MASTER • THE FUTURE OF TALENT & INNOVATION • EMPOWERING PEOPLE CULTURE
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-[#4F868C]">
                                <span className="font-light">System by <span className="font-black uppercase text-[#141A26]">T All Intelligence</span></span>
                                <span className="opacity-20">|</span>
                                <div className="flex items-center gap-1.5">
                                    <Phone size={10} className="text-[#D91604]" />
                                    <span className="font-medium">082-5695654</span>
                                </div>
                                <span className="opacity-20">|</span>
                                <div className="flex items-center gap-1.5">
                                    <Mail size={10} className="text-[#186B8C]" />
                                    <span className="font-medium">tallintelligence.ho@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}
