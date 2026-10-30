# Tài liệu Yêu cầu Nghiệp vụ (BRD) - NCB FraudGuard Anti-Fraud Monitoring System

Kế hoạch xây dựng và tích hợp Tài liệu Yêu cầu Nghiệp vụ (Business Requirements Document - BRD) chuẩn Ngân hàng được lập bởi Product Owner / IT Business Analyst nhằm chốt phạm vi chức năng (Scope Baseline), tiêu chí nghiệm thu (Acceptance Criteria) và cơ chế tuân thủ Quyết định 2345/QĐ-NHNN, Thông tư 09/TT-NHNN, đi kèm tính năng xem trực tiếp trên hệ thống và xuất file Microsoft Word chuẩn định dạng văn bản ngân hàng.

## User Review & Critical Decisions

> [!IMPORTANT]
> Hai quyết định quan trọng đã được thống nhất trực tiếp qua phỏng vấn người dùng:

- **Confirmed Decision 1 (Phương thức tiếp nhận)**: Tích hợp chế độ xem văn bản BRD trực quan ngay trên hệ thống web (tab riêng biệt "Tài liệu BRD" trên thanh điều hướng) đồng thời cung cấp nút hành động xuất ra file Microsoft Word (`.doc`) định dạng chuẩn báo cáo ngân hàng để lưu hành nội bộ và trình duyệt ký.
- **Confirmed Decision 2 (Cấp độ chi tiết & Trọng tâm)**: Tài liệu được biên soạn theo chuẩn BRD Ngân hàng chuyên nghiệp, tập trung chốt danh mục 6 nhóm tính năng cốt lõi (F1 đến F6), bảng tiêu chí nghiệm thu chức năng (Functional Acceptance Criteria), ma trận phân quyền (RACI/RBAC), và ánh xạ quy chuẩn tuân thủ Ngân hàng Nhà nước.

---

## 1. Overview & Core Concept

- **What It Does**: Cung cấp một tài liệu BRD hoàn chỉnh, chuẩn chỉnh văn phong ngân hàng (Ngân hàng TMCP Quốc Dân - NCB), hệ thống hóa toàn bộ kiến trúc giải pháp phòng chống gian lận NCB FraudGuard. Hệ thống cho phép người dùng đọc trực tiếp tài liệu có cấu trúc với mục lục điều hướng, chỉ mục điều khoản, bảng biểu chi tiết, và cho phép tải về dưới dạng file Microsoft Word với đầy đủ tiêu đề cơ quan, số hiệu tài liệu, bảng ký duyệt (Sign-off Matrix).
- **Target Audience / Persona**:
  - *Product Owner (PO) & IT Business Analyst (BA)*: Sử dụng làm tài liệu cơ sở chốt phạm vi (Scope Baseline) với Hội đồng Công nghệ & Nghiệp vụ trước khi phân rã FSD/SRS chi tiết.
  - *Bộ phận Quản trị Rủi ro Hoạt động & Vận hành Thẻ/Tài khoản*: Nghiệm thu các kịch bản luật giám sát và luồng xử lý cảnh báo Four-Eyes.
  - *Đoàn Kiểm toán & Thanh tra Giám sát NHNN*: Đối soát tính bất biến của nhật ký kiểm toán và quy trình bảo vệ dữ liệu người dùng.
- **Key Value**: Chấm dứt sự phân mảnh tài liệu, đảm bảo 100% các tính năng đang vận hành trên hệ sinh thái (Trang nhắc việc Maker, Hàng đợi cảnh báo, Đính kèm hồ sơ giải trình, Hàng đợi phê duyệt Checker, 25 kịch bản luật, Báo cáo kiểm toán Excel/CSV) được chuẩn hóa văn bản hóa đồng bộ với hệ thống.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Truy cập Văn kiện BRD**: Người dùng nhấn vào mục "Tài liệu BRD" trên thanh điều hướng chính (Top Navigation / Sidebar).
2. **Duyệt & Tra cứu Nội dung**: Giao diện hiển thị văn bản theo cấu trúc tài liệu hành chính ngân hàng với Sidebar mục lục (Table of Contents) liên kết nhanh đến từng phần:
   - Phần 1: Giới thiệu & Mục tiêu Dự án (Project Charter & Objectives)
   - Phần 2: Căn cứ Pháp lý & Chuẩn Tuân thủ (NHNN QĐ 2345, TT 09, Four-Eyes Principle)
   - Phần 3: Chốt Danh mục & Phạm vi Tính năng (F1 đến F6)
   - Phần 4: Ma trận Phân quyền & Quản trị Rủi ro (RBAC Matrix & Data Masking)
   - Phần 5: Tiêu chí Nghiệm thu Chức năng (Acceptance Criteria & Sign-off Matrix)
