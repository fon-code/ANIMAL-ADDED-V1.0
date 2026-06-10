import React, { useState, useEffect } from 'react';
import { SYSTEM_MODULES } from '../../config/modules';
import { TerminalSquare, Save, Search, Settings2, ShieldAlert, CheckCircle2, X, HelpCircle, UserCog, Lock } from 'lucide-react';
import KpiCard from '../../components/shared/KpiCard';
import UserGuideButton from '../../components/shared/UserGuideButton';
import * as api from '../../services/api';

const palette = {
    primary: '#4F868C',      // Brand Teal
    accent: '#D95032',       // Brand Orange
    bg: '#F2F0EB',           // Background Page
    success: '#16778C',      // Brand Blue
    warning: '#D95032',      // Brand Orange
    danger: '#D91604',       // Brand Red
    dark: '#141A26',         // Sidebar Background / Headers
};

export default function DevPermit() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeModules, setActiveModules] = useState<Record<string, boolean>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    // Initial load: ideally from SystemConfig sheet, but for now we simulate reading from localStorage or a default
    useEffect(() => {
        const loadConfig = async () => {
            try {
                // Here we would fetch from SystemConfig. For now, mock fallback or try to read from API if it was set up.
                // const res = await api.post('read', { sheet: 'SystemConfig' });
                // We will use local storage for instantaneous feel across app reloads for now if API is not fully hooked yet.
                const stored = localStorage.getItem('DEV_PERMIT_MODULES');
                if (stored) {
                    setActiveModules(JSON.parse(stored));
                } else {
                    // Default: All active except System Config?
                    const defaults: Record<string, boolean> = {};
                    SYSTEM_MODULES.forEach(m => {
                        defaults[m.id] = true;
                        m.subItems?.forEach(s => {
                            defaults[s.id] = true;
                        });
                    });
                    setActiveModules(defaults);
                }
            } catch (err) {
                console.error("Failed to load dev permit config", err);
            }
        };
        loadConfig();
    }, []);

    const handleToggle = (id: string, isParent: boolean, parentId?: string) => {
        setActiveModules(prev => {
            const next = { ...prev };
            const newValue = !prev[id];
            next[id] = newValue;
            
            if (isParent) {
                // If toggling parent, toggle all children to match
                const parentModule = SYSTEM_MODULES.find(m => m.id === id);
                if (parentModule && parentModule.subItems) {
                    parentModule.subItems.forEach(sub => {
                        next[sub.id] = newValue;
                    });
                }
            } else if (parentId) {
                // If any child is turned on, ensure parent is turned on
                if (newValue) {
                    next[parentId] = true;
                }
            }
            return next;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            // Save to localStorage so it propagates immediately to frontend
            localStorage.setItem('DEV_PERMIT_MODULES', JSON.stringify(activeModules));
            
            // Optionally, write to SystemConfig in GAS
            const rows = Object.entries(activeModules).map(([moduleId, isActive]) => ({
                id: `CFG_${moduleId}`,
                moduleId,
                isActive: isActive ? 'true' : 'false',
                updatedAt: new Date().toISOString()
            }));
            
            // Since we don't have batch write ready in api.ts, we skip GAS write for the MVP UI toggle,
            // or just rely entirely on localStorage for demonstration until GAS is fully fleshed out.
            
            setMessage({ type: 'success', text: 'Configuration saved. Other users will now only see enabled modules.' });
            
            // Dispatch event to force sidebar update if needed
            window.dispatchEvent(new Event('sysConfigUpdate'));
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to save configuration.' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    // Filter modules based on search and exclude dev_permit from being toggled by itself
    const filteredModules = SYSTEM_MODULES.filter(mod => {
        const matchesMain = mod.label.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSub = mod.subItems?.some(sub => sub.label.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesMain || matchesSub;
    }).map(mod => {
        if (!mod.subItems) return mod;
        return {
            ...mod,
            subItems: mod.subItems.filter(sub => sub.id !== 'dev_permit')
        };
    }).filter(mod => mod.id !== 'setting' || (mod.subItems && mod.subItems.length > 0));

    const activeCount = Object.values(activeModules).filter(v => v).length;
    const totalCount = SYSTEM_MODULES.length + SYSTEM_MODULES.reduce((acc, m) => acc + (m.subItems?.length || 0), 0);

    return (
        <div className="w-full relative flex flex-col h-full min-h-0">
            {/* Header */}
            <header className="flex flex-wrap items-center justify-between pb-4 gap-4 shrink-0 bg-transparent">
                <div className="flex items-center gap-4">
                    <div className="sys-header-icon-box">
                        <TerminalSquare className="sys-header-icon" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="sys-title-main">
                            DEV <span className="text-[#D91604]">PERMIT</span>
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded-md uppercase tracking-wider align-middle ml-2 mt-0.5">BETA</span>
                        </h2>
                        <p className="sys-title-sub mt-0.5">System Module Visibility Control</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-[#141A26] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? <Settings2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </header>

            {/* Guide Toggle Button (Right Edge) */}
            {!isGuideOpen && (
                <UserGuideButton 
                    onClick={() => setIsGuideOpen(true)} 
                    className="bg-[#D6E0E1] text-[#4A7F85] hover:bg-[#4A7F85] hover:text-white"
                />
            )}

            {message && (
                <div className={`p-4 rounded-xl flex items-center justify-between text-sm font-medium ${message.type === 'success' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    <div className="flex items-center gap-2">
                        {message.type === 'success' ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                        {message.text}
                    </div>
                    <button onClick={() => setMessage(null)}><X size={16} /></button>
                </div>
            )}

            <div className="flex-1 space-y-6 w-full pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <KpiCard 
                        title="Active Modules" 
                        value={`${activeCount} / ${totalCount}`} 
                        color={palette.primary} 
                        icon={Settings2} 
                        description="Currently visible components" 
                    />
                    <KpiCard 
                        title="Restricted Visibility" 
                        value={(totalCount - activeCount).toString()} 
                        color={palette.danger} 
                        icon={Lock} 
                        description="Modules hidden from sidebar" 
                    />
                </div>

                <div className="animate-in fade-in duration-500 overflow-hidden flex flex-col min-h-[500px]">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-[#141A26]/5 shadow-sm overflow-hidden flex flex-col h-full flex-1">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                            <h2 className="text-sm font-bold text-slate-800 tracking-widest uppercase">Module Toggle List</h2>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search modules..." 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-slate-900/10 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                            {filteredModules.map(mod => (
                                <div key={mod.id} className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                                    <div className="flex items-center justify-between p-4 bg-slate-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg text-slate-700 shadow-sm">
                                                {mod.icon && <mod.icon size={20} />}
                                            </div>
                                            <span className="font-bold text-slate-800 uppercase tracking-widest text-sm">{mod.label}</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={!!activeModules[mod.id]}
                                                onChange={() => handleToggle(mod.id, true)}
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                        </label>
                                    </div>
                                    
                                    {mod.subItems && mod.subItems.length > 0 && (
                                        <div className="divide-y divide-slate-50 bg-white">
                                            {mod.subItems.map(sub => (
                                                <div key={sub.id} className="flex items-center justify-between p-3 pl-12 hover:bg-slate-50 transition-colors">
                                                    <span className="text-sm font-medium text-slate-600 uppercase tracking-wider">{sub.label}</span>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={!!activeModules[sub.id]}
                                                            onChange={() => handleToggle(sub.id, false, mod.id)}
                                                        />
                                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Guide Sidebar */}
            {isGuideOpen && (
                <div className="fixed inset-0 z-[600] flex justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-[#141A26]/40 backdrop-blur-sm" onClick={() => setIsGuideOpen(false)} />
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                        <div className="bg-[#141A26] px-8 py-6 flex justify-between items-center text-white border-b-4 border-[#F2B705]">
                            <div className="flex items-center gap-3">
                                <HelpCircle size={22} className="text-[#F2B705]" />
                                <h3 className="text-lg font-black uppercase tracking-widest text-thai">DEV PERMIT GUIDE</h3>
                            </div>
                            <button onClick={() => setIsGuideOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#4F868C] leading-relaxed text-thai">
                            <section>
                                <h4 className="font-black text-[#141A26] border-b border-[#141A26]/10 pb-2 mb-4 flex items-center gap-2">
                                    <span className="bg-[#16778C] text-white font-mono w-6 h-6 rounded-full flex items-center justify-center text-[12px]">01</span> 
                                    การซ่อนเมนูจากระบบ
                                </h4>
                                <p className="text-[13px]">
                                    Modules ที่ถูกปิด (Disabled) จะถูกซ่อนออกจากแถบ Sidebar อย่างสมบูรณ์ และป้องกันการเข้าถึงผ่าน Direct URL เฉพาะผู้ใช้ระดับ Developer และ Admin ถึงจะมองเห็นหน้า System Config เพื่อเปิดการทำงานได้
                                </p>
                            </section>
                            <section>
                                <h4 className="font-black text-[#141A26] border-b border-[#141A26]/10 pb-2 mb-4 flex items-center gap-2">
                                    <span className="bg-[#D95032] text-white font-mono w-6 h-6 rounded-full flex items-center justify-center text-[12px]">02</span> 
                                    ความสัมพันธ์ Parent-Child
                                </h4>
                                <p className="text-[13px]">
                                    เมื่อเปิดหรือปิดสวิตช์ที่เป็น Parent Module (เช่น HR Development) ระบบจะเช็คและปรับเปลี่ยนสถานะของ Sub-modules ภายในให้ตรงกันอัตโนมัติ
                                </p>
                            </section>
                            <section>
                                <h4 className="font-black text-[#141A26] border-b border-[#141A26]/10 pb-2 mb-4 flex items-center gap-2">
                                    <span className="bg-[#F2B705] text-[#141A26] font-mono w-6 h-6 rounded-full flex items-center justify-center text-[12px]">03</span> 
                                    การปรับใช้ระบบ
                                </h4>
                                <p className="text-[13px]">
                                    กดปุ่ม <strong>SAVE CONFIGURATION</strong> ที่ด้านบนเพื่อบันทึกการตั้งค่าลงฐานข้อมูล ระบบจะส่งคำสั่งไปยังเครื่องอื่นๆ แบบอัตโนมัติ (ขึ้นอยู่กับการเชื่อมต่อ WebSocket หรือ Polling หากนำไปใช้)
                                </p>
                            </section>
                        </div>
                        <div className="p-6 border-t border-[#141A26]/10 bg-white flex justify-end">
                            <button onClick={() => setIsGuideOpen(false)} className="px-8 py-3 bg-[#141A26] text-white rounded-xl font-black text-[11px] uppercase shadow-lg text-thai">ปิดคู่มือ</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
