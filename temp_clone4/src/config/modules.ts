import {
    LayoutDashboard, Users, Clock, Sparkles, ShieldCheck, 
    GraduationCap, Target, UserPlus, Heart, BarChart3, 
    Database, CalendarDays, Settings, TerminalSquare
} from 'lucide-react';

export const SYSTEM_MODULES = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'hr_calendar', label: 'HR CALENDAR', icon: CalendarDays },
    {
        id: 'hrm', label: 'HR MANAGEMENT', icon: Users,
        subItems: [
            { id: 'employee_directory', label: 'EMPLOYEE DIRECTORY' },
            { id: 'payroll', label: 'PAYROLL & COMPENSATION' },
            { id: 'time_attendance', label: 'TIME & ATTENDANCE' },
            { id: 'leave_management', label: 'LEAVE MANAGEMENT' },
            { id: 'benefits', label: 'BENEFITS & WELFARE' },
            { id: 'disciplinary', label: 'DISCIPLINARY ACTIONS' },
        ]
    },
    {
        id: 'hrd', label: 'HR DEVELOPMENT', icon: GraduationCap, 
        subItems: [
            { id: 'training_plan', label: 'TRAINING PLANNING' },
            { id: 'skill_matrix', label: 'SKILL MATRIX' },
            { id: 'performance_hrd', label: 'PERFORMANCE' },
            { id: 'career_path', label: 'CAREER PATH' },
            { id: 'succession', label: 'SUCCESSION PLAN' },
        ]
    },
    {
        id: 'performance_mgmt', label: 'PERFORMANCE MANAGEMENT', icon: Target,
        subItems: [
            { id: 'kpi_setting', label: 'KPI / OKR SETTING' },
            { id: 'self_evaluation', label: 'SELF EVALUATION' },
            { id: 'manager_review', label: 'MANAGER REVIEW' },
            { id: 'feedback_360', label: '360 FEEDBACK' },
            { id: 'appraisal_report', label: 'APPRAISAL SUMMARY' },
        ]
    },
    {
        id: 'recruitment', label: 'RECRUITMENT', icon: UserPlus,
        subItems: [
            { id: 'manpower_request', label: 'MANPOWER REQUEST' },
            { id: 'job_vacancies', label: 'JOB VACANCIES' },
            { id: 'recruitment_jd', label: 'JOB DESCRIPTION' },
            { id: 'candidate_tracking', label: 'CANDIDATE TRACKING' },
            { id: 'interview_schedule', label: 'INTERVIEW SCHEDULE' },
            { id: 'onboarding', label: 'ONBOARDING' },
        ]
    },
    {
        id: 'labor_relations', label: 'LABOR RELATIONS', icon: Heart,
        subItems: [
            { id: 'disciplinary_law', label: 'DISCIPLINARY & LABOR LAW' },
            { id: 'company_regulations', label: 'COMPANY REGULATIONS' },
            { id: 'investigation_process', label: 'INVESTIGATION & PUNISHMENT' },
            { id: 'union_grievance', label: 'UNION & GRIEVANCES' },
            { id: 'employee_engagement', label: 'ENGAGEMENT & RELATIONSHIP' },
            { id: 'sports_social', label: 'SPORTS & SOCIAL EVENTS' },
            { id: 'internal_pr', label: 'INTERNAL PR & NEWS' },
            { id: 'external_activities', label: 'EXTERNAL ACTIVITIES' },
        ]
    },
    {
        id: 'analytics', label: 'HR ANALYTICS', icon: BarChart3,
        subItems: [
            { id: 'workforce_report', label: 'WORKFORCE REPORT' },
            { id: 'turnover_analysis', label: 'TURNOVER ANALYSIS' },
            { id: 'budget_tracking', label: 'HR BUDGET TRACKING' },
        ]
    },
    {
        id: 'master', label: 'DATA MASTER', icon: Database,
        subItems: [
            { id: 'org_structure', label: 'ORG STRUCTURE' },
            { id: 'position_master', label: 'POSITION MASTER' },
            { id: 'master_jd', label: 'JOB DESCRIPTION' },
            { id: 'branch_master', label: 'BRANCH MASTER' },
        ]
    },
    {
        id: 'setting', label: 'SETTING', icon: Settings,
        subItems: [
            { id: 'user_permission', label: 'USER PERMISSIONS' },
            { id: 'system_config', label: 'SYSTEM CONFIG' },
            { id: 'dev_permit', label: 'DEV PERMIT (BETA)' }
        ]
    }
];
