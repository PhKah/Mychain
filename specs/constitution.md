# Hiến pháp dự án Mychain

## 1. Mục tiêu dự án

Mục tiêu chính của dự án này là xây dựng một hệ thống blockchain cơ bản, mô phỏng lại các nguyên tắc cốt lõi của Bitcoin, đặc biệt là cơ chế đồng thuận Proof-of-Work (PoW).

## 2. Yêu cầu tối thiểu (Bare Minimum)

### 2.1. Cấu trúc khối (`Block`)

Mỗi khối trong chuỗi phải chứa các thông tin sau:
- `timestamp`: Thời điểm khối được tạo.
- `transactions`: Danh sách các giao dịch được đưa vào khối.
- `previousHash`: Mã hash của khối đứng trước nó trong chuỗi.
- `hash`: Mã hash của khối hiện tại (được tính toán từ nội dung của nó).
- `nonce`: Một con số được sử dụng trong quá trình đào (mining) để tìm ra hash hợp lệ.
- `difficulty`: Độ khó, quy định số lượng số 0 đứng đầu trong mã hash.

### 2.2. Cấu trúc chuỗi khối (`Blockchain`)

Blockchain là một chuỗi các khối, được triển khai dưới dạng một mảng (array).
- Phải bắt đầu bằng một "Khối nguyên thủy" (Genesis Block), là khối đầu tiên được tạo thủ công.
- Phải có các phương thức để thêm khối mới (`addBlock`) và kiểm tra tính toàn vẹn của chuỗi (`isChainValid`).

### 2.3. Cấu trúc giao dịch (`Transaction`)

Một giao dịch đại diện cho việc chuyển giá trị.
- `fromAddress`: Địa chỉ (public key) của người gửi.
- `toAddress`: Địa chỉ (public key) of người nhận.
- `amount`: Số lượng giá trị được chuyển.
- `signature`: Chữ ký số được tạo bằng khóa riêng (private key) của người gửi để xác thực giao dịch. (Trong giai đoạn đầu có thể đơn giản hóa phần này).

### 2.4. Bằng chứng công việc (Proof-of-Work)

- **Đào (Mining):** Là quá trình thêm một khối mới vào chuỗi.
- Thợ đào phải tìm ra một số `nonce` sao cho mã hash của khối (sử dụng thuật toán SHA-256) bắt đầu bằng một số lượng số 0 nhất định (do `difficulty` quy định).
- Điều này đòi hỏi sức mạnh tính toán và giúp bảo mật mạng lưới.

### 2.5. Ví và tạo khóa

- Cần có một script (`generate_keypair`) để tạo ra các cặp khóa công khai và khóa riêng (ví dụ: sử dụng thuật toán ECDSA).
- Khóa riêng được sử dụng để ký các giao dịch.
- Khóa công khai được sử dụng làm địa chỉ ví.

## 3. Các bước phát triển tiếp theo

- Triển khai mạng ngang hàng (P2P) để đồng bộ hóa blockchain giữa các nút (node) khác nhau.
- Xây dựng một vùng chứa các giao dịch đang chờ xử lý (Mempool).
- Giới thiệu phần thưởng cho việc đào khối và phí giao dịch.