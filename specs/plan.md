# Kế hoạch triển khai dự án Mychain

Dựa trên các yêu cầu trong `constitution.md`, kế hoạch này sẽ chia dự án thành các giai đoạn có thể quản lý được.

## Giai đoạn 1: Xây dựng các cấu trúc dữ liệu cốt lõi

Mục tiêu: Tạo ra các class cơ bản cho Giao dịch (Transaction) và Khối (Block).

1.  **Tạo `Transaction.ts` (`@specs/constitution.md#2.3`)**
    *   Định nghĩa `class Transaction` với các thuộc tính: `fromAddress`, `toAddress`, `amount`, `signature`.
    *   Triển khai phương thức `calculateHash()` để tính hash cho giao dịch.
    *   Triển khai phương thức `signTransaction(signingKey)` để ký giao dịch bằng khóa riêng.
    *   Triển khai phương thức `isValid()` để xác minh tính toàn vẹn và chữ ký của giao dịch.

2.  **Tạo `Block.ts` (`@specs/constitution.md#2.1`)**
    *   Định nghĩa `class Block` với các thuộc tính: `timestamp`, `transactions`, `previousHash`, `hash`, `nonce`, `difficulty`.
    *   Triển khai phương thức `calculateHash()` để tính hash (SHA-256) của khối.
    *   Triển khai phương thức `mineBlock(difficulty)` để thực hiện thuật toán Proof-of-Work. Phương thức này sẽ lặp cho đến khi tìm thấy một hash hợp lệ.

## Giai đoạn 2: Xây dựng Logic cho Blockchain

Mục tiêu: Tạo ra class `Blockchain` để quản lý chuỗi khối, các giao dịch đang chờ và các quy tắc đồng thuận.

1.  **Cập nhật `Blockchain.ts` (`@specs/constitution.md#2.2`)**
    *   Import `Block` và `Transaction`.
    *   Định nghĩa `class Blockchain`.
    *   Trong `constructor`, khởi tạo chuỗi bằng cách tạo `createGenesisBlock()`.
    *   Thêm một mảng `pendingTransactions` để lưu các giao dịch đang chờ được khai thác.
    *   Triển khai phương thức `minePendingTransactions(miningRewardAddress)`:
        *   Tạo một khối mới với các giao dịch từ `pendingTransactions`.
        *   Gọi `mineBlock()` trên khối mới.
        *   Thêm khối đã được khai thác vào chuỗi (`chain`).
        *   Tạo một giao dịch thưởng cho thợ đào.
    *   Triển khai phương thức `addTransaction(transaction)` để thêm giao dịch mới vào `pendingTransactions` sau khi xác thực.
    *   Triển khai phương thức `getBalanceOfAddress(address)` để tính toán số dư của một ví.
    *   Triển khai phương thức `isChainValid()` để xác minh tính toàn vẹn của toàn bộ chuỗi khối.

## Giai đoạn 3: Hoàn thiện và Chạy thử

Mục tiêu: Tạo các script để tạo khóa, chạy thử nghiệm toàn bộ hệ thống.

1.  **Cập nhật `generate_keypair.ts` (`@specs/constitution.md#2.5`)**
    *   Sử dụng thư viện `elliptic` để tạo và xuất ra một cặp khóa công khai/khóa riêng mới.

2.  **Cập nhật `main.ts` (Script chính để chạy thử)**
    *   Tạo một instance của `Blockchain`.
    *   Sử dụng `generate_keypair.ts` để tạo một vài ví.
    *   Tạo và ký một vài giao dịch mẫu.
    *   Thêm các giao dịch này vào blockchain.
    *   Bắt đầu quá trình khai thác.
    *   Kiểm tra số dư của các ví sau khi khai thác.
    *   In ra chuỗi khối và kiểm tra tính hợp lệ của nó.

## Giai đoạn 4: Cài đặt và Môi trường

1.  **Cập nhật `package.json`**
    *   Thêm các thư viện cần thiết: `crypto-js` cho hashing và `elliptic` cho mã hóa khóa công khai/riêng.
    *   Thêm các script `npm` để biên dịch và chạy dự án (ví dụ: sử dụng `ts-node`).
2.  **Cài đặt Dependencies**
    *   Chạy `npm install` để cài đặt các gói đã định nghĩa.
