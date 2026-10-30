# TÀI LIỆU YÊU CẦU NGHIỆP VỤ (BRD)
## HỆ THỐNG GIÁM SÁT & CẢNH BÁO PHÒNG CHỐNG GIAN LẬN GIAO DỊCH (NCB FRAUDGUARD)
**Mã tài liệu:** BRD-NCB-FG-2026-V1.0  
**Tổ chức ban hành:** Ngân hàng TMCP Quốc Dân (NCB) – Khối Công nghệ Thông tin & Khối Quản trị Rủi ro  
**Vai trò soạn thảo:** Product Owner (PO) / IT Business Analyst (BA)  
**Tình trạng tài liệu:** Chốt phạm vi nghiệp vụ (Baseline Approved)  
**Ngày hiệu lực:** 2026  

---

## 1. THÔNG TIN QUẢN TRỊ TÀI LIỆU (DOCUMENT CONTROL)

### 1.1. Lịch sử Thay đổi Phiên bản
| Phiên bản | Ngày cập nhật | Tác giả | Đơn vị | Tóm tắt nội dung thay đổi |
| :--- | :--- | :--- | :--- | :--- |
| **v0.1** | 10/2026 | IT Business Analyst | Khối CNTT | Khởi thảo phạm vi tính năng giám sát gian lận ban đầu |
| **v0.5** | 10/2026 | Product Owner | Ban Dự án FraudGuard | Bổ sung 25 kịch bản luật, ma trận phân quyền Maker/Checker/Admin |
| **v1.0** | 10/2026 | PO / Lead BA | Ban Dự án NCB FraudGuard | **Chốt phạm vi Baseline**: Trang nhắc việc Maker, Đính kèm hồ sơ giải trình/phê duyệt, Xuất báo cáo kiểm toán Excel/CSV |

### 1.2. Bảng Ký duyệt Chốt Phạm vi (Sign-off Matrix)
| Vai trò | Họ và tên | Chức danh | Đơn vị | Chữ ký / Xác nhận |
| :--- | :--- | :--- | :--- | :--- |
| **Product Owner** | Trần Hoàng Quân | Trưởng phòng QTRR Số | Khối Quản trị Rủi ro | *Đã ký duyệt phạm vi* |
| **IT Lead BA** | Lê Phương Linh | Chuyên viên Cao cấp BA | Khối Công nghệ Thông tin | *Đã ký duyệt phạm vi* |
| **Technical Lead** | Nguyễn Thanh Tùng | Kiến trúc sư Giải pháp | Trung tâm Phát triển Phần mềm | *Đã ký duyệt phạm vi* |
| **Head of Risk Ops** | Phạm Quốc Huy | Giám đốc Vận hành Rủi ro | Khối Vận hành Ngân hàng | *Đã ký duyệt phạm vi* |

---

## 2. GIỚI THIỆU & MỤC TIÊU DỰ ÁN (PROJECT CHARTER)

### 2.1. Bối cảnh Nghiệp vụ
Sự phát triển mạnh mẽ của thanh toán điện tử, ngân hàng số và các giao dịch xuyên biên giới đặt ra thách thức lớn về an toàn giao dịch tại Ngân hàng TMCP Quốc Dân (NCB). Để chủ động ngăn chặn các hành vi giả mạo, chiếm đoạt tài khoản (ATO - Account Takeover), gian lận thẻ tín dụng và rửa tiền, NCB triển khai dự án xây dựng hệ thống **NCB FraudGuard**.

### 2.2. Mục tiêu Dự án
1. **Phát hiện gian lận thời gian thực (Real-time Detection)**: Phân tích và phát hiện giao dịch bất thường trong vòng dưới 200ms bằng công cụ quy tắc (Rule Engine) 25 kịch bản giám sát.
2. **Tuân thủ quy chuẩn Pháp lý Ngân hàng Nhà nước**:
   - Quyết định số 2345/QĐ-NHNN về triển khai các giải pháp an toàn, bảo mật trong thanh toán trực tuyến và thanh toán thẻ.
   - Thông tư số 09/2020/TT-NHNN về bảo đảm an toàn hệ thống thông tin trong hoạt động ngân hàng.