3. **Xuất File Microsoft Word**: Người dùng nhấn nút `[Xuất file Word (.doc)]`. Hệ thống tự động biên dịch toàn bộ nội dung HTML được nhúng CSS in ấn chuyên nghiệp (A4, font Times New Roman / Segoe UI, bảng viền chuẩn, header/footer ngân hàng) và tải xuống file `.doc` chuẩn xác, mở được trực tiếp trên Microsoft Word / Office 365.

### Visual Identity & Theme
- **Bố cục Văn bản**: Nền tài liệu màu trắng ngà thanh lịch (`#FFFFFF` / `#FAFAFA` trong chế độ sáng, `#1E293B` trong chế độ tối), lề trang chuẩn văn bản tài chính, viền phân tách mỏng tinh tế (`1px solid #E2E8F0`).
- **Typography**: Phông chữ văn bản chuẩn ngân hàng (`Plus Jakarta Sans` cho giao diện web và quy đổi `Times New Roman / Calibri` trong file Word xuất ra). Phân cấp tiêu đề rõ ràng từ Heading 1 đến Heading 4.
- **Bảng biểu Dữ liệu**: Tất cả bảng ma trận tính năng, vai trò người dùng và tiêu chí nghiệm thu được căn lề chuẩn xác, số thứ tự dùng `tabular-nums`.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Kỹ thuật Xuất File Word Phía Client (Client-Side Word Export)**:
  - *Phương án lựa chọn*: Sử dụng định dạng HTML-Word chuẩn hóa (`application/msword;charset=utf-8`) kèm XML Namespace Office (`urn:schemas-microsoft-com:office:office`) và CSS `@page` (khổ A4, lề 2cm, ngắt trang chuyên nghiệp).
  - *Lý do*: Tạo file nhanh tức thì trong 0.2 giây mà không cần phụ thuộc thư viện nặng ngoài luồng hay backend trung gian, tương thích hoàn toàn với Microsoft Word, Google Docs, LibreOffice và bảo toàn 100% định dạng bảng biểu, màu sắc thương hiệu NCB.
- **Decision 2: Tích hợp Trực tiếp vào Điều hướng Hệ thống (Main Navigation)**:
  - *Phương án lựa chọn*: Bổ sung tab "Tài liệu BRD" trên thanh điều hướng chính của hệ thống.
  - *Lý do*: Giúp lãnh đạo, kiểm toán viên hoặc thành viên nhóm dự án có thể đối chiếu ngay lập tức giữa mô tả yêu cầu nghiệp vụ trong BRD và trải nghiệm tính năng thực tế trên ứng dụng.

---

## 4. Technical Architecture & Data Strategy

### Component Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                          NCB FraudGuard Header                         │
│  [Tổng quan] [Hàng đợi Cảnh báo] [Luật] [Checker] [Kiểm toán] [Tài liệu BRD] │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ Active Tab: 'brd'
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BRDViewer Component                             │
│  ┌───────────────────────┐ ┌─────────────────────────────────────────┐  │
│  │   Table of Contents   │ │         Document Content View           │  │
│  │ 1. Tổng quan & Mục tiêu│ │ ┌───────────────────────────────────┐ │  │
│  │ 2. Căn cứ Pháp lý      │ │ │ Header: NCB / Khối CNTT & QTRR     │ │  │
│  │ 3. Phạm vi F1 - F6     │ │ │ Bảng Baseline Tính năng F1 - F6   │ │  │
│  │ 4. Ma trận Phân quyền │ │ │ Tiêu chí Nghiệm thu & Chữ ký      │ │  │
│  │ 5. Tiêu chí Nghiệm thu │ │ └───────────────────────────────────┘ │  │
│  └───────────────────────┘ └─────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Action Bar: [Sao chép Mục lục] [In Tài liệu] [Xuất file Word (.doc)]│  │
│  └───────────────────────────────────┬───────────────────────────────┘  │
└──────────────────────────────────────┼─────────────────────────────────┘
                                       │ exportToWordDocument()
                                       ▼
                       Blob: 'BRD_NCB_FraudGuard_v1.0.doc'
                       (Formatted HTML + Office XML metadata)
