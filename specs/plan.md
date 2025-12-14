# Kế hoạch triển khai dự án Mychain

Dựa trên các yêu cầu trong `constitution.md`, kế hoạch này sẽ chia dự án thành các giai đoạn có thể quản lý được.

## Giai đoạn 1: Xây dựng các cấu trúc dữ liệu cốt lõi (Đã hoàn thành)

Mục tiêu: Tạo ra các class cơ bản cho Giao dịch (Transaction) và Khối (Block).

- [x] **1. Tạo `Transaction.ts` (`@specs/constitution.md#2.3`)**
    - [x] Định nghĩa `class Transaction` với các thuộc tính cần thiết.
    - [x] Triển khai phương thức `calculateHash()` để tính hash cho giao dịch.
    - [x] Triển khai phương thức `signTransaction(signingKey)` để ký giao dịch bằng khóa riêng.
    - [x] Triển khai phương thức `isValid()` để xác minh tính toàn vẹn và chữ ký của giao dịch.

- [x] **2. Tạo `Block.ts` (`@specs/constitution.md#2.1`)**
    - [x] Định nghĩa `class Block` với các thuộc tính: `timestamp`, `transactions`, `previousHash`, `hash`, `nonce`.
    - [x] Triển khai phương thức `calculateHash()` để tính hash (SHA-256) của khối.
    - [x] Triển khai phương thức `mineBlock(difficulty)` để thực hiện thuật toán Proof-of-Work.

## Giai đoạn 2: Xây dựng Logic cho Blockchain (Đang thực hiện)

Mục tiêu: Tạo ra class `Blockchain` để quản lý chuỗi khối, các giao dịch đang chờ và các quy tắc đồng thuận.

- [ ] **1. Cập nhật `Blockchain.ts` (`@specs/constitution.md#2.2`)**
    - [x] Import/Định nghĩa `Block` và `Transaction`.
    - [x] Định nghĩa `class Blockchain`.
    - [x] Trong `constructor`, khởi tạo chuỗi bằng cách tạo `createGenesisBlock()`.
    - [x] Thêm một mảng `mempool` (sẽ đổi tên thành `pendingTransactions`) để lưu các giao dịch đang chờ.
    - [x] Đổi tên `mempool` thành `pendingTransactions` cho nhất quán.
    - [x] Tạo một khối mới với các giao dịch từ mempool.
    - [x] Gọi `mineBlock()` trên khối mới.
    - [x] Thêm khối đã được khai thác vào chuỗi (`chain`).
    - [x] Tạo một giao dịch thưởng cho thợ đào.
    - [x] Triển khai phương thức `addTransaction(transaction)` để thêm giao dịch mới vào mempool.
    - [x] Triển khai phương thức `isChainValid()` để xác minh tính toàn vẹn của toàn bộ chuỗi khối.
    - [ ] Triển khai phương thức `findTransaction(transactionHash)` để tìm giao dịch trong chuỗi.
    - [ ] Triển khai phương thức `getBlockByHash(blockHash)` để tìm khối trong chuỗi.

## Giai đoạn 3: Hoàn thiện và Chạy thử

Mục tiêu: Tạo các script để tạo khóa, chạy thử nghiệm toàn bộ hệ thống.

- [ ] **1. Cập nhật `generate_keypair.ts` (`@specs/constitution.md#2.5`)**
    - [ ] Sử dụng thư viện `elliptic` để tạo và xuất ra một cặp khóa công khai/khóa riêng mới.

- [ ] **2. Cập nhật `main.ts` (Script chính để chạy thử)**
    - [ ] Tạo một instance của `Blockchain`.
    - [ ] Sử dụng `generate_keypair.ts` để tạo một vài ví.
    - [ ] Tạo và ký một vài giao dịch mẫu.
    - [ ] Thêm các giao dịch này vào blockchain.
    - [ ] Bắt đầu quá trình khai thác.
    - [ ] Kiểm tra số dư của các ví sau khi khai thác.
    - [ ] In ra chuỗi khối và kiểm tra tính hợp lệ của nó.

## Giai đoạn 4: Cài đặt và Môi trường (Đã hoàn thành)

- [x] **1. Cập nhật `package.json`**
    - [x] Thêm các thư viện cần thiết: `crypto-js` cho hashing và `elliptic` cho mã hóa khóa công khai/riêng.
    - [x] Thêm các script `npm` để biên dịch và chạy dự án (ví dụ: sử dụng `ts-node`).
- [x] **2. Cài đặt Dependencies**
    - [x] Chạy `npm install` để cài đặt các gói đã định nghĩa.

## Giai đoạn 5: Tối ưu hóa Tra cứu với Off-chain Index (Công việc mới)

Mục tiêu: Xây dựng một lớp dữ liệu off-chain để tăng tốc độ truy vấn thông tin từ blockchain mà không cần quét tuần tự.

- [ ] **1. Thiết lập Cơ sở dữ liệu Off-chain**
    - [ ] Lựa chọn và cài đặt một hệ quản trị CSDL (ví dụ: SQLite, MySQL, PostgreSQL).
    - [ ] Thiết kế schema cho các bảng, ví dụ:
        - `blocks` (block_hash, block_height, timestamp, ...)
        - `transactions` (tx_hash, block_hash, sender, receiver, ...)
    - [ ] Tạo các file cấu hình để kết nối tới CSDL.

- [ ] **2. Xây dựng Dịch vụ Indexing**
    - [ ] Tạo một script/tiến trình nền (gọi là "indexer").
    - [ ] Indexer sẽ theo dõi chuỗi khối (`Blockchain`).
    - [ ] Mỗi khi một khối mới được thêm vào, indexer sẽ đọc dữ liệu của khối và các giao dịch bên trong, sau đó lưu thông tin đã được cấu trúc vào các bảng trong CSDL off-chain.

- [ ] **3. Xây dựng API để Tra cứu**
    - [ ] Xây dựng một lớp API (ví dụ: sử dụng Express.js) để cung cấp các endpoint cho việc truy vấn.
    - [ ] Các API này sẽ truy vấn từ CSDL off-chain thay vì quét trực tiếp blockchain.
    - [ ] Ví dụ về các endpoint:
        - `GET /transaction/:txHash` -> Trả về thông tin giao dịch.
        - `GET /block/:blockHash` -> Trả về thông tin khối.
        - `GET /address/:address/balance` -> Trả về số dư của một địa chỉ.