3. **Chuẩn hóa quy trình thẩm định Bốn Mắt (Four-Eyes Principle)**: Phân tách minh bạch giữa người khởi tạo/thẩm định (Maker) và người phê duyệt (Checker).
4. **Tối ưu năng suất cán bộ (Maker Productivity)**: Thiết lập Trang nhắc việc thông minh (Task Reminder Hub) giúp nhân sự thẩm định tập trung ngay vào các cảnh báo ưu tiên, không bỏ sót SLA xử lý.
5. **Đảm bảo tính Minh chứng & Kiểm toán (Immutable Auditability)**: Cho phép đính kèm biên bản ngoại luồng, lưu vết lịch sử không thể tẩy xóa và xuất báo cáo kiểm toán phục vụ thanh tra.

---

## 3. CĂN CỨ PHÁP LÝ & TIÊU CHUẨN TUÂN THỦ (REGULATORY FRAMEWORK)

| Số hiệu văn bản | Cơ quan ban hành | Nội dung yêu cầu trọng yếu | Ứng dụng trong NCB FraudGuard |
| :--- | :--- | :--- | :--- |
| **Quyết định 2345/QĐ-NHNN** | Ngân hàng Nhà nước Việt Nam | Giám sát giao dịch vượt ngưỡng giá trị, chuyển tiền liên ngân hàng, xác thực sinh trắc học và cảnh báo rủi ro tức thời | Kịch bản VOL-001 (Chuyển tiền liên tiếp giá trị cao), GEO-001 (Đăng nhập thiết bị lạ / không khớp sinh trắc học) |
| **Thông tư 09/2020/TT-NHNN** | Ngân hàng Nhà nước Việt Nam | An toàn hệ thống thông tin, phân quyền truy cập tối thiểu, lưu trữ nhật ký kiểm toán bất biến tối thiểu 1 năm | Cơ chế RBAC 3 vai trò, WORM Audit Trail, mã hóa dữ liệu nhạy cảm |
| **Chuẩn Quốc tế PCI-DSS** | Hội đồng Tiêu chuẩn Bảo mật Thẻ | Bảo vệ dữ liệu chủ thẻ, cấm hiển thị đầy đủ số thẻ (PAN) trên màn hình | Che dấu dữ liệu số thẻ (Masking: `9704 22** **** 1289`) và CIF |
| **Nguyên tắc Four-Eyes** | Basel Committee / Ngân hàng | Một cá nhân không thể tự khởi tạo và tự duyệt quyết định phân loại gian lận | Hàng đợi Review Queue: Checker độc lập duyệt kết luận của Maker |

---

## 4. DANH MỤC & PHẠM VI TÍNH NĂNG CHỐT (SCOPE BASELINE: F1 - F6)

### F1: Trung tâm Điều hành & Trang Nhắc Việc (Dashboard & Maker Workbench)
- **F1.1 - Bộ chỉ số KPI trọng yếu**: Hiển thị tổng số cảnh báo mới trong ngày, số hồ sơ chờ phê duyệt, tỷ lệ gian lận phát hiện, và thời gian phản hồi SLA trung bình.
- **F1.2 - Phân tích Trực quan**: Biểu đồ phân bổ 5 nhóm gian lận (Tần suất, Khối lượng, Địa lý/Thiết bị, Đối tác, Kỹ thuật) và Top 5 quy tắc bị vi phạm nhiều nhất.
- **F1.3 - Trang Nhắc việc Maker (Task Reminder Center)**:
  - Hiển thị thông báo cá nhân hóa số lượng hồ sơ tồn đọng mà Maker cần xử lý.
  - Cảnh báo thời hạn SLA (Khẩn cấp: dưới 15 phút; Nguy cơ trễ hạn; Đúng hạn).
  - Bảng danh sách công việc cần làm ngay (To-Do Table) sắp xếp theo mức độ rủi ro (CRITICAL > HIGH > MEDIUM > LOW).
  - Nút hành động nhanh: `[⚡ Xử lý ngay Hồ sơ Ưu tiên Tiếp theo]`.

