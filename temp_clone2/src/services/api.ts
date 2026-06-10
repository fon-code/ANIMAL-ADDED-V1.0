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
    if ((data.employeeId === 'demo' && data.idCard === 'demo') || 
        (data.employeeId === 'U001' && data.idCard === '1234567890123') ||
        (data.employeeId === 'U002' && data.idCard === '1234567890123')) {
      const isDemo = data.employeeId === 'demo';
      const isDev = data.employeeId === 'U001';
      return {
        status: 'success',
        data: {
          id: isDemo ? '3' : (isDev ? '1' : '2'),
          employeeId: data.employeeId,
          name: isDemo ? 'Demo User' : (isDev ? 'Developer' : 'Administrator'),
          role: isDemo ? 'Viewer' : (isDev ? 'Developer' : 'Administrator'),
          avatar: 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400',
          permissions: {
            canCreate: !isDemo,
            canEdit: !isDemo,
            canApprove: !isDemo,
            canVerify: !isDemo,
          }
        }
      };
    }
    return { status: 'error', message: 'Invalid credentials' };
  }
  
  return { status: 'success', data: [] };
};
