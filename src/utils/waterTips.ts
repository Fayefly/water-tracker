import { Language } from "./i18n";

const tipsChinese: string[] = [
  "你知道吗？人体约60%由水组成，大脑更是高达75%都是水！每一口水都在为你的思维加速、为你的创造力充电。保持充足的水分摄入，你会发现自己的注意力更集中、思路更清晰。坚持喝水，就是在投资最聪明的自己！",
  "早晨起床后的第一杯水被称为「黄金水」，它能唤醒沉睡了一整夜的身体，帮助肠胃开始工作，促进新陈代谢。这杯水就像给身体按下了启动键，让你以最佳状态迎接新的一天。养成晨起喝水的好习惯，每天都元气满满！",
  "科学研究表明，即使是1%-2%的轻微脱水，就会导致注意力下降、疲劳感增加、记忆力减退。反过来说，保持充足饮水能让你的工作效率提升14%以上！所以每次喝水，你都在为自己的高效表现铺路，继续保持这个好习惯吧！",
  "水是天然的美容圣品！充足的饮水能让皮肤细胞保持饱满状态，维持肌肤的弹性和光泽，有效延缓皱纹产生。很多皮肤科医生都建议，想要好皮肤，与其花大价钱买护肤品，不如先把每天的水喝够。你的每一口水，都在滋养着更美的自己！",
  "喝水能有效帮助肾脏排出体内的代谢废物和毒素，降低肾结石和尿路感染的风险。肾脏每天要过滤约180升的液体，充足的水分就是它最好的助手。善待你的肾脏，让它轻松高效地为你工作，你的身体会用健康来回报你的坚持！",
  "你正在做一件对心血管非常有益的事！研究发现，每天饮用足够水分的人，心脏病发作风险可降低41%。水能帮助维持血液的正常黏稠度，促进血液循环，让心脏更轻松地工作。每一杯水，都是对心脏的温柔呵护！",
  "运动前后及时补水至关重要！运动时身体通过出汗散热，流失大量水分和电解质。及时补水不仅能防止脱水导致的头晕和疲劳，还能帮助肌肉恢复、减少运动后的酸痛感。喝够水的运动员，表现总是更出色！保持水分，释放你的运动潜能！",
  "水是消化系统的好帮手！它能促进肠胃蠕动，帮助食物中的营养物质更好地被吸收，同时预防便秘等消化问题。饭前半小时喝一杯水，还能帮助控制食欲，让你吃得更健康。健康的消化从一杯水开始，你的肠胃会感谢你的细心照顾！",
  "充足的水分摄入能显著增强免疫系统的功能！水帮助淋巴系统运转顺畅，加速白细胞的运输，让身体更有效地抵抗病毒和细菌的侵袭。在换季感冒高发期，多喝水就是最简单有效的防护措施。为自己的健康防线加油，继续保持喝水好习惯！",
  "你知道喝水还能改善心情吗？研究发现，脱水会导致大脑中血清素的产生减少，而血清素正是让我们感到快乐的「幸福荷尔蒙」。保持充足的水分摄入，能帮助稳定情绪、减轻焦虑感。每一口水，都在为你的好心情加分！今天也要开心喝水哦！",
  "长时间面对电脑和手机屏幕，眼睛的水分会加速蒸发，导致干涩、疲劳甚至视力模糊。多喝水能从内部为眼睛补充水分，缓解干眼症状，保护你的视力健康。每隔一小时喝一杯水、眨眨眼，让你的双眼始终保持明亮有神！",
  "水是关节的天然润滑剂！关节软骨中80%是水分，充足的饮水能保持关节的灵活性，减少摩擦和磨损，有效预防关节疼痛和僵硬。无论你是久坐办公还是热爱运动，喝够水都能让你的关节保持年轻态，行动更自如！",
  "冬天虽然出汗少，但暖气和空调会让室内空气干燥，身体的隐性失水反而更多。冬季保持充足饮水，不仅能滋润干燥的皮肤和嘴唇，还能帮助呼吸道黏膜保持湿润，增强对寒冷病毒的抵抗力。冬日里的每一杯温水，都是给身体最温暖的关怀！",
  "喝水能有效缓解头痛！研究表明，很多头痛其实是脱水引起的，补充足够的水分后症状就会明显改善。经常头痛的人，在吃药之前不妨先尝试喝两杯水。用最天然、最健康的方式照顾自己，你的身体值得被温柔以待！",
  "水在体内扮演着「运输工」的角色，它负责将营养物质输送到每一个细胞，同时把代谢废物带走排出体外。没有充足的水分，再好的营养也无法被身体充分利用。所以，喝水不只是解渴，更是在帮助身体高效运转的每一个环节！",
  "充足饮水对维持电解质平衡至关重要！电解质影响着肌肉收缩、神经传导等重要生理功能。缺水时容易出现肌肉痉挛、抽筋等问题。坚持规律饮水，让身体的每一块肌肉都保持在最佳状态，无论工作还是运动，你都能表现得更加出色！",
  "睡前适量饮水是一个聪明的健康习惯！夜间血液流速减慢，适量补水可以降低血液黏稠度，减少心脑血管意外的风险。当然不需要喝太多，一小杯温水就够了。用这个小小的习惯，为自己的夜间健康保驾护航，安心入睡，醒来又是元气满满的一天！",
  "你知道吗？人体每天通过呼吸、排汗、排尿等途径会流失约2.5升水分，这些水分需要及时补充。不要等到口渴了才喝水，因为当你感到口渴时，身体已经处于轻度脱水状态了。定时定量喝水，让身体始终保持在最佳水合状态！",
  "喝水能帮助提高新陈代谢率！研究显示，喝500ml水后，代谢率会在10分钟内开始上升，30-40分钟达到峰值，提升幅度约24%-30%。如果你想保持健康的体重，充足饮水就是最简单有效的方法之一。每一杯水都在帮你燃烧更多热量！",
  "温水比冰水更容易被身体吸收，对胃肠道也更加温和友好。中医认为温水能暖胃健脾、促进气血循环。尤其在早晨和饭后，一杯温热的水能让消化系统更舒适地工作。选择适合的水温，是对身体细腻的关爱，你的身体一定能感受到这份用心！",
  "坚持喝水是一种自律的体现！每天按时按量地为身体补充水分，看似简单，却需要持之以恒的毅力。而正是这些看似微小的健康习惯，日积月累之后会带来巨大的改变。你今天的每一次打卡、每一口水，都是在为未来更健康的自己积攒力量，加油！",
  "水能帮助大脑更高效地工作！当你感到思维迟钝、难以集中注意力时，可能只是因为缺水。补充一杯水后，大脑的反应速度和认知能力都会得到明显提升。把喝水变成你的「效率加速器」，让每一个工作时段都充满活力和创造力！",
  "充足的水分摄入对呼吸系统健康也至关重要！水能保持呼吸道黏膜的湿润，增强其屏障功能，帮助过滤和阻挡空气中的灰尘和病菌。尤其在干燥的秋冬季节和空气质量不好的日子里，多喝水就是给呼吸道穿上了一件天然的防护衣！",
  "喝水还能帮助缓解压力和疲劳感！当身体缺水时，肾上腺会分泌更多的压力激素皮质醇，让你感到紧张和疲惫。及时补水能帮助调节激素水平，让身心恢复平静。在忙碌的工作间隙，给自己倒一杯水，既是休息也是充电，你值得这样善待自己！",
  "你的每一次喝水打卡，都是对健康生活方式的坚定承诺！数据显示，养成良好饮水习惯的人，整体健康状况比不注意饮水的人好出许多。今天你已经迈出了重要的一步，继续坚持下去，21天养成习惯，90天固化为生活方式。未来的你，一定会感谢现在努力的自己！",
];