### F2: Hàng đợi Cảnh báo & Thẩm định Maker (Alert Investigation Workbench)
- **F2.1 - Bộ lọc Đa tiêu chí**: Lọc theo Mức độ rủi ro (Critical, High, Medium, Low), Trạng thái (Mới, Đang xử lý, Chờ duyệt, Gian lận, Báo động giả), Kênh giao dịch (NAPAS, Mobile Banking, Internet Banking, ATM, POS), và tìm kiếm theo Mã cảnh báo/CIF/Số tài khoản.
- **F2.2 - Cửa sổ Chi tiết Cảnh báo Toàn diện**:
  - Thông tin giao dịch: Mã GD, số tiền, loại giao dịch, thời gian phát sinh, kênh tiếp nhận.
  - Thông tin khách hàng & thiết bị: Tên khách hàng, CIF (đã che), Số tài khoản, IP, Device Fingerprint, Vị trí địa lý.
  - Điểm số rủi ro (Risk Score từ 0 - 100) và quy tắc kích hoạt.
- **F2.3 - Bảng Đối chiếu Giao dịch Bất thường**: So sánh biến động số dư trước/sau giao dịch, độ lệch so với hành vi chi tiêu trung bình 30 ngày, và lịch sử vi phạm gần nhất.
- **F2.4 - Cơ chế Thẩm định & Đính kèm Hồ sơ Minh chứng (Maker Workflow)**:
  - Lựa chọn kết luận phân loại: *Nghi ngờ gian lận (Confirmed Fraud)* hoặc *Cảnh báo giả / Bình thường (False Positive)*.
  - Nhập biên bản giải trình nghiệp vụ chi tiết (Investigation Notes).
  - **Tính năng Đính kèm File**: Cho phép Maker tải lên các tài liệu minh chứng đã xác minh ngoại luồng (PDF, Word, Excel, Hình ảnh) với kích thước tối đa 15MB/file.
  - Chuyển tiếp hồ sơ sang Hàng đợi Checker để phê duyệt Four-Eyes.

### F3: Quản trị Kịch bản Luật Giám sát Gian lận (Fraud Rule Engine Management)
- **F3.1 - Thư viện 25 Kịch bản Luật Chuẩn hóa**:
  - *Nhóm 1 - Tần suất (Velocity)*: Giao dịch liên tiếp trong thời gian ngắn, tần suất quẹt thẻ đột biến.
  - *Nhóm 2 - Khối lượng (Volume)*: Chuyển khoản vượt hạn mức bất thường, rút tiền cạn kiệt số dư ngay sau khi nhận tiền.
  - *Nhóm 3 - Địa lý & Thiết bị (Geo & Device)*: Vị trí giao dịch cách xa bất khả thi (Impossible Travel Speed), thiết bị lạ chưa từng định danh.
  - *Nhóm 4 - Đối tác thụ hưởng (Counterparty)*: Tài khoản thụ hưởng nằm trong danh sách đen (Blacklist/Mule Account), nhận tiền từ nhiều tài khoản khác nhau rồi chuyển ngay.
  - *Nhóm 5 - Kỹ thuật & Hệ thống (Technical)*: Thử sai mã PIN/OTP liên tiếp, thay đổi thông tin xác thực rồi phát sinh giao dịch ngay.
- **F3.2 - Kích hoạt / Tạm dừng Kịch bản**: Chuyển đổi trạng thái Bật/Tắt (ACTIVE / INACTIVE) theo thời gian thực không cần dừng hệ thống.
- **F3.3 - Tùy chỉnh Tham số Ngưỡng (Threshold Adjustment)**: Điều chỉnh linh hoạt số tiền, số phút, số lần thử sai theo tình hình rủi ro thực tế.
- **F3.4 - Quản lý Phiên bản & Hoàn tác (Version History & Rollback)**: Lưu lại lịch sử thay đổi tham số, cho phép Admin khôi phục lại phiên bản trước đó khi cần.

