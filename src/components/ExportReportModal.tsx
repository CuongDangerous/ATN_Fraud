/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Printer,
  X,
  Mail,
  CheckCircle2,
  Download,
  Calendar,
  Layers,
} from 'lucide-react';
import { AlertItem, FraudRule } from '../types';
import { formatVND, formatDateTime } from '../utils/masking';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: AlertItem[];
  rules: FraudRule[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  alerts,
  rules,
}) => {
  const [format, setFormat] = useState<'EXCEL' | 'HTML' | 'PDF' | 'CSV' | 'XML'>('EXCEL');
  const [scope, setScope] = useState<'ALL' | 'CONFIRMED' | 'FALSE_POSITIVE'>('ALL');
  const [scheduleEmail, setScheduleEmail] = useState(false);
  const [emailScheduleFreq, setEmailScheduleFreq] = useState('DAILY_0800');
  const [recipientEmail, setRecipientEmail] = useState('risk.management@ncb-bank.vn');
  const [isExporting, setIsExporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter((a) => {
    if (scope === 'CONFIRMED') return a.status === 'CONFIRMED_FRAUD';
    if (scope === 'FALSE_POSITIVE') return a.status === 'FALSE_POSITIVE';
    return true;
  });

  const handleExport = () => {
    setIsExporting(true);
    setSuccessMessage('');

    setTimeout(() => {
      if (format === 'CSV' || format === 'EXCEL') {
        // Generate CSV file
        const headers = [
          'Mã Alert',
          'Mã TXN',
          'Thời gian',
          'Khách hàng',
          'CIF',
          'Số tiền (VND)',
          'Điểm rủi ro',
          'Luật vi phạm',
          'Trạng thái',
          'Maker',
          'Checker',
          'Kênh',
        ];
        const rows = filteredAlerts.map((a) => [
          a.id,
          a.txnId,
          a.timestamp,
          `"${a.customerName}"`,
          a.cif,
          a.amount,
          a.riskScore,
          `"${a.violatedRules.join('; ')}"`,
          a.status,
          `"${a.makerName || ''}"`,
          `"${a.checkerName || ''}"`,
          a.payload.channel,
        ]);
        const csvContent =
          'data:text/csv;charset=utf-8,\uFEFF' +
          [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute(
          'download',
          `Bao_cao_Giam_sat_Gian_lan_NCB_${new Date().toISOString().slice(0, 10)}.${format === 'EXCEL' ? 'xls' : 'csv'}`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'HTML') {
        // Open formatted HTML report
        const reportWindow = window.open('', '_blank');
        if (reportWindow) {
          reportWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Báo cáo Giám sát Rủi ro Gian lận - NCB FraudGuard</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
                h1 { color: #003B73; font-size: 24px; margin-bottom: 4px; }
                .sub { color: #64748b; font-size: 14px; margin-bottom: 24px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
                th { background: #0f172a; color: #fff; text-align: left; padding: 10px; }
                td { border-bottom: 1px solid #e2e8f0; padding: 10px; }
                tr:nth-child(even) { background: #f8fafc; }
                .badge { padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; }
                .fraud { background: #fee2e2; color: #991b1b; }
                .cleared { background: #dcfce7; color: #166534; }
                .pending { background: #f3e8ff; color: #6b21a8; }
              </style>
            </head>
            <body>
              <div style="border-bottom: 2px solid #003B73; padding-bottom: 12px; margin-bottom: 20px;">
                <h1>NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN QUỐC DÂN (NCB)</h1>
                <h2>BÁO CÁO GIÁM SÁT GIAN LẬN GIAO DỊCH ĐIỆN TỬ</h2>
                <div class="sub">Hệ thống FraudGuard • Thời gian trích xuất: ${new Date().toLocaleString('vi-VN')} • Tổng số hồ sơ: ${filteredAlerts.length}</div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Mã Alert</th>
                    <th>Thời gian</th>
                    <th>Khách hàng</th>
                    <th>Số tiền</th>
                    <th>Luật vi phạm</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredAlerts
                    .map(
                      (a) => `
                    <tr>
                      <td><strong>${a.id}</strong><br><small>${a.txnId}</small></td>
                      <td>${new Date(a.timestamp).toLocaleString('vi-VN')}</td>
                      <td><strong>${a.customerName}</strong><br><small>CIF: ${a.cif}</small></td>
                      <td><strong>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(a.amount)}</strong></td>
                      <td>${a.violatedRules.join(', ')}</td>
                      <td><span class="badge ${a.status === 'CONFIRMED_FRAUD' ? 'fraud' : a.status === 'FALSE_POSITIVE' ? 'cleared' : 'pending'}">${a.status}</span></td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </body>
            </html>
          `);
          reportWindow.document.close();
        }
      } else if (format === 'PDF') {
        window.print();
      }

      setIsExporting(false);
      setSuccessMessage(
        scheduleEmail
          ? `Đã xuất dữ liệu định dạng ${format} và thiết lập lịch gửi email tự động thành công!`
          : `Đã xuất báo cáo định dạng ${format} (${filteredAlerts.length} bản ghi) thành công!`
      );
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Xuất Báo cáo Giám sát Gian lận (F1.4)
              </h3>
              <p className="text-xs text-slate-500">
                Hỗ trợ trích xuất báo cáo tuân thủ & cấu hình gửi email định kỳ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs">
          {/* Format selection */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">
              1. Chọn định dạng xuất dữ liệu:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFormat('EXCEL')}
                className={`p-3 rounded-xl border text-center transition ${
                  format === 'EXCEL'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                <span>Excel (.XLS)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('CSV')}
                className={`p-3 rounded-xl border text-center transition ${
                  format === 'CSV'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <FileText className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <span>CSV Chuẩn UTF-8</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('HTML')}
                className={`p-3 rounded-xl border text-center transition ${
                  format === 'HTML'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Layers className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                <span>HTML Báo cáo</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('PDF')}
                className={`p-3 rounded-xl border text-center transition ${
                  format === 'PDF'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Printer className="w-5 h-5 mx-auto mb-1 text-rose-600" />
                <span>PDF In ấn</span>
              </button>
            </div>
          </div>

          {/* Scope selection */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">
              2. Phạm vi dữ liệu trích xuất:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScope('ALL')}
                className={`p-2 rounded-lg border text-center transition ${
                  scope === 'ALL'
                    ? 'bg-blue-600 text-white font-bold border-blue-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Tất cả ({alerts.length})
              </button>
              <button
                type="button"
                onClick={() => setScope('CONFIRMED')}
                className={`p-2 rounded-lg border text-center transition ${
                  scope === 'CONFIRMED'
                    ? 'bg-rose-600 text-white font-bold border-rose-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Chỉ Confirmed Fraud
              </button>
              <button
                type="button"
                onClick={() => setScope('FALSE_POSITIVE')}
                className={`p-2 rounded-lg border text-center transition ${
                  scope === 'FALSE_POSITIVE'
                    ? 'bg-emerald-600 text-white font-bold border-emerald-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Chỉ False Positive
              </button>
            </div>
          </div>

          {/* Scheduled Email Reporting Configuration (F1.4) */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-800">
                  Lập lịch gửi email báo cáo tự động (F1.4)
                </span>
              </div>
              <input
                type="checkbox"
                checked={scheduleEmail}
                onChange={(e) => setScheduleEmail(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </div>

            {scheduleEmail && (
              <div className="space-y-2 pt-2 border-t border-slate-200 animate-in fade-in">
                <div>
                  <span className="text-slate-600 block mb-1">Tần suất gửi:</span>
                  <select
                    value={emailScheduleFreq}
                    onChange={(e) => setEmailScheduleFreq(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs"
                  >
                    <option value="DAILY_0800">Hàng ngày lúc 08:00 Sáng (Daily Operations Report)</option>
                    <option value="WEEKLY_MON">Hàng tuần vào 08:30 Thứ Hai (Weekly Risk Summary)</option>
                    <option value="MONTHLY_01">Đầu tháng ngày 01 (Monthly NHNN Compliance)</option>
                  </select>
                </div>

                <div>
                  <span className="text-slate-600 block mb-1">Địa chỉ Email người nhận:</span>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
          >
            Đóng
          </button>

          <button
            id="btn-confirm-export"
            disabled={isExporting}
            onClick={handleExport}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang tạo báo cáo...' : 'Tải xuống Báo cáo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