const tipsEnglish: string[] = [
  "Your body loses water every single hour through breathing, sweating, and basic cell functions — even while you sleep. The Mayo Clinic recommends that adults consume about 2.7 to 3.7 liters of total water daily. By drinking consistently throughout the day, you are giving your body exactly what it needs to thrive. Keep up the great work!",
  "According to Harvard Health, drinking water first thing in the morning helps kickstart your metabolism and rehydrate your body after hours of sleep. It primes your digestive system, flushes overnight toxins, and sets a positive tone for the rest of your day. Make that morning glass a non-negotiable ritual — your body will thank you!",
  "The European Journal of Nutrition published findings showing that even 1-2% dehydration can impair cognitive performance, reduce short-term memory, and increase feelings of anxiety. Staying on top of your water intake keeps your brain sharp, your mood stable, and your energy levels high. You are literally fueling your success with every sip!",
  "A landmark study from the American Journal of Epidemiology found that people who drink five or more glasses of water daily have a 41% lower risk of fatal coronary heart disease compared to those who drink two or fewer. Every glass you drink supports your cardiovascular system and keeps your blood flowing smoothly. Your heart loves you for this!",
  "The British Journal of Nutrition reports that proper hydration can boost your metabolic rate by up to 30% within 10-40 minutes of drinking water. This thermogenic effect means your body burns more calories simply by staying hydrated. It is one of the easiest and most natural ways to support a healthy metabolism — drink up and feel the difference!",
  "Johns Hopkins Medicine highlights that water is essential for kidney function, helping filter waste from your blood and producing urine to flush toxins from your body. Staying well-hydrated reduces your risk of kidney stones by diluting the minerals that form crystals. Treat your kidneys well — they work tirelessly for you every single day!",
  "According to the Arthritis Foundation, synovial fluid that cushions your joints is primarily made of water. Staying hydrated helps maintain cartilage elasticity and reduces friction between bones. Whether you are at a desk all day or hitting the gym, proper hydration keeps your joints moving smoothly and comfortably. Keep them happy with every glass!",
  "Research published in Frontiers in Human Neuroscience shows that hydration status directly affects mood and emotional well-being. Mild dehydration is associated with increased tension, fatigue, and confusion. By maintaining steady water intake throughout the day, you are supporting not just your physical health but your mental clarity and emotional balance too!",
  "The Cleveland Clinic notes that water plays a critical role in digestion by helping break down food, absorbing nutrients, and softening stool to prevent constipation. Drinking a glass of water about 30 minutes before meals can also help you feel fuller and make healthier portion choices. Great digestion starts with great hydration habits!",
  "A study in the journal Nutrients found that athletes who maintained optimal hydration levels performed 25% better in endurance tests compared to those who were even mildly dehydrated. Water regulates body temperature, delivers oxygen to muscles, and removes metabolic waste during exercise. Stay hydrated and unlock your full physical potential!",
  "The World Health Organization emphasizes that adequate water intake supports your immune system by helping lymph — the fluid that carries infection-fighting white blood cells — circulate efficiently throughout your body. Especially during cold and flu season, consistent hydration is one of your simplest and most powerful defenses. Keep your shield strong!",
  "According to dermatologists at the American Academy of Dermatology, well-hydrated skin appears plumper, more elastic, and less prone to dryness and flaking. While water alone is not a miracle wrinkle cure, maintaining internal hydration supports your skin barrier function and helps topical products work more effectively. Glow from the inside out!",
  "Headache specialists at the National Headache Foundation confirm that dehydration is one of the most common and overlooked headache triggers. Before reaching for pain medication, try drinking two full glasses of water — many tension headaches resolve within 30 minutes of rehydrating. It is a simple, natural, and incredibly effective remedy!",
  "The Sleep Foundation reports that going to bed even mildly dehydrated can disrupt your sleep cycle, cause nighttime leg cramps, and lead to a dry mouth that wakes you up. A small glass of water before bed — not too much — helps maintain comfortable hydration levels through the night, supporting deeper and more restorative sleep.",
  "Neuroscientists at the University of East London discovered that drinking water when thirsty can improve cognitive performance by up to 14%. Your brain cells require a delicate balance of water and other elements to function optimally. When you hydrate, you are literally giving your neurons the fuel they need to fire faster and think clearer!",
  "The American Council on Exercise recommends drinking water before, during, and after physical activity to prevent performance decline. Dehydration of just 2% of body weight can cause a noticeable decrease in physical and mental performance. By staying ahead of thirst, you maintain peak energy and endurance throughout your day!",
  "Research from the University of Connecticut found that mild dehydration can alter mood, increase perception of task difficulty, and cause fatigue — regardless of whether you are exercising or sitting at rest. The solution is beautifully simple: sip water regularly throughout the day. Small, consistent habits create extraordinary long-term health benefits!",
  "According to the National Institutes of Health, water helps regulate body temperature through perspiration and respiration. On hot days or during intense activity, your body relies heavily on water to cool itself down. Proper hydration prevents heat exhaustion and heat stroke. Take care of your internal cooling system — it is working hard for you!",
  "The Journal of Clinical Endocrinology and Metabolism published research showing that 500ml of water increases metabolic rate by approximately 30% in both men and women, with the effect beginning within 10 minutes and reaching a maximum after 30-40 minutes. Simply put, drinking water helps your body burn energy more efficiently all day long!",
  "Harvard Medical School reminds us that thirst is actually a late indicator of dehydration — by the time you feel thirsty, your body has already lost 1-2% of its water content. Proactive hydration, drinking on a schedule rather than waiting for thirst, ensures your body stays in its optimal zone for health, energy, and mental performance.",
  "A comprehensive review in the European Journal of Clinical Nutrition found that consistent water intake is associated with lower rates of urinary tract infections, hypertension, and even certain types of cancer. The cumulative protective effects of proper hydration are remarkable. Every glass you drink today is an investment in your long-term health!",
  "The National Sleep Foundation notes that proper daytime hydration contributes to better sleep quality at night. When your body is well-hydrated during waking hours, it can better regulate temperature and hormones that control your sleep-wake cycle. Good hydration during the day sets you up for truly restful nights. Sweet dreams start with water!",
  "According to sports medicine researchers, water serves as a natural lubricant for your muscles and helps transport electrolytes that are critical for muscle contraction. Dehydrated muscles are more prone to cramps, strains, and delayed recovery. Keep those muscles happy and functioning at their best — they deserve proper hydration just like the rest of you!",
  "The International Journal of Environmental Research and Public Health reports that students who bring water bottles to exams perform significantly better than those who do not. Hydration supports working memory, attention span, and processing speed. Whether you are studying, working, or creating, water is your brain's favorite performance enhancer!",
  "You are building an incredible healthy habit right now! Research shows it takes about 21 days to form a new habit and 66 days for it to become automatic. Every time you check in and drink water, you are strengthening neural pathways that will serve you for a lifetime. Celebrate this moment — you are investing in the healthiest version of yourself!",
];

const tipsMap: Record<Language, string[]> = {
  zh: tipsChinese,
  en: tipsEnglish,
  my: tipsEnglish,
};

export function getRandomTip(language: Language = "zh"): string {
  const tips = tipsMap[language];
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
}

export default tipsChinese;
