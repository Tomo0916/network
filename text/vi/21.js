/* vi: the text of lesson 21 (js/lessons.js) */
export default {
  "ls.21.lead": "[[ipaddress:Địa chỉ IP]] là con số phân biệt các thiết bị trong liên mạng. Ở đây ta xem cách viết địa chỉ IPv4 và nội dung của nó.",
  "ls.21.h1": "32 bit chia làm 4 phần",
  "ls.21.p1": "Địa chỉ IPv4 dài 32 bit. 32 số 0 và 1 rất khó đọc, nên ta chia thành 4 nhóm 8 bit, viết mỗi nhóm bằng số thập phân và nối bằng dấu chấm. 8 bit biểu diễn được từ 0 đến 255, nên mỗi số đều nằm trong khoảng 0–255.",
  "ls.21.cap1": "Viết 192.168.1.10 ở dạng nhị phân sẽ được 4 nhóm 8 bit.",
  "ls.21.h2": "Phần mạng và phần host",
  "ls.21.p2": "Địa chỉ IP chia làm hai phần trước và sau. Phần trước là [[netpart:phần mạng]], cho biết mạng nào. Phần sau là [[hostpart:phần host]], cho biết thiết bị nào trong mạng đó. Các thiết bị cùng mạng có phần mạng giống nhau.",
  "ls.21.cap2": "Các thiết bị trong LAN bên trái đều có phần mạng 192.168.1. Phần host phân biệt từng máy.",
  "ls.21.h3": "Giống như địa chỉ nhà",
  "ls.21.p3": "Phần mạng giống tên phường, phần host giống số nhà. Thư được chở tới phường trước, rồi tìm nhà theo số. [[router:Router]] cũng xem phần mạng trước và chở gói tin tới mạng đích.",
  "ls.21.pt1": "[[ipaddress:Địa chỉ IP]] IPv4 dài 32 bit, viết bằng 4 số thập phân, mỗi số 8 bit.",
  "ls.21.pt2": "Phía trước là [[netpart:phần mạng]] (mạng nào), phía sau là [[hostpart:phần host]] (thiết bị nào).",
  "ls.21.pt3": "Router xem phần mạng trước để chở gói tin."
};
