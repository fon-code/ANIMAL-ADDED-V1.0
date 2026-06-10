import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import KpiCard from '../../components/shared/KpiCard';
import UserGuideButton from '../../components/shared/UserGuideButton';

// --- Mock Data ---
const INITIAL_DATA = {
  departments: [
    { id: 1, name: 'Management', code: 'MGT' },
    { id: 2, name: 'Human Resources', code: 'HR' },
    { id: 3, name: 'Information Technology', code: 'IT' },
    { id: 4, name: 'Production', code: 'PROD' },
    { id: 5, name: 'Quality Assurance', code: 'QA' },
    { id: 6, name: 'Quality Control', code: 'QC' },
    { id: 7, name: 'Warehouse', code: 'WH' },
  ],
  pdfTemplates: [
    { id: 1, name: 'DAR FORM', dept: 'DC CENTER', code: 'FM-DC01-01', revision: 'REV. 02' },
    { id: 2, name: 'DESTRUCTION REPORT', dept: 'DC CENTER', code: 'FM-DC03-01', revision: 'REV. 01' },
    { id: 3, name: 'DISTRIBUTION REPORT', dept: 'DC CENTER', code: 'FM-DC04-01', revision: 'REV. 01' },
  ],
  idFormats: [
    { id: 1, pages: 'DAR Document', prefix: 'DAR', format: '{Prefix}-{YY}{MM}-', digitReset: '001 (Monthly)', note: 'e.g. DAR-2411-001' },
    { id: 2, pages: 'External Document', prefix: 'EXT', format: '{Prefix}-{YY}{MM}-', digitReset: '001 (Monthly)', note: 'e.g. EXT-2411-001' },
  ]
};

const TABS = [
  { id: 'departments', label: 'Departments', icon: 'Building2', title: 'Departments', desc: 'Manage department list and codes used across the system.' },
  { id: 'pdfTemplates', label: 'PDF Templates', icon: 'Printer', title: 'PDF FORM TEMPLATES', desc: 'Manage header details, codes, and revisions for system-generated PDF forms.' },
  { id: 'idFormats', label: 'ID Format', icon: 'Hash', title: 'ID FORMAT CONFIGURATION', desc: 'Manage auto-generated number formats for various pages.' }
];

const palette = {
    primary: '#141A26',
    accent: '#4F868C',
    danger: '#D91604',
    warning: '#F2B705',
    success: '#16A34A',
    surface: '#F2F0EB'
};

const LucideIcon = ({ name, size = 16, className = "", color, style }: any) => {
    if (!name) return null;
    const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={2} />;
};

function UserGuidePanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (typeof document === 'undefined') return null;
    return createPortal(
        <>
            <div 
                className={`fixed inset-0 z-[190] bg-[#141A26]/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
                onClick={onClose}
            />
            <div className={`fixed inset-y-0 right-0 z-[200] w-96 bg-[#F2F0EB] shadow-[-10px_0_30px_rgba(0,0,0,0.08)] transform transition-transform duration-300 ease-out flex flex-col border-l border-white/60 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-6 border-b border-[#4F868C]/10 bg-white text-[#141A26] shrink-0">
                    <h3 className="font-extrabold flex items-center gap-2 uppercase tracking-tight font-mono text-sm">
                        <Icons.Settings2 size={18} className="text-[#4F868C]"/> CONFIG GUIDE
                    </h3>
                    <button onClick={onClose} className="p-1.5 text-[#4F868C] hover:text-[#D91604] rounded-full transition-colors"><Icons.X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 text-[#3F4859] leading-relaxed text-[12px]">
                    <section>
                        <h4 className="text-sm font-black text-[#141A26] mb-3 uppercase flex items-center gap-2 border-b border-[#4F868C]/10 pb-2 font-mono">
                            <Icons.Database size={16} className="text-[#D91604]"/> 1. Master Data
                        </h4>
                        <p>หน้าจอนี้ใช้สำหรับตั้งค่าข้อมูลหลัก (Master Data) ที่จะถูกนำไปใช้งานเป็นตัวเลือก (Dropdown) ในหน้าต่างต่างๆ ของระบบ เช่น ประเภทเอกสาร แผนก หรือมาตรฐาน ISO รวมถึงเทมเพลตสำหรับ PDF</p>
                    </section>
                    <section>
                        <h4 className="text-sm font-black text-[#141A26] mb-3 uppercase flex items-center gap-2 border-b border-[#4F868C]/10 pb-2 font-mono">
                            <Icons.LayoutGrid size={16} className="text-[#D91604]"/> 2. System Impact
                        </h4>
                        <p>การแก้ไขหรือลบข้อมูลในส่วนนี้ อาจส่งผลกระทบต่อรายการเอกสารที่มีการเลือกข้อมูลเดิมไว้แล้ว แนะนำให้ระมัดระวังในการลบข้อมูลหลักครับ</p>
                    </section>
                </div>
                <div className="p-6 bg-white border-t border-[#4F868C]/10 flex justify-end shadow-inner">
                    <button onClick={onClose} className="px-8 py-3 bg-[#141A26] text-white font-black rounded-lg uppercase font-mono text-[11px] hover:bg-[#4F868C] transition-all shadow-sm">เข้าใจแล้ว (Got it)</button>
                </div>
            </div>
        </>,
        document.body
    );
}

const StandardModalWrapper = ({ children, className }: any) => (
    <div className={`relative ${className}`} onClick={e => e.stopPropagation()}>
        {children}
    </div>
);

export default function SystemConfig() {
  const [activeTab, setActiveTab] = useState('departments'); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [data, setData] = useState(INITIAL_DATA);
  const [search, setSearch] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', code: '', dept: '', revision: '', pages: '', prefix: '', format: '', digitReset: '', note: '' });

  const activeTabData = TABS.find(t => t.id === activeTab) || TABS[0];
  const currentList = (data as any)[activeTab] || [];

  const filteredList = useMemo(() => {
      return currentList.filter((item: any) => {
          const s = search.toLowerCase();
          return (item.name?.toLowerCase().includes(s) || 
                  item.code?.toLowerCase().includes(s) || 
                  item.dept?.toLowerCase().includes(s) ||
                  item.pages?.toLowerCase().includes(s) ||
                  item.prefix?.toLowerCase().includes(s) ||
                  item.format?.toLowerCase().includes(s));
      });
  }, [currentList, search]);

  const paginatedData = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  useEffect(() => { setCurrentPage(1); setSearch(''); }, [activeTab]);

  const handleOpenModal = (item: any = null) => {
    setEditingItem(item);
    setFormData(item ? { 
      name: item.name || '', 
      code: item.code || '',
      dept: item.dept || '',
      revision: item.revision || '',
      pages: item.pages || '',
      prefix: item.prefix || '',
      format: item.format || '',
      digitReset: item.digitReset || '',
      note: item.note || ''
    } : { name: '', code: '', dept: '', revision: '', pages: '', prefix: '', format: '', digitReset: '', note: '' });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setData(prev => ({
        ...prev,
        [activeTab]: (prev as any)[activeTab].map((item: any) => 
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      }));
      if ((window as any).Swal) (window as any).Swal.fire({icon: 'success', title: 'Updated Successfully', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500});
    } else {
      const newId = currentList.length > 0 ? Math.max(...currentList.map((i: any) => i.id)) + 1 : 1;
      setData(prev => ({
        ...prev,
        [activeTab]: [...(prev as any)[activeTab], { id: newId, ...formData }]
      }));
      if ((window as any).Swal) (window as any).Swal.fire({icon: 'success', title: 'Added Successfully', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500});
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = () => {
        setData(prev => ({
            ...prev,
            [activeTab]: (prev as any)[activeTab].filter((item: any) => item.id !== id)
        }));
    };

    if ((window as any).Swal) {
        (window as any).Swal.fire({
            title: 'Are you sure?', text: "You won't be able to revert this!", icon: 'warning',
            showCancelButton: true, confirmButtonColor: palette.danger, confirmButtonText: 'Yes, delete it!'
        }).then((result: any) => {
            if (result.isConfirmed) {
                confirmDelete();
                (window as any).Swal.fire({icon: 'success', title: 'Deleted!', text: 'Record has been deleted.', timer: 1500, showConfirmButton: false});
            }
        });
    } else {
        if(window.confirm('Are you sure you want to delete this item?')) confirmDelete();
    }
  };

  return (
    <div className="w-full relative animate-fadeIn flex flex-col h-full">
      {!isGuideOpen && (
          <UserGuideButton 
              onClick={() => setIsGuideOpen(true)} 
              className="bg-[#D6E0E1] text-[#4A7F85] hover:bg-[#4A7F85] hover:text-white"
          />
      )}
      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Header Bar Synced with Theme */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm border border-white/60 rounded-xl text-[#141A26]">
            <Icons.Settings2 size={24} strokeWidth={2} />
          </div>
          <div className="flex flex-col justify-center leading-none">
            <h1 className="text-2xl font-black tracking-tight uppercase flex gap-2">
              <span className="text-[#141A26]">SYSTEM</span>
              <span className="text-[#D91604]">CONFIG</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5 text-[#4F868C]">Master Data Configuration</p>
          </div>
        </div>
      </header>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0 mb-6">
        <KpiCard title="Total Records" value={filteredList.length.toString()} icon={Icons.List} color={palette.primary} description={`In ${activeTabData.label}`} />
        <KpiCard title="System Categories" value={TABS.length.toString()} icon={Icons.LayoutGrid} color={palette.danger} description="Configuration Areas" />
        <KpiCard title="Recently Updated" value={new Date().toLocaleDateString('en-GB')} icon={Icons.Clock} color={palette.warning} description="Latest Action" />
        <KpiCard title="Database Status" value="SYNCED" icon={Icons.CheckCircle} color={palette.success} description="Real-time Active" />
      </div>

      {/* Main Layout: Left Sidebar + Right Table */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[500px]">
        {/* Left Sidebar for Tabs */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-2 h-fit max-h-full">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 p-4">
                <h3 className="text-[10px] font-black text-[#4F868C] uppercase tracking-widest mb-4 px-2">Registry Categories</h3>
                <div className="flex flex-col gap-1.5">
                    {TABS.map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                                    isActive 
                                    ? 'bg-[#141A26] text-white shadow-md' 
                                    : 'bg-white text-[#4F868C] border border-[#4F868C]/10 hover:bg-[#F2F0EB] hover:border-[#4F868C]/30 hover:text-[#141A26]'
                                }`}
                            >
                                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/10 text-[#F2B705]' : 'bg-white border border-[#4F868C]/10 text-[#4F868C]'}`}>
                                    <LucideIcon name={tab.icon} size={16} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="font-bold text-[12px] uppercase tracking-widest leading-none mb-1 truncate">{tab.label}</div>
                                    <div className={`text-[9px] font-mono truncate ${isActive ? 'text-[#4F868C]' : 'text-[#4F868C]/70'}`}>
                                        {tab.desc}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Table Container */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col flex-1 min-h-0 min-w-0 overflow-hidden">
            {/* TOOLBAR */}
            <div className="px-6 py-4 border-b border-[#4F868C]/10 flex flex-col md:flex-row justify-between items-center bg-white shrink-0 gap-4">
              <div className="flex items-center gap-2 text-[12px] font-black text-[#141A26] uppercase tracking-widest">
                  <LucideIcon name={activeTabData.icon} size={16} className="text-[#D91604]"/>
                  <span>{activeTabData.title} List</span>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4F868C]" />
                    <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder={`Search ${activeTabData.label}...`} className="w-full pl-10 pr-4 py-2 text-[12px] border border-[#4F868C]/20 rounded-xl font-bold outline-none focus:border-[#141A26] bg-[#F2F0EB] focus:bg-white shadow-sm text-[#141A26] h-10 transition-colors" />
                  </div>
                  <button onClick={() => handleOpenModal()} className="bg-[#D91604] hover:bg-[#B31203] text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md flex items-center gap-2 transition-all active:scale-95 shrink-0 h-10">
                    <Icons.Plus size={14}/> Add New
                  </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar bg-white flex flex-col">
                {activeTab === 'pdfTemplates' ? (
                  <table className="w-full text-left font-sans min-w-[800px] border-collapse">
                    <thead className="bg-[#F2F0EB] text-[#141A26] border-b border-[#4F868C]/20 sticky top-0 z-10 font-mono uppercase tracking-wider text-[11px] font-black">
                      <tr>
                        <th className="py-4 px-6 pl-8 w-[35%] whitespace-nowrap">Form Name</th>
                        <th className="py-4 px-6 text-center w-[20%] whitespace-nowrap">Department</th>
                        <th className="py-4 px-6 text-center w-[20%] whitespace-nowrap">Form Code</th>
                        <th className="py-4 px-6 text-center w-[15%] whitespace-nowrap">Revision</th>
                        <th className="py-4 px-6 text-center w-[10%] pr-8 whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {paginatedData.length > 0 ? paginatedData.map((item: any) => (
                        <tr key={item.id} className="hover:bg-[#F2F0EB]/50 transition-colors border-b border-[#4F868C]/10 group">
                          <td className="py-3 px-6 pl-8 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#4F868C]/40"></div>
                              <span className="font-bold text-[#141A26] text-[12px] uppercase">{item.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-6 align-middle text-center">
                            <span className="font-bold text-[#4F868C] text-[12px] uppercase">{item.dept}</span>
                          </td>
                          <td className="py-3 px-6 align-middle text-center">
                            <span className="bg-[#F2F0EB] text-[#4F868C] px-3 py-1 rounded-md font-mono font-black text-[11px] uppercase tracking-widest border border-[#4F868C]/10">{item.code}</span>
                          </td>
                          <td className="py-3 px-6 align-middle text-center">
                            <span className="font-black text-[#D91604] text-[11px] font-mono">{item.revision}</span>
                          </td>
                          <td className="py-3 px-6 pr-8 align-middle text-center">
                            <div className="flex justify-center items-center gap-2">
                              <button onClick={() => handleOpenModal(item)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#4F868C]/20 text-[#4F868C] hover:border-[#F2B705] hover:text-white hover:bg-[#F2B705] transition-colors shadow-sm bg-white" title="Edit">
                                <Icons.Pencil size={14} />
                              </button>
                              <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#4F868C]/20 text-[#D91604] hover:border-[#D91604] hover:bg-red-50 transition-colors shadow-sm bg-white" title="Delete">
                                <Icons.Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} className="py-16 text-center text-[#4F868C] font-bold uppercase tracking-widest text-[12px] opacity-70">No records found. Click "Add New" to create one.</td></tr>
                      )}
                    </tbody>
                  </table>
                ) : activeTab === 'idFormats' ? (
                  <table className="w-full text-left font-sans min-w-[900px] border-collapse">
                    <thead className="bg-[#F2F0EB] text-[#141A26] border-b border-[#4F868C]/20 sticky top-0 z-10 font-mono uppercase tracking-wider text-[11px] font-black">
                      <tr>
                        <th className="py-4 px-6 pl-8 w-[20%] whitespace-nowrap">Pages</th>
                        <th className="py-4 px-6 text-center w-[15%] whitespace-nowrap">Prefix</th>
                        <th className="py-4 px-6 text-center w-[20%] whitespace-nowrap">Format</th>
                        <th className="py-4 px-6 text-center w-[15%] whitespace-nowrap">Digit & Reset</th>
                        <th className="py-4 px-6 text-center w-[20%] whitespace-nowrap">Note</th>
                        <th className="py-4 px-6 text-center w-[10%] pr-8 whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {paginatedData.length > 0 ? paginatedData.map((item: any) => (
                        <tr key={item.id} className="hover:bg-[#F2F0EB]/50 transition-colors border-b border-[#4F868C]/10 group">
                          <td className="py-3 px-6 pl-8 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#D91604]/60"></div>
                              <span className="font-bold text-[#141A26] text-[12px] uppercase">{item.pages}</span>
                            </div>
                          </td>
                          <td className="py-3 px-6 align-middle text-center">
                            <span className="bg-[#F2F0EB] text-[#141A26] px-3 py-1 rounded-md font-mono font-black text-[11px] uppercase tracking-widest border border-[#4F868C]/10">{item.prefix}</span>
                          </td>
                          <td className="py-3 px-6 align-middle text-center">
                            <span className="font-bold text-[#4F868C] text-[12px]">{item.format}</span>
                          </td>
                          <td className="py-3 px-6 align-middle text-center">
                            <span className="font-bold text-[#141A26] text-[11px]">{item.digitReset}</span>
                          </td>
                          <td className="py-3 px-6 align-middle text-center">
                            <span className="text-[10px] text-[#4F868C] italic">{item.note}</span>
                          </td>
                          <td className="py-3 px-6 pr-8 align-middle text-center">
                            <div className="flex justify-center items-center gap-2">
                              <button onClick={() => handleOpenModal(item)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#4F868C]/20 text-[#4F868C] hover:border-[#F2B705] hover:text-white hover:bg-[#F2B705] transition-colors shadow-sm bg-white" title="Edit">
                                <Icons.Pencil size={14} />
                              </button>
                              <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#4F868C]/20 text-[#D91604] hover:border-[#D91604] hover:bg-red-50 transition-colors shadow-sm bg-white" title="Delete">
                                <Icons.Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={6} className="py-16 text-center text-[#4F868C] font-bold uppercase tracking-widest text-[12px] opacity-70">No records found. Click "Add New" to create one.</td></tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left font-sans min-w-[600px] border-collapse">
                    <thead className="bg-[#F2F0EB] text-[#141A26] border-b border-[#4F868C]/20 sticky top-0 z-10 font-mono uppercase tracking-wider text-[11px] font-black">
                      <tr>
                        <th className="py-4 px-6 pl-8 w-[50%] whitespace-nowrap">Name</th>
                        {activeTab === 'departments' && <th className="py-4 px-6 text-center w-[25%] whitespace-nowrap">Code</th>}
                        <th className="py-4 px-6 pr-8 text-center w-[25%] whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {paginatedData.length > 0 ? paginatedData.map((item: any) => (
                        <tr key={item.id} className="hover:bg-[#F2F0EB]/50 transition-colors border-b border-[#4F868C]/10 group">
                          <td className="py-3 px-6 pl-8 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#4F868C]/40"></div>
                              <span className="font-bold text-[#141A26] text-[12px] uppercase">{item.name}</span>
                            </div>
                          </td>
                          {activeTab === 'departments' && (
                            <td className="py-3 px-6 align-middle text-center">
                              <span className="bg-[#F2F0EB] text-[#4F868C] px-3 py-1 rounded-md font-mono font-black text-[11px] uppercase tracking-widest border border-[#4F868C]/10">{item.code}</span>
                            </td>
                          )}
                          <td className="py-3 px-6 pr-8 align-middle text-center">
                            <div className="flex justify-center items-center gap-2">
                              <button onClick={() => handleOpenModal(item)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#4F868C]/20 text-[#4F868C] hover:border-[#F2B705] hover:text-white hover:bg-[#F2B705] transition-colors shadow-sm bg-white" title="Edit">
                                <Icons.Pencil size={14} />
                              </button>
                              <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#4F868C]/20 text-[#D91604] hover:border-[#D91604] hover:bg-red-50 transition-colors shadow-sm bg-white" title="Delete">
                                <Icons.Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={activeTab === 'departments' ? 3 : 2} className="py-16 text-center text-[#4F868C] font-bold uppercase tracking-widest text-[12px] opacity-70">No records found. Click "Add New" to create one.</td></tr>
                      )}
                    </tbody>
                  </table>
                )}
            </div>
            
            {/* Pagination */}
            <div className="p-4 bg-white border-t border-[#4F868C]/10 flex justify-between items-center font-bold text-[#4F868C] uppercase tracking-widest shrink-0 font-mono text-[10px]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span>SHOW:</span>
                        <select 
                            value={itemsPerPage} 
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                            className="bg-[#F2F0EB] border border-[#4F868C]/20 rounded-md px-2 py-1 outline-none focus:border-[#141A26] text-[#141A26] cursor-pointer"
                        >
                            {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                    <div>TOTAL {filteredList.length} ITEMS</div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`p-1.5 border border-[#4F868C]/20 bg-white rounded-lg transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#F2F0EB] text-[#141A26] shadow-sm'}`}><Icons.ChevronLeft size={16}/></button>
                    <div className="bg-[#F2F0EB] border border-[#4F868C]/20 px-5 py-1.5 rounded-lg shadow-sm text-[#141A26] font-black min-w-[120px] text-center uppercase tracking-widest">PAGE {currentPage} OF {totalPages || 1}</div>
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`p-1.5 border border-[#4F868C]/20 bg-white rounded-lg transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#F2F0EB] text-[#141A26] shadow-sm'}`}><Icons.ChevronRight size={16}/></button>
                </div>
            </div>
        </div>
      </div>

      {/* --- Add/Edit Modal --- */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#141A26]/60 backdrop-blur-sm p-4 animate-fadeIn font-sans">
          <StandardModalWrapper className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden relative border border-white/40 max-h-[90vh]">
             {/* Modal Header */}
             <div className="bg-[#141A26] px-8 py-5 flex justify-between items-center shrink-0 border-b border-[#4F868C]/10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
                        <Icons.Settings2 size={20} className="text-[#F2B705]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">{editingItem ? `Edit Item` : `Add New Item`}</h3>
                        <p className="text-[10px] font-bold text-[#4F868C] uppercase tracking-widest mt-1.5">{activeTabData.title}</p>
                    </div>
                </div>
                <button onClick={()=>setIsModalOpen(false)} className="text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"><Icons.X size={20} /></button>
             </div>
             
             {/* Modal Body */}
             <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#F2F0EB]">
                <form id="configForm" onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-[#4F868C]/10 shadow-sm grid grid-cols-2 gap-6">
                  {activeTab === 'pdfTemplates' ? (
                    <>
                      <div className="col-span-2">
                        <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Form Name <span className="text-[#D91604]">*</span></label>
                        <input 
                          type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                          className="w-full border border-[#4F868C]/20 bg-[#F2F0EB] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#141A26] outline-none focus:border-[#4F868C] transition-all shadow-sm"
                          placeholder="e.g. DAR FORM..."
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Department Name <span className="text-[#D91604]">*</span></label>
                        <input 
                          type="text" required value={formData.dept} onChange={(e) => setFormData({...formData, dept: e.target.value})} 
                          className="w-full border border-[#4F868C]/20 bg-[#F2F0EB] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#141A26] outline-none focus:border-[#4F868C] transition-all shadow-sm uppercase"
                          placeholder="e.g. DC CENTER..."
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Form Code <span className="text-[#D91604]">*</span></label>
                        <input 
                          type="text" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} 
                          className="w-full border border-[#4F868C]/20 bg-[#F2F0EB] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#141A26] font-mono outline-none focus:border-[#4F868C] transition-all shadow-sm uppercase"
                          placeholder="e.g. FM-DC01-01"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Revision <span className="text-[#D91604]">*</span></label>
                        <input 
                          type="text" required value={formData.revision} onChange={(e) => setFormData({...formData, revision: e.target.value})} 
                          className="w-full border border-[#4F868C]/20 bg-[#F2F0EB] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#141A26] font-mono outline-none focus:border-[#4F868C] transition-all shadow-sm uppercase"
                          placeholder="e.g. REV. 02"
                        />
                      </div>
                    </>
                  ) : activeTab === 'idFormats' ? (
                    <>
                      <div className="col-span-2">
                        <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Pages <span className="text-[#D91604]">*</span></label>
                        <input 
                          type="text" required value={formData.pages} onChange={(e) => setFormData({...formData, pages: e.target.value})} 
                          className="w-full border border-[#4F868C]/20 bg-[#F2F0EB] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#141A26] outline-none focus:border-[#4F868C] transition-all shadow-sm"
                          placeholder="e.g. DAR Document..."
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Prefix <span className="text-[#D91604]">*</span></label>
                        <input 
                          type="text" required value={formData.prefix} onChange={(e) => setFormData({...formData, prefix: e.target.value})} 
                          className="w-full border border-[#4F868C]/20 bg-[#F2F0EB] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#141A26] outline-none focus:border-[#4F868C] transition-all shadow-sm uppercase"
                          placeholder="e.g. DAR..."
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Format <span className="text-[#D91604]">*</span></label>
                        <input 
                          type="text" required value={formData.format} onChange={(e) => setFormData({...formData, format: e.target.value})} 
                          className="w-full border border-[#4F868C]/20 bg-[#F2F0EB] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#141A26] outline-none focus:border-[#4F868C] transition-all shadow-sm"
                          placeholder="e.g. {Prefix}-{YY}{MM}-"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Digit & Reset</label>
                        <input 
                          type="text" value={formData.digitReset} onChange={(e) => setFormData({...formData, digitReset: e.target.value})} 
                          className="w-full border border-[#4F868C]/20 bg-[#F2F0EB] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#141A26] outline-none focus:border-[#4F868C] transition-all shadow-sm"
                          placeholder="e.g. 001 (Monthly)"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Note / Example</label>
                        <input 
                          type="text" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} 
                          className="w-full border border-[#4F868C]/20 bg-[#F2F0EB] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#141A26] outline-none focus:border-[#4F868C] transition-all shadow-sm"
                          placeholder="e.g. DAR-2411-001"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-2">
                        <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Name <span className="text-[#D91604]">*</span></label>
                        <input 
                          type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                          className="w-full border border-[#4F868C]/20 bg-[#F2F0EB] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#141A26] outline-none focus:border-[#4F868C] transition-all shadow-sm"
                          placeholder="Enter name..."
                        />
                      </div>
                      {activeTab === 'departments' && (
                        <div className="col-span-2">
                          <label className="text-[10px] font-black text-[#141A26] uppercase tracking-widest block mb-2">Code <span className="text-[#D91604]">*</span></label>
                          <input 
                            type="text" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} 
                            className="w-full border border-[#4F868C]/20 bg-[#F2F0EB] focus:bg-white rounded-xl p-3 text-[12px] font-bold text-[#141A26] font-mono outline-none focus:border-[#4F868C] transition-all shadow-sm uppercase"
                            placeholder="e.g. MGT, HR, IT..."
                          />
                        </div>
                      )}
                    </>
                  )}
                </form>
             </div>

             {/* Modal Footer */}
             <div className="p-5 bg-white border-t border-[#4F868C]/10 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="px-6 py-2.5 text-[#4F868C] hover:text-[#141A26] font-bold text-[10px] uppercase tracking-widest transition-colors">Cancel</button>
                <button type="submit" form="configForm" className="px-8 py-2.5 bg-[#D91604] hover:bg-[#B31203] text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2">
                    <Icons.Save size={14}/> Save Record
                </button>
             </div>
          </StandardModalWrapper>
        </div>,
        document.body
      )}
    </div>
  );
}
