/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sliders,
  Power,
  Edit3,
  History,
  Search,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Clock,
  Save,
  X,
  FileCheck,
  Lock,
  ShieldX,
} from 'lucide-react';
import { FraudRule, RuleCategory, UserProfile } from '../types';

interface RuleManagementViewProps {
  rules: FraudRule[];
  currentUser: UserProfile | null;
  onToggleRuleStatus: (ruleId: string) => void;
  onUpdateThreshold: (
    ruleId: string,
    newThresholds: Record<string, number>,
    changeSummary: string
  ) => void;
  theme?: 'light' | 'dark';
}

export const RuleManagementView: React.FC<RuleManagementViewProps> = ({
  rules,
  currentUser,
  onToggleRuleStatus,
  onUpdateThreshold,
  theme = 'light',
}) => {
  const isLight = theme === 'light';
  const isAdmin = currentUser?.role === 'Admin';

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRule, setEditingRule] = useState<FraudRule | null>(null);
  const [tempThresholds, setTempThresholds] = useState<Record<string, number>>({});
  const [changeSummary, setChangeSummary] = useState('');
  const [versioningRule, setVersioningRule] = useState<FraudRule | null>(null);
  const [validationError, setValidationError] = useState('');

  // REQUIREMENT 3: If not Admin, show strict Access Denied screen
  if (!isAdmin) {
    return (
      <div
        className={`p-8 rounded-2xl border text-center max-w-2xl mx-auto my-12 transition ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm text-slate-800'
            : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center mb-4 border border-purple-200 shadow-xs">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-2">
          Quyền truy cập hạn chế (Phân quyền Admin)
        </h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Phân hệ <strong>Cấu hình Kịch bản Gian lận (Fraud Rules Engine)</strong> tác động trực tiếp đến toàn bộ luồng phát hiện giao dịch số tại Hội sở NCB, chỉ cho phép cán bộ có vai trò <strong>Quản trị viên (Admin)</strong> thao tác.
        </p>

        <div
          className={`p-4 rounded-xl border text-left text-xs mb-6 ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
          }`}
        >
          <div className="font-semibold mb-1 text-slate-900">Thông tin phiên hiện tại:</div>
          <div>Cán bộ: <strong>{currentUser?.name || 'Chưa đăng nhập'}</strong></div>
          <div>Vai trò hiện hành: <span className="font-bold text-blue-600">{currentUser?.role || 'Guest'}</span></div>
          <div className="text-slate-400 mt-1">Yêu cầu quyền hạn: <span className="font-bold text-purple-600">Admin</span></div>
        </div>

        <p className="text-xs text-slate-400">
          * Nếu bạn đang kiểm thử trong môi trường Sandbox, hãy chọn vai trò <strong>Admin</strong> trên thanh công cụ kiểm thử ở đầu trang để vào phân hệ này.
        </p>
      </div>
    );
  }

  const categories: { key: string; label: string; range: string }[] = [
    { key: 'ALL', label: 'Tất cả 25 Kịch bản', range: 'R01 - R25' },
    { key: 'VELOCITY', label: 'Nhóm 1: Vận tốc & Tần suất', range: 'R01 - R05' },
    { key: 'VOLUME', label: 'Nhóm 2: Giá trị & Hạn mức', range: 'R06 - R10' },
    { key: 'GEO_DEVICE', label: 'Nhóm 3: Không gian & Thiết bị', range: 'R11 - R15' },
    { key: 'COUNTERPARTY', label: 'Nhóm 4: Đối tác & Kênh', range: 'R16 - R20' },
    { key: 'TECHNICAL', label: 'Nhóm 5: Kỹ thuật & Blacklist', range: 'R21 - R25' },
  ];

  const filteredRules = rules.filter((rule) => {
    const matchCat = selectedCategory === 'ALL' || rule.category === selectedCategory;
    const matchSearch =
      !searchTerm.trim() ||
      rule.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenEdit = (rule: FraudRule) => {
    setEditingRule(rule);
    setTempThresholds({ ...rule.thresholds });
    setChangeSummary('');
    setValidationError('');
  };

  const handleSaveThresholds = () => {
    if (!editingRule) return;
    if (!changeSummary.trim()) {
      setValidationError('Vui lòng nhập lý do điều chỉnh ngưỡng (bắt buộc lưu vết audit log)');
      return;
    }

    onUpdateThreshold(editingRule.id, tempThresholds, changeSummary.trim());
    setEditingRule(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border transition ${
          isLight
            ? 'bg-white border-slate-200 shadow-xs'
            : 'bg-slate-900 border-slate-800 shadow-md text-white'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Quản trị Kịch bản Gian lận (25 Fraud Rules Engine)
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Chỉ dành cho Admin
            </span>
          </div>
          <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Động cơ 25 luật tĩnh tham số hóa. Hỗ trợ Bật/Tắt tức thì, tinh chỉnh ngưỡng định lượng và quản lý lịch sử phiên bản.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>25/25 Rules nạp từ Core Engine</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`p-4 rounded-xl border space-y-3 transition ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        {/* Search */}
        <div className="relative">
          <Search className={`w-4 h-4 absolute left-3 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo mã kịch bản (R01, R02...), tên quy tắc hoặc mô tả..."
            className={`w-full pl-9 pr-4 py-2 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-800 border-slate-700 text-white'
            }`}
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1 text-xs">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1.5 rounded-lg border transition font-medium text-xs ${
                selectedCategory === c.key
                  ? 'bg-[#004B87] border-[#004B87] text-white shadow-2xs font-semibold'
                  : isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
            >
              <span>{c.label}</span>
              <span
                className={`ml-1.5 text-[10px] ${
                  selectedCategory === c.key ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                ({c.range})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Rules Table */}
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
                <th className="py-3.5 px-4 whitespace-nowrap">Mã Luật</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Tên Kịch bản & Nhóm</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Mô tả Logic Rủi ro</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Giá trị Ngưỡng (Threshold)</th>
                <th className="py-3.5 px-3 text-center whitespace-nowrap">Trạng thái</th>
                <th className="py-3.5 px-3 text-center whitespace-nowrap">Tần suất Kích hoạt</th>
                <th className="py-3.5 px-4 text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800'}`}>
              {filteredRules.map((rule) => (
                <tr
                  key={rule.id}
                  className={`transition ${
                    isLight ? 'hover:bg-blue-50/40' : 'hover:bg-slate-800/60'
                  }`}
                >
                  {/* Mã Luật */}
                  <td className="py-3.5 px-4 align-top">
                    <span className="font-mono font-extrabold text-blue-700 text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {rule.code}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                      v{rule.version}.0
                    </span>
                  </td>

                  {/* Tên Kịch bản & Nhóm */}
                  <td className="py-3.5 px-4 align-top min-w-[200px]">
                    <strong className={`block text-xs ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                      {rule.name}
                    </strong>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {rule.categoryName}
                    </span>
                  </td>

                  {/* Mô tả */}
                  <td className="py-3.5 px-4 align-top max-w-[320px]">
                    <p className={`leading-relaxed text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                      {rule.description}
                    </p>
                  </td>

                  {/* Giá trị Ngưỡng hiện tại */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="space-y-1">
                      {rule.thresholdParams.map((p) => {
                        const val = rule.thresholds[p.key] ?? p.value;
                        return (
                          <div
                            key={p.key}
                            className={`flex items-center justify-between gap-3 text-[11px] px-2 py-1 rounded border font-mono ${
                              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                            }`}
                          >
                            <span className="text-slate-500 font-sans">{p.label}:</span>
                            <span className="font-bold text-blue-700">
                              {typeof val === 'number' && val >= 1000000
                                ? (val / 1000000).toLocaleString('vi-VN') + 'M ' + p.unit
                                : val.toLocaleString('vi-VN') + ' ' + p.unit}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </td>

                  {/* Trạng thái (Active/Paused) */}
                  <td className="py-3.5 px-3 align-top text-center">
                    <button
                      id={`btn-toggle-${rule.code.toLowerCase()}`}
                      onClick={() => onToggleRuleStatus(rule.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                        rule.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
                      }`}
                      title="Click để Bật/Tắt kịch bản"
                    >
                      <Power className="w-3 h-3" />
                      <span>{rule.status === 'ACTIVE' ? 'ACTIVE' : 'PAUSED'}</span>
                    </button>
                  </td>

                  {/* Tần suất trigger */}
                  <td className="py-3.5 px-3 align-top text-center">
                    <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                      {rule.triggerCount}
                    </span>
                    <span className="text-[10px] text-slate-400 block">lần phát hiện</span>
                  </td>

                  {/* Nút bấm [Sửa Threshold] + Xem Version History */}
                  <td className="py-3.5 px-4 align-top text-center whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-center">
                      <button
                        id={`btn-edit-threshold-${rule.code.toLowerCase()}`}
                        onClick={() => handleOpenEdit(rule)}
                        className="px-2.5 py-1 rounded border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>[Sửa Threshold]</span>
                      </button>

                      {rule.versions && rule.versions.length > 0 && (
                        <button
                          onClick={() => setVersioningRule(rule)}
                          className="text-[10px] text-slate-500 hover:text-blue-600 flex items-center gap-0.5 mt-0.5"
                        >
                          <History className="w-3 h-3" />
                          <span>Lịch sử v{rule.version}.0 ({rule.versions.length})</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Threshold */}
      {editingRule && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-2xl border shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  {editingRule.code}
                </span>
                <h3 className="font-bold text-base">Điều chỉnh Ngưỡng Tham số</h3>
              </div>
              <button
                onClick={() => setEditingRule(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">{editingRule.description}</p>

            <div className="space-y-4">
              {editingRule.thresholdParams.map((p) => {
                const currentVal = tempThresholds[p.key] ?? p.value;
                return (
                  <div key={p.key} className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {p.label} ({p.unit}):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step={p.step || 1}
                        min={p.min || 0}
                        value={currentVal}
                        onChange={(e) =>
                          setTempThresholds({
                            ...tempThresholds,
                            [p.key]: Number(e.target.value),
                          })
                        }
                        className={`w-full p-2.5 rounded-lg border text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700 text-white'
                        }`}
                      />
                      <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
                        {p.unit}
                      </span>
                    </div>
                  </div>
                );
              })}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lý do điều chỉnh (Bắt buộc theo F6.2 Versioning Audit):
                </label>
                <textarea
                  value={changeSummary}
                  onChange={(e) => {
                    setChangeSummary(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  rows={2}
                  placeholder="Ví dụ: Nâng ngưỡng cảnh báo theo quyết định rủi ro tháng 09/2026..."
                  className={`w-full text-xs p-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700 text-white'
                  }`}
                />
                {validationError && (
                  <p className="text-xs text-rose-600 mt-1 font-semibold">{validationError}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setEditingRule(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveThresholds}
                className="px-4 py-2 rounded-lg bg-[#004B87] hover:bg-[#003B6B] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu & Ban hành Phiên bản mới</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Version History */}
      {versioningRule && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-2xl border shadow-2xl max-w-lg w-full p-6 max-h-[85vh] flex flex-col ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm">
                  Lịch sử Phiên bản: {versioningRule.code} - {versioningRule.name}
                </h3>
              </div>
              <button
                onClick={() => setVersioningRule(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              <div className="p-3 rounded-lg border bg-blue-50/50 border-blue-200">
                <div className="flex items-center justify-between font-bold text-blue-900 mb-1">
                  <span>Phiên bản hiện tại (v{versioningRule.version}.0)</span>
                  <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Cập nhật lần cuối: {versioningRule.lastUpdated}
                </p>
              </div>

              {versioningRule.versions.map((ver) => (
                <div key={ver.version} className="p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-800">
                      Phiên bản v{ver.version}.0
                    </span>
                    <span className="text-[10px] text-slate-400">{ver.updatedAt}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">Người điều chỉnh: <strong>{ver.updatedBy}</strong></p>
                  <p className="text-slate-700 text-xs italic bg-slate-50 p-2 rounded border border-slate-100">
                    "{ver.changeSummary}"
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t mt-3 text-right">
              <button
                onClick={() => setVersioningRule(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
