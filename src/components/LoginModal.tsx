/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  KeyRound,
  UserCheck,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { NcbLogo } from './logos/NcbLogo';
import { AtnLogo } from './logos/AtnLogo';

interface LoginModalProps {
  isOpen: boolean;
  onSelectRole?: (role: UserRole) => void;
  onSelectUser?: (user: UserProfile) => void;
  users: UserProfile[];
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onSelectRole,
  onSelectUser,
  users,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleChoose = (role: UserRole) => {
    if (onSelectRole) onSelectRole(role);
    if (onSelectUser) {
      const u = users.find((item) => item.role === role);
      if (u) onSelectUser(u);
    }
  };

  const makerUser = users.find((u) => u.role === 'Maker');
  const checkerUser = users.find((u) => u.role === 'Checker');
  const adminUser = users.find((u) => u.role === 'Admin');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition z-10"
            title="Đóng cửa sổ"
          >
            ✕
          </button>
        )}

        {/* Header with Co-Branding NCB & ATN */}
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 p-6 border-b border-slate-800 text-center relative">
          <div className="flex items-center justify-center gap-4 mb-4">
            <NcbLogo variant="badge" height={32} />
            <div className="h-8 w-px bg-slate-700/80" />
            <AtnLogo theme="dark" height={28} showTagline={true} />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Cổng Xác Thực Quản Trị Rủi Ro FRAUDGUARD
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-normal mt-1">
            Hệ thống Giám sát & Phòng ngừa Gian lận Giao dịch Số – NCB
          </p>

          <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mô phỏng xác thực Microsoft Entra ID (Azure AD SSO)</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5">
            <Building className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">
                Ngân hàng TMCP Quốc Dân (NCB) • Hội sở chính
              </p>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Vui lòng chọn vai trò để khởi tạo phiên làm việc với quyền hạn
                tương ứng theo nguyên tắc kiểm soát kép Four-Eyes Principle.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {/* 1. Maker */}
            <button
              id="btn-login-maker"
              onClick={() => handleChoose('Maker')}
              className="w-full text-left p-4 rounded-xl border border-blue-500/30 bg-slate-800/50 hover:bg-blue-950/40 hover:border-blue-500/60 transition group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      Chuyên viên Giám sát (Maker)
                    </span>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-semibold rounded">
                      Phòng QLRR
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {makerUser?.name || 'Nguyễn Văn An'} • {makerUser?.email}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Quyền hạn: Tiếp nhận hồ sơ, tra cứu dữ liệu, đề xuất phân loại gian lận.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition" />
            </button>

            {/* 2. Checker */}
            <button
              id="btn-login-checker"
              onClick={() => handleChoose('Checker')}
              className="w-full text-left p-4 rounded-xl border border-amber-500/30 bg-slate-800/50 hover:bg-amber-950/30 hover:border-amber-500/60 transition group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      Kiểm soát viên Phê duyệt (Checker)
                    </span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-semibold rounded">
                      Trưởng bộ phận
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {checkerUser?.name || 'Trần Thị Bích Ngọc'} • {checkerUser?.email}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Quyền hạn: Thẩm định hồ sơ PENDING, phê duyệt/từ chối (Four-Eyes).
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
            </button>

            {/* 3. Admin */}
            <button
              id="btn-login-admin"
              onClick={() => handleChoose('Admin')}
              className="w-full text-left p-4 rounded-xl border border-purple-500/30 bg-slate-800/50 hover:bg-purple-950/30 hover:border-purple-500/60 transition group flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      Quản trị viên Hệ thống (Admin)
                    </span>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-semibold rounded">
                      IT Risk Admin
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {adminUser?.name || 'Lê Hoàng Minh'} • {adminUser?.email}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Quyền hạn: Cấu hình 25 Rule, quản trị tài khoản, kiểm tra Audit Log.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 text-center text-slate-500 text-[11px] flex items-center justify-between px-6">
          <div className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tiêu chuẩn Bảo mật Ngân hàng Nhà nước Việt Nam</span>
          </div>
          <span className="text-slate-500 text-[10px]">
            Phát triển bởi ATN
          </span>
        </div>
      </div>
    </div>
  );
};
