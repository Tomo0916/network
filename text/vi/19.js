/* vi: the text of lesson 19 (js/lessons.js) */
export default {
  "ls.19.lead": "Đến đây, chúng ta đã xem cách dữ liệu đi trong một mạng. Tầng 3 là tầng nối các mạng với nhau và đưa dữ liệu tới người nhận ở xa.",
  "ls.19.h1": "Nối các mạng",
  "ls.19.p1": "LAN là mạng trong một tòa nhà hoặc một phòng. Khi nối nhiều LAN bằng [[router:router]], ta có một mạng của các mạng, gọi là [[internetwork:liên mạng]]. Internet, nối các mạng trên toàn thế giới, là ví dụ lớn nhất.",
  "ls.19.cap1": "Ba LAN nối bằng hai router trở thành một liên mạng lớn.",
  "ls.19.h2": "Phân công giữa tầng 2 và tầng 3",
  "ls.19.p2": "Tầng 2 (Ethernet, v.v.) chỉ đưa dữ liệu tới thiết bị kế bên trong cùng một mạng. Tầng 3 đưa dữ liệu từ người gửi tới đích cuối cùng, qua nhiều mạng. Tầng 2 chở từng đoạn một, còn tầng 3 quyết định cả hành trình.",
  "ls.19.cap2": "Tầng 2 chở theo từng đoạn. Tầng 3 lo toàn bộ đường đi từ người gửi tới đích.",
  "ls.19.h3": "Địa chỉ và chỉ đường",
  "ls.19.p3": "Để đưa dữ liệu đi xa cần hai thứ. Một là địa chỉ phân biệt người nhận trên toàn thế giới: [[ipaddress:địa chỉ IP]]. Hai là chọn đường tới đích, gọi là [[routing:định tuyến]], do router đảm nhận.",
  "ls.19.pt1": "Các mạng nối bằng [[router:router]] tạo thành [[internetwork:liên mạng]].",
  "ls.19.pt2": "Tầng 2 đưa tới thiết bị kế bên, tầng 3 đưa tới đích cuối cùng.",
  "ls.19.pt3": "Tầng 3 cần địa chỉ ([[ipaddress:địa chỉ IP]]) và chỉ đường ([[routing:định tuyến]])."
};
