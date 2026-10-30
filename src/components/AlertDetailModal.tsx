/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  User,
  CreditCard,
  Building,
  Smartphone,
  Globe,
  Clock,
  FileCheck,
  History,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Terminal,
  Maximize2,
  Minimize2,
  ExternalLink,
  Paperclip,
  Upload,
  Trash2,
  Download,
  File,
} from 'lucide-react';
import { AlertItem, UserProfile, AttachmentFile } from '../types';
import { formatVND, formatDateTime, maskSensitiveNumber } from '../utils/masking';

interface AlertDetailModalProps {
  alert: AlertItem | null;
  onClose: () => void;
  currentUser: UserProfile | null;
  onMakerDecision: (
    alertId: string,
    decision: 'CONFIRM_FRAUD' | 'CLEAR_FRAUD',
    comment: string,
    attachments?: AttachmentFile[]
  ) => void;
  onNavigateToReviewQueue?: () => void;
  theme?: 'light' | 'dark';
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  currentUser,
  onMakerDecision,
  onNavigateToReviewQueue,
  theme = 'light',
}) => {
  const isLight = theme === 'light';
  const [comment, setComment] = useState('');
  const [showRawPayload, setShowRawPayload] = useState(false);
  const [unmaskNumber, setUnmaskNumber] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false); // REQUIREMENT 6: Expand button
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);

  if (!alert) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newAttachments: AttachmentFile[] = files.map((f, idx) => ({
      id: `ATT-${Date.now()}-${idx}`,
      name: f.name,
      size: f.size,
      type: f.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser?.name || 'Maker',
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleAddSampleAttachment = (sampleName: string) => {
    const sample: AttachmentFile = {
      id: `ATT-SAMPLE-${Date.now()}`,
      name: sampleName,
      size: 428000, // ~418 KB
      type: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser?.name || 'Maker',
    };
    setAttachments((prev) => [...prev, sample]);
  };

  const handleRemoveAttachment = (attId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attId));
  };

  const handleDownloadAttachment = (fileItem: AttachmentFile) => {
    const content = `NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN QUỐC DÂN (NCB)\nHỆ THỐNG FRAUDGUARD - TÀI LIỆU CHỨNG TỪ ĐÍNH KÈM\n\nTên tài liệu: ${fileItem.name}\nMã tài liệu: ${fileItem.id}\nDung lượng: ${(fileItem.size / 1024).toFixed(0)} KB\nThời gian tải lên: ${fileItem.uploadedAt}\nNgười đính kèm: ${fileItem.uploadedBy}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileItem.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDecision = (decision: 'CONFIRM_FRAUD' | 'CLEAR_FRAUD') => {
    if (!comment.trim()) {
      setValidationError('Vui lòng nhập lý do giải trình nghiệp vụ (bắt buộc theo F2.4)');
      return;
    }
    setValidationError('');
    onMakerDecision(alert.id, decision, comment.trim(), attachments);
  };

  const isMaker = currentUser?.role === 'Maker';
  const isChecker = currentUser?.role === 'Checker';
  const isAdmin = currentUser?.role === 'Admin';
  const canDecide = isMaker && (alert.status === 'NEW' || alert.status === 'IN_REVIEW');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* REQUIREMENT 6: Wide Modal with Expand Toggle & Side-by-Side 2-Column Workbench */}
      <div
        className={`rounded-2xl border shadow-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-all ${
          isExpanded ? 'max-w-[98vw] h-[96vh]' : 'max-w-6xl max-h-[92vh]'
        } ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-white'}`}
      >
        {/* Modal Header */}
        <div
          className={`px-5 py-3.5 flex items-center justify-between border-b transition ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-900'
              : 'bg-slate-950 border-slate-800 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                alert.riskLevel === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                  : alert.riskLevel === 'HIGH'
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-base font-extrabold text-[#004B87]">
                  {alert.id}
                </span>
                <span className="text-slate-400">•</span>
                <span className="font-mono text-sm font-semibold text-slate-600">
                  {alert.txnId}
                </span>

                {/* Status Badge */}
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    alert.status === 'NEW'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : alert.status === 'IN_REVIEW'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : alert.status === 'PENDING_APPROVAL'
                      ? 'bg-purple-100 text-purple-900 border border-purple-300'
                      : alert.status === 'CONFIRMED_FRAUD'
                      ? 'bg-rose-100 text-rose-900 border border-rose-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  {alert.status === 'NEW' && 'MỚI - CHƯA TIẾP NHẬN'}
                  {alert.status === 'IN_REVIEW' && 'ĐANG ĐIỀU TRA'}
                  {alert.status === 'PENDING_APPROVAL' && 'CHỜ CHECKER DUYỆT'}
                  {alert.status === 'CONFIRMED_FRAUD' && 'XÁC NHẬN GIAN LẬN'}
                  {alert.status === 'FALSE_POSITIVE' && 'CẢNH BÁO GIẢ'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Thời gian: {formatDateTime(alert.timestamp)} • Kênh: {alert.payload.channel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Expand / Restore Fullscreen Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1.5 rounded-lg border transition ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isExpanded ? 'Thu nhỏ cửa sổ' : 'Mở rộng toàn màn hình (Expand)'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition ${
                isLight
                  ? 'hover:bg-slate-200 text-slate-500'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* REQUIREMENT 6: Side-by-Side 2-Column Split Workbench */}
        {/* User can view data on the Left and DECIDE IMMEDIATELY on the Right without scrolling! */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* LEFT COLUMN: Data & Investigation Evidence (Scrolls independently if needed) */}
          <div className="lg:col-span-7 xl:col-span-7 overflow-y-auto p-5 space-y-4 border-r border-slate-200/80">
            {/* 1. Transaction Amount & Channel Header */}
            <div
              className={`p-4 rounded-xl border ${
                isLight
                  ? 'bg-gradient-to-r from-blue-50/60 to-slate-50 border-blue-100'
                  : 'bg-slate-800/80 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Giá trị giao dịch cảnh báo
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#004B87] font-mono mt-0.5">
                    {formatVND(alert.amount)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Kênh xử lý:</span>
                  <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-900 text-xs font-bold font-mono border border-blue-200 inline-block mt-0.5">
                    {alert.payload.channel}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Sender & Receiver Cards with Masking */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Sender */}
              <div
                className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-800/90 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b">
                  <span className="font-bold flex items-center gap-1.5 text-blue-700">
                    <User className="w-3.5 h-3.5" />
                    <span>Bên phát lệnh (Khách hàng NCB)</span>
                  </span>
                  <button
                    onClick={() => setUnmaskNumber(!unmaskNumber)}
                    className="text-[10px] text-slate-500 hover:text-blue-600 flex items-center gap-1"
                    title="Bảo mật PCI-DSS masking 6 số giữa"
                  >
                    {unmaskNumber ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{unmaskNumber ? 'Ẩn' : 'Hiện số'}</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Họ và tên:</span>
                    <strong className={isLight ? 'text-slate-900' : 'text-slate-100'}>
                      {alert.customerName}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mã CIF NCB:</span>
                    <span className="font-mono font-semibold text-slate-900">{alert.cif}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tài khoản / Thẻ:</span>
                    <span className="font-mono font-bold text-blue-700">
                      {unmaskNumber ? alert.accountOrCard : maskSensitiveNumber(alert.accountOrCard)}
                    </span>
                  </div>
                  {alert.payload.balanceBeforeTxn !== undefined && (
                    <div className="flex justify-between pt-1 border-t text-[11px]">
                      <span className="text-slate-400">Số dư Trước ➔ Sau:</span>
                      <span className="font-mono text-slate-700">
                        {formatVND(alert.payload.balanceBeforeTxn)} ➔ {formatVND(alert.payload.balanceAfterTxn)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Receiver */}
              <div
                className={`p-3.5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-800/90 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-700">
                    <Building className="w-3.5 h-3.5" />
                    <span>Bên thụ hưởng (Beneficiary)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{alert.payload.receiverBank}</span>
                </div>

                <div className="space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tên người nhận:</span>
                    <strong className={isLight ? 'text-slate-900' : 'text-slate-100'}>
                      {alert.payload.receiverName}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">TK người nhận:</span>
                    <span className="font-mono text-slate-900">
                      {unmaskNumber
                        ? alert.payload.receiverAccount
                        : maskSensitiveNumber(alert.payload.receiverAccount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ngân hàng:</span>
                    <span className="text-slate-800 font-medium">{alert.payload.receiverBank}</span>
                  </div>
                  {alert.payload.mcc && (
                    <div className="flex justify-between pt-1 border-t text-[11px]">
                      <span className="text-slate-400">Mã ngành MCC:</span>
                      <span className="font-bold text-amber-700">
                        {alert.payload.mcc} ({alert.payload.mccDescription || 'Rủi ro'})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Device & Network Fingerprint */}
            <div
              className={`p-3.5 rounded-xl border text-xs ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-700'
              }`}
            >
              <div className="font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Dấu vết Thiết bị & Mạng kết nối (Fingerprint)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Địa chỉ IP:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {alert.payload.clientIp}
                  </span>
                  {alert.payload.isVpnOrTor && (
                    <span className="ml-1 text-[9px] bg-rose-600 text-white px-1 py-0.2 rounded font-bold">
                      TOR/VPN
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 block">Quốc gia/Vị trí:</span>
                  <span className="font-semibold text-slate-900">{alert.payload.ipCountry}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tên thiết bị:</span>
                  <span className="font-medium text-slate-900 truncate block" title={alert.payload.deviceName}>
                    {alert.payload.deviceName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Device ID:</span>
                  <span className="font-mono text-slate-700 truncate block text-[10px]" title={alert.payload.deviceId}>
                    {alert.payload.deviceId}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Violated Rules List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Kịch bản Vi phạm ({alert.violatedRules.length} kịch bản)</span>
                </span>
                <span className="text-[11px] text-slate-500">Fraud Rules Engine</span>
              </div>

              <div className="space-y-2">
                {alert.violatedRuleDetails.map((rule) => (
                  <div
                    key={rule.ruleCode}
                    className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded text-[11px] border border-rose-300">
                          {rule.ruleCode}
                        </span>
                        <strong className="text-slate-900">{rule.ruleName}</strong>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200">
                        {rule.category}
                      </span>
                    </div>
                    <p className="text-rose-950 font-medium leading-relaxed pl-2 border-l-2 border-rose-500 text-[11px]">
                      {rule.triggerReason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Raw Payload Accordion */}
            <div>
              <button
                onClick={() => setShowRawPayload(!showRawPayload)}
                className="text-xs text-slate-500 hover:text-blue-700 flex items-center gap-1 font-mono"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{showRawPayload ? 'Ẩn Raw JSON Payload' : 'Xem Raw JSON Payload (F2.3)'}</span>
              </button>
              {showRawPayload && (
                <pre className="mt-2 p-3 bg-slate-950 text-emerald-400 font-mono text-[10px] rounded-lg overflow-x-auto max-h-40 border border-slate-800">
                  {JSON.stringify(alert.payload, null, 2)}
                </pre>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: DECISION & ACTION WORKBENCH (ALWAYS IN VIEWPORT - NO SCROLL DOWN REQUIRED!) */}
          <div
            className={`lg:col-span-5 xl:col-span-5 p-5 flex flex-col justify-between overflow-y-auto ${
              isLight ? 'bg-slate-50/90' : 'bg-slate-900'
            }`}
          >
            <div className="space-y-4">
              {/* Decision Section Header */}
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-sm tracking-tight text-slate-900">
                    Phân hệ Ra quyết định & Xử lý (Decision Workbench)
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  F2.4
                </span>
              </div>

              {/* Status & Role Context Banner */}
              <div
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Vai trò của bạn:</span>
                  <span className="font-bold text-blue-700">{currentUser?.role || 'Guest'} ({currentUser?.name})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Trạng thái hồ sơ:</span>
                  <span className="font-mono font-bold text-slate-800">{alert.status}</span>
                </div>
                {alert.status === 'NEW' && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 mt-2 font-medium">
                    ⚡ Hồ sơ vừa phát sinh tự động, chưa có ai xử lý. Bạn có thể thụ lý và ra quyết định ngay dưới đây.
                  </p>
                )}
              </div>

              {/* Decision Form: If Maker and workable */}
              {canDecide ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nhập lý do giải trình nghiệp vụ / Kết quả đối soát (Bắt buộc):
                    </label>
                    <textarea
                      id="txt-maker-comment"
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                        if (validationError) setValidationError('');
                      }}
                      placeholder="Ví dụ: Đã liên hệ trực tiếp chủ tài khoản xác minh, khách hàng xác nhận bị lừa cài ứng dụng giả mạo..."
                      rows={4}
                      className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs ${
                        isLight ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-600 text-white'
                      }`}
                    />
                    {validationError && (
                      <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{validationError}</span>
                      </p>
                    )}
                  </div>

                  {/* USER REQUEST 1: ATTACHMENT SECTION FOR MAKER (Hồ sơ / Biên bản ngoại luồng) */}
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                        <span>Đính kèm Hồ sơ / Biên bản đã duyệt ngoại luồng</span>
                      </label>
                      <span className="text-[10px] text-slate-400">PDF, Word, Excel, Ảnh</span>
                    </div>

                    {/* Upload button & Quick sample attachments */}
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 shadow-2xs transition">
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Tải tệp từ máy tính</span>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => handleAddSampleAttachment('Bien_ban_goi_xac_minh_chu_tai_khoan_NCB.pdf')}
                        className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[11px] font-semibold text-blue-800 transition"
                        title="Thêm nhanh biên bản gọi điện xác minh khách hàng"
                      >
                        + Biên bản xác minh KH (.pdf)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddSampleAttachment('To_trinh_phe_duyet_ngoai_luong_GD.docx')}
                        className="px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-[11px] font-semibold text-emerald-800 transition"
                        title="Thêm nhanh tờ trình ngoại luồng"
                      >
                        + Tờ trình ngoại luồng (.docx)
                      </button>
                    </div>

                    {/* Attached files list */}
                    {attachments.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <File className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span className="font-medium text-slate-800 truncate" title={att.name}>
                                {att.name}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                ({(att.size / 1024).toFixed(0)} KB)
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(att.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 transition"
                              title="Xóa tệp"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2 LARGE ACTION BUTTONS (NO SCROLLING NEEDED!) */}
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    <button
                      id="btn-maker-confirm-fraud"
                      onClick={() => handleDecision('CONFIRM_FRAUD')}
                      className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>[Xác nhận Gian lận (Confirm Fraud)]</span>
                    </button>

                    <button
                      id="btn-maker-clear-fraud"
                      onClick={() => handleDecision('CLEAR_FRAUD')}
                      className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                        isLight
                          ? 'border-emerald-600 bg-white hover:bg-emerald-50 text-emerald-700'
                          : 'border-emerald-600 bg-slate-800 hover:bg-emerald-950/60 text-emerald-400'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>[Đánh dấu Cảnh báo giả (Clear of Fraud)]</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 italic leading-relaxed pt-1">
                    * Lưu ý chuẩn Maker - Checker: Sau khi submit, hồ sơ chuyển sang <strong>Hàng đợi Duyệt (PENDING_APPROVAL)</strong> để Checker thẩm định và phê duyệt kết luận cuối cùng.
                  </p>
                </div>
              ) : alert.status === 'PENDING_APPROVAL' ? (
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50 text-xs text-purple-900 space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600 shrink-0" />
                    <span className="font-semibold">
                      Hồ sơ đã được Maker lập đề xuất và đang chờ Kiểm soát viên (Checker) phê duyệt.
                    </span>
                  </div>

                  {(isChecker || isAdmin) && onNavigateToReviewQueue && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToReviewQueue();
                      }}
                      className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <span>Mở Hàng đợi Duyệt của Checker</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-600 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Hồ sơ đã hoàn tất phê duyệt cuối cùng: {alert.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Dấu vết kiểm toán (Audit Trail) được lưu trữ bất biến theo tiêu chuẩn ISO 27001 & Quyết định 2345.
                  </p>
                </div>
              )}

              {/* Action History / Workflow Audit Trail */}
              {(alert.makerComment || alert.checkerComment || (alert.makerAttachments && alert.makerAttachments.length > 0) || (alert.checkerAttachments && alert.checkerAttachments.length > 0)) && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-500" />
                    <span>Lịch sử xử lý Maker - Checker & Bằng chứng đính kèm</span>
                  </div>

                  {alert.makerComment && (
                    <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px]">
                      <div className="flex items-center justify-between text-blue-900 font-semibold mb-1">
                        <span>Maker: {alert.makerName} ({alert.makerDecision === 'CONFIRM_FRAUD' ? 'Đề xuất Gian lận' : 'Đề xuất Hợp lệ'})</span>
                        <span className="text-[10px] text-slate-400">
                          {alert.makerDecidedAt ? formatDateTime(alert.makerDecidedAt) : ''}
                        </span>
                      </div>
                      <p className="text-slate-700 italic">"{alert.makerComment}"</p>

                      {/* Maker attachments display */}
                      {alert.makerAttachments && alert.makerAttachments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-blue-100/80 space-y-1">
                          <span className="text-[10px] font-bold text-blue-800 block">
                            Tài liệu Maker đính kèm ({alert.makerAttachments.length} tệp):
                          </span>
                          {alert.makerAttachments.map((f) => (
                            <div
                              key={f.id}
                              className="flex items-center justify-between p-1.5 rounded bg-white border border-blue-200 text-[11px]"
                            >
                              <span className="flex items-center gap-1.5 text-blue-950 truncate">
                                <Paperclip className="w-3 h-3 text-blue-600 shrink-0" />
                                <span className="truncate">{f.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                  ({(f.size / 1024).toFixed(0)} KB)
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDownloadAttachment(f)}
                                className="text-blue-700 hover:text-blue-900 text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-blue-50 transition"
                              >
                                <Download className="w-3 h-3" />
                                <span>Tải về</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {alert.checkerComment && (
                    <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-[11px]">
                      <div className="flex items-center justify-between text-emerald-900 font-semibold mb-1">
                        <span>Checker: {alert.checkerName} ({alert.checkerDecision === 'APPROVED' ? 'ĐÃ DUYỆT' : 'TỪ CHỐI'})</span>
                        <span className="text-[10px] text-slate-400">
                          {alert.checkerDecidedAt ? formatDateTime(alert.checkerDecidedAt) : ''}
                        </span>
                      </div>
                      <p className="text-slate-700 italic">"{alert.checkerComment}"</p>

                      {/* Checker attachments display */}
                      {alert.checkerAttachments && alert.checkerAttachments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-emerald-100/80 space-y-1">
                          <span className="text-[10px] font-bold text-emerald-800 block">
                            Tài liệu Checker đính kèm ({alert.checkerAttachments.length} tệp):
                          </span>
                          {alert.checkerAttachments.map((f) => (
                            <div
                              key={f.id}
                              className="flex items-center justify-between p-1.5 rounded bg-white border border-emerald-200 text-[11px]"
                            >
                              <span className="flex items-center gap-1.5 text-emerald-950 truncate">
                                <Paperclip className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate">{f.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                  ({(f.size / 1024).toFixed(0)} KB)
                                </span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDownloadAttachment(f)}
                                className="text-emerald-700 hover:text-emerald-900 text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-emerald-50 transition"
                              >
                                <Download className="w-3 h-3" />
                                <span>Tải về</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t flex items-center justify-between text-xs text-slate-500 mt-4">
              <span>Hội sở chính NCB • PCI-DSS</span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
