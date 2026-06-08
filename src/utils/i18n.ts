export type Language = "zh" | "en" | "my";

export interface Translations {
  title: string;
  subtitle: string;
  clearToday: string;
  myDrinking: string;
  achieved: string;
  needMore: string;
  selectAmount: string;
  last7Days: string;
  footer: string;
  clearAll: string;
  smallCup: string;
  mediumCup: string;
  custom: string;
  customTitle: string;
  enterNumber: string;
  multiplier: string;
  cancel: string;
  confirm: string;
  healthTip: string;
  yesterday: string;
  yesterdayMakeup: string;
  largeCup: string;
  today: string;
  weekDays: string[];
  friends: string;
  addFriend: string;
  searchPlaceholder: string;
  search: string;
  add: string;
  remove: string;
  noFriends: string;
  friendId: string;
  todayDrank: string;
  friendRecords: string;
  coldJoke: string;
  jokeLike: string;
  jokeDislike: string;
  feedbackSent: string;
  feedbackSentSwitch: string;
  jokeLoading: string;
}

const zh: Translations = {
  title: "喝水大师",
  subtitle: "养成健康饮水习惯",
  clearToday: "清空今日",
  myDrinking: "我今日饮水",
  achieved: "已达标",
  needMore: "还需",
  selectAmount: "选择饮水量，点击打卡",
  last7Days: "近7天记录",
  footer: "每天8杯水，健康好伙伴",
  clearAll: "清空数据",
  smallCup: "小杯",
  mediumCup: "中杯",
  custom: "自定义",
  customTitle: "自定义饮水量",
  enterNumber: "请输入数字",
  multiplier: "x 100ml",
  cancel: "取消",
  confirm: "确认打卡",
  healthTip: "健康科普",
  yesterday: "昨天",
  yesterdayMakeup: "补打昨天",
  largeCup: "大杯",
  today: "今天",
  weekDays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  friends: "好友",
  addFriend: "添加好友",
  searchPlaceholder: "输入好友ID或用户名",
  search: "搜索",
  add: "添加",
  remove: "删除",
  noFriends: "还没有好友，添加一个吧",
  friendId: "我的ID",
  todayDrank: "今日喝了",
  friendRecords: "好友动态",
  coldJoke: "双关梗",
  jokeLike: "哈哈哈哈",
  jokeDislike: "啥玩意",
  feedbackSent: "已提交反馈",
  feedbackSentSwitch: "已提交反馈，换一个...",
  jokeLoading: "换一个...",
};

const en: Translations = {
  title: "Water Tracker",
  subtitle: "Build healthy drinking habits",
  clearToday: "Clear Today",
  myDrinking: "Today's Intake",
  achieved: "Goal Reached",
  needMore: "Need",
  selectAmount: "Select amount to check in",
  last7Days: "Last 7 Days",
  footer: "8 glasses a day keeps you healthy!",
  clearAll: "Clear All",
  smallCup: "Small",
  mediumCup: "Medium",
  custom: "Custom",
  customTitle: "Custom Amount",
  enterNumber: "Enter number",
  multiplier: "x 100ml",
  cancel: "Cancel",
  confirm: "Confirm",
  healthTip: "Health Tip",
  yesterday: "Yesterday",
  yesterdayMakeup: "Add Yesterday",
  largeCup: "Large",
  today: "Today",
  weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  friends: "Friends",
  addFriend: "Add Friend",
  searchPlaceholder: "Enter friend's ID or name",
  search: "Search",
  add: "Add",
  remove: "Remove",
  noFriends: "No friends yet, add one!",
  friendId: "My ID",
  todayDrank: "drank today",
  friendRecords: "Friend Activity",
  coldJoke: "Pun",
  jokeLike: "LOL",
  jokeDislike: "Meh",
  feedbackSent: "Feedback sent",
  feedbackSentSwitch: "Feedback sent, loading...",
  jokeLoading: "Loading...",
};

const my: Translations = {
  title: "ရေသောက်မှတ်တမ်း",
  subtitle: "ကျန်းမာသော ရေသောက်အလေ့အထ",
  clearToday: "ယနေ့ ရည်မှန်းချက်",
  myDrinking: "ယနေ့သောက်ပမာဏ",
  achieved: "ပြည့်မီပြီ",
  needMore: "လိုအပ်သေးသည်",
  selectAmount: "ပမာဏ ရွေးချယ်ပြီး မှတ်တမ်းတင်ပါ",
  last7Days: "လွန်ခဲ့သော ၇ ရက်",
  footer: "တစ်နေ့ ရေ ၈ ခွက် ကျန်းမာရေးအတွက်",
  clearAll: "အားလုံးရှင်းရန်",
  smallCup: "အသေး",
  mediumCup: "အလတ်",
  custom: "စိတ်ကြိုက်",
  customTitle: "စိတ်ကြိုက်ပမာဏ",
  enterNumber: "ဂဏန်းထည့်ပါ",
  multiplier: "x 100ml",
  cancel: "ပယ်ဖျက်ရန်",
  confirm: "အတည်ပြု",
  healthTip: "ကျန်းမာရေးအကြံ",
  yesterday: "မနေ့",
  yesterdayMakeup: "မနေ့ မှတ်တမ်း ဖြည့်ရန်",
  largeCup: "အကြီး",
  today: "ယနေ့",
  weekDays: ["တနင်္ဂနွေ", "တနင်္လာ", "အင်္ဂါ", "ဗုဒ္ဓဟူး", "ကြာသပတေး", "သောကြာ", "စနေ"],
  friends: "သူငယ်ချင်း",
  addFriend: "သူငယ်ချင်းထည့်ရန်",
  searchPlaceholder: "ID သို့မဟုတ် အမည်ထည့်ပါ",
  search: "ရှာရန်",
  add: "ထည့်ရန်",
  remove: "ဖယ်ရှားရန်",
  noFriends: "သူငယ်ချင်းမရှိသေးပါ",
  friendId: "ကျွန်ုပ်၏ ID",
  todayDrank: "ယနေ့သောက်ပမာဏ",
  friendRecords: "သူငယ်ချင်းလှုပ်ရှားမှု",
  coldJoke: "ဟာသ",
  jokeLike: "ရယ်စရာကောင်း",
  jokeDislike: "ဘာလဲ",
  feedbackSent: "တုံ့ပြန်ချက်ပို့ပြီး",
  feedbackSentSwitch: "တုံ့ပြန်ချက်ပို့ပြီး...",
  jokeLoading: "ပြောင်းနေသည်...",
};

const allTranslations: Record<Language, Translations> = { zh, en, my };

export function getTranslations(language: Language): Translations {
  return allTranslations[language];
}
