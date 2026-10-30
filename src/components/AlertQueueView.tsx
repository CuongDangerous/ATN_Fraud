/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  RefreshCw,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  ChevronRight,
  RotateCcw,
  Plus,
  Trash2,
  HelpCircle,
  Terminal,
  Zap,
  Info,
  X,
} from 'lucide-react';
import { AlertItem, AlertStatus, RuleCategory, AlertType } from '../types';
import { formatVND, formatDateTime, maskSensitiveNumber } from '../utils/masking';

export interface JiraClause {
  id: string;
  field: 'id' | 'txnId' | 'customerName' | 'cif' | 'amount' | 'status' | 'category' | 'ruleCode' | 'channel';
  operator: '=' | '!=' | 'CONTAINS' | 'NOT_CONTAINS' | '>' | '<' | '>=' | '<=';
  value: string;
}

interface AlertQueueViewProps {
  alerts: AlertItem[];
  onOpenDetail: (alert: AlertItem) => void;
  initialFilters?: {
    status?: AlertStatus;
    category?: RuleCategory;
    type?: AlertType;
    ruleCode?: string;
  };
  theme?: 'light' | 'dark';
}

export const AlertQueueView: React.FC<AlertQueueViewProps> = ({
  alerts,
  onOpenDetail,
  initialFilters,
  theme = 'light',
}) => {
  const isLight = theme === 'light';

  // REQUIREMENT 5: Jira Filter Builder state (Trường --> Toán tử --> Giá trị)
  const [jiraClauses, setJiraClauses] = useState<JiraClause[]>([
    {
      id: 'c-1',
      field: 'status',
      operator: '=',
      value: initialFilters?.status || 'ALL',
    },
  ]);
  const [combinator, setCombinator] = useState<'AND' | 'OR'>('AND');
  const [quickSearchText, setQuickSearchText] = useState('');
  const [showStatusGlossary, setShowStatusGlossary] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'timestamp' | 'amount'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Handle initial filters
  React.useEffect(() => {
    if (initialFilters?.status) {
      setJiraClauses([
        { id: `c-${Date.now()}`, field: 'status', operator: '=', value: initialFilters.status },
      ]);
    } else if (initialFilters?.category) {
      setJiraClauses([
        { id: `c-${Date.now()}`, field: 'category', operator: '=', value: initialFilters.category },
      ]);
    } else if (initialFilters?.ruleCode) {
      setJiraClauses([
        { id: `c-${Date.now()}`, field: 'ruleCode', operator: '=', value: initialFilters.ruleCode },
      ]);
    }
  }, [initialFilters]);

  // Field definitions for Jira Filter
  const FIELD_OPTIONS = [
    { value: 'id', label: 'Mã Alert (Key)', type: 'text' },
    { value: 'txnId', label: 'Mã Giao dịch (TXN)', type: 'text' },
    { value: 'customerName', label: 'Tên Khách hàng', type: 'text' },
    { value: 'cif', label: 'Mã CIF / Số TK / Thẻ', type: 'text' },
    { value: 'amount', label: 'Số tiền giao dịch (VND)', type: 'number' },
    { value: 'status', label: 'Trạng thái xử lý (Status)', type: 'status' },
    { value: 'category', label: 'Nhóm kịch bản (Category)', type: 'category' },
    { value: 'ruleCode', label: 'Mã Kịch bản (R01-R25)', type: 'ruleCode' },
    { value: 'channel', label: 'Kênh giao dịch (Channel)', type: 'channel' },
  ] as const;

  // Add a clause
  const addClause = () => {
    const newId = `c-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setJiraClauses((prev) => [
      ...prev,
      { id: newId, field: 'status', operator: '=', value: 'NEW' },
    ]);
  };

  // Remove a clause
  const removeClause = (id: string) => {
    setJiraClauses((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev));
  };

  // Update a clause
  const updateClause = (id: string, updates: Partial<JiraClause>) => {
    setJiraClauses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, ...updates };
        // Adjust operator default if field type changed
        if (updates.field && updates.field !== c.field) {
          if (updates.field === 'amount') {
            updated.operator = '>=';
            updated.value = '50000000';
          } else if (updates.field === 'status') {
            updated.operator = '=';
            updated.value = 'NEW';
          } else if (updates.field === 'category') {
            updated.operator = '=';
            updated.value = 'VELOCITY';
          } else if (updates.field === 'channel') {
            updated.operator = '=';
            updated.value = 'NCB_IZIMOBILE';
          } else {
            updated.operator = 'CONTAINS';
            updated.value = '';
          }
        }
        return updated;
      })
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setJiraClauses([
      { id: 'c-1', field: 'status', operator: '=', value: 'ALL' },
    ]);
    setQuickSearchText('');
  };

  // Preset Quick Filters (Jira Quick Filters)
  const applyQuickFilter = (type: 'NEW_UNTOUCHED' | 'HIGH_VALUE' | 'TODAY' | 'MOBILE' | 'ALL') => {
    if (type === 'ALL') {
      resetFilters();
      return;
    }
    if (type === 'NEW_UNTOUCHED') {
      setJiraClauses([
        { id: `c-${Date.now()}`, field: 'status', operator: '=', value: 'NEW' },
      ]);
    } else if (type === 'HIGH_VALUE') {
      setJiraClauses([
        { id: `c-${Date.now()}`, field: 'amount', operator: '>=', value: '100000000' },
      ]);
    } else if (type === 'MOBILE') {
      setJiraClauses([
        { id: `c-${Date.now()}`, field: 'channel', operator: '=', value: 'NCB_IZIMOBILE' },
      ]);
    } else if (type === 'TODAY') {
      setQuickSearchText(new Date().toISOString().slice(0, 10));
    }
  };

  // Evaluation of Jira Clause against an alert item
  const evaluateClause = (alert: AlertItem, clause: JiraClause): boolean => {
    if (clause.value === 'ALL' || clause.value === '') return true;

    switch (clause.field) {
      case 'id': {
        const val = alert.id.toLowerCase();
        const target = clause.value.toLowerCase();
        if (clause.operator === '=') return val === target;
        if (clause.operator === '!=') return val !== target;
        if (clause.operator === 'CONTAINS') return val.includes(target);
        if (clause.operator === 'NOT_CONTAINS') return !val.includes(target);
        return true;
      }
      case 'txnId': {
        const val = alert.txnId.toLowerCase();
        const target = clause.value.toLowerCase();
        if (clause.operator === '=') return val === target;
        if (clause.operator === '!=') return val !== target;
        if (clause.operator === 'CONTAINS') return val.includes(target);
        if (clause.operator === 'NOT_CONTAINS') return !val.includes(target);
        return true;
      }
      case 'customerName': {
        const val = alert.customerName.toLowerCase();
        const target = clause.value.toLowerCase();
        if (clause.operator === '=') return val === target;
        if (clause.operator === '!=') return val !== target;
        if (clause.operator === 'CONTAINS') return val.includes(target);
        if (clause.operator === 'NOT_CONTAINS') return !val.includes(target);
        return true;
      }
      case 'cif': {
        const cifVal = alert.cif.toLowerCase();
        const accVal = alert.accountOrCard.toLowerCase();
        const target = clause.value.toLowerCase();
        if (clause.operator === '=') return cifVal === target || accVal === target;
        if (clause.operator === '!=') return cifVal !== target && accVal !== target;
        if (clause.operator === 'CONTAINS') return cifVal.includes(target) || accVal.includes(target);
        if (clause.operator === 'NOT_CONTAINS') return !cifVal.includes(target) && !accVal.includes(target);
        return true;
      }
      case 'amount': {
        const alertAmount = alert.amount;
        const targetAmount = Number(clause.value) || 0;
        if (clause.operator === '>=') return alertAmount >= targetAmount;
        if (clause.operator === '<=') return alertAmount <= targetAmount;
        if (clause.operator === '>') return alertAmount > targetAmount;
        if (clause.operator === '<') return alertAmount < targetAmount;
        if (clause.operator === '=') return alertAmount === targetAmount;
        if (clause.operator === '!=') return alertAmount !== targetAmount;
        return true;
      }
      case 'status': {
        if (clause.operator === '=') return alert.status === clause.value;
        if (clause.operator === '!=') return alert.status !== clause.value;
        return true;
      }
      case 'category': {
        const hasCat = alert.violatedRuleDetails.some((r) => r.category === clause.value);
        if (clause.operator === '=') return hasCat;
        if (clause.operator === '!=') return !hasCat;
        return true;
      }
      case 'ruleCode': {
        const target = clause.value.toUpperCase();
        const hasRule = alert.violatedRules.some((r) => r.toUpperCase().includes(target));
        if (clause.operator === '=') return alert.violatedRules.includes(target);
        if (clause.operator === '!=') return !alert.violatedRules.includes(target);
        if (clause.operator === 'CONTAINS') return hasRule;
        if (clause.operator === 'NOT_CONTAINS') return !hasRule;
        return true;
      }
      case 'channel': {
        if (clause.operator === '=') return alert.payload.channel === clause.value;
        if (clause.operator === '!=') return alert.payload.channel !== clause.value;
        return true;
      }
      default:
        return true;
    }
  };

  // Filter alerts by Jira Builder & Quick Search Text
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // 1. Quick text search
      if (quickSearchText.trim()) {
        const term = quickSearchText.toLowerCase();
        const matchQuick =
          alert.id.toLowerCase().includes(term) ||
          alert.txnId.toLowerCase().includes(term) ||
          alert.customerName.toLowerCase().includes(term) ||
          alert.cif.toLowerCase().includes(term) ||
          alert.timestamp.toLowerCase().includes(term) ||
          alert.violatedRules.some((r) => r.toLowerCase().includes(term));
        if (!matchQuick) return false;
      }

      // 2. Evaluate all Jira Clauses
      if (jiraClauses.length === 0) return true;

      if (combinator === 'AND') {
        return jiraClauses.every((clause) => evaluateClause(alert, clause));
      } else {
        // OR combinator: true if any non-empty clause matches
        const activeClauses = jiraClauses.filter((c) => c.value !== 'ALL' && c.value !== '');
        if (activeClauses.length === 0) return true;
        return activeClauses.some((clause) => evaluateClause(alert, clause));
      }
    });
  }, [alerts, jiraClauses, combinator, quickSearchText]);

  // Sort alerts
  const sortedAlerts = useMemo(() => {
    return [...filteredAlerts].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'timestamp') {
        comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [filteredAlerts, sortBy, sortOrder]);

  // Generated JQL String preview
  const jqlString = useMemo(() => {
    const valid = jiraClauses.filter((c) => c.value !== 'ALL' && c.value !== '');
    if (valid.length === 0) return 'ORDER BY timestamp DESC';
    return valid
      .map((c) => {
        let val = c.value;
        if (c.field === 'amount') val = Number(c.value).toLocaleString('vi-VN');
        return `${c.field} ${c.operator} "${val}"`;
      })
      .join(` ${combinator} `);
  }, [jiraClauses, combinator]);

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-xl border transition ${
          isLight
            ? 'bg-white border-slate-200 shadow-xs'
            : 'bg-slate-900 border-slate-800 shadow-md text-white'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Danh sách Cảnh báo Rủi ro (Alert Queue)
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isLight ? 'bg-blue-100 text-blue-800' : 'bg-blue-900/40 text-blue-300'
              }`}
            >
              {sortedAlerts.length} / {alerts.length} hồ sơ
            </span>
          </div>
          <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Tra cứu và sàng lọc toàn diện giao dịch đáng ngờ theo mô hình truy vấn Jira (Field - Operator - Value).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Glossary Help Button */}
          <button
            onClick={() => setShowStatusGlossary(true)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
            title="Xem giải thích chuẩn các trạng thái cảnh báo"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Từ điển Trạng thái (Glossary)</span>
          </button>
        </div>
      </div>

      {/* REQUIREMENT 5: Jira Query Filter Builder (Trường -> Toán tử -> Giá trị) */}
      <div
        className={`p-5 rounded-xl border shadow-xs space-y-4 transition ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        {/* Top Header of Jira Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-sm tracking-tight">
              Bộ lọc nâng cao kiểu Jira (Field → Operator → Value)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Logic Combinator AND / OR */}
            <span className="text-xs text-slate-500">Toán tử liên kết:</span>
            <div
              className={`inline-flex rounded-lg p-0.5 border text-xs font-semibold ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <button
                onClick={() => setCombinator('AND')}
                className={`px-2.5 py-1 rounded-md transition ${
                  combinator === 'AND'
                    ? 'bg-[#004B87] text-white shadow-2xs'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                AND (Tất cả)
              </button>
              <button
                onClick={() => setCombinator('OR')}
                className={`px-2.5 py-1 rounded-md transition ${
                  combinator === 'OR'
                    ? 'bg-[#004B87] text-white shadow-2xs'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                OR (Bất kỳ)
              </button>
            </div>

            <button
              onClick={resetFilters}
              className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 transition ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
              title="Đặt lại các điều kiện lọc"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Presets (Jira Quick Filters) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1 mr-1">
            <Zap className="w-3 h-3 text-amber-500" />
            Quick Filters:
          </span>
          <button
            onClick={() => applyQuickFilter('NEW_UNTOUCHED')}
            className="px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-medium text-[11px] transition"
          >
            Mới - Chưa ai xử lý
          </button>
          <button
            onClick={() => applyQuickFilter('HIGH_VALUE')}
            className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 font-medium text-[11px] transition"
          >
            GD lớn (≥ 100M VND)
          </button>
          <button
            onClick={() => applyQuickFilter('MOBILE')}
            className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-medium text-[11px] transition"
          >
            Kênh NCB IZIMOBILE
          </button>
          <button
            onClick={() => applyQuickFilter('TODAY')}
            className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-medium text-[11px] transition"
          >
            Phát sinh hôm nay
          </button>
          <button
            onClick={() => applyQuickFilter('ALL')}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] transition"
          >
            Tất cả
          </button>
        </div>

        {/* Dynamic Jira Rows List (Field --> Operator --> Value) */}
        <div className="space-y-2.5">
          {jiraClauses.map((clause, idx) => {
            const currentFieldDef = FIELD_OPTIONS.find((f) => f.value === clause.field) || FIELD_OPTIONS[0];

            return (
              <div
                key={clause.id}
                className={`p-2.5 rounded-lg border flex flex-col md:flex-row items-stretch md:items-center gap-2 transition ${
                  isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-800/60 border-slate-700'
                }`}
              >
                {/* Condition row number */}
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  {/* 1. Trường (Field) */}
                  <select
                    value={clause.field}
                    onChange={(e) => updateClause(clause.id, { field: e.target.value as any })}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-800 border-slate-600 text-white'
                    }`}
                  >
                    {FIELD_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Toán tử (Operator) */}
                <div className="shrink-0">
                  <select
                    value={clause.operator}
                    onChange={(e) => updateClause(clause.id, { operator: e.target.value as any })}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isLight ? 'bg-white border-slate-300 text-blue-700' : 'bg-slate-800 border-slate-600 text-blue-400'
                    }`}
                  >
                    {currentFieldDef.type === 'number' ? (
                      <>
                        <option value=">=">&gt;= (Lớn hơn hoặc bằng)</option>
                        <option value="<=">&lt;= (Nhỏ hơn hoặc bằng)</option>
                        <option value=">">&gt; (Lớn hơn)</option>
                        <option value="<">&lt; (Nhỏ hơn)</option>
                        <option value="=">= (Bằng chính xác)</option>
                        <option value="!=">!= (Khác)</option>
                      </>
                    ) : currentFieldDef.type === 'status' || currentFieldDef.type === 'category' || currentFieldDef.type === 'channel' ? (
                      <>
                        <option value="=">= (Bằng)</option>
                        <option value="!=">!= (Khác)</option>
                      </>
                    ) : (
                      <>
                        <option value="CONTAINS">CONTAINS (Chứa chuỗi)</option>
                        <option value="=">= (Bằng chính xác)</option>
                        <option value="!=">!= (Khác)</option>
                        <option value="NOT_CONTAINS">NOT CONTAINS (Không chứa)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* 3. Giá trị (Value) */}
                <div className="flex-1">
                  {clause.field === 'status' ? (
                    <select
                      value={clause.value}
                      onChange={(e) => updateClause(clause.id, { value: e.target.value })}
                      className={`w-full py-1.5 px-3 rounded-lg border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-800 border-slate-600 text-white'
                      }`}
                    >
                      <option value="ALL">Mọi trạng thái</option>
                      <option value="NEW">MỚI (Chưa ai xử lý, chưa tiếp nhận)</option>
                      <option value="IN_REVIEW">ĐANG ĐIỀU TRA (Maker đang thụ lý)</option>
                      <option value="PENDING_APPROVAL">CHỜ DUYỆT (Đang chờ Checker duyệt)</option>
                      <option value="CONFIRMED_FRAUD">XÁC NHẬN GIAN LẬN (Checker đã duyệt)</option>
                      <option value="FALSE_POSITIVE">CẢNH BÁO GIẢ (Hợp lệ, an toàn)</option>
                    </select>
                  ) : clause.field === 'category' ? (
                    <select
                      value={clause.value}
                      onChange={(e) => updateClause(clause.id, { value: e.target.value })}
                      className={`w-full py-1.5 px-3 rounded-lg border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-800 border-slate-600 text-white'
                      }`}
                    >
                      <option value="ALL">Tất cả nhóm kịch bản</option>
                      <option value="VELOCITY">Nhóm 1: Vận tốc & Tần suất (R01 - R05)</option>
                      <option value="VOLUME">Nhóm 2: Giá trị & Hạn mức (R06 - R10)</option>
                      <option value="GEO_DEVICE">Nhóm 3: Không gian & Thiết bị (R11 - R15)</option>
                      <option value="COUNTERPARTY">Nhóm 4: Đối tác & Kênh (R16 - R20)</option>
                      <option value="TECHNICAL">Nhóm 5: Kỹ thuật & Blacklist (R21 - R25)</option>
                    </select>
                  ) : clause.field === 'channel' ? (
                    <select
                      value={clause.value}
                      onChange={(e) => updateClause(clause.id, { value: e.target.value })}
                      className={`w-full py-1.5 px-3 rounded-lg border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-800 border-slate-600 text-white'
                      }`}
                    >
                      <option value="ALL">Tất cả kênh</option>
                      <option value="NCB_IZIMOBILE">NCB IZIMOBILE (App Cá nhân)</option>
                      <option value="IZIBANKBIZ">IZIBANKBIZ (Kênh Doanh nghiệp)</option>
                      <option value="ATM">Cây ATM NCB / Napas</option>
                      <option value="POS">Máy quẹt thẻ POS</option>
                      <option value="ECOM_GATEWAY">Cổng thanh toán E-commerce</option>
                    </select>
                  ) : clause.field === 'amount' ? (
                    <div className="relative">
                      <input
                        type="number"
                        step={1000000}
                        value={clause.value}
                        onChange={(e) => updateClause(clause.id, { value: e.target.value })}
                        placeholder="Nhập số tiền VND..."
                        className={`w-full py-1.5 px-3 pr-12 rounded-lg border text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-600 text-white'
                        }`}
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">
                        VND
                      </span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={clause.value}
                      onChange={(e) => updateClause(clause.id, { value: e.target.value })}
                      placeholder={`Nhập giá trị lọc cho ${currentFieldDef.label}...`}
                      className={`w-full py-1.5 px-3 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-800 border-slate-600 text-white'
                      }`}
                    />
                  )}
                </div>

                {/* Remove Clause Button */}
                <button
                  onClick={() => removeClause(clause.id)}
                  disabled={jiraClauses.length <= 1}
                  className={`p-1.5 rounded-lg transition shrink-0 ${
                    jiraClauses.length <= 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : isLight
                      ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      : 'text-slate-500 hover:text-rose-400 hover:bg-slate-700'
                  }`}
                  title="Xóa điều kiện này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Action bar: Add Clause & JQL syntax representation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <button
            onClick={addClause}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
              isLight
                ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                : 'bg-blue-950/60 hover:bg-blue-900/60 border-blue-800 text-blue-300'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm điều kiện lọc</span>
          </button>

          {/* JQL View Bar */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-[11px] overflow-x-auto ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-emerald-400'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-bold text-slate-400 shrink-0">JQL:</span>
            <span className="truncate">{jqlString}</span>
          </div>
        </div>

        {/* Global Quick Search text bar & Sort options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t">
          {/* Quick text */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={quickSearchText}
              onChange={(e) => setQuickSearchText(e.target.value)}
              placeholder="Tìm nhanh theo Mã Alert, TXN, Tên KH, CIF..."
              className={`w-full pl-9 pr-4 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700 text-white'
              }`}
            />
          </div>

          {/* Sort order */}
          <div className="flex items-center gap-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`w-full py-1.5 px-2 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700 text-white'
              }`}
            >
              <option value="timestamp">Thời gian phát sinh</option>
              <option value="amount">Số tiền giao dịch</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className={`p-2 rounded-lg border transition ${
                isLight
                  ? 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  : 'border-slate-700 hover:bg-slate-800 text-slate-300'
              }`}
              title="Đảo chiều sắp xếp"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* REQUIREMENT 4: Bỏ cột Điểm Rủi ro; Định nghĩa rõ trạng thái MỚI */}
      <div
        className={`rounded-xl border shadow-xs overflow-hidden transition ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={`font-semibold border-b ${
                  isLight
                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                    : 'bg-slate-950 text-slate-200 border-slate-800'
                }`}
              >
                <th className="py-3.5 px-4 whitespace-nowrap">Mã Alert / Giao dịch</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Thời gian phát sinh</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Khách hàng & Masking TK/Thẻ</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Số tiền (VND)</th>
                {/* REQUIREMENT 4: CỘT ĐIỂM RỦI RO ĐÃ ĐƯỢC LOẠI BỎ THEO YÊU CẦU */}
                <th className="py-3.5 px-4 whitespace-nowrap">Kịch bản vi phạm</th>
                <th className="py-3.5 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span>Trạng thái xử lý</span>
                    <button
                      onClick={() => setShowStatusGlossary(true)}
                      title="Bấm để xem định nghĩa các trạng thái"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <HelpCircle className="w-3 h-3" />
                    </button>
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800'}`}>
              {sortedAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không tìm thấy cảnh báo nào phù hợp với bộ lọc Jira hiện tại.
                  </td>
                </tr>
              ) : (
                sortedAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className={`transition duration-150 ${
                      isLight ? 'hover:bg-blue-50/40' : 'hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Mã Alert / Txn */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-blue-700 text-xs">
                        {alert.id}
                      </div>
                      <div className="font-mono text-[11px] text-slate-500">
                        {alert.txnId}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {alert.payload.channel}
                      </span>
                    </td>

                    {/* Thời gian */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-600">
                      <div>{formatDateTime(alert.timestamp)}</div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(alert.timestamp).toDateString() === new Date().toDateString()
                          ? 'Hôm nay'
                          : 'Trước đó'}
                      </span>
                    </td>

                    {/* Khách hàng & Masking */}
                    <td className="py-3.5 px-4">
                      <strong className={`block ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        {alert.customerName}
                      </strong>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span>CIF: {alert.cif}</span>
                        <span>•</span>
                        <span className="font-mono text-blue-700 font-semibold">
                          {maskSensitiveNumber(alert.accountOrCard)}
                        </span>
                      </div>
                    </td>

                    {/* Số tiền (VND) */}
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900">
                      <span className={alert.amount >= 100000000 ? 'text-rose-700' : 'text-slate-800'}>
                        {formatVND(alert.amount)}
                      </span>
                    </td>

                    {/* Kịch bản vi phạm */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[240px]">
                        {alert.violatedRules.map((r) => (
                          <span
                            key={r}
                            className="font-mono font-bold text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded"
                            title={r}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {alert.violatedRuleDetails[0]?.ruleName}
                      </p>
                    </td>

                    {/* REQUIREMENT 4: Trạng thái được định nghĩa rõ */}
                    <td className="py-3.5 px-3">
                      {alert.status === 'NEW' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            MỚI
                          </span>
                          <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                            Chưa tiếp nhận • Chưa xử lý
                          </div>
                        </div>
                      )}

                      {alert.status === 'IN_REVIEW' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                            ĐANG ĐIỀU TRA
                          </span>
                          <div className="text-[10px] text-blue-700 mt-0.5">
                            Maker {alert.makerName?.split(' ')[0]} thụ lý
                          </div>
                        </div>
                      )}

                      {alert.status === 'PENDING_APPROVAL' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                            CHỜ DUYỆT
                          </span>
                          <div className="text-[10px] text-purple-700 mt-0.5">
                            Đang chờ Checker duyệt
                          </div>
                        </div>
                      )}

                      {alert.status === 'CONFIRMED_FRAUD' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                            XÁC NHẬN GIAN LẬN
                          </span>
                          <div className="text-[10px] text-rose-700 mt-0.5">
                            Đã phong tỏa / Chặn
                          </div>
                        </div>
                      )}

                      {alert.status === 'FALSE_POSITIVE' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            CẢNH BÁO GIẢ
                          </span>
                          <div className="text-[10px] text-emerald-700 mt-0.5">
                            GD hợp lệ • Lưu vết
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Thao tác: Mở modal xem xét */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        id={`btn-open-${alert.id.toLowerCase()}`}
                        onClick={() => onOpenDetail(alert)}
                        className="px-3 py-1.5 rounded-lg bg-[#004B87] hover:bg-[#003B6B] text-white font-semibold text-xs transition inline-flex items-center gap-1 shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Mở TXN</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REQUIREMENT 4: Modal Từ điển Trạng thái (Status Glossary) */}
      {showStatusGlossary && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-2xl border shadow-2xl max-w-xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base">Từ điển Trạng thái Cảnh báo Gian lận (Status Glossary)</h3>
              </div>
              <button
                onClick={() => setShowStatusGlossary(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Quy chuẩn vòng đời xử lý hồ sơ cảnh báo tại Ngân hàng TMCP Quốc Dân (NCB) theo Quyết định 2345/QĐ-NHNN:
            </p>

            <div className="space-y-3 text-xs">
              {/* NEW */}
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[11px]">
                    1. MỚI (NEW)
                  </span>
                  <span className="text-amber-800 font-semibold">Cảnh báo tự động • Chưa ai xử lý</span>
                </div>
                <p className="text-amber-950 leading-relaxed text-[11px]">
                  Cảnh báo vừa được động cơ 25 Fraud Rules phát hiện từ Core Banking / Thẻ / E-com. <strong>Chưa có bất kỳ cán bộ Maker nào tiếp nhận thụ lý hoặc mở hồ sơ xem xét</strong>. Cần cán bộ mở hồ sơ để bắt đầu thụ lý.
                </p>
              </div>

              {/* IN_REVIEW */}
              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900 text-[11px]">
                    2. ĐANG ĐIỀU TRA (IN_REVIEW)
                  </span>
                  <span className="text-blue-800 font-semibold">Maker đã tiếp nhận thụ lý</span>
                </div>
                <p className="text-blue-950 leading-relaxed text-[11px]">
                  Chuyên viên Maker đã bấm mở hồ sơ và đang tiến hành xác minh: đối soát số điện thoại, kiểm tra định vị IP, Device ID và liên hệ khách hàng để đối chứng.
                </p>
              </div>

              {/* PENDING_APPROVAL */}
              <div className="p-3 rounded-xl border border-purple-200 bg-purple-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-900 text-[11px]">
                    3. CHỜ PHÊ DUYỆT (PENDING_APPROVAL)
                  </span>
                  <span className="text-purple-800 font-semibold">Đã chuyển lên Checker</span>
                </div>
                <p className="text-purple-950 leading-relaxed text-[11px]">
                  Maker đã hoàn thành đối soát, ghi rõ lý do giải trình và bấm đề xuất (Xác nhận Gian lận hoặc Cảnh báo giả). Hồ sơ đang nằm trong Hàng đợi Phê duyệt của Kiểm soát viên (Checker).
                </p>
              </div>

              {/* CONFIRMED_FRAUD */}
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900 text-[11px]">
                    4. XÁC NHẬN GIAN LẬN (CONFIRMED_FRAUD)
                  </span>
                  <span className="text-rose-800 font-semibold">Checker đã ký duyệt kết luận gian lận</span>
                </div>
                <p className="text-rose-950 leading-relaxed text-[11px]">
                  Hồ sơ được Checker phê duyệt kết luận gian lận. Hệ thống tự động kích hoạt chặn giao dịch, phong tỏa tài khoản/thẻ liên quan và đưa vào danh sách đen (Blacklist).
                </p>
              </div>

              {/* FALSE_POSITIVE */}
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[11px]">
                    5. CẢNH BÁO GIẢ (FALSE_POSITIVE)
                  </span>
                  <span className="text-emerald-800 font-semibold">Giao dịch an toàn, hợp lệ</span>
                </div>
                <p className="text-emerald-950 leading-relaxed text-[11px]">
                  Checker phê duyệt giao dịch an toàn hợp lệ (do khách hàng đi công tác đột xuất, đổi điện thoại chính đáng). Hồ sơ được đóng và lưu trữ làm dữ liệu huấn luyện tinh chỉnh kịch bản.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t mt-4 text-right">
              <button
                onClick={() => setShowStatusGlossary(false)}
                className="px-4 py-1.5 rounded-lg bg-[#004B87] text-white text-xs font-semibold shadow-xs"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
