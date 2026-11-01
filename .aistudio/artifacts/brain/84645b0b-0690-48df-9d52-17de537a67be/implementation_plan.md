# Kế Hoạch Triển Khai: Chế Độ Trình Diễn Pháo Hoa Điện Tử (Grand Fireworks Show)

## 1. Mục Tiêu & Trải Nghiệm Người Dùng
- Cung cấp tính năng **"Đêm Trình Diễn Pháo Hoa" (Fireworks Show)** toàn màn hình, biến trang thiệp thành một rạp chiếu pháo hoa đêm lễ hội 20/10 lung linh huyền ảo.
- Kịch bản dàn dựng công phu theo từng cao trào (mở màn -> các loạt pháo hoa nghệ thuật -> chữ phát sáng tri ân tên người nhận -> đại tiệc kết màn bùng nổ Grand Finale).
- Vẫn đảm bảo tính chất **chạy thuần Client-side 100% (Web Audio API + HTML5 2D Canvas Physics)**, siêu nhẹ, không tốn tài nguyên và chạy mượt mà trên VPS sinh viên.

---

## 2. Các Loại Pháo Hoa Vật Lý Chân Thực (Realistic Shell Types)
Mở rộng engine hạt `particleEffects.ts` để bổ sung các loại pháo hoa chuẩn thế giới:
1. **Chrysanthemum / Peony (Pháo hoa Cúc đại đoá & Mẫu đơn):** Bùng nổ hình cầu tròn đều với đuôi sao lấp lánh đổi màu từ hồng ngọc sang vàng kim.
2. **Kamuro / Willow (Pháo hoa Liễu rủ vàng):** Các vệt pháo ánh kim rơi chậm với lực cản không khí mềm mại, phát sáng rực rỡ và tỏa rộng dần.
3. **Double Heart & Ring (Pháo hoa Trái tim kép & Vòng sao):** Nở thành hình trái tim lồng nhau và các vành đai thiên hà.
4. **Crossette & Crackling Palm (Pháo hoa Rẽ nhánh & Cây dừa lách tách):** Mỗi tia pháo tách làm 4 nhánh con kèm chuỗi nổ giòn tan *“tách… tách… bùm”*.
5. **Sky Text / Starlight Projection:** Chữ ánh sáng rực rỡ lấp lánh giữa màn đêm: *"20/10 YÊU THƯƠNG"* & tên người nhận (ví dụ: *"[Tên người nhận]"*).

---

## 3. Kịch Bản Trình Diễn Âm Thanh & Ánh Sáng (Choreographed Timeline)
Khi bấm nút **"Trình diễn pháo hoa"**:
- **0:00 - 0:03:** Đêm tối dần (Dark Cinema Mode), ánh trăng và sao đêm lấp lánh xuất hiện, hiệu ứng đếm ngược 3... 2... 1...
- **0:03 - 0:10:** **Khai màn (Opening Salvo):** Các quả pháo rít vút lên liên tiếp từ hai cánh trái/phải, nổ bung hoa cúc rực rỡ với âm thanh dội trầm ấm.
- **0:10 - 0:25:** **Giai điệu lãng mạn (Willow & Hearts):** Loạt pháo trái tim đôi và liễu rủ vàng kim rơi chậm đan xen nhau theo nhịp nhạc nền waltz lãng mạn.
- **0:25 - 0:38:** **Thông điệp bầu trời (Sky Letters):** Bắn chữ ánh sáng lấp lánh chúc mừng 20/10 và tên người nhận giữa bầu trời sao đêm.
- **0:38 - 0:50:** **Đại tiệc bùng nổ (Grand Finale):** Dàn pháo bắn dồn dập nhiều tầng (thấp, trung, cao) phủ kín bầu trời, âm thanh rền vang như đêm giao thừa/lễ hội thật, kết thúc bằng mưa sao băng vàng óng.
- **Sau 0:50:** Hiện lời chúc kết màn ấm áp cùng nút xem lại hoặc quay về đọc tiếp thiệp.

---

## 4. Giao Diện & Nút Điều Khiển
- **Nút kích hoạt:** Thêm nút biểu tượng pháo hoa lung linh trên Toolbar dưới đáy hoặc thẻ đặc biệt trong trang: **"Xem Trình Diễn Pháo Hoa 🎆"**.
- **Chế độ trình chiếu (Cinema Overlay):**
  - Thanh điều khiển tối giản ở góc trên: Nút **Tạm dừng / Tiếp tục**, nút **Bật/Tắt âm thanh pháo hoa**, nút **Thoát (X)**.
  - Tự động tương thích hoàn hảo trên cả điện thoại (màn hình dọc) và máy tính (màn hình ngang).
- Không ảnh hưởng đến các logic URL và bảo mật phân quyền trước đó (`ldkien.me` vẫn sạch sẽ, người nhận không thể sửa thiệp).

---

## 5. Kế Hoạch Triển Khai Kỹ Thuật
1. **Nâng cấp `src/lib/particleEffects.ts`:**
   - Bổ sung các hàm vẽ và tính toán vật lý: `willowShell()`, `chrysanthemumShell()`, `crossetteShell()`, `drawSkyText()`.
2. **Nâng cấp `src/lib/audioSynth.ts`:**
   - Bổ sung hiệu ứng âm thanh: tiếng huýt sáo rít cao (Whistling comet tail), tiếng đập dội xa (Distant multi-echo), tiếng nổ chùm lách tách (Crackling clusters).
3. **Tạo component mới `src/components/FireworksShowModal.tsx`:**
   - Quản lý kịch bản thời gian (Timeline scheduler), Canvas biểu diễn chuyên biệt độ phân giải cao và thanh công cụ chiếu bóng.
4. **Tích hợp vào `App.tsx` & `Toolbar.tsx`:**
   - Thêm nút kích hoạt và gắn kết trạng thái xem.
5. **Kiểm thử & Tối ưu hoá:**
   - Kiểm tra hiệu năng 60 FPS, độ giật lag trên thiết bị di động, chạy `npm run build` và kiểm tra Dev Server.
