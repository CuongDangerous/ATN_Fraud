/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Plus,
  Edit2,
  Trash2,
  Lock,
  CheckCircle2,
  Building,
  KeyRound,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface UserManagementViewProps {
  users: UserProfile[];
  onAddUser: (user: Omit<UserProfile, 'id' | 'entraId'>) => void;
  onToggleUserStatus: (userId: string) => void;
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onAddUser,
  onToggleUserStatus,
  onUpdateUserRole,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Maker');
  const [department, setDepartment] = useState('Khối Quản lý Rủi ro & Gian lận');
  const [branch, setBranch] = useState('Hội sở chính NCB - 28 Lê Thái Tổ, Hà Nội');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!name.trim() || !email.trim()) {
      setError('Vui lòng nhập đầy đủ Họ tên và Email NCB');
      return;
    }
    if (!email.includes('@')) {
      setError('Email không đúng định dạng');
      return;
    }
    onAddUser({
      name: name.trim(),
      email: email.trim(),
      role,
      department,
      branch,
      status: 'ACTIVE',
    });
    setName('');
    setEmail('');
    setError('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Quản trị Người dùng & Phân quyền (User & Group CRUD - F5.2)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Đồng bộ từ Microsoft Entra ID (Azure AD SSO - F5.1). Phân định rạch ròi vai trò Maker, Checker và Admin theo quy định an toàn thông tin ngân hàng.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Người dùng mới</span>
        </button>
      </div>

      {/* SSO Status Banner */}
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600 text-white font-bold text-xs">
            AZURE AD
          </div>
          <div>
            <p className="font-bold text-white flex items-center gap-1.5">
              <span>Đồng bộ Microsoft Entra ID SSO: Đang kết nối</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Tenant ID: <span className="font-mono">ncb-bank-vn-prod-directory-001</span> • Đồng bộ lần cuối: 2 phút trước
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Đã kiểm tra và đồng bộ lại danh mục người dùng từ Entra ID')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Kiểm tra Sync Entra ID</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-semibold border-b border-slate-800">
              <th className="py-3.5 px-4">Tài khoản & Email</th>
              <th className="py-3.5 px-4">Phân quyền (Role)</th>
              <th className="py-3.5 px-4">Đơn vị & Phòng ban</th>
              <th className="py-3.5 px-4">Entra ID Object ID</th>
              <th className="py-3.5 px-3 text-center">Trạng thái</th>
              <th className="py-3.5 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition">
                {/* Name & Email */}
                <td className="py-3.5 px-4">
                  <strong className="text-slate-900 text-xs block">{u.name}</strong>
                  <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
                </td>

                {/* Role dropdown */}
                <td className="py-3.5 px-4">
                  <select
                    value={u.role}
                    onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                    className="p-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none bg-white"
                  >
                    <option value="Maker">Maker (Chuyên viên Rủi ro)</option>
                    <option value="Checker">Checker (Kiểm soát viên)</option>
                    <option value="Admin">Admin (Quản trị viên)</option>
                  </select>
                </td>

                {/* Dept & Branch */}
                <td className="py-3.5 px-4 text-slate-600">
                  <p className="font-medium text-slate-800">{u.department}</p>
                  <p className="text-[11px] text-slate-400">{u.branch}</p>
                </td>

                {/* Entra ID */}
                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                  {u.entraId}
                </td>

                {/* Status Toggle */}
                <td className="py-3.5 px-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      u.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {u.status === 'ACTIVE' ? 'HOẠT ĐỘNG' : 'ĐÃ KHÓA'}
                  </span>
                </td>

                {/* Lock/Unlock action */}
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => onToggleUserStatus(u.id)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      u.status === 'ACTIVE'
                        ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {u.status === 'ACTIVE' ? 'Khóa TK (Disable)' : 'Mở khóa (Enable)'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-150">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
              Thêm Người dùng Hệ thống Rủi ro
            </h3>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Họ và tên cán bộ:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Đỗ Mạnh Hùng"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email NCB:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hung.dm@ncb-bank.vn"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Vai trò (Role):
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                >
                  <option value="Maker">Maker (Chuyên viên Rủi ro)</option>
                  <option value="Checker">Checker (Kiểm soát viên)</option>
                  <option value="Admin">Admin (Quản trị viên)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Phòng ban:
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none text-xs"
                />
              </div>

              {error && <p className="text-rose-600 text-xs font-semibold">{error}</p>}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold"
              >
                Tạo mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
