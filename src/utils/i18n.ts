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
}

const zh: Translations = {
  title: "喝水打卡",
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
};

const allTranslations: Record<Language, Translations> = { zh, en, my };

export function getTranslations(language: Language): Translations {
  return allTranslations[language];
}
