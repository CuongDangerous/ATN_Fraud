/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Maker' | 'Checker' | 'Admin';

export type NavigationTab =
  | 'DASHBOARD'
  | 'ALERTS'
  | 'REVIEW'
  | 'RULES'
  | 'AUDIT'
  | 'USERS'
  | 'BRD';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  branch: string;
  avatar?: string;
  status: 'ACTIVE' | 'DISABLED';
  entraId: string;
}

export type AlertStatus =
  | 'NEW'
  | 'IN_REVIEW'
  | 'PENDING_APPROVAL'
  | 'CONFIRMED_FRAUD'
  | 'FALSE_POSITIVE';

export type AlertType = 'TRANSACTION' | 'ACCOUNT' | 'COLLATERAL_CARD';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RuleCategory =
  | 'VELOCITY'
  | 'VOLUME'
  | 'GEO_DEVICE'
  | 'COUNTERPARTY'
  | 'TECHNICAL';

export interface RuleThresholdParam {
  key: string;
  label: string;
  value: number;
  unit: string;
  step?: number;
  min?: number;
}

export interface RuleVersion {
  version: number;
  updatedAt: string;
  updatedBy: string;
  changeSummary: string;
  previousThresholds: Record<string, number>;
  newThresholds: Record<string, number>;
}

export interface FraudRule {
  id: string;
  code: string; // e.g. R01
  category: RuleCategory;
  categoryName: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'PAUSED';
  thresholds: Record<string, number>;
  thresholdParams: RuleThresholdParam[];
  riskWeight: number; // 1-100
  triggerCount: number;
  version: number;
  lastUpdated: string;
  versions: RuleVersion[];
}

export interface TransactionPayload {
  txnId: string;
  channel: 'NCB_IZIMOBILE' | 'IZIBANKBIZ' | 'ATM' | 'POS' | 'ECOM_GATEWAY';
  amount: number;
  currency: string;
  timestamp: string;
  senderCif: string;
  senderName: string;
  senderAccount: string;
  senderCardNumber?: string;
  receiverCif?: string;
  receiverName: string;
  receiverAccount: string;
  receiverBank: string;
  clientIp: string;
  ipCountry: string;
  isVpnOrTor: boolean;
  deviceId: string;
  deviceName: string;
  geoDistanceKm?: number;
  timeDiffMinutes?: number;
  mcc?: string;
  mccDescription?: string;
  cardEntryMode?: string; // 80: Fallback, 05: Chip, 07: Contactless
  failedPinCount?: number;
  errCode?: string;
  merchantName?: string;
  customerType: 'INDIVIDUAL' | 'CORPORATE';
  accountAgeDays?: number;
  previousAvgDailyVolume?: number;
  currentDayVolume?: number;
  balanceBeforeTxn?: number;
  balanceAfterTxn?: number;
}

export interface AttachmentFile {
  id: string;
  name: string;
  size: number; // in bytes
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  dataUrl?: string;
}

export interface AlertItem {
  id: string; // e.g. ALR-2026-001
  txnId: string;
  type: AlertType;
  timestamp: string;
  amount: number;
  currency: string;
  customerName: string;
  cif: string;
  accountOrCard: string;
  accountType: 'ACCOUNT' | 'CARD';
  customerType: 'INDIVIDUAL' | 'CORPORATE';
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  violatedRules: string[]; // ['R01', 'R06']
  violatedRuleDetails: {
    ruleCode: string;
    ruleName: string;
    category: RuleCategory;
    triggerReason: string;
  }[];
  status: AlertStatus;
  assignedTo?: string;
  // Maker decision workflow
  makerId?: string;
  makerName?: string;
  makerDecision?: 'CONFIRM_FRAUD' | 'CLEAR_FRAUD';
  makerComment?: string;
  makerAttachments?: AttachmentFile[];
  makerDecidedAt?: string;
  // Checker review workflow
  checkerId?: string;
  checkerName?: string;
  checkerDecision?: 'APPROVED' | 'REJECTED';
  checkerComment?: string;
  checkerAttachments?: AttachmentFile[];
  checkerDecidedAt?: string;
  // Payload detail
  payload: TransactionPayload;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole | 'System';
  action: string;
  targetType: 'ALERT' | 'RULE' | 'USER' | 'SYSTEM' | 'REPORT' | 'SESSION';
  targetId: string;
  details: string;
  reason?: string;
  clientIp: string;
  status?: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  userAgent?: string;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  level: 'CRITICAL' | 'WARNING' | 'INFO';
  read: boolean;
  linkAlertId?: string;
}
