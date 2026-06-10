import { 
  LayoutDashboard, 
  ArrowDownToLine,
  ArrowUpRight,
  Boxes,
  RotateCcw,
  Settings,
  Users,
  History
} from 'lucide-react';

export interface MenuItem {
  id: string;
  path: string;
  name: string;
  icon: any;
  isConfidential: boolean;
  subItems?: { id: string; name: string; isConfidential?: boolean }[];
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', path: '/', name: 'Dashboard', icon: LayoutDashboard, isConfidential: false },
  { id: 'inbound', path: '/inbound', name: 'Inbound Control', icon: ArrowDownToLine, isConfidential: false },
  { id: 'outbound', path: '/outbound', name: 'Outbound Control', icon: ArrowUpRight, isConfidential: false },
  { id: 'inventory', path: '/inventory', name: 'Inventory Core', icon: Boxes, isConfidential: false },
  { id: 'returns', path: '/returns', name: 'Returns & QC', icon: RotateCcw, isConfidential: false },
  { id: 'settings', path: '/settings', name: 'WMS Settings', icon: Settings, isConfidential: true },
  { id: 'permissions', path: '/permissions', name: 'User Permissions', icon: Users, isConfidential: true },
  { id: 'access_logs', path: '/access-logs', name: 'Access Logs', icon: History, isConfidential: true },
];
