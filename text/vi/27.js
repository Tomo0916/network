/* vi: the text of lesson 27 (js/lessons.js) */
export default {
  "ls.27.lead": "Địa chỉ IP là những con số nên khó nhớ đối với con người. Vì vậy ta dùng tên như \"www.example.com\". [[dns:DNS]] là cơ chế liên kết tên với địa chỉ IP.",
  "ls.27.h1": "Từ tên sang địa chỉ IP",
  "ls.27.p1": "Con người dùng [[domain:tên miền]], còn máy tính giao tiếp bằng địa chỉ IP. Khi gõ tên miền vào trình duyệt, máy tính trước hết hỏi máy chủ DNS: \"Địa chỉ IP của tên này là gì?\". Tìm địa chỉ IP từ tên gọi là phân giải tên.",
  "ls.27.cap1": "Máy tính hỏi tên, máy chủ DNS trả lời bằng địa chỉ IP.",
  "ls.27.h2": "Các cấp của tên miền",
  "ls.27.p2": "Tên miền là các cấp hình cây, ngăn cách bằng dấu chấm. Càng sang phải, cấp càng cao. Trên cùng là gốc (root), dưới đó là \"jp\", \"com\", rồi \"co.jp\", tên tổ chức… Mỗi cấp do các máy chủ DNS khác nhau chia nhau quản lý.",
  "ls.27.cap2": "www.example.co.jp được dò theo: gốc → jp → co → example → www.",
  "ls.27.h3": "Quá trình phân giải tên",
  "ls.27.p3": "Nếu máy chủ DNS được hỏi không biết câu trả lời, nó lần lượt hỏi, bắt đầu từ máy chủ gốc. Gốc nói \"về jp thì hỏi máy chủ này\", máy chủ jp chỉ máy chủ tiếp theo… cho tới khi có câu trả lời. Câu trả lời được lưu một thời gian, nên lần thứ hai trả lời được ngay.",
  "ls.27.cap3": "Máy chủ DNS lần lượt hỏi máy chủ gốc → jp → example.co.jp.",
  "ls.27.pt1": "[[dns:DNS]] liên kết [[domain:tên miền]] với địa chỉ IP.",
  "ls.27.pt2": "Tên miền là các cấp hình cây, càng sang phải càng cao.",
  "ls.27.pt3": "Câu trả lời được tìm bằng cách dò từ gốc, và được lưu một thời gian."
};
