/* vi: the text of lesson 17 (js/lessons.js) */
export default {
  "ls.17.lead": "[[switch:Switch]] trông giống hub, nhưng nó đọc địa chỉ MAC đích của mỗi frame và chỉ gửi tới cổng cần thiết. Để làm vậy, nó tự học thiết bị nào ở cổng nào.",
  "ls.17.h1": "Học bảng địa chỉ MAC",
  "ls.17.p1": "Mỗi khi frame tới, switch ghi địa chỉ MAC nguồn và số cổng mà frame đi vào vào [[mactable:bảng địa chỉ MAC]]. Cứ thế, trong lúc liên lạc, switch tự động học ai ở cổng nào.",
  "ls.17.cap1": "Khi frame từ PC A tới, switch ghi \"A ở cổng 1\" vào bảng.",
  "ls.17.h2": "Lọc (filtering) và tràn (flooding)",
  "ls.17.p2": "Nếu địa chỉ MAC đích có trong bảng, switch chỉ gửi frame ra cổng đó. Vì không gửi ra cổng khác nên gọi là [[macfilter:lọc (filtering)]]. Nếu đích chưa có trong bảng, switch buộc phải gửi frame ra mọi cổng trừ cổng vào. Đó là [[flooding:tràn (flooding)]]. Broadcast cũng được gửi ra mọi cổng.",
  "ls.17.cap2": "Trái: switch biết đích nên chỉ gửi ra cổng của C. Phải: không biết nên gửi ra mọi cổng.",
  "ls.17.h3": "Mỗi cổng một miền xung đột",
  "ls.17.p3": "Switch nhận tín hiệu ở từng cổng riêng, giữ lại một chút rồi gửi đi. Vì vậy mỗi cổng có [[colldomain:miền xung đột]] riêng, và xung đột không lan ra toàn mạng như với hub. Switch là thiết bị tầng 2 dùng địa chỉ MAC.",
  "ls.17.cap3": "Với hub, mọi máy ở chung một miền xung đột; với switch, mỗi cổng tách riêng.",
  "ls.17.pt1": "Switch nhớ địa chỉ MAC nguồn và cổng trong [[mactable:bảng địa chỉ MAC]].",
  "ls.17.pt2": "Biết đích thì một cổng ([[macfilter:lọc]]); không biết thì mọi cổng ([[flooding:tràn]]).",
  "ls.17.pt3": "Switch là thiết bị tầng 2. Mỗi cổng có miền xung đột riêng."
};
