/* vi: the text of lesson 23 (js/lessons.js) */
export default {
  "ls.23.lead": "Nếu chỉ dùng lớp, một mạng có thể trở nên rất lớn. [[subnetting:Chia mạng con]] là cách chia một mạng thành các mạng nhỏ hơn (mạng con).",
  "ls.23.h1": "Mượn bit của phần host",
  "ls.23.p1": "Khi chia mạng con, ta mượn các bit đầu của phần host để làm phần mạng dài hơn. Ví dụ, mạng lớp B 172.16.0.0, nếu lấy 3 số đầu làm phần mạng, sẽ chia được thành nhiều mạng nhỏ như 172.16.1.0, 172.16.2.0… Chia mạng theo từng phòng ban giúp quản lý dễ hơn.",
  "ls.23.cap1": "Chia mạng lớp B lớn thành các mạng con nhỏ cho từng phòng ban.",
  "ls.23.h2": "Subnet mask",
  "ls.23.p2": "[[subnetmask:Subnet mask]] cho biết phần mạng dài tới đâu. Đó là số 32 bit có bit 1 ở phần mạng và bit 0 ở phần host, viết bằng số thập phân giống địa chỉ IP. Với 255.255.255.0, 24 bit đầu là phần mạng.",
  "ls.23.cap2": "Chỗ mask là 1 là phần mạng, chỗ là 0 là phần host.",
  "ls.23.h3": "Tính địa chỉ mạng",
  "ls.23.p3": "Tính AND từng bit giữa địa chỉ IP và subnet mask (chỉ ra 1 khi cả hai đều là 1) sẽ được địa chỉ mạng. Nếu địa chỉ mạng của mình và của đích giống nhau, người nhận ở cùng mạng. Nếu khác, cần router chuyển giúp.",
  "ls.23.cap3": "192.168.1.130 AND 255.255.255.192 được 192.168.1.128.",
  "ls.23.pt1": "[[subnetting:Chia mạng con]] mượn phần host để chia mạng nhỏ hơn.",
  "ls.23.pt2": "[[subnetmask:Subnet mask]] có 1 ở phần mạng, 0 ở phần host.",
  "ls.23.pt3": "Địa chỉ IP AND mask cho ra địa chỉ mạng."
};
