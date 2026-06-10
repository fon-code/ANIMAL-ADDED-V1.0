import React, { useMemo } from 'react';
import KpiCard from '../../../components/shared/KpiCard';
import { Key, History, Users } from 'lucide-react';
import { AccessLog } from '../types';

interface AccessKpisProps {
  logs: AccessLog[];
}

export function AccessKpis({ logs }: AccessKpisProps) {
  const totalLogins = useMemo(() => logs.filter(l => l.action === 'LOGIN').length, [logs]);
  const uniqueUsers = useMemo(() => new Set(logs.map(l => l.employeeId)).size, [logs]);
  
  const latestEventTime = useMemo(() => {
    if (logs.length === 0 || !logs[0].timestamp) return '-';
    return new Date(logs[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [logs]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <KpiCard
        label="Total Logins"
        value={totalLogins}
        icon={Key}
        color="#3b82f6"
        bg="bg-blue-50"
        subLabel="Recorded successful logins"
      />
      <KpiCard
        label="Unique Users"
        value={uniqueUsers}
        icon={Users}
        color="#10b981"
        bg="bg-emerald-50"
        subLabel="Staff members accessed"
      />
      <KpiCard
        label="Latest Event"
        value={latestEventTime}
        icon={History}
        color="#8b5cf6"
        bg="bg-purple-50"
        subLabel="Time of last activity"
      />
    </div>
  );
}
