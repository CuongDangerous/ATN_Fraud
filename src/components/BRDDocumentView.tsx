/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  Scale,
  Layers,
  Users,
  CheckSquare,
  FileSpreadsheet,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { NcbLogo } from './logos/NcbLogo';

interface BRDDocumentViewProps {
  theme?: 'light' | 'dark';
}

export const BRDDocumentView: React.FC<BRDDocumentViewProps> = ({ theme = 'light' }) => {
  const isLight = theme === 'light';
  const [activeSection, setActiveSection] = useState<string>('sec-scope');
  const [copiedMarkdown, setCopiedMarkdown] = useState<boolean>(false);
  const [isExportingWord, setIsExportingWord] = useState<boolean>(false);

  // Function to export formatted Microsoft Word document (.doc)
  const handleExportWord = () => {
    setIsExportingWord(true);

    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>BRD - NCB FraudGuard</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: 21.0cm 29.7cm; /* A4 */
            margin: 2.0cm 2.0cm 2.0cm 2.5cm;
            mso-page-orientation: portrait;
          }
          body {
            font-family: 'Times New Roman', 'Segoe UI', serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #111827;
          }
          .title-area {
            text-align: center;
            margin-bottom: 25pt;
            border-bottom: 2pt solid #004B87;
            padding-bottom: 15pt;
          }
          .bank-name {
            font-size: 14pt;
            font-weight: bold;
            color: #004B87;
            text-transform: uppercase;
          }
          .doc-sub {
            font-size: 11pt;
            color: #475569;
            margin-top: 4pt;
          }
          .doc-title {
            font-size: 20pt;
            font-weight: bold;
            color: #004B87;
            margin: 15pt 0 8pt 0;
            text-transform: uppercase;
          }
          .doc-code {
            font-size: 10.5pt;
            font-weight: bold;
            color: #64748B;
          }
          h1 {
            font-size: 15pt;
            color: #004B87;
            font-weight: bold;
            margin-top: 22pt;
            margin-bottom: 8pt;
            border-bottom: 1pt solid #CBD5E1;
            padding-bottom: 4pt;
            text-transform: uppercase;
          }
          h2 {
            font-size: 12.5pt;
            color: #0F172A;
            font-weight: bold;
            margin-top: 14pt;
            margin-bottom: 6pt;
          }
          h3 {
            font-size: 11pt;
            color: #1E293B;
            font-weight: bold;
            margin-top: 10pt;
            margin-bottom: 4pt;
          }
          p, li {
            font-size: 11pt;
            color: #1E293B;
            line-height: 1.5;
            text-align: justify;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 12pt 0;
            font-size: 10pt;
          }
          th {
            background-color: #F1F5F9;
            color: #0F172A;
            font-weight: bold;
            border: 1pt solid #94A3B8;
            padding: 6pt 8pt;
            text-align: left;
          }
          td {
            border: 1pt solid #CBD5E1;
            padding: 5pt 8pt;
            vertical-align: top;
          }
          .badge-approved {
            background-color: #DCFCE7;
            color: #166534;
            font-weight: bold;
            padding: 2pt 6pt;
            display: inline-block;
            border-radius: 3pt;
          }
          .sign-box {
            margin-top: 35pt;
            page-break-inside: avoid;
          }
          .sign-box td {
            border: none;
            text-align: center;
            padding: 10pt 5pt;
            width: 25%;
          }
        </style>
      </head>
      <body>
        <div class="title-area">
          <div class="bank-name">NGÂN HÀNG THƯƠNG MẠI CỔ PHẦN QUỐC DÂN (NCB)</div>
          <div class="doc-sub">KHỐI CÔNG NGHỆ THÔNG TIN & KHỐI QUẢN TRỊ RỦI RO</div>
          <div class="doc-title">TÀI LIỆU YÊU CẦU NGHIỆP VỤ (BRD)</div>
          <div style="font-size: 13pt; font-weight: bold; color: #1E293B; margin-bottom: 6pt;">
            HỆ THỐNG GIÁM SÁT & CẢNH BÁO PHÒNG CHỐNG GIAN LẬN (NCB FRAUDGUARD)
          </div>
          <div class="doc-code">Mã tài liệu: BRD-NCB-FG-2026-V1.0 | Phiên bản: 1.0 (Chốt phạm vi Baseline)</div>
        </div>

        <h1>1. Thông tin Quản trị Tài liệu & Phê duyệt</h1>
        <p>Tài liệu này đóng vai trò là căn cứ nghiệp vụ chính thức giữa Product Owner, IT Business Analyst, Khối Quản trị Rủi ro và Trung tâm Phát triển Phần mềm để cố định phạm vi tính năng (Scope Baseline) trước khi triển khai chi tiết các đặc tả kỹ thuật FSD.</p>
        
        <table>
          <thead>
            <tr>
              <th>Vai trò</th>
              <th>Họ và tên</th>
              <th>Chức danh / Đơn vị</th>
              <th>Tình trạng ký duyệt</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Product Owner</strong></td>
              <td>Trần Hoàng Quân</td>
              <td>Trưởng phòng QTRR Số - Khối QTRR</td>
              <td><span class="badge-approved">Đã ký duyệt phạm vi</span></td>
            </tr>
            <tr>
              <td><strong>Lead Business Analyst</strong></td>
              <td>Lê Phương Linh</td>
              <td>Chuyên viên Cao cấp BA - Khối CNTT</td>
              <td><span class="badge-approved">Đã ký duyệt phạm vi</span></td>
            </tr>
            <tr>
              <td><strong>Technical Lead</strong></td>
              <td>Nguyễn Thanh Tùng</td>
              <td>Kiến trúc sư Giải pháp - Khối CNTT</td>
              <td><span class="badge-approved">Đã ký duyệt phạm vi</span></td>
            </tr>
            <tr>
              <td><strong>Head of Risk Ops</strong></td>
              <td>Phạm Quốc Huy</td>
              <td>Giám đốc Vận hành Rủi ro - Khối Vận hành</td>
              <td><span class="badge-approved">Đã ký duyệt phạm vi</span></td>
            </tr>
          </tbody>
        </table>

        <h1>2. Giới thiệu & Mục tiêu Dự án</h1>
        <p>Hệ thống NCB FraudGuard được xây dựng nhằm giám sát đa kênh các giao dịch phát sinh qua Internet Banking, Mobile Banking, Thẻ quốc tế, ATM và NAPAS; phân tích bất thường tức thời trong dưới 200ms để phát hiện hành vi chiếm quyền tài khoản (ATO), giả mạo danh tính, hoặc gian lận thanh toán.</p>
        <p><strong>Mục tiêu cốt lõi:</strong></p>
        <ul>
          <li>Ngăn chặn tổn thất tài chính cho khách hàng và ngân hàng NCB.</li>
          <li>Tuân thủ tuyệt đối quy định Ngân hàng Nhà nước (Quyết định 2345/QĐ-NHNN và Thông tư 09/2020/TT-NHNN).</li>
          <li>Áp dụng nguyên tắc Bốn Mắt (Four-Eyes Principle) trong thẩm định rủi ro.</li>
          <li>Nâng cao năng suất xử lý của cán bộ Maker thông qua Trang nhắc việc cá nhân hóa.</li>
          <li>Lưu trữ nhật ký kiểm toán bất biến (WORM) và cho phép xuất báo cáo đối soát Excel/CSV.</li>
        </ul>

        <h1>3. Căn cứ Pháp lý & Tiêu chuẩn Tuân thủ</h1>
        <table>
          <thead>
            <tr>
              <th>Số hiệu văn bản</th>
              <th>Cơ quan ban hành</th>
              <th>Nội dung yêu cầu trọng yếu</th>
              <th>Áp dụng trong NCB FraudGuard</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>QĐ 2345/QĐ-NHNN</strong></td>
              <td>Ngân hàng Nhà nước</td>
              <td>Giám sát giao dịch vượt ngưỡng, xác thực sinh trắc học và phòng ngừa lừa đảo trực tuyến</td>
              <td>Bộ quy tắc giám sát giao dịch lớn, phát hiện đăng nhập thiết bị lạ và không khớp sinh trắc</td>
            </tr>
            <tr>
              <td><strong>Thông tư 09/2020/TT-NHNN</strong></td>
              <td>Ngân hàng Nhà nước</td>
              <td>An toàn thông tin trong hoạt động ngân hàng, kiểm toán hệ thống và bảo mật dữ liệu</td>
              <td>Kiểm soát truy cập RBAC, nhật ký kiểm toán WORM bất biến, phân tách môi trường</td>
            </tr>
            <tr>
              <td><strong>PCI-DSS & Basel</strong></td>
              <td>Tổ chức Quốc tế</td>
              <td>Che dấu dữ liệu số thẻ (Data Masking) và kiểm soát rủi ro hoạt động Bốn Mắt (Four-Eyes)</td>
              <td>Mặt nạ hóa số thẻ/CIF; luồng phê duyệt độc lập giữa Maker và Checker</td>
            </tr>
          </tbody>
        </table>

        <h1>4. Chốt Danh mục Phạm vi Tính năng (Scope Baseline F1 - F6)</h1>
        
        <h2>F1: Trung tâm Điều hành & Trang Nhắc Việc (Dashboard & Maker Workbench)</h2>
        <ul>
          <li><strong>F1.1 Bộ chỉ số KPI trọng yếu:</strong> Theo dõi thời gian thực số lượng cảnh báo mới, hồ sơ chờ phê duyệt, tỷ lệ gian lận và thời gian phản hồi SLA.</li>
          <li><strong>F1.2 Biểu đồ phân bổ:</strong> Phân bổ rủi ro theo 5 nhóm nghiệp vụ và thống kê Top 5 quy tắc bị kích hoạt thường xuyên nhất.</li>
          <li><strong>F1.3 Trang Nhắc việc Maker (Task Reminder Center):</strong> Thông báo tức thời số lượng hồ sơ tồn đọng, phân loại mức độ khẩn cấp SLA (&lt;15 phút, nguy cơ trễ, đúng hạn), hiển thị bảng To-Do sắp xếp theo rủi ro và nút [Xử lý ngay hồ sơ ưu tiên tiếp theo].</li>
        </ul>

        <h2>F2: Hàng đợi Cảnh báo & Thẩm định Maker (Alert Investigation Workbench)</h2>
        <ul>
          <li><strong>F2.1 Bộ lọc đa tiêu chí:</strong> Lọc theo Mức độ rủi ro, Trạng thái, Kênh giao dịch, Phân loại gian lận và tìm kiếm theo Mã/CIF/Số tài khoản.</li>
          <li><strong>F2.2 Cửa sổ chi tiết cảnh báo toàn diện:</strong> Phân tích chi tiết giao dịch, khách hàng, thiết bị, vị trí địa lý và điểm rủi ro Risk Score (0-100).</li>
          <li><strong>F2.3 Bảng đối chiếu bất thường:</strong> Biến động số dư trước/sau, độ lệch chi tiêu 30 ngày và lịch sử cảnh báo gần nhất.</li>
          <li><strong>F2.4 Luồng thẩm định & Đính kèm hồ sơ Maker:</strong> Phân loại kết luận (Gian lận / Báo động giả), nhập biên bản giải trình, cho phép đính kèm tệp tài liệu minh chứng (PDF, Word, Excel, Hình ảnh) tối đa 15MB/file và gửi phê duyệt Checker.</li>
        </ul>

        <h2>F3: Quản trị Kịch bản Luật Giám sát Gian lận (Fraud Rule Engine Management)</h2>
        <ul>
          <li><strong>F3.1 Thư viện 25 Kịch bản Luật:</strong> Phân chia thành 5 nhóm chuyên sâu: Tần suất (Velocity), Khối lượng (Volume), Địa lý/Thiết bị (Geo & Device), Đối tác thụ hưởng (Counterparty), Kỹ thuật/Hệ thống (Technical).</li>
          <li><strong>F3.2 Bật/Tắt kịch bản thời gian thực:</strong> Admin chuyển đổi trạng thái kích hoạt mà không làm gián đoạn luồng xử lý giao dịch.</li>
          <li><strong>F3.3 Điều chỉnh tham số ngưỡng (Thresholds):</strong> Thay đổi linh hoạt hạn mức tiền, khoảng thời gian giây/phút, số lần thử sai.</li>
          <li><strong>F3.4 Lịch sử phiên bản & Hoàn tác (Rollback):</strong> Lưu vết toàn bộ lịch sử chỉnh sửa luật và hỗ trợ hoàn tác phiên bản an toàn.</li>
        </ul>

        <h2>F4: Hàng đợi Phê duyệt Checker (Review Queue & Four-Eyes Principle)</h2>
        <ul>
          <li><strong>F4.1 Phân tách trách nhiệm (Segregation of Duties):</strong> Checker kiểm tra độc lập các hồ sơ đã có kết luận từ Maker; Checker không được tự duyệt hồ sơ do mình xử lý ban đầu.</li>
          <li><strong>F4.2 Thẩm định hồ sơ:</strong> Xem toàn văn biên bản giải trình và kiểm tra đầy đủ các tệp minh chứng do Maker đính kèm.</li>
          <li><strong>F4.3 Quyết định Phê duyệt & Đính kèm văn bản:</strong> Thao tác Phê duyệt (Approve) hoặc Trả về yêu cầu giải trình lại (Reject/Return), nhập chỉ đạo và đính kèm văn bản phê duyệt ngoại luồng.</li>
        </ul>

        <h2>F5: Quản trị Người dùng & Bảo mật Phân quyền (RBAC & Data Masking)</h2>
        <ul>
          <li><strong>F5.1 3 Vai trò người dùng:</strong> Maker (Thẩm định viên), Checker (Kiểm soát viên), Admin (Quản trị hệ thống).</li>
          <li><strong>F5.2 Ma trận phân quyền:</strong> Kiểm soát chặt chẽ quyền thao tác trên từng màn hình chức năng.</li>
          <li><strong>F5.3 Che dấu dữ liệu nhạy cảm (Data Masking):</strong> Tự động che dấu Số thẻ, CIF, Số tài khoản để tuân thủ PCI-DSS và bảo mật thông tin nội bộ.</li>
        </ul>

        <h2>F6: Nhật ký Kiểm toán Bất biến & Báo cáo Tuân thủ (Audit Trail & Compliance Reporting)</h2>
        <ul>
          <li><strong>F6.1 Nhật ký kiểm toán WORM:</strong> Ghi vết tự động mọi hành vi trong hệ thống, bảo đảm tính bất biến, không thể sửa đổi hoặc xóa bỏ.</li>
          <li><strong>F6.2 Lưu trữ báo động giả:</strong> Lưu trữ hồ sơ giải trình tối thiểu 5 năm phục vụ công tác thanh tra định kỳ của Ngân hàng Nhà nước.</li>
          <li><strong>F6.3 Xuất báo cáo kiểm toán linh hoạt:</strong> Xuất file Microsoft Excel (.xlsx/.csv) và CSV thuần UTF-8 hỗ trợ bộ lọc phạm vi dữ liệu phục vụ đối soát.</li>
        </ul>

        <h1>5. Ma trận Phân quyền Chức năng (RACI / RBAC Matrix)</h1>
        <table>
          <thead>
            <tr>
              <th>Mã Tính năng</th>
              <th>Chức năng</th>
              <th>Maker (Thẩm định)</th>
              <th>Checker (Kiểm soát)</th>
              <th>Admin (Quản trị)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>F1</td>
              <td>Xem Dashboard & Trang nhắc việc cá nhân</td>
              <td>Thực hiện chính (R/A)</td>
              <td>Được thông báo (I)</td>
              <td>Được thông báo (I)</td>
            </tr>
            <tr>
              <td>F2.1 - F2.3</td>
              <td>Xem danh sách & chi tiết cảnh báo</td>
              <td>Thực hiện (R)</td>
              <td>Thực hiện (R)</td>
              <td>Thực hiện (R)</td>
            </tr>
            <tr>
              <td>F2.4</td>
              <td>Thẩm định Maker & Đính kèm hồ sơ</td>
              <td>Thực hiện chính (R/A)</td>
              <td>Xem xét (C)</td>
              <td>Không can thiệp</td>
            </tr>
            <tr>
              <td>F3.1 - F3.4</td>
              <td>Cấu hình 25 kịch bản luật & Hoàn tác</td>
              <td>Không có quyền</td>
              <td>Không có quyền</td>
              <td>Thực hiện chính (R/A)</td>
            </tr>
            <tr>
              <td>F4.1 - F4.3</td>
              <td>Phê duyệt Checker & Đính kèm biên bản</td>
              <td>Không có quyền</td>
              <td>Thực hiện chính (R/A)</td>
              <td>Không can thiệp</td>
            </tr>
            <tr>
              <td>F5.1 - F5.2</td>
              <td>Quản trị người dùng & phân quyền</td>
              <td>Không có quyền</td>
              <td>Không có quyền</td>
              <td>Thực hiện chính (R/A)</td>
            </tr>
            <tr>
              <td>F6.1 - F6.3</td>
              <td>Nhật ký kiểm toán & Xuất báo cáo</td>
              <td>Xem nhật ký cá nhân</td>
              <td>Xem nhật ký cá nhân</td>
              <td>Toàn quyền xuất (R/A)</td>
            </tr>
          </tbody>
        </table>

        <h1>6. Bảng Tiêu chí Nghiệm thu Chức năng (Acceptance Criteria)</h1>
        <table>
          <thead>
            <tr>
              <th>Mã AC</th>
              <th>Tính năng</th>
              <th>Mô tả Tiêu chí Nghiệm thu</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AC-01</td>
              <td>Trang Nhắc Việc Maker</td>
              <td>Trang chủ Maker hiển thị số cảnh báo tồn đọng, cảnh báo SLA và nút [Xử lý ngay hồ sơ ưu tiên tiếp theo].</td>
              <td><span class="badge-approved">Đạt (Passed)</span></td>
            </tr>
            <tr>
              <td>AC-02</td>
              <td>Maker Đính kèm File</td>
              <td>Maker tải lên file minh chứng ngoại luồng (PDF, Word, Excel, ảnh &lt;15MB) khi nhập biên bản giải trình.</td>
              <td><span class="badge-approved">Đạt (Passed)</span></td>
            </tr>
            <tr>
              <td>AC-03</td>
              <td>Checker Thẩm định & File</td>
              <td>Checker kiểm tra được toàn bộ file của Maker và đính kèm văn bản chỉ đạo/phê duyệt của mình.</td>
              <td><span class="badge-approved">Đạt (Passed)</span></td>
            </tr>
            <tr>
              <td>AC-04</td>
              <td>Xuất Báo cáo Excel/CSV</td>
              <td>Màn hình Kiểm toán cho phép xuất báo cáo ra file Excel (.xlsx/.csv) và CSV tiếng Việt UTF-8 kèm bộ lọc.</td>
              <td><span class="badge-approved">Đạt (Passed)</span></td>
            </tr>
            <tr>
              <td>AC-05</td>
              <td>Rule Engine 25 Kịch bản</td>
              <td>Admin bật/tắt luật, điều chỉnh ngưỡng và xem lịch sử phiên bản để hoàn tác khi cần thiết.</td>
              <td><span class="badge-approved">Đạt (Passed)</span></td>
            </tr>
            <tr>
              <td>AC-06</td>
              <td>Bảo mật Che Dữ liệu</td>
              <td>Số thẻ, CIF, Tài khoản hiển thị dạng che giấu (masking) theo chuẩn an ninh ngân hàng.</td>
              <td><span class="badge-approved">Đạt (Passed)</span></td>
            </tr>
          </tbody>
        </table>

        <div class="sign-box">
          <table style="width: 100%; border: none;">
            <tr>
              <td>
                <strong>ĐẠI DIỆN KHỐI CNTT</strong><br>
                <em>(Ký, ghi rõ họ tên)</em><br><br><br><br>
                <strong>Lê Phương Linh</strong><br>
                Lead Business Analyst
              </td>
              <td>
                <strong>ĐẠI DIỆN KHỐI QTRR</strong><br>
                <em>(Ký, ghi rõ họ tên)</em><br><br><br><br>
                <strong>Trần Hoàng Quân</strong><br>
                Product Owner
              </td>
              <td>
                <strong>BAN PHÁT TRIỂN PHẦN MỀM</strong><br>
                <em>(Ký, ghi rõ họ tên)</em><br><br><br><br>
                <strong>Nguyễn Thanh Tùng</strong><br>
                Technical Lead
              </td>
              <td>
                <strong>BAN LÃNH ĐẠO PHÊ DUYỆT</strong><br>
                <em>(Ký, ghi rõ họ tên)</em><br><br><br><br>
                <strong>Phạm Quốc Huy</strong><br>
                Giám đốc Vận hành Rủi ro
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docContent], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BRD_NCB_FraudGuard_v1.0_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsExportingWord(false);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const rawMarkdown = `# TÀI LIỆU YÊU CẦU NGHIỆP VỤ (BRD) - NCB FRAUDGUARD
Mã tài liệu: BRD-NCB-FG-2026-V1.0
Đơn vị ban hành: Ngân hàng TMCP Quốc Dân (NCB)
Trạng thái: Chốt phạm vi Baseline Approved

Danh mục 6 nhóm tính năng cốt lõi:
- F1: Trung tâm Điều hành & Trang Nhắc Việc Maker (Dashboard & Workbench)
- F2: Hàng đợi Cảnh báo & Thẩm định Maker (Kèm đính kèm file giải trình ngoại luồng)
- F3: Quản trị Kịch bản Luật Giám sát Gian lận (25 Rules, Versioning & Rollback)
- F4: Hàng đợi Phê duyệt Checker (Nguyên tắc Four-Eyes & Đính kèm memo phê duyệt)
- F5: Quản trị Người dùng & Bảo mật Phân quyền (RBAC 3 vai trò & Data Masking)
- F6: Nhật ký Kiểm toán Bất biến & Báo cáo Tuân thủ (WORM & Xuất file Excel/CSV)`;

    navigator.clipboard.writeText(rawMarkdown);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2500);
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* 1. Header & Actions Toolbar */}
      <div
        className={`p-6 rounded-2xl border shadow-sm transition-colors ${
          isLight
            ? 'bg-gradient-to-r from-white via-blue-50/20 to-white border-slate-200'
            : 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border-slate-800'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <NcbLogo variant="badge" height={26} />
              <span className="text-slate-400">·</span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  isLight ? 'bg-blue-100 text-[#004B87]' : 'bg-blue-900/40 text-blue-300'
                }`}
              >
                Tài liệu PO / BA IT
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs font-mono text-slate-500">
                Mã: BRD-NCB-FG-2026-V1.0
              </span>
              <span className="text-slate-400">·</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                Đã chốt phạm vi (Baseline Approved)
              </span>
            </div>

            <h1
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Tài liệu Yêu cầu Nghiệp vụ (BRD) - Hệ thống NCB FraudGuard
            </h1>
            <p className={`text-sm max-w-3xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Văn bản chốt phạm vi chức năng (Scope Baseline), mô tả chi tiết 6 nhóm tính năng cốt lõi (F1–F6),
              ma trận phân quyền RACI/RBAC, và các tiêu chí nghiệm thu làm cơ sở biên soạn tài liệu kỹ thuật FSD
              theo quy chuẩn Ngân hàng Nhà nước Việt Nam (QĐ 2345 & TT 09).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={handleExportWord}
              disabled={isExportingWord}
              className="px-4 py-2.5 bg-[#004B87] hover:bg-[#003B6B] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-sm transition active:scale-98 cursor-pointer"
              title="Xuất văn bản ra file Microsoft Word (.doc) có định dạng chuẩn văn bản ngân hàng"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingWord ? 'Đang chuẩn bị file...' : 'Xuất file Word (.doc)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className={`px-3.5 py-2.5 border text-xs sm:text-sm font-medium rounded-xl flex items-center gap-2 transition cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="In trực tiếp hoặc Lưu file PDF chuẩn A4"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">In / Lưu PDF</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className={`px-3.5 py-2.5 border text-xs sm:text-sm font-medium rounded-xl flex items-center gap-2 transition cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="Sao chép toàn bộ tóm tắt nội dung Markdown vào bộ nhớ tạm"
            >
              {copiedMarkdown ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedMarkdown ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Document Content with Sticky Sidebar Table of Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Sticky Table of Contents (TOC) */}
        <aside className="lg:col-span-1 lg:sticky lg:top-24 space-y-3">
          <div
            className={`p-4 rounded-xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 pb-3 border-b mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Mục lục Văn kiện BRD</span>
            </div>

            <nav className="space-y-1 text-xs">
              {[
                { id: 'sec-signoff', label: '1. Quản trị & Ký duyệt' },
                { id: 'sec-intro', label: '2. Giới thiệu & Mục tiêu' },
                { id: 'sec-legal', label: '3. Căn cứ Pháp lý (QĐ 2345)' },
                { id: 'sec-scope', label: '4. Chốt Phạm vi Tính năng' },
                { id: 'sec-f1', label: '— F1: Dashboard & Nhắc việc', indent: true },
                { id: 'sec-f2', label: '— F2: Thẩm định Maker & File', indent: true },
                { id: 'sec-f3', label: '— F3: 25 Kịch bản Luật', indent: true },
                { id: 'sec-f4', label: '— F4: Phê duyệt Checker 4-Eyes', indent: true },
                { id: 'sec-f5', label: '— F5: Phân quyền & Masking', indent: true },
                { id: 'sec-f6', label: '— F6: Kiểm toán & Báo cáo', indent: true },
                { id: 'sec-matrix', label: '5. Ma trận Phân quyền RACI' },
                { id: 'sec-acceptance', label: '6. Tiêu chí Nghiệm thu' },
                { id: 'sec-next', label: '7. Kế hoạch Triển khai' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg transition font-medium flex items-center justify-between ${
                    item.indent ? 'pl-5 text-[11px]' : ''
                  } ${
                    activeSection === item.id
                      ? isLight
                        ? 'bg-blue-50 text-[#004B87] font-semibold'
                        : 'bg-blue-950/60 text-blue-300 font-semibold'
                      : isLight
                      ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {activeSection === item.id && <ArrowRight className="w-3 h-3 shrink-0" />}
                </button>
              ))}
            </nav>

            <div
              className={`mt-4 pt-3 border-t text-[11px] leading-relaxed text-slate-500 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}
            >
              <div>Phiên bản: <strong className="text-slate-700 dark:text-slate-300">v1.0 (Final)</strong></div>
              <div>Cập nhật: <strong className="text-slate-700 dark:text-slate-300">Tháng 10/2026</strong></div>
              <div>Cơ quan: <strong className="text-slate-700 dark:text-slate-300">NCB Digital Risk</strong></div>
            </div>
          </div>
        </aside>

        {/* Right Main Document Body */}
        <div className="lg:col-span-3 space-y-8">
          {/* Section 1: Document Control & Sign-off */}
          <section
            id="sec-signoff"
            className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#004B87] dark:text-blue-400 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Phần 1: Thông tin Quản trị Tài liệu & Ký duyệt</span>
            </div>
            <h2 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Bảng Ký duyệt Chốt Phạm vi Nghiệp vụ (Baseline Sign-off)
            </h2>
            <p className={`text-sm leading-relaxed mb-5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Tài liệu này xác lập ranh giới chức năng chính thức được bảo vệ giữa Product Owner, Đội ngũ BA IT,
              Khối Quản trị Rủi ro và Khối Vận hành. Mọi thay đổi phát sinh sau khi chốt văn bản này sẽ được quản lý
              thông qua Quy trình Quản trị Thay đổi (Change Request - CR).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={isLight ? 'bg-slate-50 text-slate-700' : 'bg-slate-800 text-slate-200'}>
                    <th className="p-3 border-b font-semibold">Vai trò Ký duyệt</th>
                    <th className="p-3 border-b font-semibold">Họ và tên</th>
                    <th className="p-3 border-b font-semibold">Chức danh / Đơn vị</th>
                    <th className="p-3 border-b font-semibold text-right">Tình trạng Phê duyệt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">Product Owner</td>
                    <td className="p-3">Trần Hoàng Quân</td>
                    <td className="p-3 text-slate-500">Trưởng phòng Quản trị Rủi ro Số – Khối QTRR</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Đã ký duyệt
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">IT Lead BA</td>
                    <td className="p-3">Lê Phương Linh</td>
                    <td className="p-3 text-slate-500">Chuyên viên Cao cấp BA – Khối Công nghệ Thông tin</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Đã ký duyệt
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">Technical Lead</td>
                    <td className="p-3">Nguyễn Thanh Tùng</td>
                    <td className="p-3 text-slate-500">Kiến trúc sư Giải pháp – Trung tâm Phần mềm</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Đã ký duyệt
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">Head of Risk Ops</td>
                    <td className="p-3">Phạm Quốc Huy</td>
                    <td className="p-3 text-slate-500">Giám đốc Vận hành Rủi ro – Khối Vận hành</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Đã ký duyệt
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: Project Charter & Objectives */}
          <section
            id="sec-intro"
            className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#004B87] dark:text-blue-400 uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              <span>Phần 2: Giới thiệu & Mục tiêu Dự án</span>
            </div>
            <h2 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Bối cảnh Nghiệp vụ & Sứ mệnh Hệ thống NCB FraudGuard
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              <p>
                Trước sự gia tăng mạnh mẽ của các hình thức gian lận số, đặc biệt là tấn công chiếm quyền điều khiển
                thiết bị (Account Takeover - ATO), chuyển tiền liên ngân hàng qua tài khoản trung gian (mule account)
                và lừa đảo giao dịch thẻ quốc tế, Ngân hàng TMCP Quốc Dân triển khai hệ thống <strong>NCB FraudGuard</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div
                  className={`p-4 rounded-xl border ${
                    isLight ? 'bg-blue-50/50 border-blue-200' : 'bg-blue-950/30 border-blue-800/60'
                  }`}
                >
                  <h4 className="font-semibold text-xs text-[#004B87] dark:text-blue-300 mb-1">
                    Mục tiêu Vận hành (Ops Goals)
                  </h4>
                  <ul className="text-xs space-y-1.5 list-disc list-inside">
                    <li>Phát hiện gian lận đa kênh trong thời gian thực dưới 200ms.</li>
                    <li>Giảm thiểu 65% thời gian xử lý thủ công nhờ Trang nhắc việc thông minh cho Maker.</li>
                    <li>Đảm bảo 100% hồ sơ kết luận rủi ro tuân thủ quy trình kiểm soát Bốn Mắt (Four-Eyes).</li>
                  </ul>
                </div>
                <div
                  className={`p-4 rounded-xl border ${
                    isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-950/30 border-emerald-800/60'
                  }`}
                >
                  <h4 className="font-semibold text-xs text-emerald-800 dark:text-emerald-300 mb-1">
                    Mục tiêu Tuân thủ Pháp lý (Compliance Goals)
                  </h4>
                  <ul className="text-xs space-y-1.5 list-disc list-inside">
                    <li>Đáp ứng đầy đủ yêu cầu giám sát theo Quyết định 2345/QĐ-NHNN.</li>
                    <li>Lưu trữ nhật ký kiểm toán bất biến (WORM) theo Thông tư 09/2020/TT-NHNN.</li>
                    <li>Sẵn sàng công cụ kết xuất báo cáo kiểm toán phục vụ thanh tra đột xuất và định kỳ.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Regulatory Framework */}
          <section
            id="sec-legal"
            className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#004B87] dark:text-blue-400 uppercase tracking-wider mb-2">
              <Scale className="w-4 h-4" />
              <span>Phần 3: Căn cứ Pháp lý & Tiêu chuẩn Tuân thủ</span>
            </div>
            <h2 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Căn cứ Pháp lý & Tiêu chuẩn Quốc tế Áp dụng
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={isLight ? 'bg-slate-50 text-slate-700' : 'bg-slate-800 text-slate-200'}>
                    <th className="p-3 border-b font-semibold">Căn cứ Pháp lý</th>
                    <th className="p-3 border-b font-semibold">Cơ quan Ban hành</th>
                    <th className="p-3 border-b font-semibold">Yêu cầu Trọng yếu</th>
                    <th className="p-3 border-b font-semibold">Triển khai trong NCB FraudGuard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">QĐ 2345/QĐ-NHNN</td>
                    <td className="p-3 text-slate-500">Ngân hàng Nhà nước VN</td>
                    <td className="p-3">Giám sát các giao dịch chuyển tiền giá trị lớn, đối chiếu sinh trắc học và cảnh báo rủi ro</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400">
                      Kịch bản VOL-001 (GD vượt hạn mức), GEO-001 (Thiết bị mới chưa định danh sinh trắc học)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Thông tư 09/2020/TT-NHNN</td>
                    <td className="p-3 text-slate-500">Ngân hàng Nhà nước VN</td>
                    <td className="p-3">An toàn hệ thống thông tin, nhật ký kiểm toán không thể sửa đổi, lưu trữ tối thiểu 1-5 năm</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400">
                      Nhật ký WORM Audit Trail, kho lưu trữ False Positive 5 năm, xuất file Excel/CSV đối soát
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Nguyên tắc Bốn Mắt (Four-Eyes)</td>
                    <td className="p-3 text-slate-500">Basel Committee / QTRR</td>
                    <td className="p-3">Tách biệt thẩm quyền thẩm định và phê duyệt quyết định rủi ro</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400">
                      Maker lập hồ sơ kèm minh chứng, Checker độc lập thẩm định và ban hành quyết định
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Baselined Feature Scope (F1 - F6) */}
          <section
            id="sec-scope"
            className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#004B87] dark:text-blue-400 uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4" />
              <span>Phần 4: Chốt Danh mục Phạm vi Tính năng (Scope Baseline)</span>
            </div>
            <h2 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Đặc tả 6 Nhóm Tính năng Cốt lõi (F1 đến F6)
            </h2>
            <p className={`text-sm leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Dưới đây là mô tả chi tiết của 6 nhóm tính năng đã được thống nhất chốt phạm vi để đưa vào vận hành:
            </p>

            <div className="space-y-6">
              {/* F1 */}
              <div
                id="sec-f1"
                className={`p-5 rounded-xl border ${
                  isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-[#004B87] dark:text-blue-400">
                    F1: Trung tâm Điều hành & Trang Nhắc Việc Maker (Dashboard & Workbench)
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Mức độ: Bắt buộc (Core)
                  </span>
                </div>
                <div className={`text-xs space-y-2 leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <p>
                    <strong>F1.1 Bộ chỉ số KPI trọng yếu:</strong> Hiển thị số liệu thời gian thực gồm Tổng số cảnh báo mới,
                    Hồ sơ đang chờ phê duyệt, Tỷ lệ phát hiện gian lận và Thời gian phản hồi SLA trung bình của phòng ban.
                  </p>
                  <p>
                    <strong>F1.2 Biểu đồ phân bổ:</strong> Trực quan hóa rủi ro theo 5 nhóm kịch bản (Tần suất, Khối lượng, Địa lý,
                    Đối tác, Kỹ thuật) và danh sách Top 5 quy tắc bị kích hoạt nhiều nhất.
                  </p>
                  <p>
                    <strong>F1.3 Trang Nhắc việc Maker (Task Reminder Center):</strong> Thiết lập trang đích đầu tiên khi Maker đăng nhập:
                    thông báo số lượng hồ sơ tồn đọng cá nhân, phân nhóm mức độ khẩn cấp SLA (&lt;15 phút khẩn cấp, nguy cơ trễ hạn, đúng hạn),
                    bảng danh sách công việc ưu tiên và nút hành động nhanh <em>[⚡ Xử lý ngay Hồ sơ Ưu tiên Tiếp theo]</em> giúp Maker lập tức vào việc.
                  </p>
                </div>
              </div>

              {/* F2 */}
              <div
                id="sec-f2"
                className={`p-5 rounded-xl border ${
                  isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-[#004B87] dark:text-blue-400">
                    F2: Hàng đợi Cảnh báo & Thẩm định Maker (Alert Investigation Workbench)
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Mức độ: Bắt buộc (Core)
                  </span>
                </div>
                <div className={`text-xs space-y-2 leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <p>
                    <strong>F2.1 Bộ lọc Đa tiêu chí:</strong> Lọc linh hoạt theo Mức độ rủi ro (Critical, High, Medium, Low),
                    Trạng thái (Mới, Đang thẩm định, Chờ duyệt, Gian lận, Báo động giả), Kênh giao dịch (NAPAS, Mobile, Web, ATM, POS)
                    và tìm kiếm tức thì theo Mã GD / CIF / Số tài khoản.
                  </p>
                  <p>
                    <strong>F2.2 Cửa sổ Chi tiết Cảnh báo Toàn diện:</strong> Cung cấp 360 độ góc nhìn về giao dịch: Thông tin khách hàng,
                    thiết bị định danh, địa chỉ IP, vị trí địa lý, điểm số rủi ro (Risk Score 0-100) và quy tắc luật bị vi phạm.
                  </p>
                  <p>
                    <strong>F2.3 Bảng Đối chiếu Giao dịch Bất thường:</strong> So sánh số dư trước/sau, tính toán tỷ lệ độ lệch
                    so với mức chi tiêu trung bình 30 ngày và hiển thị lịch sử các cảnh báo trước đây của khách hàng.
                  </p>
                  <p>
                    <strong>F2.4 Luồng Xử lý & Đính kèm Hồ sơ Minh chứng:</strong> Cho phép Maker đưa ra kết luận sơ bộ,
                    nhập biên bản giải trình nghiệp vụ và <em>đính kèm các tài liệu xác minh ngoại luồng (file PDF, Word, Excel, ảnh chứng từ)</em>
                    trước khi chuyển tiếp hồ sơ sang hàng đợi phê duyệt Checker.
                  </p>
                </div>
              </div>

              {/* F3 */}
              <div
                id="sec-f3"
                className={`p-5 rounded-xl border ${
                  isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-[#004B87] dark:text-blue-400">
                    F3: Quản trị Kịch bản Luật Giám sát Gian lận (Fraud Rule Engine Management)
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Quyền Admin
                  </span>
                </div>
                <div className={`text-xs space-y-2 leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <p>
                    <strong>F3.1 Thư viện 25 Kịch bản Luật:</strong> Bao gồm đầy đủ 25 kịch bản phân bố theo 5 nhóm nghiệp vụ ngân hàng
                    (Tần suất, Khối lượng, Vị trí/Thiết bị, Tài khoản thụ hưởng nghi vấn, Kỹ thuật OTP/PIN).
                  </p>
                  <p>
                    <strong>F3.2 Bật/Tắt Luật Thời gian thực:</strong> Khả năng bật hoặc dừng kích hoạt bất kỳ kịch bản nào tức thời mà không
                    cần khởi động lại máy chủ hoặc gián đoạn giao dịch khách hàng.
                  </p>
                  <p>
                    <strong>F3.3 Điều chỉnh Tham số Ngưỡng:</strong> Cấu hình trực quan các tham số (Số tiền ngưỡng, thời gian giây/phút,
                    số lần giao dịch lặp lại) theo từng thời kỳ rủi ro.
                  </p>
                  <p>
                    <strong>F3.4 Quản lý Phiên bản & Hoàn tác (Rollback):</strong> Tự động lưu trữ lịch sử thay đổi tham số cùng danh tính
                    Admin thực hiện, cho phép hoàn tác trở lại phiên bản trước nếu có sự cố.
                  </p>
                </div>
              </div>

              {/* F4 */}
              <div
                id="sec-f4"
                className={`p-5 rounded-xl border ${
                  isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-[#004B87] dark:text-blue-400">
                    F4: Hàng đợi Phê duyệt Checker (Review Queue & Four-Eyes Principle)
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Quyền Checker
                  </span>
                </div>
                <div className={`text-xs space-y-2 leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <p>
                    <strong>F4.1 Phân tách Trách nhiệm (Segregation of Duties):</strong> Checker kiểm soát độc lập; hệ thống nghiêm cấm
                    Checker phê duyệt hồ sơ do chính mình đã thẩm định tại bước Maker.
                  </p>
                  <p>
                    <strong>F4.2 Thẩm tra Hồ sơ & Minh chứng:</strong> Checker trực tiếp xem kết luận của Maker, đọc nội dung giải trình
                    và kiểm tra từng file tài liệu đính kèm do Maker gửi lên.
                  </p>
                  <p>
                    <strong>F4.3 Quyết định Phê duyệt & Đính kèm Quyết định:</strong> Thực hiện Phê duyệt (Approve) chốt trạng thái cuối cùng
                    hoặc Trả về (Reject/Return) yêu cầu Maker giải trình bổ sung, đồng thời cho phép Checker đính kèm biên bản phê duyệt chính thức.
                  </p>
                </div>
              </div>

              {/* F5 */}
              <div
                id="sec-f5"
                className={`p-5 rounded-xl border ${
                  isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-[#004B87] dark:text-blue-400">
                    F5: Quản trị Người dùng & Bảo mật Phân quyền (RBAC & Data Masking)
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Quyền Admin
                  </span>
                </div>
                <div className={`text-xs space-y-2 leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <p>
                    <strong>F5.1 3 Vai trò Người dùng Chuẩn:</strong> Phân quyền nghiêm ngặt gồm Maker (Thẩm định viên),
                    Checker (Kiểm soát viên), và Admin (Quản trị hệ thống).
                  </p>
                  <p>
                    <strong>F5.2 Quản lý Tài khoản & Phân quyền:</strong> Thêm mới người dùng, kích hoạt/vô hiệu hóa tài khoản và
                    chuyển đổi vai trò cán bộ trong phạm vi an ninh cho phép.
                  </p>
                  <p>
                    <strong>F5.3 Cơ chế Che giấu Dữ liệu Nhạy cảm (Data Masking):</strong> Tự động che dấu Số thẻ (PAN: <code>9704 22** **** 1289</code>),
                    Số CIF khách hàng và Số tài khoản thanh toán nhằm ngăn ngừa rò rỉ dữ liệu nội bộ theo tiêu chuẩn PCI-DSS.
                  </p>
                </div>
              </div>

              {/* F6 */}
              <div
                id="sec-f6"
                className={`p-5 rounded-xl border ${
                  isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-[#004B87] dark:text-blue-400">
                    F6: Nhật ký Kiểm toán Bất biến & Báo cáo Tuân thủ (Audit Trail & Compliance)
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Mức độ: Bắt buộc (Core)
                  </span>
                </div>
                <div className={`text-xs space-y-2 leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  <p>
                    <strong>F6.1 Ghi vết Bất biến (WORM Principle):</strong> Tự động ghi lại mọi thao tác trên hệ thống (Xem, Thẩm định,
                    Phê duyệt, Từ chối, Sửa luật, Đăng nhập, Xuất báo cáo). Tuyệt đối không một người dùng nào có quyền chỉnh sửa hoặc xóa nhật ký.
                  </p>
                  <p>
                    <strong>F6.2 Lưu trữ Báo động giả (False Positive Archive):</strong> Toàn bộ các hồ sơ phân loại báo động giả kèm lý do
                    giải trình được lưu trữ tối thiểu 5 năm phục vụ công tác thanh tra của NHNN theo Thông tư 09/2020/TT-NHNN.
                  </p>
                  <p>
                    <strong>F6.3 Xuất Báo cáo Đa định dạng (Excel & CSV):</strong> Tích hợp công cụ xuất báo cáo kiểm toán linh hoạt ra định dạng
                    Microsoft Excel (<code>.xlsx</code> / <code>.csv</code>) và CSV chuẩn tiếng Việt UTF-8 BOM, hỗ trợ bộ lọc phạm vi dữ liệu phục vụ đối soát.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: RACI / RBAC Permission Matrix */}
          <section
            id="sec-matrix"
            className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#004B87] dark:text-blue-400 uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              <span>Phần 5: Ma trận Phân quyền & Quản trị Rủi ro</span>
            </div>
            <h2 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Ma trận Phân quyền Chi tiết (RACI Matrix)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={isLight ? 'bg-slate-50 text-slate-700' : 'bg-slate-800 text-slate-200'}>
                    <th className="p-3 border-b font-semibold">Mã Tính năng</th>
                    <th className="p-3 border-b font-semibold">Tên Tính năng / Hành vi</th>
                    <th className="p-3 border-b font-semibold text-center">Maker (Thẩm định)</th>
                    <th className="p-3 border-b font-semibold text-center">Checker (Kiểm soát)</th>
                    <th className="p-3 border-b font-semibold text-center">Admin (Quản trị)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">F1</td>
                    <td className="p-3">Xem Dashboard & Trang nhắc việc cá nhân</td>
                    <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">R / A</td>
                    <td className="p-3 text-center text-slate-400">I</td>
                    <td className="p-3 text-center text-slate-400">I</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">F2.1 - F2.3</td>
                    <td className="p-3">Tìm kiếm & xem chi tiết giao dịch cảnh báo</td>
                    <td className="p-3 text-center font-semibold text-slate-700 dark:text-slate-300">R</td>
                    <td className="p-3 text-center font-semibold text-slate-700 dark:text-slate-300">R</td>
                    <td className="p-3 text-center font-semibold text-slate-700 dark:text-slate-300">R</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">F2.4</td>
                    <td className="p-3">Thẩm định rủi ro, giải trình & đính kèm file</td>
                    <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">R / A</td>
                    <td className="p-3 text-center text-slate-400">C</td>
                    <td className="p-3 text-center text-slate-300 dark:text-slate-600">—</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">F3.1 - F3.4</td>
                    <td className="p-3">Cấu hình 25 kịch bản luật, bật/tắt & rollback</td>
                    <td className="p-3 text-center text-slate-300 dark:text-slate-600">—</td>
                    <td className="p-3 text-center text-slate-300 dark:text-slate-600">—</td>
                    <td className="p-3 text-center font-bold text-purple-600 dark:text-purple-400">R / A</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">F4.1 - F4.3</td>
                    <td className="p-3">Phê duyệt Bốn Mắt & đính kèm biên bản Checker</td>
                    <td className="p-3 text-center text-slate-300 dark:text-slate-600">—</td>
                    <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-400">R / A</td>
                    <td className="p-3 text-center text-slate-300 dark:text-slate-600">—</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">F5.1 - F5.2</td>
                    <td className="p-3">Quản trị người dùng & phân bổ vai trò</td>
                    <td className="p-3 text-center text-slate-300 dark:text-slate-600">—</td>
                    <td className="p-3 text-center text-slate-300 dark:text-slate-600">—</td>
                    <td className="p-3 text-center font-bold text-purple-600 dark:text-purple-400">R / A</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">F6.3</td>
                    <td className="p-3">Xuất báo cáo kiểm toán Excel / CSV</td>
                    <td className="p-3 text-center text-slate-500">Xem</td>
                    <td className="p-3 text-center text-slate-500">Xem</td>
                    <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">R / A</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-[11px] text-slate-400">
              * Ghi chú: <strong>R</strong> (Responsible - Thực hiện), <strong>A</strong> (Accountable - Chịu trách nhiệm), <strong>C</strong> (Consulted - Tham vấn), <strong>I</strong> (Informed - Nhận thông báo).
            </div>
          </section>

          {/* Section 6: Functional Acceptance Criteria */}
          <section
            id="sec-acceptance"
            className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#004B87] dark:text-blue-400 uppercase tracking-wider mb-2">
              <CheckSquare className="w-4 h-4" />
              <span>Phần 6: Tiêu chí Nghiệm thu Chức năng</span>
            </div>
            <h2 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Tiêu chí Nghiệm thu Chức năng Nghiệp vụ (Acceptance Criteria)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={isLight ? 'bg-slate-50 text-slate-700' : 'bg-slate-800 text-slate-200'}>
                    <th className="p-3 border-b font-semibold">Mã AC</th>
                    <th className="p-3 border-b font-semibold">Tính năng</th>
                    <th className="p-3 border-b font-semibold">Mô tả Yêu cầu Nghiệm thu</th>
                    <th className="p-3 border-b font-semibold text-right">Trạng thái Kiểm thử</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">AC-01</td>
                    <td className="p-3 font-semibold">Trang Nhắc Việc Maker</td>
                    <td className="p-3">Maker mở trang chủ thấy ngay số lượng cảnh báo tồn đọng, cảnh báo SLA và nút xử lý ưu tiên tiếp theo.</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Đạt (Passed)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">AC-02</td>
                    <td className="p-3 font-semibold">Maker Đính kèm File</td>
                    <td className="p-3">Cho phép Maker kéo thả hoặc chọn tệp minh chứng ngoại luồng (PDF, Word, Excel, Ảnh), tải về và xóa file.</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Đạt (Passed)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">AC-03</td>
                    <td className="p-3 font-semibold">Checker Đối chiếu File</td>
                    <td className="p-3">Checker xem được giải trình Maker kèm toàn bộ file đính kèm của Maker để đối soát trước khi duyệt.</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Đạt (Passed)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">AC-04</td>
                    <td className="p-3 font-semibold">Checker Đính kèm Memo</td>
                    <td className="p-3">Checker được đính kèm văn bản phê duyệt / chỉ đạo ngoại luồng khi bấm Duyệt hoặc Trả về.</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Đạt (Passed)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">AC-05</td>
                    <td className="p-3 font-semibold">Xuất Báo cáo Excel/CSV</td>
                    <td className="p-3">Màn hình Kiểm toán có tính năng xuất file Excel (.xlsx/.csv) và CSV chuẩn tiếng Việt UTF-8 BOM kèm bộ lọc.</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Đạt (Passed)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">AC-06</td>
                    <td className="p-3 font-semibold">25 Kịch bản & Rollback</td>
                    <td className="p-3">Admin bật/tắt luật, điều chỉnh tham số ngưỡng và lưu vết phiên bản cho phép hoàn tác an toàn.</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Đạt (Passed)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7: Next Steps */}
          <section
            id="sec-next"
            className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#004B87] dark:text-blue-400 uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Phần 7: Kế hoạch Triển khai Sau khi Chốt BRD</span>
            </div>
            <h2 className={`text-xl font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Lộ trình Tiếp theo Sau khi Chốt Phạm vi
            </h2>
            <div className={`space-y-3 text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              <div className="flex items-start gap-3">
                <span className="font-bold text-[#004B87] dark:text-blue-400 shrink-0">1.</span>
                <p>
                  <strong>Chốt Phạm vi Nghiệp vụ (Baseline Sign-off)</strong>: Các bên liên quan ký xác nhận tài liệu BRD này làm ranh giới phạm vi chính thức của dự án NCB FraudGuard v1.0.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-[#004B87] dark:text-blue-400 shrink-0">2.</span>
                <p>
                  <strong>Biên soạn Tài liệu Đặc tả Chi tiết (FSD)</strong>: Nhóm IT Business Analyst tiến hành phân rã chi tiết từng tính năng F1 đến F6 thành các tài liệu đặc tả chức năng (Functional Specification Documents) chuyên sâu cho từng luồng màn hình, bao gồm schema dữ liệu, API contract và validation matrix.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-[#004B87] dark:text-blue-400 shrink-0">3.</span>
                <p>
                  <strong>Nghiệm thu Người dùng (UAT) & Triển khai</strong>: Ban Dự án căn cứ vào Bảng Tiêu chí Nghiệm thu của BRD để thực hiện kiểm thử người dùng UAT và tiến hành chuyển giao vận hành.
                </p>
              </div>
            </div>

            {/* Bottom Download CTA */}
            <div
              className={`mt-6 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isLight ? 'bg-blue-50/60 border-blue-200' : 'bg-blue-950/40 border-blue-800/80'
              }`}
            >
              <div>
                <h4 className="text-sm font-bold text-[#004B87] dark:text-blue-300">
                  Tải xuống bản Word chính thức để ký duyệt
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  File Microsoft Word (.doc) giữ nguyên 100% định dạng trang in A4, tiêu đề, bảng ma trận và hộp ký duyệt.
                </p>
              </div>
              <button
                onClick={handleExportWord}
                disabled={isExportingWord}
                className="px-4 py-2 bg-[#004B87] hover:bg-[#003B6B] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs transition active:scale-98 shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isExportingWord ? 'Đang xuất...' : 'Tải file Word (.doc)'}</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
