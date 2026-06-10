import React from 'react';
import { Shield, RefreshCw } from 'lucide-react';

interface AccessHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export function AccessHeader({ isLoading, onRefresh }: AccessHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-4">
          <div className="sys-header-icon-box">
            <Shield className="sys-header-icon" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="sys-title-main">System Access Logs</h1>
            <p className="sys-title-sub">Audit trail of all user logins and logouts across the application.</p>
          </div>
        </div>
      </div>
      <button 
        onClick={onRefresh}
        disabled={isLoading}
        className="sys-btn-secondary whitespace-nowrap self-start sm:self-auto"
      >
        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        Refresh Logs
      </button>
    </div>
  );
}