### F4: Hàng đợi Phê duyệt Checker (Review Queue & Four-Eyes Principle)
- **F4.1 - Phân tách Trách nhiệm (Segregation of Duties)**:
  - Checker chỉ tiếp nhận các hồ sơ đã có kết luận từ Maker.
  - Checker tuyệt đối không được phê duyệt hồ sơ do chính mình đã tạo/xử lý ở vai trò Maker.
- **F4.2 - Thẩm định Toàn diện Hồ sơ**:
  - Xem xét kết luận của Maker, nội dung giải trình và kiểm tra toàn bộ tệp đính kèm do Maker tải lên.
- **F4.3 - Quyết định Phê duyệt & Đính kèm Văn bản Phê duyệt**:
  - Hành động: *Phê duyệt (Approve)* chốt trạng thái cuối cùng, hoặc *Trả về yêu cầu giải trình lại (Reject/Return)*.
  - Nhập ghi chú thẩm định của Kiểm soát viên.
  - Đính kèm biên bản phê duyệt / văn bản chỉ đạo của Ban Kiểm soát nếu có.

### F5: Quản trị Người dùng & Bảo mật Phân quyền (RBAC & Data Masking)
- **F5.1 - 3 Vai trò Người dùng Chuẩn**:
  - *Maker*: Xử lý cảnh báo, nhập giải trình, đính kèm hồ sơ, gửi duyệt.
  - *Checker*: Thẩm định và duyệt hồ sơ từ Maker, đính kèm biên bản phê duyệt.
  - *Admin*: Quản lý người dùng, cấu hình kịch bản luật 25 rules, xem toàn bộ nhật ký.
- **F5.2 - Ma trận Phân quyền Chức năng (RBAC Permission Matrix)**.
- **F5.3 - Cơ chế Che dấu Dữ liệu Nhạy cảm (Data Masking)**: Che số thẻ (`9704 **** **** 1234`), CIF (`***678`), Số tài khoản ngân hàng nhằm phòng chống lộ lọt thông tin khách hàng nội bộ.

### F6: Nhật ký Kiểm toán Bất biến & Báo cáo Tuân thủ (Audit Trail & Compliance Reporting)
- **F6.1 - Ghi nhận Nhật ký Bất biến (WORM Principle)**: Ghi vết tự động mọi hành vi: Đăng nhập, Xem chi tiết, Maker thẩm định, Checker phê duyệt/từ chối, Admin chỉnh sửa luật, Xuất báo cáo. Không ai có quyền xóa/sửa bản ghi nhật ký.
- **F6.2 - Kho Lưu trữ Báo động giả (False Positive Archive)**: Lưu vết tối thiểu 5 năm kèm toàn bộ biên bản giải trình phục vụ công tác thanh tra của Cơ quan Giám sát Ngân hàng.
- **F6.3 - Xuất Báo cáo Đa định dạng (Excel & CSV)**:
  - Xuất báo cáo kiểm toán ra file Microsoft Excel (`.xlsx`/`.csv`) và file CSV thuần chuẩn mã hóa tiếng Việt UTF-8 BOM.
  - Hỗ trợ bộ lọc phạm vi: Toàn bộ dữ liệu, Chỉ các bản ghi được lọc, hoặc Theo khoảng thời gian tùy chọn.

---

## 5. MA TRẬN PHÂN QUYỀN (RACI / RBAC MATRIX)

