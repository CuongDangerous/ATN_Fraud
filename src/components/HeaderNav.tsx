/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  CheckCheck,
  SlidersHorizontal,
  FileCheck,
  Users,
  LogOut,
  Bell,
  Building2,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  Sun,
  Moon,
  Lock,
} from 'lucide-react';
import { UserProfile, NotificationItem, NavigationTab, UserRole } from '../types';
import { NcbLogo } from './logos/NcbLogo';
import { AtnLogo } from './logos/AtnLogo';

interface HeaderNavProps {
  currentUser: UserProfile | null;
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onLogout: () => void;
  onOpenLogin: () => void;
  pendingReviewCount: number;
  newAlertCount: number;
  notifications: NotificationItem[];
  onMarkNotificationAsRead: (id: string) => void;
  onSelectAlertFromNotif: (alertId: string) => void;
  onExportReport?: () => void;
  onSwitchRole?: (role: UserRole) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentUser,
  currentTab,
  onSelectTab,
  onLogout,
  onOpenLogin,
  pendingReviewCount,
  newAlertCount,
  notifications,
  onMarkNotificationAsRead,
  onSelectAlertFromNotif,
  onExportReport,
  onSwitchRole,
  theme = 'light',
  onToggleTheme,
}) => {
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const isLight = theme === 'light';

  return (
    <header
      className={`border-b shadow-sm sticky top-0 z-40 transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-slate-900 border-slate-800 text-white'
      }`}
    >
      {/* 1. Top Enterprise Branding & Executive Metadata Bar */}
      <div
        className={`border-b px-4 py-2 sm:px-6 transition-colors duration-200 ${
          isLight
            ? 'bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 border-slate-200/90 text-slate-700'
            : 'bg-gradient-to-r from-slate-950 via-slate-900 to-[#0A192F] border-slate-800/80 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
          
          {/* Official Co-Branding: NCB & ATN */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* Official NCB Bank Logo (Exact image file) */}
            <div className="flex items-center">
              <NcbLogo variant="badge" height={28} />
            </div>

            {/* Hairline Divider */}
            <div
              className={`h-6 w-px hidden sm:block ${
                isLight ? 'bg-slate-300' : 'bg-slate-700/80'
              }`}
            />

            {/* Official ATN Technology Partner Logo */}
            <div className="flex items-center">
              <AtnLogo theme={isLight ? 'light' : 'dark'} height={24} showTagline={true} />
            </div>

            {/* Hairline Divider */}
            <div
              className={`h-6 w-px hidden md:block ${
                isLight ? 'bg-slate-300' : 'bg-slate-700/80'
              }`}
            />

            {/* System Title & Compliance Standard */}
            <div
              className={`hidden lg:flex items-center gap-2 ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              <span
                className={`font-bold tracking-wide text-xs ${
                  isLight ? 'text-[#004B87]' : 'text-white'
                }`}
              >
                FRAUDGUARD
              </span>
              <span className={isLight ? 'text-slate-400' : 'text-slate-500'}>•</span>
              <span className={`text-[11px] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                Hệ thống Quản trị & Giám sát Rủi ro Gian lận Giao dịch Số
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ml-1 ${
                  isLight
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                }`}
              >
                QĐ 2345/QĐ-NHNN
              </span>
            </div>
          </div>

          {/* Right Section: Officer Profile, Role Badge, Dark/Light Mode, Notifications */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto md:ml-0">
            {/* Theme Toggle Button (Light Mode / Dark Mode) */}
            {onToggleTheme && (
              <button
                id="btn-toggle-theme"
                onClick={onToggleTheme}
                className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-medium ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300'
                }`}
                title={isLight ? 'Chuyển sang chế độ Tối (Dark Mode)' : 'Chuyển sang chế độ Sáng (Light Mode)'}
              >
                {isLight ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span className="hidden sm:inline text-[11px]">Chế độ Tối</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span className="hidden sm:inline text-[11px] text-slate-200">Chế độ Sáng</span>
                  </>
                )}
              </button>
            )}

            {currentUser ? (
              <>
                {/* Unit Tag */}
                <div
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                      : 'bg-slate-800/70 border-slate-700/50 text-slate-300'
                  }`}
                >
                  <Building2 className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Đơn vị:</span>
                  <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    Hội sở chính NCB
                  </span>
                </div>

                {/* Real-time Notification Bell */}
                <div className="relative">
                  <button
                    id="btn-notif-bell"
                    onClick={() => {
                      setShowNotifPopover(!showNotifPopover);
                      setShowUserMenu(false);
                    }}
                    className={`relative p-1.5 rounded-md transition-colors ${
                      isLight
                        ? 'hover:bg-slate-100 text-slate-700'
                        : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                    title="Thông báo cảnh báo gian lận"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                        {unreadNotifCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {showNotifPopover && (
                    <div
                      className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl p-3 z-50 text-xs border ${
                        isLight
                          ? 'bg-white border-slate-200 text-slate-800 shadow-slate-300/60'
                          : 'bg-slate-900 border-slate-700 text-slate-200 shadow-2xl'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between pb-2 border-b mb-2 ${
                          isLight ? 'border-slate-200' : 'border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-sm">
                          <Bell className={`w-4 h-4 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                          <span className={isLight ? 'text-slate-900' : 'text-white'}>
                            Cảnh báo thời gian thực
                          </span>
                        </div>
                        <span className={isLight ? 'text-[11px] text-slate-500' : 'text-[11px] text-slate-400'}>
                          {unreadNotifCount} chưa đọc
                        </span>
                      </div>

                      <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                        {notifications.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              onMarkNotificationAsRead(item.id);
                              if (item.linkAlertId) {
                                onSelectAlertFromNotif(item.linkAlertId);
                                setShowNotifPopover(false);
                              }
                            }}
                            className={`p-2.5 rounded-lg border transition cursor-pointer ${
                              isLight
                                ? item.read
                                  ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                                  : 'bg-blue-50/80 border-blue-200 text-slate-800 hover:bg-blue-100/70'
                                : item.read
                                ? 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800/70'
                                : 'bg-blue-950/40 border-blue-800/60 text-slate-100 hover:bg-blue-900/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <span
                                className={`font-semibold text-xs ${
                                  isLight ? 'text-slate-900' : 'text-white'
                                }`}
                              >
                                {item.title}
                              </span>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {new Date(item.timestamp).toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                              {item.message}
                            </p>
                            {item.linkAlertId && (
                              <div
                                className={`mt-1 flex items-center gap-1 text-[10px] font-semibold ${
                                  isLight ? 'text-blue-700' : 'text-blue-400'
                                }`}
                              >
                                <span>Mở hồ sơ {item.linkAlertId}</span>
                                <ExternalLink className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Officer Account Card & Dropdown */}
                <div className="relative">
                  <button
                    id="btn-user-menu"
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifPopover(false);
                    }}
                    className={`flex items-center gap-2 p-1 pl-2 rounded-lg border transition ${
                      isLight
                        ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-2xs'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-white'
                    }`}
                    title="Thông tin cán bộ & vai trò"
                  >
                    <div className="flex flex-col text-left leading-tight hidden sm:block">
                      <span className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {currentUser.name}
                      </span>
                      <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {currentUser.department}
                      </span>
                    </div>

                    {/* Role badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentUser.role === 'Admin'
                          ? 'bg-purple-100 text-purple-800 border border-purple-300'
                          : currentUser.role === 'Checker'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {currentUser.role}
                    </span>

                    <ChevronDown className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                  </button>

                  {/* User Profile Popover */}
                  {showUserMenu && (
                    <div
                      className={`absolute right-0 mt-2 w-72 rounded-xl shadow-2xl p-3 z-50 text-xs border ${
                        isLight
                          ? 'bg-white border-slate-200 text-slate-800 shadow-slate-300/70'
                          : 'bg-slate-900 border-slate-700 text-slate-200 shadow-2xl'
                      }`}
                    >
                      <div
                        className={`pb-2.5 mb-2.5 border-b ${
                          isLight ? 'border-slate-200' : 'border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                            {currentUser.name.charAt(0)}
                          </div>
                          <div>
                            <div className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {currentUser.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {currentUser.email}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 text-[11px] space-y-1 text-slate-500">
                          <div>
                            Chi nhánh:{' '}
                            <strong className={isLight ? 'text-slate-800' : 'text-slate-300'}>
                              {currentUser.branch}
                            </strong>
                          </div>
                          <div>
                            Microsoft Entra ID:{' '}
                            <code className="text-[10px] text-blue-600 font-mono">
                              {currentUser.entraId}
                            </code>
                          </div>
                        </div>
                      </div>

                      {/* Quick Switch Role Selector */}
                      {onSwitchRole && (
                        <div
                          className={`py-2 border-b ${
                            isLight ? 'border-slate-200' : 'border-slate-800'
                          }`}
                        >
                          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Chuyển nhanh vai trò kiểm thử:
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            {(['Maker', 'Checker', 'Admin'] as UserRole[]).map((r) => (
                              <button
                                key={r}
                                onClick={() => {
                                  onSwitchRole(r);
                                  setShowUserMenu(false);
                                }}
                                className={`px-2 py-1 rounded text-center text-[10px] font-semibold border transition ${
                                  currentUser.role === r
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : isLight
                                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                                }`}
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 flex flex-col gap-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onOpenLogin();
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded font-medium text-xs transition ${
                            isLight
                              ? 'hover:bg-slate-100 text-blue-700'
                              : 'hover:bg-slate-800 text-blue-400'
                          }`}
                        >
                          Đổi tài khoản xác thực khác...
                        </button>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onLogout();
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded font-medium text-xs flex items-center gap-1.5 transition ${
                            isLight
                              ? 'hover:bg-red-50 text-red-600'
                              : 'hover:bg-red-950/60 text-red-400'
                          }`}
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Đăng xuất phiên làm việc</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                id="btn-nav-login"
                onClick={onOpenLogin}
                className="px-3 py-1.5 bg-[#004B87] hover:bg-[#003B6B] text-white font-semibold rounded-lg text-xs transition shadow-xs"
              >
                Đăng nhập Microsoft Entra ID
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar with Enterprise Banking Styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center overflow-x-auto py-2 gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium scrollbar-none">
          {/* Dashboard */}
          <button
            id="nav-dashboard"
            onClick={() => onSelectTab('DASHBOARD')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition whitespace-nowrap ${
              currentTab === 'DASHBOARD'
                ? isLight
                  ? 'bg-[#004B87] text-white shadow-xs font-semibold'
                  : 'bg-blue-600 text-white shadow-sm font-semibold'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 shrink-0 ${isLight ? 'text-blue-200' : 'text-slate-300'}`} />
            <span>Tổng quan Rủi ro</span>
          </button>

          {/* Alert Queue */}
          <button
            id="nav-alerts"
            onClick={() => onSelectTab('ALERTS')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition whitespace-nowrap ${
              currentTab === 'ALERTS'
                ? isLight
                  ? 'bg-[#004B87] text-white shadow-xs font-semibold'
                  : 'bg-blue-600 text-white shadow-sm font-semibold'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldAlert className={`w-4 h-4 shrink-0 ${isLight ? 'text-amber-300' : 'text-amber-400'}`} />
            <span>Danh sách Cảnh báo</span>
            {newAlertCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                {newAlertCount}
              </span>
            )}
          </button>

          {/* Review Queue (Maker / Checker) */}
          <button
            id="nav-review-queue"
            onClick={() => onSelectTab('REVIEW')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition whitespace-nowrap ${
              currentTab === 'REVIEW'
                ? isLight
                  ? 'bg-[#004B87] text-white shadow-xs font-semibold'
                  : 'bg-blue-600 text-white shadow-sm font-semibold'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <CheckCheck className={`w-4 h-4 shrink-0 ${isLight ? 'text-emerald-300' : 'text-emerald-400'}`} />
            <span>Hàng đợi Phê duyệt</span>
            {pendingReviewCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                {pendingReviewCount}
              </span>
            )}
          </button>

          {/* Rule Management: REQUIREMENT 3 - CHỈ CHO ADMIN */}
          {currentUser?.role === 'Admin' && (
            <button
              id="nav-rules"
              onClick={() => onSelectTab('RULES')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition whitespace-nowrap ${
                currentTab === 'RULES'
                  ? isLight
                    ? 'bg-[#004B87] text-white shadow-xs font-semibold'
                    : 'bg-blue-600 text-white shadow-sm font-semibold'
                  : isLight
                  ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <SlidersHorizontal className={`w-4 h-4 shrink-0 ${isLight ? 'text-cyan-300' : 'text-cyan-400'}`} />
              <span>Cấu hình Kịch bản (25 Rules)</span>
              <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                Admin
              </span>
            </button>
          )}

          {/* Audit Log */}
          <button
            id="nav-audit"
            onClick={() => onSelectTab('AUDIT')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition whitespace-nowrap ${
              currentTab === 'AUDIT'
                ? isLight
                  ? 'bg-[#004B87] text-white shadow-xs font-semibold'
                  : 'bg-blue-600 text-white shadow-sm font-semibold'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileCheck className={`w-4 h-4 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
            <span>Nhật ký Kiểm toán</span>
          </button>

          {/* Admin User Management */}
          {currentUser?.role === 'Admin' && (
            <button
              id="nav-users"
              onClick={() => onSelectTab('USERS')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition whitespace-nowrap ${
                currentTab === 'USERS'
                  ? 'bg-purple-600 text-white shadow-xs font-semibold'
                  : isLight
                  ? 'text-purple-700 hover:bg-purple-50'
                  : 'text-purple-300 hover:bg-slate-800 hover:text-purple-200'
              }`}
            >
              <Users className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Phân quyền Người dùng</span>
            </button>
          )}

          {/* BRD Document: PO / BA Baseline Specification */}
          <button
            id="nav-brd"
            onClick={() => onSelectTab('BRD')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition whitespace-nowrap ${
              currentTab === 'BRD'
                ? isLight
                  ? 'bg-[#004B87] text-white shadow-xs font-semibold'
                  : 'bg-blue-600 text-white shadow-sm font-semibold'
                : isLight
                ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className={`w-4 h-4 shrink-0 ${isLight ? 'text-amber-500' : 'text-amber-400'}`} />
            <span>Tài liệu BRD</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
              currentTab === 'BRD'
                ? 'bg-white/20 text-white'
                : isLight
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-amber-950/60 text-amber-300 border border-amber-800/80'
            }`}>
              PO/BA
            </span>
          </button>

          {/* Export Report Utility Action */}
          {onExportReport && (
            <div className="ml-auto pl-2">
              <button
                id="nav-export-report"
                onClick={onExportReport}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition whitespace-nowrap text-xs font-medium border ${
                  isLight
                    ? 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-300'
                    : 'text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border-slate-700/60'
                }`}
                title="Xuất báo cáo PDF, Excel, CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span>Xuất Báo cáo</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
