/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  INITIAL_USERS,
  INITIAL_RULES,
  INITIAL_ALERTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';
import {
  UserProfile,
  AlertItem,
  FraudRule,
  AuditLogEntry,
  NavigationTab,
  UserRole,
  RuleCategory,
  AlertType,
  AlertStatus,
  NotificationItem,
  RuleVersion,
  AttachmentFile,
} from './types';
import { HeaderNav } from './components/HeaderNav';
import { LoginModal } from './components/LoginModal';
import { DashboardView } from './components/DashboardView';
import { AlertQueueView } from './components/AlertQueueView';
import { AlertDetailModal } from './components/AlertDetailModal';
import { ReviewQueueView } from './components/ReviewQueueView';
import { RuleManagementView } from './components/RuleManagementView';
import { AuditLogView } from './components/AuditLogView';
import { UserManagementView } from './components/UserManagementView';
import { BRDDocumentView } from './components/BRDDocumentView';
import { ExportReportModal } from './components/ExportReportModal';
import { NcbLogo } from './components/logos/NcbLogo';
import { AtnLogo } from './components/logos/AtnLogo';
import {
  Radio,
} from 'lucide-react';

export default function App() {
  // 1. Core State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USERS[0]); // Defaults to Maker: Nguyễn Văn An
  const [activeTab, setActiveTab] = useState<NavigationTab>('DASHBOARD');
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [rules, setRules] = useState<FraudRule[]>(INITIAL_RULES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals & Navigation state
  const [selectedAlertForDetail, setSelectedAlertForDetail] = useState<AlertItem | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isExportReportModalOpen, setIsExportReportModalOpen] = useState(false);
  const [activeAlertFilters, setActiveAlertFilters] = useState<{
    status?: AlertStatus;
    category?: RuleCategory;
    type?: AlertType;
    ruleCode?: string;
  } | undefined>(undefined);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Global Theme State (Dark / Light Mode)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('ncb_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('ncb_theme', next);
      return next;
    });
  };

  // Helper to show transient toast message
  const showToast = (message: string) => {
    setToastNotification(message);
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // 2. Audit Log Helper (Immutable Append-only)
  const logAuditAction = (
    action: string,
    targetType: 'ALERT' | 'RULE' | 'USER' | 'SYSTEM' | 'REPORT' | 'SESSION',
    targetId: string,
    details: string,
    reason?: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `LOG-${String(auditLogs.length + 1).padStart(4, '0')}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'SYS-001',
      userName: currentUser?.name || 'Hệ thống tự động',
      userRole: currentUser?.role || 'System',
      action,
      targetType,
      targetId,
      details,
      reason,
      clientIp: '10.20.14.88',
      userAgent: navigator.userAgent,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // 3. Maker Decision Workflow (F2.4)
  const handleMakerDecision = (
    alertId: string,
    decision: 'CONFIRM_FRAUD' | 'CLEAR_FRAUD',
    comment: string,
    attachments?: AttachmentFile[]
  ) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return;

    const updatedAlerts = alerts.map((a) => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'PENDING_APPROVAL' as const,
          makerId: currentUser?.id,
          makerName: currentUser?.name,
          makerDecision: decision,
          makerComment: comment,
          makerAttachments: attachments || [],
          makerDecidedAt: new Date().toISOString(),
        };
      }
      return a;
    });

    setAlerts(updatedAlerts);

    // Audit Log
    const attachNote = attachments && attachments.length > 0 ? ` [Kèm ${attachments.length} tệp đính kèm ngoại luồng]` : '';
    logAuditAction(
      decision === 'CONFIRM_FRAUD' ? 'MAKER_SUBMIT_CONFIRM' : 'MAKER_SUBMIT_CLEAR',
      'ALERT',
      alertId,
      `Maker ${currentUser?.name} gửi đề xuất ${
        decision === 'CONFIRM_FRAUD' ? 'XÁC NHẬN GIAN LẬN' : 'CẢNH BÁO GIẢ'
      } cho giao dịch ${alert.txnId}. Trạng thái chuyển thành PENDING_APPROVAL.${attachNote}`,
      comment
    );

    setSelectedAlertForDetail(null);
    showToast(
      `Hồ sơ ${alertId} đã chuyển sang Hàng đợi Duyệt (PENDING_APPROVAL). Chờ Checker phê duyệt.`
    );
  };

  // 4. Checker Approve Workflow (F4.2)
  const handleCheckerApprove = (alertId: string, comment: string, attachments?: AttachmentFile[]) => {
    const targetAlert = alerts.find((a) => a.id === alertId);
    if (!targetAlert) return;

    // Four-Eyes Principle check
    if (targetAlert.makerId && currentUser?.id && targetAlert.makerId === currentUser.id) {
      showToast('Vi phạm nguyên tắc Four-Eyes: Bạn không thể tự phê duyệt hồ sơ do chính mình tạo!');
      return;
    }

    const finalStatus: AlertStatus =
      targetAlert.makerDecision === 'CONFIRM_FRAUD' ? 'CONFIRMED_FRAUD' : 'FALSE_POSITIVE';

    const updatedAlerts = alerts.map((a) => {
      if (a.id === alertId) {
        return {
          ...a,
          status: finalStatus,
          checkerId: currentUser?.id,
          checkerName: currentUser?.name,
          checkerDecision: 'APPROVED' as const,
          checkerComment: comment,
          checkerAttachments: attachments || [],
          checkerDecidedAt: new Date().toISOString(),
        };
      }
      return a;
    });

    setAlerts(updatedAlerts);

    const attachNote = attachments && attachments.length > 0 ? ` [Kèm ${attachments.length} tệp KSV đính kèm]` : '';
    logAuditAction(
      'CHECKER_APPROVE',
      'ALERT',
      alertId,
      `Checker ${currentUser?.name} PHÊ DUYỆT hồ sơ ${alertId}. Trạng thái hoàn tất: ${finalStatus}.${attachNote}`,
      comment
    );

    showToast(
      `Đã phê duyệt thành công hồ sơ ${alertId}. Trạng thái kết luận: ${finalStatus}.`
    );
  };

  // 5. Checker Reject Workflow (F4.2)
  const handleCheckerReject = (alertId: string, comment: string, attachments?: AttachmentFile[]) => {
    const targetAlert = alerts.find((a) => a.id === alertId);
    if (!targetAlert) return;

    const updatedAlerts = alerts.map((a) => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'IN_REVIEW' as AlertStatus,
          checkerId: currentUser?.id,
          checkerName: currentUser?.name,
          checkerDecision: 'REJECTED' as const,
          checkerComment: comment,
          checkerAttachments: attachments || [],
          checkerDecidedAt: new Date().toISOString(),
        };
      }
      return a;
    });

    setAlerts(updatedAlerts);

    const attachNote = attachments && attachments.length > 0 ? ` [Kèm ${attachments.length} tệp đính kèm]` : '';
    logAuditAction(
      'CHECKER_REJECT',
      'ALERT',
      alertId,
      `Checker ${currentUser?.name} TỪ CHỐI đề xuất của Maker cho hồ sơ ${alertId}. Trả lại trạng thái IN_REVIEW để điều tra bổ sung.${attachNote}`,
      comment
    );

    showToast(
      `Đã từ chối đề xuất hồ sơ ${alertId}. Hồ sơ được trả về trạng thái IN_REVIEW.`
    );
  };

  // 6. Rule Toggle Status (F3.2)
  const handleToggleRuleStatus = (ruleId: string) => {
    const targetRule = rules.find((r) => r.id === ruleId);
    if (!targetRule) return;

    const newStatus = targetRule.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, status: newStatus } : r))
    );

    logAuditAction(
      'RULE_STATUS_TOGGLED',
      'RULE',
      targetRule.code,
      `Chuyển trạng thái kịch bản ${targetRule.code} (${targetRule.name}) từ ${targetRule.status} sang ${newStatus}.`
    );

    showToast(
      `Kịch bản ${targetRule.code} đã chuyển sang trạng thái ${newStatus}.`
    );
  };

  // 7. Rule Threshold Update (F3.3 & F3.4)
  const handleUpdateThreshold = (
    ruleId: string,
    newThresholds: Record<string, number>,
    changeSummary: string
  ) => {
    const targetRule = rules.find((r) => r.id === ruleId);
    if (!targetRule) return;

    const newVersion = targetRule.version + 1;
    const versionRecord: RuleVersion = {
      version: newVersion,
      updatedAt: new Date().toISOString(),
      updatedBy: `${currentUser?.name} (${currentUser?.role})`,
      changeSummary,
      previousThresholds: { ...targetRule.thresholds },
      newThresholds: { ...newThresholds },
    };

    setRules((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          return {
            ...r,
            thresholds: { ...newThresholds },
            version: newVersion,
            versions: [versionRecord, ...r.versions],
          };
        }
        return r;
      })
    );

    logAuditAction(
      'RULE_THRESHOLD_UPDATED',
      'RULE',
      targetRule.code,
      `Cập nhật tham số ngưỡng kịch bản ${targetRule.code} lên phiên bản v${newVersion}.`,
      changeSummary
    );

    showToast(
      `Đã cập nhật ngưỡng cho ${targetRule.code} (v${newVersion}) và lưu vết phiên bản thành công!`
    );
  };

  // 8. User Management Handlers (Admin)
  const handleAddUser = (userCandidate: Omit<UserProfile, 'id' | 'entraId'>) => {
    const newId = `USR-${String(users.length + 1).padStart(3, '0')}`;
    const newUser: UserProfile = {
      ...userCandidate,
      id: newId,
      entraId: `aad-${Math.random().toString(36).substring(2, 10)}`,
    };
    setUsers((prev) => [...prev, newUser]);
    logAuditAction(
      'USER_CREATED',
      'USER',
      newId,
      `Tạo mới người dùng ${newUser.name} (${newUser.email}) với vai trò ${newUser.role}.`
    );
    showToast(`Đã tạo tài khoản ${newUser.name} thành công.`);
  };

  const handleToggleUserStatus = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;
    const newStatus = targetUser.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    logAuditAction(
      newStatus === 'DISABLED' ? 'USER_DISABLED' : 'USER_ENABLED',
      'USER',
      userId,
      `${newStatus === 'DISABLED' ? 'Khóa' : 'Mở khóa'} tài khoản người dùng ${targetUser.name}.`
    );
    showToast(
      `Tài khoản ${targetUser.name} đã chuyển sang trạng thái ${newStatus}.`
    );
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    logAuditAction(
      'USER_ROLE_UPDATED',
      'USER',
      userId,
      `Thay đổi vai trò của người dùng ${targetUser.name} từ ${targetUser.role} sang ${newRole}.`
    );
    showToast(`Đã cập nhật vai trò của ${targetUser.name} thành ${newRole}.`);
  };

  // 9. Simulate Live Fraud Event (Real-time stimulation)
  const handleSimulateLiveAlert = () => {
    const newTxnNumber = String(alerts.length + 1).padStart(3, '0');
    const newId = `ALT-2026-99${newTxnNumber}`;
    const newAlert: AlertItem = {
      id: newId,
      txnId: `TXN-SIM-${newTxnNumber}`,
      timestamp: new Date().toISOString(),
      amount: 495000000,
      currency: 'VND',
      customerName: 'Hoàng Văn Bách (Giả lập realtime)',
      cif: '1099238',
      accountOrCard: '9704198822339901',
      accountType: 'ACCOUNT',
      customerType: 'INDIVIDUAL',
      type: 'TRANSACTION',
      riskScore: 98,
      riskLevel: 'CRITICAL',
      status: 'NEW',
      violatedRules: ['R06', 'R12', 'R21'],
      violatedRuleDetails: [
        {
          ruleCode: 'R06',
          ruleName: 'Giao dịch đơn lẻ vượt ngưỡng đặc biệt lớn',
          category: 'VOLUME',
          triggerReason: 'Chuyển tiền 495,000,000 VND vượt ngưỡng giám sát đặc biệt 300,000,000 VND',
        },
        {
          ruleCode: 'R12',
          ruleName: 'Đăng nhập từ IP/Vị trí địa lý bất thường',
          category: 'GEO_DEVICE',
          triggerReason: 'Giao dịch phát sinh từ IP Tor Exit Node đặt tại Amsterdam, Hà Lan',
        },
        {
          ruleCode: 'R21',
          ruleName: 'Tài khoản thụ hưởng trong Blacklist lừa đảo',
          category: 'TECHNICAL',
          triggerReason: 'Tài khoản nhận tiền trùng khớp danh sách đen của Cục An ninh mạng Bộ Công An',
        },
      ],
      payload: {
        txnId: `TXN-SIM-${newTxnNumber}`,
        channel: 'NCB_IZIMOBILE',
        amount: 495000000,
        currency: 'VND',
        timestamp: new Date().toISOString(),
        senderCif: '1099238',
        senderName: 'Hoàng Văn Bách (Giả lập realtime)',
        senderAccount: '9704198822339901',
        customerType: 'INDIVIDUAL',
        clientIp: '185.220.101.5',
        ipCountry: 'Netherlands (Tor Exit)',
        deviceId: 'dev_fingerprint_simulated_991',
        deviceName: 'Xiaomi 13 Pro (Rooted)',
        isVpnOrTor: true,
        receiverAccount: '19038844992211',
        receiverName: 'CTY TNHH DAU TU QUOC TE SIM',
        receiverBank: 'Techcombank',
        mcc: '6051',
        mccDescription: 'Tài sản số & Tiền mã hóa',
      },
    };

    setAlerts((prev) => [newAlert, ...prev]);

    // Create live notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: `Phát hiện giao dịch rủi ro nghiêm trọng (CRITICAL: 98/100)`,
      message: `Tài khoản 9704...9901 chuyển 495,000,000 VND vi phạm R06, R12, R21.`,
      level: 'CRITICAL',
      read: false,
      linkAlertId: newId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    logAuditAction(
      'ALERT_TRIGGERED',
      'ALERT',
      newId,
      `Hệ thống Realtime phát hiện giao dịch rủi ro cao 495,000,000 VND từ IP Tor vi phạm R06, R12, R21.`
    );
    showToast(`🚨 PHÁT HIỆN CẢNH BÁO MỚI: ${newId} (495 Tr VND - CRITICAL 98/100)!`);
  };

  // Switch role convenience selector for easy testing
  const switchRole = (role: UserRole) => {
    const userForRole = users.find((u) => u.role === role) || users[0];
    setCurrentUser(userForRole);
    logAuditAction(
      'USER_LOGIN',
      'SESSION',
      userForRole.id,
      `Người dùng ${userForRole.name} đăng nhập phiên làm việc vai trò ${role}.`
    );
    if (role !== 'Admin' && (activeTab === 'RULES' || activeTab === 'USERS')) {
      setActiveTab('DASHBOARD');
      showToast(`Đã chuyển về Tổng quan do vai trò ${role} không có quyền truy cập tab quản trị.`);
    } else {
      showToast(`Đã chuyển phiên làm việc sang vai trò: ${role} (${userForRole.name})`);
    }
  };

  // False positive list for retention compliance tab
  const falsePositiveAlerts = useMemo(
    () => alerts.filter((a) => a.status === 'FALSE_POSITIVE'),
    [alerts]
  );

  return (
    <div
      className={`min-h-screen font-sans flex flex-col antialiased transition-colors duration-200 ${
        theme === 'light' ? 'bg-slate-100/70 text-slate-900' : 'dark bg-slate-950 text-slate-100'
      }`}
    >
      {/* Toast popup */}
      {toastNotification && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-top-3 duration-200">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs font-semibold">{toastNotification}</span>
        </div>
      )}

      {/* Enterprise Simulation & Quality Assurance Sandbox Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[11px]">Môi trường Kiểm thử Nghiệp vụ (NCB Sandbox):</span>
          </div>
          <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-0.5">
            {(['Maker', 'Checker', 'Admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`px-2.5 py-0.5 text-[11px] font-medium rounded-md transition ${
                  currentUser?.role === r
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'Maker' && 'Maker (Chuyên viên)'}
                {r === 'Checker' && 'Checker (Kiểm soát)'}
                {r === 'Admin' && 'Admin (Quản trị)'}
              </button>
            ))}
          </div>
        </div>

        {/* Live Simulator Trigger Button */}
        <button
          onClick={handleSimulateLiveAlert}
          className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-medium flex items-center gap-1.5 shadow-sm transition"
          title="Mô phỏng phát sinh giao dịch bất thường để kiểm thử hệ thống cảnh báo tức thì"
        >
          <Radio className="w-3.5 h-3.5 text-rose-400" />
          <span>Mô phỏng Giao dịch Rủi ro (Realtime Event)</span>
        </button>
      </div>

      {/* Primary Header Navigation Component with Required Markdown Header Style */}
      <HeaderNav
        currentUser={currentUser}
        currentTab={activeTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSelectTab={(tab) => {
          if (tab === 'RULES' && currentUser?.role !== 'Admin') {
            showToast('Quyền truy cập hạn chế: Phân hệ Cấu hình Kịch bản chỉ dành cho vai trò Admin.');
            return;
          }
          if (tab === 'USERS' && currentUser?.role !== 'Admin') {
            showToast('Quyền truy cập hạn chế: Quản lý người dùng chỉ dành cho Admin.');
            return;
          }
          setActiveTab(tab);
          if (tab !== 'ALERTS') setActiveAlertFilters(undefined);
        }}
        onSwitchRole={switchRole}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={() => {
          logAuditAction('USER_LOGOUT', 'SESSION', currentUser?.id || '', 'Người dùng đăng xuất.');
          setCurrentUser(null);
          setIsLoginModalOpen(true);
        }}
        onExportReport={() => setIsExportReportModalOpen(true)}
        pendingReviewCount={alerts.filter((a) => a.status === 'PENDING_APPROVAL').length}
        newAlertCount={alerts.filter((a) => a.status === 'NEW').length}
        notifications={notifications}
        onMarkNotificationAsRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        onSelectAlertFromNotif={(alertId) => {
          const target = alerts.find((a) => a.id === alertId);
          if (target) {
            setSelectedAlertForDetail(target);
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'DASHBOARD' && (
          <DashboardView
            alerts={alerts}
            rules={rules}
            currentUser={currentUser}
            theme={theme}
            onOpenAlertDetail={(alert) => setSelectedAlertForDetail(alert)}
            onNavigateToAlertsWithFilter={(filters) => {
              setActiveTab('ALERTS');
              setActiveAlertFilters(filters);
            }}
            onOpenExportModal={() => setIsExportReportModalOpen(true)}
            onOpenBRD={() => setActiveTab('BRD')}
          />
        )}

        {activeTab === 'ALERTS' && (
          <AlertQueueView
            alerts={alerts}
            theme={theme}
            onOpenDetail={(alert) => setSelectedAlertForDetail(alert)}
            initialFilters={activeAlertFilters}
          />
        )}

        {activeTab === 'REVIEW' && (
          <ReviewQueueView
            currentUser={currentUser}
            alerts={alerts}
            onApprove={handleCheckerApprove}
            onReject={handleCheckerReject}
            onOpenDetail={(alert) => setSelectedAlertForDetail(alert)}
            onSwitchToChecker={() => switchRole('Checker')}
          />
        )}

        {activeTab === 'RULES' && (
          <RuleManagementView
            rules={rules}
            currentUser={currentUser}
            theme={theme}
            onToggleRuleStatus={handleToggleRuleStatus}
            onUpdateThreshold={handleUpdateThreshold}
          />
        )}

        {activeTab === 'AUDIT' && (
          <AuditLogView
            logs={auditLogs}
            falsePositiveAlerts={falsePositiveAlerts}
            onOpenAlertDetail={(alert) => {
              setSelectedAlertForDetail(alert);
            }}
          />
        )}

        {activeTab === 'USERS' && (
          <UserManagementView
            users={users}
            onAddUser={handleAddUser}
            onToggleUserStatus={handleToggleUserStatus}
            onUpdateUserRole={handleUpdateUserRole}
          />
        )}

        {activeTab === 'BRD' && (
          <BRDDocumentView theme={theme} />
        )}
      </main>

      {/* Modals */}
      {/* 1. Alert Detail & Decision Modal (F2.3 & F2.4) */}
      <AlertDetailModal
        alert={selectedAlertForDetail}
        onClose={() => setSelectedAlertForDetail(null)}
        currentUser={currentUser}
        theme={theme}
        onMakerDecision={handleMakerDecision}
        onNavigateToReviewQueue={() => {
          setActiveTab('REVIEW');
        }}
      />

      {/* 2. Login Modal (SSO Simulation) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        users={users}
        onSelectRole={(role) => switchRole(role)}
        onSelectUser={(user) => {
          setCurrentUser(user);
          setIsLoginModalOpen(false);
          logAuditAction(
            'USER_LOGIN',
            'SESSION',
            user.id,
            `Đăng nhập thành công qua Entra ID SSO: ${user.name} (${user.role}).`
          );
          showToast(`Đăng nhập thành công với vai trò: ${user.role} (${user.name})`);
        }}
      />

      {/* 3. Export Report Modal (F1.4) */}
      <ExportReportModal
        isOpen={isExportReportModalOpen}
        onClose={() => setIsExportReportModalOpen(false)}
        alerts={alerts}
        rules={rules}
      />

      {/* Enterprise Co-Branded Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 text-xs text-slate-500 mt-16 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 flex-wrap">
            <NcbLogo variant="standard" theme="light" height={32} />
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <AtnLogo theme="light" height={22} showTagline={true} />
            <span className="text-[11px] text-slate-500 hidden lg:inline">
              | Bản quyền © 2026 Ngân hàng TMCP Quốc Dân (NCB) & Công ty CP Công nghệ ATN
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-[11px] text-slate-400">
            <span>Tiêu chuẩn PCI-DSS Level 1 & ISO 27001</span>
            <span className="hidden sm:inline">•</span>
            <span>Tuân thủ Quyết định 2345/QĐ-NHNN</span>
            <span className="hidden sm:inline">•</span>
            <span>Hội sở: 28 Lê Thái Tổ, Hoàn Kiếm, Hà Nội</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