| Mã Tính năng | Tên Tính năng / Chức năng | Maker (Thẩm định viên) | Checker (Kiểm soát viên) | Admin (Quản trị hệ thống) |
| :--- | :--- | :---: | :---: | :---: |
| **F1** | Xem Dashboard & Trang nhắc việc cá nhân | **R / A** | **I** | **I** |
| **F2.1** | Tìm kiếm & lọc danh sách cảnh báo | **R** | **R** | **R** |
| **F2.2** | Xem chi tiết giao dịch bất thường | **R** | **R** | **R** |
| **F2.4** | Thẩm định, giải trình & đính kèm file | **R / A** | **C** | Không can thiệp |
| **F3.1 - F3.4** | Cấu hình tham số & Bật/Tắt 25 luật | Không được phép | Không được phép | **R / A** |
| **F4.1 - F4.3** | Phê duyệt hồ sơ & đính kèm quyết định | Không được phép | **R / A** | Không can thiệp |
| **F5.1 - F5.2** | Quản lý người dùng & phân vai trò | Không được phép | Không được phép | **R / A** |
| **F6.1** | Ghi nhận nhật ký kiểm toán tự động | Tự động (Hệ thống) | Tự động (Hệ thống) | Tự động (Hệ thống) |
| **F6.3** | Xuất báo cáo kiểm toán Excel / CSV | Xem được | Xem được | **R / A** |

*(Ghi chú: R = Responsible - Thực hiện; A = Accountable - Chịu trách nhiệm; C = Consulted - Tham vấn; I = Informed - Được thông báo)*

---

## 6. TIÊU CHÍ NGHIỆM THU CHỨC NĂNG (FUNCTIONAL ACCEPTANCE CRITERIA)

| Mã Tiêu chí | Tính năng liên quan | Tiêu chí Nghiệm thu (Giao diện & Nghiệp vụ) | Kết quả kiểm thử |
| :--- | :--- | :--- | :--- |
| **AC-01** | F1.3 - Trang Nhắc Việc | Khi Maker truy cập trang chủ, hiển thị ngay số lượng cảnh báo tồn đọng, mức độ khẩn cấp SLA và nút `[⚡ Xử lý ngay Hồ sơ Ưu tiên Tiếp theo]`. | Đạt (Passed) |
| **AC-02** | F2.4 - Đính kèm Maker | Cho phép Maker kéo thả hoặc chọn file minh chứng (PDF, Word, Excel, Ảnh), hiển thị dung lượng file, cho phép tải xuống hoặc xóa file trước khi gửi duyệt. | Đạt (Passed) |
| **AC-03** | F4.2 - Checker Thẩm định | Checker nhìn thấy thông tin kết luận của Maker kèm toàn bộ danh sách file do Maker tải lên để kiểm tra đối chiếu. | Đạt (Passed) |
| **AC-04** | F4.3 - Đính kèm Checker | Cho phép Checker đính kèm văn bản phê duyệt / chỉ đạo khi bấm Phê duyệt hoặc Trả về yêu cầu giải trình lại. | Đạt (Passed) |
| **AC-05** | F6.3 - Xuất Báo cáo | Nút "Xuất Báo cáo Kiểm toán" mở Modal cho phép chọn xuất định dạng Excel (`.xlsx`/`.csv`) hoặc CSV thuần UTF-8, có bộ lọc phạm vi dữ liệu. | Đạt (Passed) |
| **AC-06** | F3.2 & F3.3 - Rule Engine | Admin có thể Bật/Tắt kịch bản và lưu tham số mới, hệ thống tự động ghi nhật ký Audit Log và lưu bản ghi phiên bản để hoàn tác. | Đạt (Passed) |
| **AC-07** | F5.3 - Data Masking | Các trường thông tin Số thẻ, CIF, Tài khoản hiển thị dạng che dấu, không hiển thị toàn phần trên màn hình danh sách. | Đạt (Passed) |

---

## 7. KẾ HOẠCH BƯỚC TIẾP THEO (NEXT STEPS)
1. **Chốt Tài liệu BRD**: Lãnh đạo Khối CNTT và Khối QTRR phê duyệt phiên bản v1.0 này làm cơ sở cố định phạm vi (Baseline Scope).
2. **Biên soạn FSD chi tiết**: Đội ngũ BA tiến hành viết Tài liệu Đặc tả Yêu cầu Kỹ thuật & Chức năng chi tiết (Functional Specification Document - FSD) cho từng tính năng F1 đến F6.
3. **Kiểm thử UAT**: Hội đồng Kiểm thử Người dùng (UAT Team) đối chiếu 100% kịch bản kiểm thử dựa trên Bảng Tiêu chí Nghiệm thu của BRD này.
