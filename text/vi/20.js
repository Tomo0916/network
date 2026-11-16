/* vi: the text of lesson 20 (js/lessons.js) */
export default {
  "ls.20.lead": "[[ip:IP]] (Internet Protocol) là giao thức tiêu biểu của tầng 3. Hầu hết thiết bị nối Internet đều giao tiếp bằng IP.",
  "ls.20.h1": "IP chạy trên nhiều loại mạng",
  "ls.20.p1": "Bên dưới IP có nhiều loại tầng 2 như Ethernet, mạng LAN không dây. IP hoạt động như nhau trên tất cả. Ngoài ra, IP chỉ \"cố gắng hết sức\" để gửi, không kiểm tra dữ liệu đã tới chưa. Khi cần kiểm tra, TCP ở tầng trên sẽ làm.",
  "ls.20.cap1": "IP hoạt động giống nhau trên nhiều loại tầng 2.",
  "ls.20.h2": "Hình dạng của gói tin IP",
  "ls.20.p2": "Một khối dữ liệu gửi bằng IP gọi là [[packet:gói tin]] IP. Phía trước gói tin có [[header:header]], ghi địa chỉ IP nguồn, địa chỉ IP đích, [[ttl:TTL]] (còn đi qua được bao nhiêu router), v.v. Router đọc header này để quyết định gửi đi đâu.",
  "ls.20.cap2": "Gói tin IP gồm header IP và dữ liệu.",
  "ls.20.h3": "Gói tin đi trong frame",
  "ls.20.p3": "Gói tin IP không thể tự đi trên dây. Nó được đặt vào frame của tầng 2 ([[encap:đóng gói]]) để chở đi. Mỗi lần qua router, frame bên ngoài được làm lại, nhưng đích của gói tin IP bên trong không đổi cho tới cuối.",
  "ls.20.cap3": "Router mở frame, lấy gói tin ra và đặt vào frame mới cho đoạn tiếp theo.",
  "ls.20.pt1": "[[ip:IP]] là giao thức tiêu biểu của tầng 3, không kiểm tra dữ liệu đã tới chưa.",
  "ls.20.pt2": "[[header:Header]] của [[packet:gói tin]] IP ghi địa chỉ IP nguồn và đích, v.v.",
  "ls.20.pt3": "Frame được làm lại ở mỗi đoạn, nhưng đích của gói tin IP không đổi."
};
