/* vi: the text of lesson 15 (js/lessons.js) */
export default {
  "ls.15.lead": "Khi nhiều thiết bị ở chung một mạng, mỗi frame cần một địa chỉ cho biết gửi cho ai. Địa chỉ của tầng 2 là [[mac:địa chỉ MAC]]. Bài này học cấu trúc của địa chỉ MAC và ba loại đích.",
  "ls.15.h1": "Cấu trúc của địa chỉ MAC",
  "ls.15.p1": "[[mac:Địa chỉ MAC]] là một số 48 bit được ghi vào mỗi NIC tại nhà máy. Thường được viết thành sáu nhóm, mỗi nhóm hai chữ số thập lục phân, như 00:1A:2B:3C:4D:5E. 24 bit đầu là mã nhà sản xuất (OUI), 24 bit sau là số sê-ri do nhà sản xuất đặt.",
  "ls.15.cap1": "Địa chỉ MAC dài 48 bit. Ba byte đầu là mã nhà sản xuất, ba byte sau là số sê-ri.",
  "ls.15.h2": "Ba loại đích",
  "ls.15.p2": "Gửi cho một thiết bị là [[unicast:unicast]], gửi cho mọi thiết bị trong cùng mạng là [[broadcast:broadcast]], chỉ gửi cho một nhóm nhất định là [[multicast:multicast]]. Địa chỉ MAC đích của broadcast là FF:FF:FF:FF:FF:FF, cả 48 bit đều là 1.",
  "ls.15.cap2": "Từ trái: unicast (một thiết bị), broadcast (tất cả), multicast (một nhóm). Màu xanh là thiết bị nhận.",
  "ls.15.h3": "NIC quyết định có nhận hay không",
  "ls.15.p3": "Header của frame [[ethernet:Ethernet]] chứa địa chỉ MAC đích và địa chỉ MAC nguồn. NIC xem đích của mỗi frame tới. Nếu đó là địa chỉ MAC của chính nó, broadcast, hoặc nhóm multicast nó tham gia thì nhận frame. Nếu không thì bỏ.",
  "ls.15.cap3": "NIC chỉ xem địa chỉ MAC đích để quyết định nhận hay bỏ frame.",
  "ls.15.pt1": "[[mac:Địa chỉ MAC]] dài 48 bit: 24 bit mã nhà sản xuất và 24 bit số sê-ri.",
  "ls.15.pt2": "Cho một = [[unicast:unicast]], cho tất cả = [[broadcast:broadcast]], cho nhóm = [[multicast:multicast]].",
  "ls.15.pt3": "NIC xem địa chỉ MAC đích và bỏ frame không phải gửi cho mình."
};
