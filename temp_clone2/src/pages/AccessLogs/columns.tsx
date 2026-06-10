import React from 'react';
import { AccessLog } from './types';

export const getColumns = () => [
  { 
    key: 'timestamp', 
    label: 'Date & Time', 
    sortable: true,
    render: (value: string) => {
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : (
        <div className="flex flex-col">
          <span className="font-bold text-primary">{date.toLocaleDateString('en-GB')}</span>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{date.toLocaleTimeString()}</span>
        </div>
      );
    }
  },
  { 
    key: 'employeeId', 
    label: 'Staff Code', 
    filterable: true,
    render: (value: string) => <span className="font-mono text-[11px] font-black text-primary">{value}</span>
  },
  { 
    key: 'name', 
    label: 'Name', 
    filterable: true,
    render: (value: string, row: AccessLog) => (
      <div className="flex flex-col">
        <span className="sys-stack-main">{value}</span>
        <span className="sys-stack-sub">{row.role}</span>
      </div>
    )
  },
  { 
    key: 'action', 
    label: 'Event Type', 
    filterable: true,
    render: (value: string) => (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
        value === 'LOGIN' ? 'bg-emerald-50 text-emerald-600' : 
        value === 'LOGOUT' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
      }`}>
        {value === 'LOGIN' ? 'Login' : value === 'LOGOUT' ? 'Logout' : value}
      </span>
    )
  },
  { 
    key: 'userAgent', 
    label: 'Device & Browser', 
    render: (value: string) => {
      // Simplistic parsing for a cleaner display
      const isMobile = /mobile/i.test(value);
      const browser = value.split(' ').pop() || value;
      return (
        <span className="text-[10px] text-slate-500 max-w-[200px] truncate block" title={value}>
          {isMobile ? '📱 Mobile' : '💻 Desktop'} - {browser.split('/')[0]}
        </span>
      );
    }
  }
];
