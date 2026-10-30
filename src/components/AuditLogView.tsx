/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  FileText,
  ShieldCheck,
  Lock,
  Search,
  Filter,
  Download,
  AlertCircle,
  Database,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  X,
  FileDown,
} from 'lucide-react';
import { AuditLogEntry, AlertItem } from '../types';
import { formatDateTime } from '../utils/masking';

interface AuditLogViewProps {
  logs: AuditLogEntry[];
  falsePositiveAlerts: AlertItem[];
  onOpenAlertDetail?: (alert: AlertItem) => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  logs,
  falsePositiveAlerts,
  onOpenAlertDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'LOGS' | 'FALSE_POSITIVE_RETENTION'>('LOGS');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>('ALL');

  // USER REQUEST 3: Export Audit Report Modal & Configurations
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'EXCEL' | 'CSV'>('EXCEL');
  const [exportScope, setExportScope] = useState<'FILTERED' | 'ALL' | 'MAKER_CHECKER'>('FILTERED');
  const [includeHeaderInfo, setIncludeHeaderInfo] = useState(true);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        !searchTerm.trim() ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.reason && log.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
        log.targetId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole = roleFilter === 'ALL' || log.userRole === roleFilter;
      const matchAction = actionFilter === 'ALL' || log.action === actionFilter;
      const matchTarget = targetTypeFilter === 'ALL' || log.targetType === targetTypeFilter;

