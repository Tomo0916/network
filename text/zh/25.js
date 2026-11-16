/* zh: the text of lesson 25 (js/lessons.js) */
export default {
  "ls.25.lead": "连接网络的设备需要IP地址等设置。一台一台手动设置很麻烦，还容易出错。[[dhcp:DHCP]]就是自动分配这些设置的协议。",
  "ls.25.h1": "DHCP分配的内容",
  "ls.25.p1": "DHCP服务器把[[ipaddress:IP地址]]、[[subnetmask:子网掩码]]、[[gateway:默认网关]]、DNS服务器地址等设置一起交给连接上来的设备。在家里，通常由路由器担任DHCP服务器。",
  "ls.25.cap1": "DHCP服务器把通信需要的设置成套分配。",
  "ls.25.h2": "4条消息",
  "ls.25.p2": "获得设置前要交换4条消息。①DISCOVER：设备寻找“有DHCP服务器吗？”②OFFER：服务器提议“这个地址怎么样？”③REQUEST：设备申请“我就用它”。④ACK：服务器确认“可以”。设备还没有IP地址，所以DISCOVER用[[broadcast:广播]]发送。",
  "ls.25.cap2": "按DISCOVER → OFFER → REQUEST → ACK的顺序交换4次。",
  "ls.25.h3": "地址是出租的",
  "ls.25.p3": "DHCP分配的地址不是送给设备的，而是有期限地出租。这个期限叫做租约。继续使用的设备要在期限到之前申请续租。不再使用的地址会还给服务器，可以再租给其他设备。",
  "ls.25.cap3": "大约在期限过半时申请续租。不用时归还。",
  "ls.25.pt1": "[[dhcp:DHCP]]自动分配IP地址等设置。",
  "ls.25.pt2": "DISCOVER → OFFER → REQUEST → ACK 4条消息。",
  "ls.25.pt3": "地址是有期限的出租（租约）。"
};
