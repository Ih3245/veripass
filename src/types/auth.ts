export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  passwordHash: string; // Plaintext or hashed for demo comparison
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'pending' | 'suspended';
}

export type CharacterMatchStatus = 'correct' | 'wrong' | 'partial' | 'pending';

export interface CharacterFeedback {
  char: string;
  expectedChar?: string;
  status: CharacterMatchStatus;
  reason?: 'exact' | 'wrong-case' | 'near-key' | 'wrong-position' | 'incorrect';
}

export interface PasswordComparisonResult {
  characters: CharacterFeedback[];
  matchCount: number;
  totalEntered: number;
  expectedLength: number;
  isExactMatch: boolean;
  accuracyPercentage: number;
}

export interface PasswordStrength {
  score: number; // 0 to 100
  level: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Optimal';
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  feedback: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  eventType: 'login_success' | 'login_failed' | 'user_created' | 'password_changed' | 'session_revoked';
  ipAddress: string;
  location: string;
  device: string;
  accuracy: number;
  status: 'success' | 'warning' | 'danger';
}

export interface SystemStats {
  totalUsers: number;
  activeSessions: number;
  averageAuthLatencyMs: number;
  loginSuccessRate: number;
  securityHealthScore: number;
}