      return matchSearch && matchRole && matchAction && matchTarget;
    });
  }, [logs, searchTerm, roleFilter, actionFilter, targetTypeFilter]);

  const handleExportReport = () => {
    let dataset = logs;
    if (exportScope === 'FILTERED') {
      dataset = filteredLogs;
    } else if (exportScope === 'MAKER_CHECKER') {
      dataset = logs.filter(
        (l) =>
          l.action.includes('MAKER') ||
          l.action.includes('CHECKER') ||
          l.userRole === 'Maker' ||
          l.userRole === 'Checker'
      );
    }

    const headers = [
      'STT',
      'Mã Log',
      'Thời gian ghi nhận',
      'Người thực hiện',
      'Vai trò',
      'Hành động',
      'Loại đối tượng',
      'Mã đối tượng',
      'Nội dung chi tiết',
      'Lý do giải trình / Ý kiến thẩm định',
      'Địa chỉ IP',
    ];

    const rows = dataset.map((l, index) => [
      String(index + 1),
      `"${l.id}"`,
      `"${formatDateTime(l.timestamp)}"`,
      `"${l.userName.replace(/"/g, '""')}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${l.targetType}"`,
      `"${l.targetId}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${(l.reason || '').replace(/"/g, '""')}"`,
      `"${l.clientIp}"`,
    ]);

    let outputText = '';
    if (includeHeaderInfo) {
      const nowStr = formatDateTime(new Date().toISOString());
      outputText += `"NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN QUỐC DÂN (NCB) - PHÒNG QUẢN TRỊ RỦI RO HOẠT ĐỘNG"\n`;
      outputText += `"BÁO CÁO NHẬT KÝ KIỂM TOÁN HỆ THỐNG PHÒNG CHỐNG GIAN LẬN NCB FRAUDGUARD"\n`;
      outputText += `"Thời điểm xuất: ${nowStr} | Định dạng: ${exportFormat} | Tiêu chuẩn tuân thủ: QĐ 2345/QĐ-NHNN & ISO 27001"\n`;
      outputText += `"Phạm vi xuất: ${exportScope === 'FILTERED' ? 'Theo bộ lọc hiện tại' : exportScope === 'MAKER_CHECKER' ? 'Chỉ Maker-Checker' : 'Toàn bộ'} (${dataset.length} bản ghi)"\n\n`;
    }

    outputText += [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    // UTF-8 BOM so Excel opens with perfect Vietnamese accents
    const blob = new Blob(['\uFEFF' + outputText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:T-]/g, '').slice(0, 14);
    link.href = url;
    link.download = `NCB_Audit_Report_${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with compliance banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Nhật ký Kiểm toán Bất biến (Immutable Audit Trail - F6.1)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận toàn bộ thao tác người dùng, đăng nhập, quyết định Maker-Checker, và cấu hình kịch bản. Hệ thống ngăn chặn hoàn toàn việc xóa hoặc sửa log.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-open-audit-export-modal"
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Xuất Báo cáo Kiểm toán (Excel & CSV)</span>
          </button>
        </div>
      </div>

      {/* Immutable Security Notice Banner */}
      <div className="bg-blue-950 text-blue-100 p-3.5 rounded-xl border border-blue-900 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Cơ chế Bất biến (WORM - Write Once Read Many):</strong> Mọi thao tác click và submit được ký số hash và lưu trữ tại phân vùng kiểm toán cô lập. Tuyệt đối ngăn chặn sửa đổi log theo tiêu chuẩn PCI-DSS & Thông tư 09/NHNN.
          </span>
        </div>
        <span className="text-[10px] font-mono bg-blue-900 px-2 py-0.5 rounded text-blue-300 shrink-0 hidden md:inline-block">
          SHA-256 Chained
        </span>
      </div>

      {/* Tabs: Standard Audit Log vs False Positive Retention (F6.3) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('LOGS')}
          className={`px-4 py-2 rounded-t-lg font-bold transition flex items-center gap-1.5 border-b-2 ${
            activeTab === 'LOGS'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tra cứu Nhật ký Hoạt động (F6.2)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
            {logs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('FALSE_POSITIVE_RETENTION')}
          className={`px-4 py-2 rounded-t-lg font-bold transition flex items-center gap-1.5 border-b-2 ${
            activeTab === 'FALSE_POSITIVE_RETENTION'
              ? 'border-emerald-600 text-emerald-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Lưu trữ Cảnh báo giả (False Positive Retention - F6.3)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
            {falsePositiveAlerts.length}
          </span>
        </button>
      </div>

      {activeTab === 'LOGS' ? (
        <div className="space-y-4">
          {/* F6.2 Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="relative">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Tìm kiếm trong nhật ký
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ID, Tên người dùng, nội dung..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Vai trò (Role)
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full p-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
              >
                <option value="ALL">Tất cả vai trò</option>
                <option value="Maker">Maker (Chuyên viên)</option>
                <option value="Checker">Checker (Kiểm soát viên)</option>
                <option value="Admin">Admin (Quản trị viên)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Loại hành động (Action)
              </label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full p-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
              >
                <option value="ALL">Tất cả hành động</option>
                <option value="ALERT_TRIGGERED">ALERT_TRIGGERED (Hệ thống)</option>
                <option value="USER_LOGIN">USER_LOGIN (Đăng nhập SSO)</option>
                <option value="MAKER_SUBMIT_CONFIRM">MAKER_SUBMIT_CONFIRM (Maker)</option>
                <option value="MAKER_SUBMIT_CLEAR">MAKER_SUBMIT_CLEAR (Maker)</option>
                <option value="CHECKER_APPROVE">CHECKER_APPROVE (Checker duyệt)</option>
                <option value="CHECKER_REJECT">CHECKER_REJECT (Checker từ chối)</option>
                <option value="RULE_THRESHOLD_UPDATED">RULE_THRESHOLD_UPDATED (Sửa ngưỡng)</option>
                <option value="RULE_STATUS_TOGGLED">RULE_STATUS_TOGGLED (Bật/Tắt Rule)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Đối tượng bị tác động (Target)
              </label>
              <select
                value={targetTypeFilter}
                onChange={(e) => setTargetTypeFilter(e.target.value)}
                className="w-full p-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
              >
                <option value="ALL">Tất cả đối tượng</option>
                <option value="ALERT">ALERT (Hồ sơ cảnh báo)</option>
                <option value="RULE">RULE (Kịch bản gian lận)</option>
                <option value="USER">USER (Tài khoản người dùng)</option>
                <option value="REPORT">REPORT (Báo cáo trích xuất)</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-semibold border-b border-slate-800">
                    <th className="py-3 px-3 whitespace-nowrap">Mã Nhật ký</th>
                    <th className="py-3 px-3 whitespace-nowrap">Thời gian (UTC+7)</th>
                    <th className="py-3 px-3 whitespace-nowrap">Người thao tác</th>
                    <th className="py-3 px-3 whitespace-nowrap">Hành động</th>
                    <th className="py-3 px-4 whitespace-nowrap">Đối tượng & Chi tiết thao tác</th>
                    <th className="py-3 px-3 whitespace-nowrap">Lý do giải trình</th>
                    <th className="py-3 px-3 whitespace-nowrap">IP / Điểm chạm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50 transition duration-100"
                    >
                      {/* Log ID */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                        {log.id}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500">
                        {formatDateTime(log.timestamp)}
                      </td>

                      {/* User & Role */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <strong className="text-slate-900 block">{log.userName}</strong>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded inline-block ${
                            log.userRole === 'Admin'
                              ? 'bg-purple-100 text-purple-800'
                              : log.userRole === 'Checker'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {log.userRole}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {log.action}
                        </span>
                      </td>

                      {/* Target & Details */}
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-mono font-bold text-blue-700 text-[11px]">
                          [{log.targetType}: {log.targetId}]
                        </div>
                        <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">
                          {log.details}
                        </p>
                      </td>

                      {/* Reason */}
                      <td className="py-3 px-3 text-slate-500 italic max-w-xs text-[11px]">
                        {log.reason ? `"${log.reason}"` : '-'}
                      </td>

                      {/* Client IP */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.clientIp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* F6.3 False Positive Retention View */
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900 text-sm">
                Quy định Lưu trữ Cảnh báo giả (False Positive Retention - F6.3)
              </p>
              <p className="mt-1 leading-relaxed text-emerald-800">
                Toàn bộ các giao dịch được phân loại là <strong>False Positive (Cảnh báo giả)</strong> tuyệt đối KHÔNG BỊ XÓA khỏi hệ thống. Các hồ sơ này được lưu trữ vĩnh viễn nhằm làm dữ liệu đầu vào (training dataset) để Phòng Quản lý Rủi ro NCB đánh giá, tinh chỉnh ngưỡng 25 kịch bản và giảm thiểu tỷ lệ báo động nhầm.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold">
                  <th className="py-3 px-4">Mã Cảnh báo</th>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Khách hàng & CIF</th>
                  <th className="py-3 px-4">Luật kích hoạt</th>
                  <th className="py-3 px-4">Giải trình xác minh False Positive</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {falsePositiveAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Chưa có hồ sơ False Positive nào được lưu trữ.
                    </td>
                  </tr>
                ) : (
                  falsePositiveAlerts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {item.id}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {formatDateTime(item.timestamp)}
                      </td>
                      <td className="py-3 px-4">
                        <strong>{item.customerName}</strong>
                        <div className="text-[11px] text-slate-500">CIF: {item.cif}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {item.violatedRules.join(', ')}
                      </td>
                      <td className="py-3 px-4 text-slate-700 italic max-w-sm">
                        "{item.makerComment || 'Đã xác minh khách hàng chính chủ'}"
                      </td>
                      <td className="py-3 px-4 text-center">
                        {onOpenAlertDetail && (
                          <button
                            onClick={() => onOpenAlertDetail(item)}
                            className="text-xs text-blue-600 hover:underline font-semibold"
                          >
                            Xem hồ sơ lưu trữ
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USER REQUEST 3: EXPORT AUDIT REPORT MODAL (Excel & CSV với bộ lọc dữ liệu) */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#004B87] border border-blue-100">
                  <FileSpreadsheet className="w-5 h-5 text-[#004B87]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Xuất Báo cáo Nhật ký Kiểm toán (Audit Report)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tuân thủ Quyết định 2345/QĐ-NHNN & ISO 27001
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Format selection */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  1. Định dạng tệp xuất:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExportFormat('EXCEL')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                      exportFormat === 'EXCEL'
                        ? 'border-[#004B87] bg-blue-50/60 ring-2 ring-blue-500/20 text-[#004B87]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <FileSpreadsheet className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                    <div>
                      <strong className="block text-xs font-bold">Microsoft Excel (.xlsx / .csv)</strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Chuẩn UTF-8 BOM, không lỗi font tiếng Việt
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportFormat('CSV')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition ${
                      exportFormat === 'CSV'
                        ? 'border-[#004B87] bg-blue-50/60 ring-2 ring-blue-500/20 text-[#004B87]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <FileText className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
                    <div>
                      <strong className="block text-xs font-bold">Tệp CSV Chuẩn (.csv)</strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Dùng tích hợp SIEM / Phân tích dữ liệu
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Scope selection */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  2. Phạm vi dữ liệu trích xuất (Bộ lọc dữ liệu):
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="auditScope"
                      checked={exportScope === 'FILTERED'}
                      onChange={() => setExportScope('FILTERED')}
                      className="text-[#004B87] focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <strong className="text-slate-800 block text-xs">
                        Theo bộ lọc & từ khóa tìm kiếm hiện tại ({filteredLogs.length} bản ghi)
                      </strong>
                      <span className="text-[10px] text-slate-500">
                        Chỉ xuất các log thỏa mãn bộ lọc vai trò, hành động và tìm kiếm
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="auditScope"
                      checked={exportScope === 'ALL'}
                      onChange={() => setExportScope('ALL')}
                      className="text-[#004B87] focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <strong className="text-slate-800 block text-xs">
                        Toàn bộ nhật ký kiểm toán trong hệ thống ({logs.length} bản ghi)
                      </strong>
                      <span className="text-[10px] text-slate-500">
                        Xuất toàn bộ dấu vết lịch sử từ lúc khởi tạo
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="auditScope"
                      checked={exportScope === 'MAKER_CHECKER'}
                      onChange={() => setExportScope('MAKER_CHECKER')}
                      className="text-[#004B87] focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <strong className="text-slate-800 block text-xs">
                        Chỉ xuất hồ sơ Maker - Checker (Thẩm định & Phê duyệt)
                      </strong>
                      <span className="text-[10px] text-slate-500">
                        Tập trung vào hồ sơ quyết định gian lận và giải trình nghiệp vụ
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Extra header option */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHeaderInfo}
                    onChange={(e) => setIncludeHeaderInfo(e.target.checked)}
                    className="rounded text-[#004B87] focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">
                    Kèm tiêu đề cơ quan (NCB), dấu thời gian và chuẩn tuân thủ QĐ 2345
                  </span>
                </label>
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                id="btn-confirm-export-audit"
                onClick={handleExportReport}
                className="px-4 py-2 bg-[#004B87] hover:bg-[#003B6B] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition"
              >
                <FileDown className="w-4 h-4" />
                <span>[Tải file Báo cáo ngay]</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
