/// <reference types="vite/client" />
import { ApiResponse } from '../types';

const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

// Output setup status for easy debugging
console.log('App initialization - GAS Backend URL configured:', !!SCRIPT_URL);

// Cache utility for static data
export const cache = {
  get: (key: string) => {
    const item = localStorage.getItem(`wms_cache_${key}`);
    if (!item) return null;
    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(`wms_cache_${key}`);
      return null;
    }
    return parsed.data;
  },
  set: (key: string, data: any, ttlMinutes: number = 60) => {
    const expiry = Date.now() + ttlMinutes * 60 * 1000;
    localStorage.setItem(`wms_cache_${key}`, JSON.stringify({ data, expiry }));
  },
  clear: (key?: string) => {
    if (key) localStorage.removeItem(`wms_cache_${key}`);
    else {
      Object.keys(localStorage)
        .filter(k => k.startsWith('wms_cache_'))
        .forEach(k => localStorage.removeItem(k));
    }
  }
};

export const api = {
  post: async <T = any>(action: string, sheet?: string, data?: any, params?: { limit?: number, offset?: number }): Promise<ApiResponse<T>> => {
    if (!SCRIPT_URL) {
      console.warn('VITE_APPS_SCRIPT_URL is not set. Using mock response.');
      return mockResponse(action, data);
    }
    
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, sheet, data, ...params }),
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Mock response for development if URL is not set
const mockResponse = async (action: string, data: any): Promise<ApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (action === 'login') {
    // 1. Super Admin (DEV001 / 1234567890123)
    // 2. Admin (Demo) (U001 / ADMIN12345678)
    // 3. Operator (Demo) (DEMO / DEMO123456789)
    if ((data.employeeId === 'DEV001' && data.idCard === '1234567890123') || 
        (data.employeeId === 'U001' && data.idCard === 'ADMIN12345678') ||
        (data.employeeId === 'DEMO' && data.idCard === 'DEMO123456789') ||
        (data.employeeId === 'demo' && data.idCard === 'demo')) { // keep 'demo' / 'demo' just in case for older sessions
      const isSuperAdmin = data.employeeId === 'DEV001';
      const isAdmin = data.employeeId === 'U001';
      const isOperator = data.employeeId === 'DEMO' || data.employeeId === 'demo';
      
      return {
        status: 'success',
        data: {
          id: isSuperAdmin ? '1' : (isAdmin ? '2' : '3'),
          employeeId: data.employeeId,
          name: isSuperAdmin ? 'Super Admin' : (isAdmin ? 'Demo Admin' : 'Demo Operator'),
          role: isSuperAdmin ? 'Developer' : (isAdmin ? 'Administrator' : 'Viewer'),
          avatar: 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400',
          permissions: {
            canCreate: !isOperator,
            canEdit: !isOperator,
            canApprove: isSuperAdmin || isAdmin,
            canVerify: isSuperAdmin || isAdmin,
          }
        }
      };
    }
    return { status: 'error', message: 'Invalid credentials' };
  }
  
  return { status: 'success', data: [] };
};
