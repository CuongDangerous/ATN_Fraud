/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  CheckCircle,
  Clock,
  ArrowRight,
  PieChart,
  BarChart3,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  ShieldCheck,
  ListTodo,
  BellRing,
  Zap,
  Flame,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react';
import { AlertItem, FraudRule, RuleCategory, AlertStatus, AlertType, UserProfile } from '../types';
import { formatVND, formatShortVND, formatDateTime } from '../utils/masking';

interface DashboardViewProps {
  alerts: AlertItem[];
  rules: FraudRule[];
  currentUser?: UserProfile | null;
  onOpenAlertDetail?: (alert: AlertItem) => void;
  onNavigateToAlertsWithFilter: (filters: {
    status?: AlertStatus;
    category?: RuleCategory;
    type?: AlertType;
    ruleCode?: string;
  }) => void;
  onOpenExportModal: () => void;
  onOpenBRD?: () => void;
  theme?: 'light' | 'dark';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  alerts,
  rules,
  currentUser,
  onOpenAlertDetail,
  onNavigateToAlertsWithFilter,
  onOpenExportModal,
  onOpenBRD,
  theme = 'light',
}) => {
  const isLight = theme === 'light';

  // 1. Calculation for 3 Global Metrics (F1.1)
  const totalAlerts = alerts.length;
  const confirmedFraudCount = alerts.filter((a) => a.status === 'CONFIRMED_FRAUD').length;
  const falsePositiveCount = alerts.filter((a) => a.status === 'FALSE_POSITIVE').length;

  const newAlertsCount = alerts.filter((a) => a.status === 'NEW').length;
  const inReviewCount = alerts.filter((a) => a.status === 'IN_REVIEW').length;
  const pendingApprovalCount = alerts.filter((a) => a.status === 'PENDING_APPROVAL').length;

  const totalValueAtRisk = alerts.reduce((acc, curr) => acc + curr.amount, 0);
  const totalFraudValueConfirmed = alerts
    .filter((a) => a.status === 'CONFIRMED_FRAUD')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Group by Alert Type
  const countByType: Record<AlertType, number> = {
    TRANSACTION: alerts.filter((a) => a.type === 'TRANSACTION').length,
    ACCOUNT: alerts.filter((a) => a.type === 'ACCOUNT').length,
    COLLATERAL_CARD: alerts.filter((a) => a.type === 'COLLATERAL_CARD').length,
  };

  // Group by 5 Scenario Groups (F1.2)
  const categoryCount: Record<RuleCategory, number> = {
    VELOCITY: 0,
    VOLUME: 0,
    GEO_DEVICE: 0,
    COUNTERPARTY: 0,
    TECHNICAL: 0,
  };

  alerts.forEach((alert) => {
    alert.violatedRuleDetails.forEach((v) => {
      if (categoryCount[v.category] !== undefined) {
        categoryCount[v.category]++;
      }
    });
  });

  const categoryLabels: Record<RuleCategory, { label: string; color: string; desc: string }> = {
    VELOCITY: { label: 'Vận tốc & Tần suất', color: 'bg-amber-500', desc: 'R01 - R05' },
    VOLUME: { label: 'Giá trị & Hạn mức', color: 'bg-rose-500', desc: 'R06 - R10' },
    GEO_DEVICE: { label: 'Không gian & Thiết bị', color: 'bg-indigo-500', desc: 'R11 - R15' },
    COUNTERPARTY: { label: 'Đối tác & Kênh', color: 'bg-emerald-500', desc: 'R16 - R20' },
    TECHNICAL: { label: 'Kỹ thuật & Blacklist', color: 'bg-purple-500', desc: 'R21 - R25' },
  };

  // Top 3-5 Violated Rules
  const ruleCounts: Record<string, { count: number; name: string; category: RuleCategory }> = {};
  alerts.forEach((a) => {
    a.violatedRuleDetails.forEach((r) => {
      if (!ruleCounts[r.ruleCode]) {
        ruleCounts[r.ruleCode] = { count: 0, name: r.ruleName, category: r.category };
      }
      ruleCounts[r.ruleCode].count++;
    });
  });

  const sortedTopRules = Object.entries(ruleCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  const maxRuleCount = Math.max(1, ...sortedTopRules.map(([_, v]) => v.count));

  // USER REQUEST 2: Calculations for Maker/Checker Task Reminder Workbench
  const isMaker = currentUser?.role === 'Maker';
  const isChecker = currentUser?.role === 'Checker';

  // Alerts needing action:
  // For Checker: PENDING_APPROVAL alerts
  // For Maker & others: NEW or IN_REVIEW alerts
  const todoAlerts = alerts
    .filter((a) => {
      if (isChecker) return a.status === 'PENDING_APPROVAL';
      return a.status === 'NEW' || a.status === 'IN_REVIEW';
    })
    .sort((a, b) => {
      const priorityWeight: Record<string, number> = {
        CRITICAL: 4,
        HIGH: 3,
        MEDIUM: 2,
        LOW: 1,
      };
      const diff = (priorityWeight[b.riskLevel] || 0) - (priorityWeight[a.riskLevel] || 0);
      if (diff !== 0) return diff;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const urgentTodoCount = todoAlerts.filter(
    (a) => a.riskLevel === 'CRITICAL' || a.riskLevel === 'HIGH'
  ).length;

  const nextPriorityAlert = todoAlerts[0] || null;

  return (
    <div className="space-y-6">
      {/* USER REQUEST 2: TRANG NHẮC VIỆC & BÀN LÀM VIỆC TÁC NGHIỆP CỦA MAKER / CHECKER */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border transition ${
          isLight
            ? 'bg-gradient-to-r from-blue-50/80 via-white to-slate-50 border-blue-200/80 shadow-xs text-slate-800'
            : 'bg-slate-900 border-slate-800 shadow-md text-white'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-[#004B87] text-[11px] font-extrabold mb-2 border border-blue-200">
              <ListTodo className="w-3.5 h-3.5" />
              <span>
                TRANG NHẮC VIỆC • BÀN LÀM VIỆC TÁC NGHIỆP ({currentUser?.role?.toUpperCase() || 'MAKER'})
              </span>
            </div>
            <h1
              className={`text-xl sm:text-2xl font-black tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Xin chào, {currentUser?.name || 'Cán bộ'}! Bạn có{' '}
              <span className="text-[#004B87] underline decoration-blue-300">
                {todoAlerts.length} cảnh báo cần xử lý
              </span>
            </h1>
            <p className={`text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {isChecker ? (
                <>
                  Có <strong>{pendingApprovalCount} hồ sơ PENDING_APPROVAL</strong> do Maker đề xuất đang chờ bạn phê duyệt. Vui lòng thẩm định theo quy trình Four-Eyes.
                </>
              ) : (
                <>
                  Hệ thống ghi nhận <strong>{newAlertsCount} cảnh báo MỚI chưa tiếp nhận</strong> và{' '}
                  <strong>{urgentTodoCount} hồ sơ mức độ Khẩn cấp (CRITICAL/HIGH)</strong> cần ưu tiên thẩm định & lập đề xuất trước.
                </>
              )}
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {nextPriorityAlert && onOpenAlertDetail && (
              <button
                id="btn-process-next-priority"
                onClick={() => onOpenAlertDetail(nextPriorityAlert)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition animate-pulse hover:animate-none"
                title={`Xử lý hồ sơ ưu tiên cao nhất: ${nextPriorityAlert.id}`}
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>[⚡ Xử lý ngay Hồ sơ Ưu tiên Tiếp theo]</span>
              </button>
            )}

            <button
              id="btn-export-report"
              onClick={onOpenExportModal}
              className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-2xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>[Xuất báo cáo PDF/Excel]</span>
            </button>

            {onOpenBRD && (
              <button
                id="btn-open-brd-dashboard"
                onClick={onOpenBRD}
                className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 text-[#004B87] border-blue-300 shadow-2xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-blue-300 border-blue-900/80'
                }`}
                title="Xem và tải văn kiện BRD chốt phạm vi tính năng"
              >
                <FileText className="w-4 h-4 text-[#004B87] dark:text-blue-400" />
                <span>[Văn kiện BRD / Tải Word]</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Thẻ Nhắc việc Hành động (Action Reminder Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5">
          {/* Card 1: Cảnh báo MỚI */}
          <div
            onClick={() => onNavigateToAlertsWithFilter({ status: 'NEW' })}
            className={`p-3.5 rounded-xl border cursor-pointer transition group ${
              isLight
                ? 'bg-white hover:border-amber-400 border-slate-200 shadow-2xs'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Mới Chưa Tiếp Nhận</span>
              <span className="p-1 rounded-md bg-amber-100 text-amber-700">
                <BellRing className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-2xl font-black font-mono text-amber-600">
                {newAlertsCount}
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-blue-600 flex items-center">
                Xem ngay →
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Chưa có ai xử lý</p>
          </div>

          {/* Card 2: Khẩn cấp CRITICAL/HIGH */}
          <div
            onClick={() => onNavigateToAlertsWithFilter({})}
            className={`p-3.5 rounded-xl border cursor-pointer transition group ${
              isLight
                ? 'bg-white hover:border-rose-400 border-slate-200 shadow-2xs'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Cấp bách (CRITICAL/HIGH)</span>
              <span className="p-1 rounded-md bg-rose-100 text-rose-700">
                <Flame className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-2xl font-black font-mono text-rose-600">
                {urgentTodoCount}
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-rose-600 flex items-center">
                Ưu tiên số 1 →
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Nguy cơ tổn thất cao</p>
          </div>

          {/* Card 3: Đang điều tra IN_REVIEW */}
          <div
            onClick={() => onNavigateToAlertsWithFilter({ status: 'IN_REVIEW' })}
            className={`p-3.5 rounded-xl border cursor-pointer transition group ${
              isLight
                ? 'bg-white hover:border-blue-400 border-slate-200 shadow-2xs'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Đang Điều Tra Dở Dang</span>
              <span className="p-1 rounded-md bg-blue-100 text-blue-700">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-2xl font-black font-mono text-blue-600">
                {inReviewCount}
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-blue-600 flex items-center">
                Hoàn tất →
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Đang chờ giải trình</p>
          </div>

          {/* Card 4: Chờ Checker duyệt */}
          <div
            onClick={() => onNavigateToAlertsWithFilter({ status: 'PENDING_APPROVAL' })}
            className={`p-3.5 rounded-xl border cursor-pointer transition group ${
              isLight
                ? 'bg-white hover:border-purple-400 border-slate-200 shadow-2xs'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Chờ Checker Duyệt</span>
              <span className="p-1 rounded-md bg-purple-100 text-purple-700">
                <UserCheck className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-2xl font-black font-mono text-purple-600">
                {pendingApprovalCount}
              </span>
              <span className="text-[10px] text-slate-400 group-hover:text-purple-600 flex items-center">
                Theo dõi →
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Maker đã trình KSV</p>
          </div>
        </div>

        {/* Bảng Danh sách Công việc Cần Làm Ngay (Priority Action To-Do List) */}
        <div className="mt-6 pt-5 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-[#004B87]" />
              <span>
                Danh sách Việc Cần Làm Ngay Hôm Nay ({todoAlerts.length} hồ sơ tồn đọng)
              </span>
            </h2>
            <button
              onClick={() => onNavigateToAlertsWithFilter({})}
              className="text-xs text-[#004B87] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Mở Toàn bộ Hàng đợi Cảnh báo →</span>
            </button>
          </div>

          {todoAlerts.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <p className="font-bold text-sm">Tuyệt vời! Bạn không còn hồ sơ nào tồn đọng cần xử lý.</p>
              <p className="text-xs text-emerald-700 mt-0.5">Tất cả cảnh báo đã được thẩm định hoặc chuyển phê duyệt.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Mức độ</th>
                    <th className="py-2.5 px-3">Mã Alert / TXN</th>
                    <th className="py-2.5 px-3">Khách hàng</th>
                    <th className="py-2.5 px-3">Số tiền (VND)</th>
                    <th className="py-2.5 px-3">Kịch bản vi phạm chính</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                    <th className="py-2.5 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {todoAlerts.slice(0, 5).map((a) => (
                    <tr key={a.id} className="hover:bg-blue-50/40 transition">
                      {/* Priority */}
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            a.riskLevel === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : a.riskLevel === 'HIGH'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          {a.riskLevel}
                        </span>
                      </td>

                      {/* IDs */}
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-slate-900 block">{a.id}</span>
                        <span className="font-mono text-[10px] text-slate-400">{a.txnId}</span>
                      </td>

                      {/* Customer */}
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-slate-900 block">{a.customerName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">CIF: {a.cif}</span>
                      </td>

                      {/* Amount */}
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {formatVND(a.amount)}
                      </td>

                      {/* Violated Rules */}
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[10px] mr-1.5">
                          {a.violatedRules[0] || 'R01'}
                        </span>
                        <span className="text-slate-700 truncate inline-block max-w-[200px] align-middle" title={a.violatedRuleDetails[0]?.ruleName}>
                          {a.violatedRuleDetails[0]?.ruleName || 'Giao dịch bất thường'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            a.status === 'NEW'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : a.status === 'IN_REVIEW'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : 'bg-purple-100 text-purple-900 border border-purple-300'
                          }`}
                        >
                          {a.status === 'NEW' ? 'MỚI' : a.status === 'IN_REVIEW' ? 'ĐANG ĐIỀU TRA' : 'CHỜ DUYỆT'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 text-right">
                        {onOpenAlertDetail && (
                          <button
                            onClick={() => onOpenAlertDetail(a)}
                            className="px-2.5 py-1 bg-[#004B87] hover:bg-[#003B6B] text-white rounded-lg text-[11px] font-bold shadow-2xs transition inline-flex items-center gap-1"
                          >
                            <span>Xử lý ngay</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* REQUIREMENT 1: Global Metrics View (Chỉ số trọng yếu F1.1) in Bright/Light Colors */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border transition ${
          isLight
            ? 'bg-white border-slate-200 shadow-xs text-slate-800'
            : 'bg-slate-900 border-slate-800 shadow-lg text-white'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-lg ${
                isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/40 text-blue-400'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? 'text-[#004B87]' : 'text-blue-400'
              }`}
            >
              Chỉ số trọng yếu F1.1 (Global Metrics View)
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Thời gian thực
            </span>
          </div>
          <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Dữ liệu chu kỳ hiện tại (So sánh với chu kỳ 7 ngày trước)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Total Alerts */}
          <div
            id="card-metric-total-alerts"
            onClick={() => onNavigateToAlertsWithFilter({})}
            className={`p-4 rounded-xl border cursor-pointer transition group ${
              isLight
                ? 'bg-gradient-to-b from-blue-50/50 via-white to-white hover:border-blue-300 border-blue-100 shadow-2xs hover:shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Tổng Cảnh báo (Total Alerts)
              </span>
              <span
                className={`p-1.5 rounded-lg ${
                  isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span
                className={`text-3xl font-extrabold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {totalAlerts}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.5% so với kỳ trước</span>
              </span>
            </div>
            <p className={`mt-2 text-[11px] flex items-center justify-between ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Định giá rủi ro: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{formatShortVND(totalValueAtRisk)}</strong></span>
              <span className={`group-hover:translate-x-0.5 transition flex items-center gap-0.5 font-medium ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>
                Khoanh vùng <ArrowRight className="w-3 h-3" />
              </span>
            </p>
          </div>

          {/* Card 2: Confirmed Fraud */}
          <div
            id="card-metric-confirmed-fraud"
            onClick={() => onNavigateToAlertsWithFilter({ status: 'CONFIRMED_FRAUD' })}
            className={`p-4 rounded-xl border cursor-pointer transition group ${
              isLight
                ? 'bg-gradient-to-b from-rose-50/50 via-white to-white hover:border-rose-300 border-rose-100 shadow-2xs hover:shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-800 border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className={`font-semibold ${isLight ? 'text-rose-900' : 'text-rose-300'}`}>
                Xác nhận Gian lận (Confirmed Fraud)
              </span>
              <span
                className={`p-1.5 rounded-lg ${
                  isLight ? 'bg-rose-100 text-rose-700' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span
                className={`text-3xl font-extrabold ${
                  isLight ? 'text-rose-700' : 'text-rose-400'
                }`}
              >
                {confirmedFraudCount}
              </span>
              <span className="text-xs font-semibold text-rose-600 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+4.2% so với kỳ trước</span>
              </span>
            </div>
            <p className={`mt-2 text-[11px] flex items-center justify-between ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Tổn thất ngăn chặn: <strong className={isLight ? 'text-rose-800' : 'text-rose-300'}>{formatShortVND(totalFraudValueConfirmed)}</strong></span>
              <span className={`group-hover:translate-x-0.5 transition flex items-center gap-0.5 font-medium ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>
                Xem chi tiết <ArrowRight className="w-3 h-3" />
              </span>
            </p>
          </div>

          {/* Card 3: False Positive */}
          <div
            id="card-metric-false-positive"
            onClick={() => onNavigateToAlertsWithFilter({ status: 'FALSE_POSITIVE' })}
            className={`p-4 rounded-xl border cursor-pointer transition group ${
              isLight
                ? 'bg-gradient-to-b from-emerald-50/50 via-white to-white hover:border-emerald-300 border-emerald-100 shadow-2xs hover:shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-800 border-emerald-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className={`font-semibold ${isLight ? 'text-emerald-900' : 'text-emerald-300'}`}>
                Cảnh báo giả (False Positive)
              </span>
              <span
                className={`p-1.5 rounded-lg ${
                  isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span
                className={`text-3xl font-extrabold ${
                  isLight ? 'text-emerald-700' : 'text-emerald-400'
                }`}
              >
                {falsePositiveCount}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>-6.8% (Độ chính xác tăng)</span>
              </span>
            </div>
            <p className={`mt-2 text-[11px] flex items-center justify-between ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Dữ liệu tinh chỉnh kịch bản (F6.3)</span>
              <span className={`group-hover:translate-x-0.5 transition flex items-center gap-0.5 font-medium ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                Tra cứu log <ArrowRight className="w-3 h-3" />
              </span>
            </p>
          </div>
        </div>

        {/* Operational Flow Sub-counters */}
        <div
          className={`mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span className={isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}>
              Phân luồng vận hành:
            </span>
            <button
              onClick={() => onNavigateToAlertsWithFilter({ status: 'NEW' })}
              className={`px-3 py-1.5 rounded-lg border transition ${
                isLight
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              Mới phát sinh:{' '}
              <strong className={isLight ? 'text-amber-800 font-bold ml-1' : 'text-amber-400 font-bold ml-1'}>
                {newAlertsCount}
              </strong>
            </button>
            <button
              onClick={() => onNavigateToAlertsWithFilter({ status: 'IN_REVIEW' })}
              className={`px-3 py-1.5 rounded-lg border transition ${
                isLight
                  ? 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              Đang điều tra:{' '}
              <strong className={isLight ? 'text-blue-800 font-bold ml-1' : 'text-blue-400 font-bold ml-1'}>
                {inReviewCount}
              </strong>
            </button>
            <button
              onClick={() => onNavigateToAlertsWithFilter({ status: 'PENDING_APPROVAL' })}
              className={`px-3 py-1.5 rounded-lg border transition ${
                isLight
                  ? 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              Chờ Checker duyệt:{' '}
              <strong className={isLight ? 'text-purple-800 font-bold ml-1' : 'text-purple-400 font-bold ml-1'}>
                {pendingApprovalCount}
              </strong>
            </button>
          </div>

          <div className={`text-[11px] flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <Clock className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
            <span>Tần suất quét Core Banking: 500ms / block</span>
          </div>
        </div>
      </div>

      {/* Grid: F1.2 Risk Distribution Charts & Top 3-5 Violated Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Violated Rules */}
        <div
          className={`lg:col-span-6 p-5 rounded-xl border flex flex-col justify-between transition ${
            isLight
              ? 'bg-white border-slate-200 shadow-xs'
              : 'bg-slate-900 border-slate-800 shadow-md text-white'
          }`}
        >
          <div>
            <div
              className={`flex items-center justify-between pb-3 border-b mb-4 ${
                isLight ? 'border-slate-100' : 'border-slate-800'
              }`}
            >
              <div
                className={`flex items-center gap-2 font-bold text-sm sm:text-base ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                <BarChart3 className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                <span>Top Kịch bản Rủi ro vi phạm nhiều nhất (F1.2)</span>
              </div>
              <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Click để lọc danh sách
              </span>
            </div>

            <p className={`text-xs mb-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Các kịch bản có tần suất kích hoạt cảnh báo cao nhất trong kỳ đánh giá. Sử dụng để phát hiện biến động gian lận mới.
            </p>

            {/* Visual Text Bar Chart */}
            <div className="space-y-3">
              {sortedTopRules.map(([code, item], idx) => {
                const percent = Math.round((item.count / maxRuleCount) * 100);
                return (
                  <div
                    key={code}
                    onClick={() => onNavigateToAlertsWithFilter({ ruleCode: code })}
                    className={`p-2.5 rounded-lg border cursor-pointer transition group ${
                      isLight
                        ? 'border-slate-100 hover:border-blue-300 hover:bg-blue-50/50'
                        : 'border-slate-800 hover:border-blue-500/50 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded font-bold flex items-center justify-center text-[11px] ${
                            isLight
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}
                        >
                          #{idx + 1}
                        </span>
                        <span
                          className={`font-bold group-hover:text-blue-600 ${
                            isLight ? 'text-slate-900' : 'text-slate-200'
                          }`}
                        >
                          {code}: {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-blue-600 group-hover:underline">
                        {item.count} vụ ({percent}%)
                      </span>
                    </div>

                    {/* Bar visualization */}
                    <div
                      className={`w-full h-2.5 rounded-full overflow-hidden ${
                        isLight ? 'bg-slate-100' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className="bg-[#004B87] h-full rounded-full transition-all duration-500 group-hover:bg-blue-600"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t text-right ${
              isLight ? 'border-slate-100' : 'border-slate-800'
            }`}
          >
            <button
              onClick={() => onNavigateToAlertsWithFilter({})}
              className="text-xs text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>Xem toàn bộ 25 Kịch bản</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Risk Distribution by Scenario Groups & Alert Type */}
        <div className="lg:col-span-6 space-y-6">
          {/* Distribution by 5 Scenario Groups */}
          <div
            className={`p-5 rounded-xl border transition ${
              isLight
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-slate-900 border-slate-800 shadow-md text-white'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b mb-4 ${
                isLight ? 'border-slate-100' : 'border-slate-800'
              }`}
            >
              <div
                className={`flex items-center gap-2 font-bold text-sm sm:text-base ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                <PieChart className={`w-4 h-4 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
                <span>Phân bổ theo 5 Nhóm Kịch bản (F1.2)</span>
              </div>
              <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Interactive Drill-down
              </span>
            </div>

            <div className="space-y-3">
              {(Object.keys(categoryCount) as RuleCategory[]).map((cat) => {
                const count = categoryCount[cat];
                const meta = categoryLabels[cat];
                const totalTriggers = Object.values(categoryCount).reduce((a, b) => a + b, 0) || 1;
                const pct = Math.round((count / totalTriggers) * 100);

                return (
                  <div
                    key={cat}
                    onClick={() => onNavigateToAlertsWithFilter({ category: cat })}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition group ${
                      isLight
                        ? 'border-slate-100 hover:bg-slate-50'
                        : 'border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${meta.color}`} />
                      <div>
                        <p
                          className={`text-xs font-bold group-hover:text-blue-600 ${
                            isLight ? 'text-slate-800' : 'text-slate-200'
                          }`}
                        >
                          {meta.label}
                        </p>
                        <p className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                          {meta.desc}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-extrabold ${
                          isLight ? 'text-slate-900' : 'text-slate-200'
                        }`}
                      >
                        {count} lần
                      </span>
                      <span className={`text-[11px] ml-1.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                        ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Distribution by Alert Type */}
          <div
            className={`p-5 rounded-xl border transition ${
              isLight
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-slate-900 border-slate-800 shadow-md text-white'
            }`}
          >
            <div
              className={`flex items-center justify-between pb-3 border-b mb-3 ${
                isLight ? 'border-slate-100' : 'border-slate-800'
              }`}
            >
              <div
                className={`flex items-center gap-2 font-bold text-sm sm:text-base ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                <span>Phân loại theo Đối tượng Cảnh báo</span>
              </div>
              <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Giao dịch / TK / Thẻ
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div
                onClick={() => onNavigateToAlertsWithFilter({ type: 'TRANSACTION' })}
                className={`p-3 rounded-lg border cursor-pointer text-center transition ${
                  isLight
                    ? 'border-slate-100 hover:border-blue-400 hover:bg-blue-50/40'
                    : 'border-slate-800 hover:border-blue-400 hover:bg-slate-800'
                }`}
              >
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Giao dịch (Txn)</p>
                <p className={`text-lg font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {countByType.TRANSACTION}
                </p>
                <span className="text-[10px] text-blue-600 font-semibold">Chuyển khoản, E-com</span>
              </div>

              <div
                onClick={() => onNavigateToAlertsWithFilter({ type: 'ACCOUNT' })}
                className={`p-3 rounded-lg border cursor-pointer text-center transition ${
                  isLight
                    ? 'border-slate-100 hover:border-blue-400 hover:bg-blue-50/40'
                    : 'border-slate-800 hover:border-blue-400 hover:bg-slate-800'
                }`}
              >
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Tài khoản (Acc)</p>
                <p className={`text-lg font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {countByType.ACCOUNT}
                </p>
                <span className="text-[10px] text-indigo-600 font-semibold">Draining, Smurfing</span>
              </div>

              <div
                onClick={() => onNavigateToAlertsWithFilter({ type: 'COLLATERAL_CARD' })}
                className={`p-3 rounded-lg border cursor-pointer text-center transition ${
                  isLight
                    ? 'border-slate-100 hover:border-blue-400 hover:bg-blue-50/40'
                    : 'border-slate-800 hover:border-blue-400 hover:bg-slate-800'
                }`}
              >
                <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Thẻ / TS BĐ</p>
                <p className={`text-lg font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {countByType.COLLATERAL_CARD}
                </p>
                <span className="text-[10px] text-amber-600 font-semibold">POS, Fallback, MCC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
