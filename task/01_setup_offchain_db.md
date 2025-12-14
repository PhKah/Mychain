# [Task 01] Thiết lập Off-chain Database để tra cứu

- **Liên quan đến Giai đoạn (Related to Phase):** 5

---

## 📝 Kế hoạch thực thi (Execution Plan)

*Phần này mô tả kế hoạch chi tiết để xây dựng một hệ thống cơ sở dữ liệu off-chain, giúp tăng tốc độ truy vấn thông tin giao dịch và khối mà không cần quét toàn bộ blockchain.*

**1. Mục tiêu (Goal):**
*   Thiết lập một database MySQL và xây dựng một service ("Indexer") để đồng bộ dữ liệu từ blockchain vào database này.
*   Cung cấp các phương thức để truy vấn nhanh thông tin (giao dịch, khối) từ MySQL database.

**2. Lý do (Reason):**
*   Việc quét toàn bộ blockchain để tìm một giao dịch (on-chain query) rất chậm và không hiệu quả, đặc biệt khi chuỗi khối lớn dần.
*   Một database được tối ưu hóa cho việc truy vấn (như SQL) sẽ cho kết quả gần như ngay lập tức. Đây là kiến trúc được sử dụng bởi hầu hết các blockchain explorer.

**3. Tiêu chí chấp nhận (Acceptance Criteria):**
*   Một database schema được tạo trong MySQL.
*   Một `IndexerService` có thể kết nối đến MySQL và lưu thông tin của một khối mới vào các bảng tương ứng.
*   Có các phương thức `findTransactionByHash(hash)` và `findBlockByHash(hash)` có thể lấy dữ liệu từ MySQL DB.
*   Thư viện `mysql2` được thêm vào `package.json`.

**4. Các bước thực hiện (Steps):**
1.  **Cập nhật môi trường:**
    *   Thêm thư viện `mysql2` vào `dependencies` trong file `package.json`.
    *   Chạy `npm install` để cài đặt thư viện mới.
2.  **Thiết kế và Khởi tạo Database:**
    *   Tạo một file mới `src/database.ts`.
    *   Trong file này, viết một hàm `initDatabase` để:
        *   Tạo kết nối tới server MySQL (thông tin kết nối sẽ được quản lý trong file cấu hình).
        *   Thực thi câu lệnh `CREATE TABLE IF NOT EXISTS` để tạo các bảng:
            *   `blocks` (hash VARCHAR(64) PRIMARY KEY, previousHash VARCHAR(64), timestamp BIGINT, nonce INT, merkleRoot VARCHAR(64))
            *   `transactions` (hash VARCHAR(128) PRIMARY KEY, blockHash VARCHAR(64), owner TEXT, fee INT, signature TEXT)
3.  **Xây dựng Indexer Service:**
    *   Tạo một file mới `src/IndexerService.ts`.
    *   Tạo `class IndexerService` với các phương thức:
        *   `constructor`: Nhận một đối tượng connection pool của MySQL.
        *   `indexBlock(block: Block)`: Đọc thông tin từ một đối tượng `Block` và `Transaction`, sau đó ghi vào các bảng `blocks` và `transactions` trong MySQL DB.
        *   `findTransactionByHash(hash: string)`: Truy vấn bảng `transactions` để tìm giao dịch theo hash.
        *   `findBlockByHash(hash: string)`: Truy vấn bảng `blocks` để tìm khối theo hash.
4.  **Tích hợp:**
    *   (Để sau) Sửa đổi logic của ứng dụng chính (`main.ts`) để sau khi một khối được đào thành công (`minePendingTransactions`), nó sẽ được đưa cho `IndexerService` để xử lý.

---

## 🚀 Quy trình thực hiện (Implementation Process)

1.  **Đề xuất Kế hoạch:** (Đã hoàn thành ở trên)
2.  **Chờ phê duyệt:** Tôi đang chờ bạn xem xét và đồng ý với kế hoạch này.

---

## 📚 Ghi chú & Tài liệu tham khảo (Notes & References)

*   Thư viện `mysql2` cho Node.js: https://github.com/sidorares/node-mysql2

