import {
    Home, CalendarDays, Package, ShoppingCart, FlaskConical, Briefcase, Factory, Settings, TerminalSquare
} from 'lucide-react';

export const SYSTEM_MODULES = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'calendar_main', label: 'CALENDAR', icon: CalendarDays },
    { id: 'inventory', label: 'INVENTORY', icon: Package, isConfidential: false,
      subItems: [ { id: 'inv_additives', label: 'FEED ADDITIVES' }, { id: 'inv_vax', label: 'VACCINES & DRUGS' }, { id: 'inv_minerals', label: 'VITAMINS & MINERALS' } ] },
    { id: 'procurement', label: 'PROCUREMENT', icon: ShoppingCart, isConfidential: false,
        subItems: [ { id: 'supplier_list', label: 'SUPPLIER HUB' }, { id: 'po_tracking', label: 'PO TRACKING' } ] },
    { id: 'qc_lab', label: 'QUALITY & LAB', icon: FlaskConical, isConfidential: false,
        subItems: [ { id: 'lab_analysis', label: 'LAB ANALYSIS' }, { id: 'qc_cert', label: 'COA ISSUANCE' } ] },
    { id: 'sales', label: 'SALES HUB', icon: Briefcase, isConfidential: false,
        subItems: [ { id: 'order_management', label: 'ORDER MGMT' }, { id: 'customer_database', label: 'CLIENT DATABASE' } ] },
    { id: 'production', label: 'MIXING CENTER', icon: Factory, isConfidential: false,
        subItems: [ { id: 'formula_config', label: 'FORMULA MASTER' }, { id: 'batch_tracking', label: 'BATCH CONTROL' } ] },
    { id: 'setting', label: 'SYSTEM SETTING', icon: Settings, isConfidential: true,
        subItems: [ { id: 'user_permissions', label: 'USER PERMISSION' }, { id: 'system_config', label: 'SYSTEM CONFIG' }, { id: 'audit_log', label: 'AUDIT LOG' }, { id: 'dev_permit', label: 'DEV PERMIT (BETA)' } ] }
];