```

### Chi tiết 6 Nhóm Tính năng Chốt trong BRD (Feature Scope Baseline)

1. **F1: Trung tâm Điều hành & Trang Nhắc Việc (Dashboard & Maker Workbench)**
   - F1.1: Bộ chỉ số KPI trọng yếu thời gian thực (Cảnh báo mới, Chờ phê duyệt, Tỷ lệ gian lận, Thời gian phản hồi SLA).
   - F1.2: Biểu đồ phân bổ 5 nhóm gian lận và Top 5 quy tắc bị kích hoạt nhiều nhất.
   - F1.3: Trang nhắc việc thông minh cho Maker (Thông báo số lượng hồ sơ tồn đọng, mức độ khẩn cấp SLA, danh sách ưu tiên hành động và nút "Xử lý ngay hồ sơ ưu tiên tiếp theo").
2. **F2: Hàng đợi Cảnh báo & Thẩm định Hồ sơ Maker (Alert Investigation Workbench)**
   - F2.1: Bộ lọc đa tiêu chí (Mức độ rủi ro, Trạng thái, Kênh giao dịch, Phân loại gian lận, Mã cảnh báo/CIF/Tài khoản).
   - F2.2: Cửa sổ chi tiết cảnh báo toàn diện (Thông tin giao dịch, khách hàng, thiết bị, vị trí địa lý, điểm số rủi ro).
   - F2.3: Bảng đối chiếu giao dịch bất thường (Biến động số dư đột biến, số dư trước/sau, lịch sử cảnh báo gần nhất).
   - F2.4: Luồng xử lý Maker (Phân loại kết luận: Nghi ngờ/Giả mạo/Bình thường, nhập biên bản giải trình nghiệp vụ, đính kèm file tài liệu minh chứng dạng PDF/DOC/XLS/ảnh và chuyển phê duyệt Checker).
3. **F3: Quản trị Kịch bản Luật Giám sát Gian lận (Fraud Rule Engine Management)**
   - F3.1: Danh mục 25 kịch bản luật chuẩn quốc tế phân nhóm theo 5 danh mục nghiệp vụ.
   - F3.2: Bật/Tắt kích hoạt kịch bản luật theo thời gian thực.
   - F3.3: Tùy biến tham số ngưỡng cảnh báo (Hạn mức tiền, khoảng thời gian giây/phút, số lần thử sai, độ lệch địa lý).
   - F3.4: Quản lý phiên bản kịch bản và cơ chế hoàn tác (Rollback) an toàn.
4. **F4: Hàng đợi Phê duyệt Checker & Nguyên tắc Bốn Mắt (Review Queue & Four-Eyes Principle)**
   - F4.1: Phân tách trách nhiệm triệt để (Checker không được duyệt hồ sơ do chính mình xử lý).
   - F4.2: Thẩm định hồ sơ Maker: Xem biên bản giải trình và toàn bộ tệp đính kèm do Maker gửi lên.
   - F4.3: Quyết định Checker: Phê duyệt (Approve) hoặc Trả về yêu cầu giải trình lại (Reject/Return), nhập ý kiến chỉ đạo và đính kèm biên bản phê duyệt.
5. **F5: Quản trị Người dùng & Bảo mật Phân quyền (RBAC & Data Masking)**
   - F5.1: 3 vai trò phân quyền hệ thống (Maker - Thẩm định viên, Checker - Kiểm soát viên, Admin - Quản trị hệ thống).
   - F5.2: Ma trận phân quyền truy cập chức năng chi tiết.
   - F5.3: Cơ chế che dấu dữ liệu nhạy cảm (Data Masking) cho Số thẻ, CIF, Số tài khoản thanh toán theo quy chuẩn bảo mật ngân hàng.
6. **F6: Nhật ký Kiểm toán Bất biến & Báo cáo Tuân thủ (Audit Trail & Compliance Reporting)**
   - F6.1: Ghi nhận nhật ký kiểm toán bất biến theo nguyên tắc WORM (Write Once, Read Many).
   - F6.2: Lưu trữ hồ sơ giải trình cảnh báo giả (False Positive) tối thiểu 5 năm phục vụ thanh tra.
   - F6.3: Xuất báo cáo kiểm toán linh hoạt ra định dạng Microsoft Excel (`.xlsx`/`.csv`) và CSV chuẩn UTF-8 kèm bộ lọc phạm vi dữ liệu.

---

## 5. Verification Plan

1. **Kiểm tra tính hoàn chỉnh của tài liệu**:
   - Đối chiếu đầy đủ 6 nhóm chức năng F1 đến F6, ma trận nghiệm thu, bảng phân quyền và các căn cứ pháp lý NHNN.
2. **Kiểm tra chức năng giao diện web**:
   - Tab "Tài liệu BRD" hiển thị chuẩn xác, không ảnh hưởng đến các tab nghiệp vụ hiện tại.
   - Menu mục lục (TOC) cuộn mượt mà đến từng phần văn bản.
3. **Kiểm tra tính năng Xuất file Word**:
   - Nhấn `[Xuất file Word (.doc)]` tải về tệp có dung lượng hợp lệ, mở trên Microsoft Word hiển thị đầy đủ bảng biểu, màu sắc tiêu đề và căn lề chuyên nghiệp.
4. **Biên dịch mã nguồn**:
   - Chạy `compile_applet` và `lint_applet` để xác nhận 0 lỗi cú pháp hoặc tương thích.
