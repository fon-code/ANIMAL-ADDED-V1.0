import React, { useEffect, useState } from 'react';
import { api, cache } from '../../services/api';
import { DataTable } from '../../components/shared/DataTable';
import { AccessHeader } from './components/AccessHeader';
import { AccessKpis } from './components/AccessKpis';
import { getColumns } from './columns';
import { AccessLog } from './types';

export default function AccessLogs() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async (force = false) => {
    try {
      setIsLoading(true);
      if (!force) {
        const cached = cache.get('AccessLogs');
        if (cached) {
          setLogs(cached);
          setIsLoading(false);
          return;
        }
      }
      
      const response = await api.post('read', 'AccessLogs');
      if (response.status === 'success') {
        // Assume latest logs are at the bottom, so reverse to show newest first
        const data = [...(response.data || [])].reverse();
        setLogs(data);
        cache.set('AccessLogs', data, 15); // Cache for 15 minutes
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = getColumns();

  return (
    <div className="w-full flex flex-col space-y-4 pt-2">
      <AccessHeader isLoading={isLoading} onRefresh={() => fetchLogs(true)} />
      
      <div className="sys-main-content">
        <AccessKpis logs={logs} />
        
        <div className="w-full">
          <DataTable 
            columns={columns}
            data={logs}
          />
        </div>
      </div>
    </div>
  );
}
