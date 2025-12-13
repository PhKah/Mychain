# Các Điểm Cần Cải Thiện cho Mychain

Đây là danh sách các mục cần cải thiện cho file `src/Blockchain.ts`, được phân loại theo mức độ ưu tiên.

## 1. Mức Độ Nghiêm Trọng (Critical Issues)

### a. `Transaction.calculateHash()` luôn trả về chuỗi rỗng
- **Vấn đề:** Hàm này hiện tại là `return "";`. Điều này làm cho việc xác thực chữ ký trở nên vô nghĩa và không an toàn.
- **Cách sửa:** Hash phải được tính toán từ nội dung của giao dịch.
  ```typescript
  // Bên trong class Transaction

  calculateHash(): string {
      // Để đảm bảo tính nhất quán (deterministic), chúng ta sẽ tạo một đối tượng
      // với các thuộc tính theo thứ tự nhất quán trước khi hash.
      // Việc này đảm bảo mọi máy tính sẽ tạo ra cùng một hash cho cùng một giao dịch.
      const dataToHash = {
          sender: this.sender,
          fee: this.fee,
          instruction: this.instruction,
          input: this.input
          // Lưu ý: signature không được đưa vào đây, vì hash này chính là thứ
          // mà chúng ta sẽ dùng để tạo ra signature.
      };

      // JSON.stringify sẽ chuyển đổi đối tượng thành một chuỗi văn bản.
      // Đối với cấu trúc dữ liệu này, nó đủ ổn định cho dự án của chúng ta.
      // Các hệ thống chuyên nghiệp hơn có thể dùng các thư viện serialization như Protobuf.
      const serializedData = JSON.stringify(dataToHash);

      return sha256(serializedData).toString();
  }
  ```

### b. Vòng lặp vô hạn trong `Wallet.listen()`
- **Vấn đề:** `while(true)` sẽ chặn hoàn toàn event loop của Node.js, làm chương trình bị "đơ".
- **Cách sửa:** Sử dụng polling không đồng bộ (async/await với `setInterval` hoặc `setTimeout`).
  ```typescript
  // Bên trong class Wallet
  async listen() {
      const processNewBlock = () => {
          const block: Block = network.getLatestBlock();
          for (const trans of block.transaction) {
              for (const out of trans.output) {
                  if (sha256(this.owner).toString() === out.scriptPubKey) { 
                      this.uxtoList.push(out);
                  }
              }
          }
      };
      
      setInterval(processNewBlock, 10000); 
  }
  ```

## 2. Lỗi Logic và Tiềm ẩn (Logical and Potential Bugs)

### a. Khởi tạo `Blockchain.chain` bị lỗi
- **Vấn đề:** `public chain: Block[] = [this.createGenesis()];` sẽ gây lỗi vì `this` không thể được sử dụng trong quá trình khởi tạo thuộc tính.
- **Cách sửa:** Gọi `createGenesis()` bên trong `constructor`.
  ```typescript
  class Blockchain {
      public chain: Block[];

      constructor(...) {
          this.chain = [this.createGenesis()]; 
      }
  }
  ```

### b. Lỗi logic trong `Block.merkleTree`
- **Vấn đề:** `const mid = (l + r) / 2;` có thể tạo ra số thực.
- **Cách sửa:** Dùng `Math.floor()`.
  ```typescript
  const mid = Math.floor((l + r) / 2);
  ```

### c. Rủi ro crash trong `Blockchain.Mining`
- **Vấn đề:** Lấy `block.size` giao dịch từ mempool có thể gây lỗi nếu mempool không đủ.
- **Cách sửa:** Chỉ lấy số lượng giao dịch có sẵn.
  ```typescript
  // Bên trong hàm Mining
  const transactionsToMine = Math.min(block.size, this.mempool.length);
  for (let i = 0; i < transactionsToMine; i++) {
      const tx = this.mempool.pop(); // Dùng pop()
      if (tx) {
          block.transaction.push(tx);
      }
  }
  ```

## 3. Cải Thiện về TypeScript và Cấu Trúc (TypeScript & Structural Improvements)

### a. Sử dụng `import` thay cho `require`
- **Vấn đề:** Code đang dùng `require` trong file `.ts`.
- **Cách sửa:** Dùng `import/export` cho nhất quán.
  ```typescript
  import sha256 from 'crypto-js/sha256';
  export { Blockchain, Transaction };
  ```

### b. Kiểu `any` trong `isChainValid`
- **Vấn đề:** Hàm `isChainValid(): any` nên trả về kiểu cụ thể.
- **Cách sửa:** Sửa thành `isChainValid(): boolean`.

### c. Import không sử dụng
- **Vấn đề:** `import { Instruction } from '@metaplex-foundation/umi';` không được dùng.
- **Cách sửa:** Xóa dòng import này đi.

## 4. Gợi Ý Khác
- **Tên biến**: Sửa `uxtoList` thành `utxoList`.
- **Sử dụng `sha256`**: Luôn gọi `.toString()` để lấy chuỗi hash từ kết quả của `sha256()`.
- **Hàm `merkleProof`**: Logic hiện tại phức tạp, nên xem xét lại thiết kế để đơn giản và đúng mục đích hơn.
