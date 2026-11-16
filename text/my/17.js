/* my: the text of lesson 17 (js/lessons.js) */
export default {
  "ls.17.lead": "[[switch:Switch]] သည် ကြည့်ရသည်မှာ hub နှင့် ဆင်သော်လည်း frame ၏ ဦးတည်ရာ MAC လိပ်စာကို ကြည့်၍ လိုအပ်သော port သို့သာ ပို့သည်။ ထိုသို့ လုပ်ရန် ဘယ် port တွင် ဘယ်စက် ရှိသလဲ ကိုယ်တိုင် မှတ်သည်။",
  "ls.17.h1": "MAC လိပ်စာ ဇယား သင်ယူခြင်း",
  "ls.17.p1": "frame ရောက်တိုင်း switch က ၎င်း၏ ပို့သူ MAC လိပ်စာနှင့် ရောက်လာသော port နံပါတ်ကို [[mactable:MAC လိပ်စာ ဇယား]] တွင် ရေးသည်။ ဤနည်းဖြင့် ဆက်သွယ်ရင်း ဘယ်သူ ဘယ် port တွင် ရှိသလဲ အလိုအလျောက် မှတ်သွားသည်။",
  "ls.17.cap1": "PC A မှ frame ရောက်လျှင် switch က ဇယားတွင် \"A သည် port 1 တွင်\" ဟု ရေးသည်။",
  "ls.17.h2": "Filtering နှင့် flooding",
  "ls.17.p2": "ဦးတည်ရာ MAC လိပ်စာ ဇယားတွင် ရှိလျှင် switch က ထို port သို့သာ ပို့သည်။ အခြား port သို့ မပို့သဖြင့် ၎င်းကို [[macfilter:filtering]] ဟုခေါ်သည်။ ဦးတည်ရာ ဇယားတွင် မရှိသေးလျှင် ရောက်လာသော port မှလွဲ၍ port အားလုံးသို့ ပို့ရသည်။ ၎င်းက [[flooding:flooding]] ဖြစ်သည်။ broadcast ကိုလည်း port အားလုံးသို့ ပို့သည်။",
  "ls.17.cap2": "ဘယ် - ဦးတည်ရာ သိ၍ C ၏ port သို့သာ။ ညာ - မသိ၍ port အားလုံးသို့။",
  "ls.17.h3": "port တစ်ခုစီ collision domain ခွဲခြင်း",
  "ls.17.p3": "switch သည် port တစ်ခုစီတွင် signal ကို သီးခြား လက်ခံ၍ ခဏ ထားပြီးမှ ဆက်ပို့သည်။ ထို့ကြောင့် port တစ်ခုစီ၏ [[colldomain:collision domain]] ခွဲသွားပြီး hub ကဲ့သို့ ကွန်ရက်တစ်ခုလုံး တိုက်မိမှု မဖြစ်တော့။ switch သည် MAC လိပ်စာ သုံးသော အလွှာ 2 စက် ဖြစ်သည်။",
  "ls.17.cap3": "hub တွင် အားလုံး collision domain တစ်ခုတည်း၊ switch တွင် port အလိုက် ခွဲသည်။",
  "ls.17.pt1": "switch သည် ပို့သူ MAC လိပ်စာနှင့် port ကို [[mactable:MAC လိပ်စာ ဇယား]] တွင် မှတ်သည်။",
  "ls.17.pt2": "ဦးတည်ရာ သိလျှင် port တစ်ခု ([[macfilter:filtering]])၊ မသိလျှင် port အားလုံး ([[flooding:flooding]])။",
  "ls.17.pt3": "switch သည် အလွှာ 2 စက်။ port တစ်ခုစီ collision domain ခွဲသည်။"
};
