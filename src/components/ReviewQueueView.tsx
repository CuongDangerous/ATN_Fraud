/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  Lock,
  UserCheck,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Paperclip,
  Upload,
  Trash2,
  File,
  Download,
} from 'lucide-react';
import { AlertItem, UserProfile, AttachmentFile } from '../types';
import { formatVND, formatDateTime, maskSensitiveNumber } from '../utils/masking';

interface ReviewQueueViewProps {
  currentUser: UserProfile | null;
  alerts: AlertItem[];
  onApprove: (alertId: string, comment: string, attachments?: AttachmentFile[]) => void;
  onReject: (alertId: string, comment: string, attachments?: AttachmentFile[]) => void;
  onOpenDetail: (alert: AlertItem) => void;
  onSwitchToChecker?: () => void;
}

export const ReviewQueueView: React.FC<ReviewQueueViewProps> = ({
  currentUser,
  alerts,
  onApprove,
  onReject,
  onOpenDetail,
  onSwitchToChecker,
}) => {
  const [selectedAlertForAction, setSelectedAlertForAction] = useState<AlertItem | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [checkerComment, setCheckerComment] = useState('');
  const [validationError, setValidationError] = useState('');
  const [checkerAttachments, setCheckerAttachments] = useState<AttachmentFile[]>([]);

  // 1. Access Control: Maker click vào sẽ báo "Access Denied" as strictly required by prompt
  if (currentUser?.role === 'Maker') {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 shadow-sm max-w-2xl mx-auto my-12 text-center animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Quyền truy cập bị từ chối (Access Denied - 403)
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Bạn đang đăng nhập với vai trò <strong>Maker</strong> (Chuyên viên Phòng chống Gian lận). Theo nguyên tắc Kiểm soát nội bộ <strong>Four-Eyes Principle (Maker - Checker)</strong> của NCB, chỉ người dùng có quyền <strong>Checker</strong> (Kiểm soát viên) hoặc <strong>Admin</strong> mới được truy cập Hàng đợi Phê duyệt.
        </p>

        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-left space-y-1.5">
          <p className="font-semibold text-slate-700">Quy định tuân thủ Ngân hàng Nhà nước:</p>
          <p>• Người lập đề xuất (Maker) không được quyền tự phê duyệt hồ sơ.</p>
          <p>• Hồ sơ ở trạng thái PENDING_APPROVAL phải do Checker độc lập thẩm định.</p>
        </div>

        {onSwitchToChecker && (
          <div className="mt-6">
            <button
              onClick={onSwitchToChecker}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
            >
              Chuyển sang tài khoản Checker để duyệt hồ sơ
            </button>
          </div>
        )}
      </div>
    );
  }

  // Pending Approval Alerts
  const pendingAlerts = alerts.filter((a) => a.status === 'PENDING_APPROVAL');

  const handleSubmitAction = () => {
    if (!selectedAlertForAction || !actionType) return;
    if (!checkerComment.trim()) {
      setValidationError('Vui lòng nhập ý kiến kiểm soát / nhận xét phê duyệt (Bắt buộc)');
      return;
    }

    if (actionType === 'APPROVE') {
      onApprove(selectedAlertForAction.id, checkerComment.trim(), checkerAttachments);
    } else {
      onReject(selectedAlertForAction.id, checkerComment.trim(), checkerAttachments);
    }

    setSelectedAlertForAction(null);
    setActionType(null);
    setCheckerComment('');
    setCheckerAttachments([]);
    setValidationError('');
  };

  const handleCheckerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newAttachments: AttachmentFile[] = files.map((f, idx) => ({
      id: `ATT-CHK-${Date.now()}-${idx}`,
      name: f.name,
      size: f.size,
      type: f.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser?.name || 'Checker',
    }));
    setCheckerAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleAddSampleCheckerAttachment = (sampleName: string) => {
    const sample: AttachmentFile = {
      id: `ATT-CHK-SAMPLE-${Date.now()}`,
      name: sampleName,
      size: 512000,
      type: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser?.name || 'Checker',
    };
    setCheckerAttachments((prev) => [...prev, sample]);
  };

  const handleDownloadAttachment = (fileItem: AttachmentFile) => {
    const content = `NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN QUỐC DÂN (NCB)\nHỆ THỐNG FRAUDGUARD - TÀI LIỆU CHỨNG TỪ KIỂM SOÁT VIÊN\n\nTên tài liệu: ${fileItem.name}\nMã tài liệu: ${fileItem.id}\nDung lượng: ${(fileItem.size / 1024).toFixed(0)} KB\nThời gian tải lên: ${fileItem.uploadedAt}\nNgười đính kèm: ${fileItem.uploadedBy}\n`;
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

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span>Hàng đợi Duyệt của Checker (Review Queue - F4.1)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thẩm định hồ sơ do Maker đề xuất. Phê duyệt chuyển thành CONFIRMED_FRAUD / FALSE_POSITIVE, hoặc Từ chối trả về IN_REVIEW.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            {pendingAlerts.length} hồ sơ chờ duyệt
          </span>
        </div>
      </div>

      {/* Pending Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold border-b border-slate-800">
                <th className="py-3 px-4 whitespace-nowrap">Mã Cảnh báo</th>
                <th className="py-3 px-4 whitespace-nowrap">Khách hàng & Giao dịch</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Số tiền (VND)</th>
                <th className="py-3 px-4 whitespace-nowrap">Maker & Đề xuất</th>
                <th className="py-3 px-4 whitespace-nowrap">Lý do giải trình của Maker</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Hành động Phê duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
                    <p className="font-semibold text-slate-700">Hàng đợi rỗng</p>
                    <p className="text-xs text-slate-500">
                      Hiện tại không có hồ sơ nào ở trạng thái PENDING_APPROVAL chờ duyệt.
                    </p>
                  </td>
                </tr>
              ) : (
                pendingAlerts.map((alert) => {
                  // Rule F4.2: Self-approval check!
                  const isSelfCreated =
                    alert.makerId && currentUser?.id && alert.makerId === currentUser.id;

                  return (
                    <tr
                      key={alert.id}
                      className="hover:bg-slate-50/80 transition duration-150"
                    >
                      {/* Alert ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-blue-700 text-xs">
                          {alert.id}
                        </div>
                        <div className="font-mono text-[11px] text-slate-500">
                          {alert.txnId}
                        </div>
                        <button
                          onClick={() => onOpenDetail(alert)}
                          className="mt-1 text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Chi tiết payload</span>
                        </button>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 block">{alert.customerName}</strong>
                        <div className="text-[11px] text-slate-500">
                          TK: <span className="font-mono font-semibold">{maskSensitiveNumber(alert.accountOrCard)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {formatDateTime(alert.timestamp)}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {formatVND(alert.amount)}
                        </span>
                        <div className="text-[10px] text-rose-600 font-semibold">
                          Điểm rủi ro: {alert.riskScore}/100
                        </div>
                      </td>

                      {/* Maker & Proposed Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-slate-900 font-semibold">
                          {alert.makerName || 'Maker phân bổ'}
                        </div>
                        <div className="mt-1">
                          {alert.makerDecision === 'CONFIRM_FRAUD' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              Đề xuất: Xác nhận Gian lận
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Đề xuất: Cảnh báo giả (Clear)
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {alert.makerDecidedAt ? formatDateTime(alert.makerDecidedAt) : ''}
                        </span>
                      </td>

                      {/* Maker rationale */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-700 italic text-[11px] line-clamp-3 bg-slate-50 p-2 rounded border border-slate-200">
                          "{alert.makerComment || 'Không có giải trình'}"
                        </p>
                      </td>

                      {/* Checker Actions: [Phê duyệt (Approve)] hoặc [Từ chối (Reject)] as required */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isSelfCreated ? (
                          <div className="text-center p-2 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-800 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 mx-auto mb-0.5 text-amber-600" />
                            <span>Cấm tự phê duyệt (F4.2)</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            {/* Approve */}
                            <button
                              id={`btn-approve-${alert.id.toLowerCase()}`}
                              onClick={() => {
                                setSelectedAlertForAction(alert);
                                setActionType('APPROVE');
                                setCheckerComment(
                                  alert.makerDecision === 'CONFIRM_FRAUD'
                                    ? 'Đồng ý với kết quả điều tra của Maker. Phê duyệt xác nhận gian lận và thi hành các biện pháp chế tài phòng chống thất thoát.'
                                    : 'Đồng ý phân loại False Positive (Cảnh báo giả). Lưu hồ sơ phục vụ đánh giá trọng số kịch bản.'
                                );
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs shadow-sm transition flex items-center gap-1"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>[Phê duyệt (Approve)]</span>
                            </button>

                            {/* Reject */}
                            <button
                              id={`btn-reject-${alert.id.toLowerCase()}`}
                              onClick={() => {
                                setSelectedAlertForAction(alert);
                                setActionType('REJECT');
                                setCheckerComment(
                                  'Yêu cầu Maker điều tra bổ sung: Cần tra soát thêm thông tin sinh trắc học và lịch sử thiết bị đăng nhập trước khi ra quyết định cuối cùng.'
                                );
                              }}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-xs shadow-sm transition flex items-center gap-1"
                            >
                              <ShieldX className="w-3.5 h-3.5" />
                              <span>[Từ chối (Reject)]</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checker Decision Confirmation Modal */}
      {selectedAlertForAction && actionType && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div
                className={`p-2.5 rounded-xl ${
                  actionType === 'APPROVE'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {actionType === 'APPROVE' ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : (
                  <ShieldX className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {actionType === 'APPROVE'
                    ? 'Xác nhận Phê duyệt Quyết định (Approve)'
                    : 'Từ chối Đề xuất & Trả về Điều tra (Reject)'}
                </h3>
                <p className="text-xs text-slate-500">
                  Hồ sơ: {selectedAlertForAction.id} ({selectedAlertForAction.customerName})
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Đề xuất ban đầu của Maker:</span>
                <strong className="text-slate-900">
                  {selectedAlertForAction.makerDecision === 'CONFIRM_FRAUD'
                    ? 'Xác nhận Gian lận (CONFIRMED_FRAUD)'
                    : 'Cảnh báo giả (FALSE_POSITIVE)'}
                </strong>
                <p className="text-slate-600 mt-1 italic">
                  "{selectedAlertForAction.makerComment}"
                </p>
              </div>

              {/* USER REQUEST 1: Display Maker's attached documents */}
              {selectedAlertForAction.makerAttachments && selectedAlertForAction.makerAttachments.length > 0 && (
                <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200 space-y-1.5">
                  <span className="text-blue-900 font-bold block flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                    <span>Hồ sơ / Biên bản ngoại luồng Maker đính kèm ({selectedAlertForAction.makerAttachments.length} tệp):</span>
                  </span>
                  <div className="space-y-1">
                    {selectedAlertForAction.makerAttachments.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-1.5 rounded bg-white border border-blue-200 text-[11px]"
                      >
                        <span className="flex items-center gap-1.5 text-blue-950 truncate">
                          <File className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{f.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({(f.size / 1024).toFixed(0)} KB)
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDownloadAttachment(f)}
                          className="text-blue-700 hover:text-blue-900 text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-blue-50 transition"
                        >
                          <Download className="w-3 h-3" />
                          <span>Tải về xem</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* USER REQUEST 1: Checker attachment upload */}
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đính kèm Tờ trình phê duyệt ngoại luồng của Kiểm soát viên:</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Tùy chọn</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-100 text-xs font-medium text-slate-700">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tải tệp KSV</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleCheckerFileUpload}
                      className="hidden"
                      accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddSampleCheckerAttachment('To_trinh_phe_duyet_KSV_NCB.pdf')}
                    className="px-2 py-1 rounded-md border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-[11px] font-medium text-emerald-800"
                  >
                    + Tờ trình KSV mẫu (.pdf)
                  </button>
                </div>
                {checkerAttachments.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {checkerAttachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200 text-xs"
                      >
                        <span className="flex items-center gap-1.5 truncate text-slate-800">
                          <File className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{att.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({(att.size / 1024).toFixed(0)} KB)
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCheckerAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ý kiến của Kiểm soát viên / Checker Comment (Bắt buộc):
                </label>
                <textarea
                  id="txt-checker-comment"
                  value={checkerComment}
                  onChange={(e) => {
                    setCheckerComment(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  rows={3}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
                {validationError && (
                  <p className="text-rose-600 text-xs font-semibold mt-1">
                    {validationError}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedAlertForAction(null);
                  setActionType(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Hủy bỏ
              </button>

              <button
                id="btn-confirm-checker-decision"
                onClick={handleSubmitAction}
                className={`px-4 py-2 rounded-lg text-white text-xs font-bold shadow-sm transition ${
                  actionType === 'APPROVE'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {actionType === 'APPROVE'
                  ? 'Xác nhận Phê duyệt hoàn tất'
                  : 'Xác nhận Từ chối trả về IN_REVIEW'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
