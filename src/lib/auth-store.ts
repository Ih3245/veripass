import { User, AuditLog } from '@/types/auth';

const STORAGE_KEY_USERS = 'rta_users_v1';
const STORAGE_KEY_SESSION = 'rta_current_user_v1';
const STORAGE_KEY_LOGS = 'rta_audit_logs_v1';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_01',
    name: 'Alex Morgan',
    email: 'alex.morgan@company.com',
    role: 'Senior Security Architect',
    department: 'Cyber Infrastructure',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    passwordHash: 'Secure2026!',
    createdAt: '2026-09-15',
    lastLogin: '2026-10-11 12:15 PM',
    status: 'active',
  },
  {
    id: 'usr_02',
    name: 'Sarah Chen',
    email: 'sarah.dev@enterprise.io',
    role: 'Principal Systems Engineer',
    department: 'Cloud Platform',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
    passwordHash: 'VercelPass#9',
    createdAt: '2026-08-20',
    lastLogin: '2026-10-10 04:45 PM',
    status: 'active',
  },
  {
    id: 'usr_03',
    name: 'Daniel Hayes',
    email: 'demo@realtime.auth',
    role: 'Product Operations Lead',
    department: 'Access & Governance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    passwordHash: 'Password123',
    createdAt: '2026-10-01',
    lastLogin: '2026-10-11 10:02 AM',
    status: 'active',
  },
];

export const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    timestamp: 'Just now',
    userEmail: 'alex.morgan@company.com',
    userName: 'Alex Morgan',
    eventType: 'login_success',
    ipAddress: '192.168.1.104',
    location: 'Dhaka, Bangladesh',
    device: 'Chrome 129 / Windows 11',
    accuracy: 100,
    status: 'success',
  },
  {
    id: 'log_02',
    timestamp: '18 minutes ago',
    userEmail: 'sarah.dev@enterprise.io',
    userName: 'Sarah Chen',
    eventType: 'login_success',
    ipAddress: '103.205.71.42',
    location: 'Singapore, SG',
    device: 'Edge 128 / macOS Sonoma',
    accuracy: 100,
    status: 'success',
  },
  {
    id: 'log_03',
    timestamp: '2 hours ago',
    userEmail: 'demo@realtime.auth',
    userName: 'Daniel Hayes',
    eventType: 'login_failed',
    ipAddress: '172.56.21.9',
    location: 'Frankfurt, Germany',
    device: 'Firefox 131 / Linux',
    accuracy: 58,
    status: 'danger',
  },
  {
    id: 'log_04',
    timestamp: 'Yesterday',
    userEmail: 'sarah.dev@enterprise.io',
    userName: 'Sarah Chen',
    eventType: 'password_changed',
    ipAddress: '103.205.71.42',
    location: 'Singapore, SG',
    device: 'Edge 128 / macOS Sonoma',
    accuracy: 100,
    status: 'warning',
  },
];

export function getUsers(): User[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export function getAuditLogs(): AuditLog[] {
  if (typeof window === 'undefined') return INITIAL_LOGS;
  try {
    const data = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_LOGS;
  }
}

export function addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  try {
    const logs = getAuditLogs();
    const newLog: AuditLog = {
      ...entry,
      id: `log_${Date.now()}`,
      timestamp: 'Just now',
    };
    const updated = [newLog, ...logs.slice(0, 19)];
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to add audit log', e);
  }
}

export function getCurrentSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setCurrentSession(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } else {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to set session', e);
  }
}
