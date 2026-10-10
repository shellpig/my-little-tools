// The town's residents.
//
// look  — Mini Characters model: male-a … male-f, female-a … female-f
// work  — the place they work, if any (a shop or public building name)
// home  — 'upstairs' (above their workplace), 'townhouse' or 'villa';
//         homes are handed out in order from the town's houses
// plan  — the day as [clock hour, place] departures: at that hour they leave
//         wherever they are for that place. Before the first departure they
//         are where the last one took them, usually home.
//         Places: any shop or public building name, '山嵐旅館', '公園',
//         '公車站' (they board a bus and leave town), '加油站' or 'home'.
// say   — one line for each part of the day: morning 05–11, day 11–17,
//         evening 17–22, night 22–05

export const RESIDENTS = [
  // Shopkeepers and staff
  {
    name: '陳曉晴', look: 'female-a', job: '咖啡師', work: '晨光咖啡', home: 'upstairs',
    plan: [[6.5, '晨光咖啡'], [22.6, '公園'], [23.2, 'home']],
    say: { morning: '第一杯拿鐵的拉花，今天是天鵝。', day: '下午茶時段最忙了，等我一下喔！', evening: '收店前的咖啡渣可以拿去種花。', night: '關店後繞公園一圈，才睡得著。' },
  },
  {
    name: '林以安', look: 'male-c', job: '書店老闆', work: '小巷書店', home: 'townhouse',
    plan: [[9.5, '小巷書店'], [12.3, '老街麵館'], [13, '小巷書店'], [21.6, 'home']],
    say: { morning: '新到的二手書還沒拆箱，好期待。', day: '麵館的乾麵配一本小說，完美午休。', evening: '有人在書裡夾了一張舊車票。', night: '今天賣出三本詩集，算是好日子。' },
  },
  {
    name: '王志明', look: 'male-e', job: '超商早班店員', work: '便利商店', home: 'townhouse',
    plan: [[6.8, '便利商店'], [15, '公園'], [16, 'home']],
    say: { morning: '早班最常聽到的是：一杯大冰美。', day: '交班了，去公園曬一下太陽。', evening: '晚上就交給阿翔哥顧店。', night: '明天又要五點半起床……' },
  },
  {
    name: '黃宇翔', look: 'male-b', job: '超商大夜店員', work: '便利商店', home: 'townhouse',
    plan: [[7, 'home'], [14.5, '甜甜手搖飲'], [15.2, 'home'], [22, '便利商店']],
    say: { morning: '下班！回家補眠。', day: '剛睡醒，先來一杯半糖少冰。', evening: '準備上大夜，今晚應該很安靜。', night: '半夜來買關東煮的，都是熟面孔。' },
  },
  {
    name: '吳美玲', look: 'female-c', job: '麵包師傅', work: '麥香麵包', home: 'upstairs',
    plan: [[5.5, '麥香麵包'], [14, '郵局'], [14.5, '麥香麵包'], [20.2, 'home']],
    say: { morning: '菠蘿麵包剛出爐，香吧？', day: '寄一箱鳳梨酥給台北的女兒。', evening: '剩下的吐司明天做成麵包布丁。', night: '麵團在冰箱裡慢慢發酵中。' },
  },
  {
    name: '張若涵', look: 'female-d', job: '花店店主', work: '小花園花店', home: 'townhouse',
    plan: [[8.5, '小花園花店'], [19.6, 'home']],
    say: { morning: '今天進了好多向日葵。', day: '有人訂了一束告白用的玫瑰，好緊張。', evening: '沒賣完的花，送給晚上路過的人。', night: '夢裡也在包花束。' },
  },
  {
    name: '李秀琴', look: 'female-e', job: '早餐店老闆娘', work: '阿嬤早餐', home: 'upstairs',
    plan: [[5, '阿嬤早餐'], [13.2, '公園'], [15, 'home']],
    say: { morning: '帥哥，蛋餅要不要加起司？', day: '收攤囉，去公園跟老朋友聊天。', evening: '早點睡，明天四點半要備料。', night: '呼……（睡著了）' },
  },
  {
    name: '周大川', look: 'male-d', job: '麵館老闆', work: '老街麵館', home: 'villa',
    plan: [[10, '老街麵館'], [21.2, 'home']],
    say: { morning: '大骨湯從昨晚熬到現在。', day: '牛肉麵小碗？我們沒有小碗啦。', evening: '晚餐時段，再多一個人就坐不下了。', night: '收店後的那碗麵，是給自己的。' },
  },
  {
    name: '許靜宜', look: 'female-f', job: '藥師', work: '安心藥局', home: 'townhouse',
    plan: [[8.5, '安心藥局'], [22.1, 'home']],
    say: { morning: '換季了，記得多喝水。', day: '診所開的藥，飯後吃喔。', evening: '感冒的人變多了，口罩快賣完。', night: '藥局燈關了，明天見。' },
  },
  {
    name: '鄭家豪', look: 'male-a', job: '洗衣店老闆', work: '泡泡洗衣', home: 'upstairs',
    plan: [[8, '泡泡洗衣'], [11.8, '阿嬤早餐'], [12.3, '泡泡洗衣'], [20, 'home']],
    say: { morning: '烘衣機三號又卡住了。', day: '早餐店的蘿蔔糕是我的午餐。', evening: '自助洗衣二十四小時，我可不是。', night: '樓下的洗衣機還在轉，好催眠。' },
  },
  {
    name: '蔡宛如', look: 'female-b', job: '文具店店主', work: '拾光文具', home: 'townhouse',
    plan: [[9, '拾光文具'], [21.1, 'home']],
    say: { morning: '新學期，小朋友都來買橡皮擦。', day: '這支鋼筆寫起來很滑，要試試嗎？', evening: '放學後的店裡最熱鬧。', night: '在家畫明天要貼的手寫海報。' },
  },
  {
    name: '楊佳穎', look: 'female-a', job: '手搖飲店員', work: '甜甜手搖飲', home: 'townhouse',
    plan: [[11, '甜甜手搖飲'], [23.1, 'home']],
    say: { morning: '還沒開店啦，十一點見！', day: '珍珠剛煮好，現在最Q。', evening: '今天第一百杯，全糖去冰。', night: '收店時把剩下的冰塊倒掉，嘩啦一聲。' },
  },

  // Hotel
  {
    name: '劉建宏', look: 'male-f', job: '旅館經理', work: '山嵐旅館', home: 'villa',
    plan: [[8, '山嵐旅館'], [19, '晨光咖啡'], [19.8, 'home']],
    say: { morning: '今天有一團登山客要入住。', day: '三樓的窗景最好，要不要升級？', evening: '下班前來一杯手沖，獎勵自己。', night: '旅館交給夜班的雅婷了。' },
  },
  {
    name: '謝雅婷', look: 'female-c', job: '旅館夜班櫃檯', work: '山嵐旅館', home: 'townhouse',
    plan: [[6.5, 'home'], [15, '小花園花店'], [15.4, 'home'], [21.5, '山嵐旅館']],
    say: { morning: '交班！早餐我要吃兩份。', day: '買一束花放在櫃檯，客人會開心。', evening: '今晚還有兩組客人沒到。', night: '凌晨兩點，有人來問最近的拉麵店。' },
  },

  // School, post office, clinic, gas station
  {
    name: '何文彬', look: 'male-c', job: '國小老師', work: '鎮立小學', home: 'villa',
    plan: [[7.2, '鎮立小學'], [17.5, '小巷書店'], [18.3, 'home']],
    say: { morning: '早自習，誰又忘了帶聯絡簿？', day: '午休時間，全校安靜得像圖書館。', evening: '來找下週自然課要用的繪本。', night: '作業簿改到一半，眼睛好痠。' },
  },
  {
    name: '鍾怡君', look: 'female-d', job: '國小老師', work: '鎮立小學', home: 'townhouse',
    plan: [[7.3, '鎮立小學'], [16.8, '甜甜手搖飲'], [17.2, 'home']],
    say: { morning: '今天要帶大家去公園觀察昆蟲。', day: '音樂課，直笛聲此起彼落。', evening: '放學後的第一口奶茶最療癒。', night: '明天的考卷印好了嗎……' },
  },
  {
    name: '郭志遠', look: 'male-b', job: '郵差', work: '郵局', home: 'townhouse',
    plan: [[8, '郵局'], [10, '山嵐旅館'], [10.4, '安心藥局'], [10.8, '郵局'], [18.6, 'home']],
    say: { morning: '旅館有一封從日本寄來的明信片。', day: '這條街每一戶的狗，我都認識。', evening: '今天送了八十七封信。', night: '夢裡還在找門牌。' },
  },
  {
    name: '蘇明哲', look: 'male-e', job: '診所醫師', work: '仁心診所', home: 'villa',
    plan: [[8.5, '仁心診所'], [21.2, 'home']],
    say: { morning: '早上的門診，都是量血壓的長輩。', day: '多休息、多喝水，比什麼藥都有效。', evening: '晚診最後一位，再撐一下。', night: '睡前還是會想起今天的病人。' },
  },
  {
    name: '潘雨萱', look: 'female-f', job: '護理師', work: '仁心診所', home: 'townhouse',
    plan: [[8.3, '仁心診所'], [12.5, '老街麵館'], [13.2, '仁心診所'], [21.1, 'home']],
    say: { morning: '小朋友打針不哭，有貼紙！', day: '午餐只有四十分鐘，麵要快點上。', evening: '今天量了一百次體溫吧。', night: '回家第一件事：泡腳。' },
  },
  {
    name: '羅志強', look: 'male-d', job: '加油站員', work: '加油站', home: 'townhouse',
    plan: [[13.5, '加油站'], [22.5, '便利商店'], [22.8, 'home']],
    say: { morning: '還沒上班，在家修腳踏車。', day: '九五加滿，請問要統編嗎？', evening: '晚上來加油的多半是計程車。', night: '下班買一罐熱咖啡再回家。' },
  },

  // Schoolchildren
  {
    name: '陳品傑', look: 'male-a', job: '國小三年級', home: 'townhouse',
    plan: [[7.1, '鎮立小學'], [16, '甜甜手搖飲'], [16.4, '公園'], [17.5, 'home']],
    say: { morning: '我今天要當值日生！', day: '下課鐘一響就衝去溜滑梯。', evening: '媽媽說天黑前要回家……', night: '（在棉被裡偷看漫畫）' },
  },
  {
    name: '林安琪', look: 'female-b', job: '國小五年級', home: 'townhouse',
    plan: [[7.2, '鎮立小學'], [16.2, '拾光文具'], [16.6, 'home']],
    say: { morning: '數學考卷我寫完了，可以交了嗎？', day: '文具店新到的貼紙超可愛。', evening: '寫完作業才能看電視。', night: '明天要穿運動服，別忘了。' },
  },
  {
    name: '張家翔', look: 'male-f', job: '國小六年級', home: 'townhouse',
    plan: [[7, '鎮立小學'], [16, '公園'], [18, 'home']],
    say: { morning: '畢業前一定要贏一次躲避球。', day: '公園的噴水池，夏天最好玩。', evening: '再玩十分鐘就好……', night: '睡不著，在想畢業旅行。' },
  },
  {
    name: '吳米亞', look: 'female-e', job: '國小一年級', home: 'upstairs', work: '麥香麵包',
    plan: [[7.4, '鎮立小學'], [15.8, 'home']],
    say: { morning: '媽媽做的菠蘿麵包，我帶去學校。', day: '我會寫自己的名字了！', evening: '我在店裡幫忙數麵包。', night: '（抱著小熊睡著了）' },
  },

  // Retired
  {
    name: '陳福來', look: 'male-c', job: '退休公務員', home: 'villa',
    plan: [[6, '公園'], [7.5, '阿嬤早餐'], [8.3, 'home'], [15, '公園'], [17, 'home']],
    say: { morning: '公園繞三圈，然後吃蛋餅。', day: '下午跟老鄰居下棋，又輸了。', evening: '夕陽下的噴水池最好看。', night: '老人家早睡早起。' },
  },
  {
    name: '王淑芬', look: 'female-c', job: '退休老師', home: 'townhouse',
    plan: [[8, '小花園花店'], [8.6, '麥香麵包'], [9.2, 'home'], [18.5, '公園'], [19.5, 'home']],
    say: { morning: '家裡的茉莉開了，再買一盆。', day: '在家聽廣播劇，好久沒這麼悠閒。', evening: '晚飯後散步，遇到好多以前的學生。', night: '寫日記，今天也是平安的一天。' },
  },
  {
    name: '黃金水', look: 'male-e', job: '退休漁夫', home: 'townhouse',
    plan: [[9, '郵局'], [9.5, '晨光咖啡'], [11, 'home'], [16, '公園'], [17.3, 'home']],
    say: { morning: '年輕人的咖啡，我只喝黑的。', day: '以前出海，一出去就是半個月。', evening: '公園的鴿子都認得我了。', night: '聽著海浪聲的錄音睡覺。' },
  },
  {
    name: '林玉蘭', look: 'female-a', job: '退休裁縫', home: 'villa',
    plan: [[10, '安心藥局'], [10.5, '仁心診所'], [11.5, 'home'], [19, '公園'], [20, 'home']],
    say: { morning: '醫生說我的血壓很漂亮。', day: '在家幫孫子改制服褲管。', evening: '晚上的公園很涼，帶件外套。', night: '老花眼鏡又不知道放哪了。' },
  },

  // Commuter and freelancer
  {
    name: '趙宇辰', look: 'male-b', job: '在城裡上班的工程師', home: 'townhouse',
    plan: [[7.6, '公車站'], [18.9, '晨光咖啡'], [19.6, 'home']],
    say: { morning: '七點四十的公車，不能錯過。', day: '（人在城裡上班）', evening: '下車先來一杯咖啡，才算到家。', night: '明天還要早起……再看一集就好。' },
  },
  {
    name: '方晴', look: 'female-d', job: '自由插畫家', home: 'townhouse',
    plan: [[10.5, '晨光咖啡'], [13, 'home'], [16.5, '公園'], [18, '拾光文具'], [18.4, 'home'], [23, '便利商店'], [23.3, 'home']],
    say: { morning: '在咖啡店畫路人，希望你不介意。', day: '截稿日前，連吃飯都在畫。', evening: '公園的光線，這個時間最溫柔。', night: '畫到半夜，靈感和泡麵一起來。' },
  },
];

// What passers-by without a name say, by part of the day.
export const PASSERBY_LINES = {
  morning: ['早安！今天天氣不錯。', '趕著上班，借過一下！', '早餐吃什麼好呢？'],
  day: ['這條街好熱鬧。', '我只是路過，看看而已。', '聽說老街麵館很有名？'],
  evening: ['晚霞好漂亮。', '肚子餓了，找家店吃飯。', '散步消化一下。'],
  night: ['這麼晚了，該回家了。', '路燈下的小鎮好安靜。', '便利商店還開著，真好。'],
};
