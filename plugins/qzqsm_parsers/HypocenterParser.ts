import { datetimeToString, getValueNumber } from "../string_converter";

export default function HypocenterParser(sentence: string): string {
  const t = {
    At: {
      Mo: getValueNumber(sentence, 21, 4),
      D: getValueNumber(sentence, 25, 5),
      H: getValueNumber(sentence, 30, 5),
      Mi: getValueNumber(sentence, 35, 6)
    },
    Co: [
      getValueNumber(sentence, 53, 9),
      getValueNumber(sentence, 62, 9),
      getValueNumber(sentence, 71, 9),
    ],
    Ot: {
      D: getValueNumber(sentence, 80, 5),
      H: getValueNumber(sentence, 85, 5),
      Mi: getValueNumber(sentence, 90, 6)
    },
    De: getValueNumber(sentence, 96, 9),
    Ma: getValueNumber(sentence, 105, 7),
    Ep: getValueNumber(sentence, 112, 10),
    Lat: {
      Ns: getValueNumber(sentence, 122, 1),
      D: getValueNumber(sentence, 123, 7),
      M: getValueNumber(sentence, 130, 6),
      S: getValueNumber(sentence, 136, 6)
    },
    Lng: {
      Ew: getValueNumber(sentence, 142, 1),
      D: getValueNumber(sentence, 143, 8),
      M: getValueNumber(sentence, 151, 6),
      S: getValueNumber(sentence, 157, 6)
    }
  };

  const publishedAt = new Date(`${new Date().getFullYear()}/${t.At.Mo}/${t.At.D} ${t.At.H}:${t.At.Mi}:00`);
  publishedAt.setHours(publishedAt.getHours() + 9);
  const originTime = new Date(`${new Date().getFullYear()}/${t.At.Mo}/${t.Ot.D} ${t.Ot.H}:${t.Ot.Mi}:00`);
  originTime.setHours(originTime.getHours() + 9);

  const coRaw = t.Co.filter(c => c !== 0).map(c => Co(c)).join("\n");
  const co: string = coRaw === "" ? Co(0) : coRaw;
  const ep = Ep(t.Ep);
  const lng = `${(t.Lng.Ew == 0 ? "+" : "-")}${t.Lng.D + t.Lng.M / 60}`;
  const lat = `${(t.Lat.Ns == 0 ? "+" : "-")}${t.Lat.D + t.Lat.M / 60}`;
  const de = De(t.De);
  const ma = Ma(t.Ma);

  var text = `${datetimeToString(originTime, "{dd}日{HH}時{mm}分")}ころ、地震がありました。
${co}
発表時刻：${datetimeToString(publishedAt, "{MM}月{dd}日{HH}時{mm}分")}
震央地名：${ep}
緯度・経度：${lat} ${lng}
深さ(km)：${de}
マグニチュード：${ma}`;

  return text.trim();
}

function Co(code: number): string {
  switch (code) {
    case 0: return "固定付加文なし";
    case 101: return "今後若干の海面変動があるかもしれません。";
    case 102: return "今後若干の海面変動があるかもしれませんが、被害の心配はありません。";
    case 103: return "今後もしばらく海面変動が続くと思われます。";
    case 104: return "今後もしばらく海面変動が続くと思われますので、海水浴や磯釣り等を行う際は注意してください。";
    case 105: return "今後もしばらく海面変動が続くと思われますので、磯釣り等を行う際は注意してください。";
    case 107: return "現在、大津波警報・津波警報・津波注意報を発表している沿岸はありません。 ";
    case 109: return "津波と満潮が重なると、津波はより高くなりますので 一層厳重な警戒が必要です。";
    case 110: return "津波と満潮が重なると、津波はより高くなりますので十分な注意が必要です。";
    case 111: return "場所によっては、観測した津波の高さよりさらに大きな津波が到達しているおそれがあります。";
    case 112: return "今後、津波の高さは更に高くなることも考えられます。";
    case 113: return "沖合での観測値をもとに津波が推定されている沿岸では、早いところでは、既に津波が到達していると推定されます。";
    case 114: return "津波による潮位変化が観測されてから最大波が観測されるまでに数時間以上かかることがあります。";
    case 115: return "沖合での観測値であり、沿岸では津波はさらに高くなます。";
    case 121: return "＜大津波警報＞\n大きな津波が襲い甚大な被害が発生します。\n沿岸部や川沿いにる人はただちに高台や避難ビルなど安全な場所へ避難してください。\n津波は繰り返し襲ってきます。警報が解除されるまで安全な場所から離れないでください。";
    case 122: return "＜津波警報＞\n津波による被害が発生します。\n沿岸部や川沿いにる人はただちに高台や避難ビルなど安全な場所へ避難してください。\n津波は繰り返し襲ってきます。警報が解除されるまで安全な場所から離れないでください。";
    case 123: return "＜津波注意報＞\n海の中や海岸付近は危険です。\n海の中にいる人はただちに海から上がって、海岸から離れてください。\n潮の流れが速い状態が続きますで、注意報が解除さるるまで海に入ったり海岸に近づいたりしないようにしてください。";
    case 124: return "＜津波予報(若干の海面変動)＞\n若干の海面変動が予想されますが、被害の心配はありせん。";
    case 131: return "警報が発表された沿岸部や川沿いにいる人はただちに高台や避難ビルなど安全な場所へ避難してください。\n到達予想時刻は、予報区のなかで最も早く津波が到達する時刻です。場所によっては、この時刻よりもかなり遅れて津波が襲ってくることがあります。\n到達予想時刻から津波が最も高くなるまでに数時間以上かかることがありますので、観測された津波の高さにかかわらず、警報が解除されるまで安全な場所から離れないでください。";
    case 132: return "場所によっては津波の高さが「予想される津波の高さ」より高くなる可能性があります。";
    case 141: return "東日本大震災クラスの津波が来襲します。";
    case 142: return "沖合で高い津波を観測したため大津波警報・津波警報に切り替えました。";
    case 143: return "沖合で高い津波を観測したため大津波警報・津波警報を切り替えました。";
    case 144: return "沖合で高い津波を観測したため大津波警報に切り替えました。";
    case 145: return "沖合で高い津波を観測したため大津波警報を切り替えました。";
    case 146: return "沖合で高い津波を観測したため津波警報に切り替えました。";
    case 147: return "沖合で高い津波を観測したため津波警報を切り替えました。";
    case 148: return "沖合で高い津波を観測したため予想される津波の高さを切り替えました。";
    case 149: return "ただちに避難してくさい。";
    case 201: return "強い揺れに警戒してください。";
    case 211: return "津波警報等(大津波警報・津波警報あるいは津波注意報)を発表中です。";
    case 212: return "この地震により、日本の沿岸では若干の海面変動があるかもしれませんが、被害の心配はありません。";
    case 213: return "今後もしばらく海面変動が続と思われますので、海水浴や磯釣り等を行う際は注意してください。";
    case 214: return "今後もしばらく海面変動が続くと思われますので、磯釣り等を行う際は注意してください";
    case 215: return "この地震による津波の心配はありません。";
    case 216: return "震源が海底の場合、津波が発生するおそれがあります。";
    case 217: return "今後の情報に注意してください。";
    case 221: return "太平洋の広域に津波発生の可能性があります。";
    case 222: return "太平洋で津波発生の可能性があります。";
    case 223: return "北西太平洋で津波発生の可能性があります。";
    case 224: return "インド洋の広域に津波発生の可能性があります。";
    case 225: return "インド洋で津波発生の可能性があります。";
    case 226: return "震源の近傍で津波発生の可能性があります。";
    case 227: return "震源の近傍で小さな津波発生の可能性がありますが、被害をもたらす津波の心配はありません。";
    case 228: return "一般的に、この規模の地震が海域の浅い領域で発生すると 津波が発生することがあります。";
    case 229: return "日本への津波の有無については現在調査中です。";
    case 230: return "この地震による日本への津波の影響はありません。";
    case 241: return "この地震について、緊急地震速報を発表しています。";
    case 242: return "この地震について、緊急地震速報を発表しています。この地震の最大震度は2でした。";
    case 243: return "この地震について、緊急地震速報を発表しています。この地震の最大震度は1でした。";
    case 244: return "この地震について、緊急地震速報を発表しています。この地震で震度1以上は観測されていません。";
    case 245: return "この地震で緊急地震速報を発表しましたが、強い揺れは観測されませんでした。";
    case 256: return "震源要素を訂正します。";
    case 500: return "その他の防災上の留意事項";
    default: return `不明(${code})`;
  }
}

function Ep(code: number): string {
  switch (code) {
    case 11: return "北海道地方";
    case 12: return "東北地方";
    case 13: return "北陸地方";
    case 14: return "関東甲信地方";
    case 15: return "小笠原地方";
    case 16: return "東海地方";
    case 17: return "近畿地方";
    case 18: return "中国地方";
    case 19: return "四国地方";
    case 20: return "九州地方";
    case 21: return "沖縄地方";
    case 100: return "石狩地方北部";
    case 101: return "石狩地方中部";
    case 102: return "石狩地方南部";
    case 105: return "渡島地方北部";
    case 106: return "渡島地方東部";
    case 107: return "渡島地方西部";
    case 110: return "檜山地方";
    case 115: return "後志地方北部";
    case 116: return "後志地方東部";
    case 117: return "後志地方西部";
    case 120: return "空知地方北部";
    case 121: return "空知地方中部";
    case 122: return "空知地方南部";
    case 125: return "上川地方北部";
    case 126: return "上川地方中部";
    case 127: return "上川地方南部";
    case 130: return "留萌地方中北部";
    case 131: return "留萌地方南部";
    case 135: return "宗谷地方北部";
    case 136: return "宗谷地方南部";
    case 140: return "網走地方";
    case 141: return "北見地方";
    case 142: return "紋別地方";
    case 145: return "胆振地方西部";
    case 146: return "胆振地方中東部";
    case 150: return "日高地方西部";
    case 151: return "日高地方中部";
    case 152: return "日高地方東部";
    case 155: return "十勝地方北部";
    case 156: return "十勝地方中部";
    case 157: return "十勝地方南部";
    case 160: return "釧路地方北部";
    case 161: return "釧路地方中南部";
    case 165: return "根室地方北部";
    case 166: return "根室地方中部";
    case 167: return "根室地方南部";
    case 180: return "北海道南西沖";
    case 181: return "北海道西方沖";
    case 182: return "石狩湾";
    case 183: return "北海道西沖";
    case 184: return "宗谷海峡";
    case 186: return "国後島付近";
    case 187: return "択捉島付近";
    case 188: return "北海道東方沖";
    case 189: return "根室半島南東沖";
    case 190: return "釧路沖";
    case 191: return "十勝沖";
    case 192: return "浦河沖";
    case 193: return "苫小牧沖";
    case 194: return "内浦湾";
    case 195: return "宗谷東方沖";
    case 196: return "網走沖";
    case 197: return "択捉島南東沖";
    case 200: return "青森県津軽北部";
    case 201: return "青森県津軽南部";
    case 202: return "青森県三八上北地方";
    case 203: return "青森県下北地方";
    case 210: return "岩手県沿岸北部";
    case 211: return "岩手県沿岸南部";
    case 212: return "岩手県内陸北部";
    case 213: return "岩手県内陸南部";
    case 220: return "宮城県北部";
    case 221: return "宮城県南部";
    case 222: return "宮城県中部";
    case 230: return "秋田県沿岸北部";
    case 231: return "秋田県沿岸南部";
    case 232: return "秋田県内陸北部";
    case 233: return "秋田県内陸南部";
    case 240: return "山形県庄内地方";
    case 241: return "山形県最上地方";
    case 242: return "山形県村地方";
    case 243: return "山形県置賜地方";
    case 250: return "福島県中通り";
    case 251: return "福島県浜通り";
    case 252: return "福島県会津";
    case 280: return "津軽海峡";
    case 281: return "山形県沖";
    case 282: return "秋田県沖";
    case 283: return "青森県西方沖";
    case 284: return "陸奥湾";
    case 285: return "青森県東方沖";
    case 286: return "岩手県沖";
    case 287: return "宮城県沖";
    case 288: return "三陸沖";
    case 289: return "福島県沖";
    case 300: return "茨城県北部";
    case 301: return "茨城県南部";
    case 309: return "千葉県南東沖";
    case 310: return "栃木県北部";
    case 311: return "栃木県南部";
    case 320: return "群馬県北部";
    case 321: return "群馬県南部";
    case 330: return "埼玉県北部";
    case 331: return "埼玉県南部";
    case 332: return "埼玉県秩父地方";
    case 340: return "千葉県北東部";
    case 341: return "千葉県北西部";
    case 342: return "千葉県南部";
    case 349: return "房総半島南方沖";
    case 350: return "東京都２３区";
    case 351: return "東京都多摩東部";
    case 352: return "東京都多摩西部";
    case 360: return "神奈川県東部";
    case 361: return "神奈川県西部";
    case 370: return "新潟県上越地方";
    case 371: return "新潟県中越地方";
    case 372: return "新潟県下越地方";
    case 378: return "新潟県下越沖";
    case 379: return "新潟県上中越沖";
    case 380: return "富山県東部";
    case 381: return "富山県西部";
    case 390: return "石川県能登地方";
    case 391: return "石川県加賀地方";
    case 400: return "福井県嶺北";
    case 401: return "福井県嶺南";
    case 411: return "山梨県中・西部";
    case 412: return "山梨県東部・富士五湖";
    case 420: return "長野県北部";
    case 421: return "長野県中部";
    case 422: return "長野県南部";
    case 430: return "岐阜県飛騨地方";
    case 431: return "岐阜県美濃東部";
    case 432: return "岐阜県美濃中西部";
    case 440: return "静岡県伊豆地方";
    case 441: return "静岡県東部";
    case 442: return "静岡県中部";
    case 443: return "静岡県西部";
    case 450: return "愛知県東部";
    case 451: return "愛知県西部";
    case 460: return "三重県北部";
    case 461: return "三重県中部";
    case 462: return "三重県南部";
    case 469: return "三重県南東沖";
    case 471: return "茨城県沖";
    case 472: return "関東東方沖";
    case 473: return "千葉県東方沖";
    case 475: return "八丈島東方沖";
    case 476: return "八丈島近海";
    case 477: return "東京湾";
    case 478: return "相模湾";
    case 480: return "伊豆大島近海";
    case 481: return "伊豆半島東方沖";
    case 482: return "三宅島近海";
    case 483: return "新島・神津島近海";
    case 485: return "駿河湾";
    case 486: return "駿河湾南方沖";
    case 487: return "遠州灘";
    case 489: return "三河湾";
    case 490: return "伊勢湾";
    case 492: return "若狭湾";
    case 493: return "福井県沖";
    case 494: return "石川県西方沖";
    case 495: return "能登半島沖";
    case 497: return "富山湾";
    case 498: return "佐渡付近";
    case 499: return "東海道南方沖";
    case 500: return "滋賀県北部";
    case 501: return "滋賀県南部";
    case 510: return "京都府北部";
    case 511: return "京都府南部";
    case 520: return "大阪府北部";
    case 521: return "大阪府南部";
    case 530: return "兵庫県北部";
    case 531: return "兵庫県南東部";
    case 532: return "兵庫県南西部";
    case 540: return "奈良県";
    case 550: return "和歌山県北部";
    case 551: return "和歌山県南部";
    case 560: return "鳥取県東部";
    case 562: return "鳥取県中部";
    case 563: return "鳥取県西部";
    case 570: return "島根県東部";
    case 571: return "島根県西部";
    case 580: return "岡山県北部";
    case 581: return "岡山県南部";
    case 590: return "広島県北部";
    case 591: return "広島県南東部";
    case 592: return "広島県南西部";
    case 600: return "徳島県北部";
    case 601: return "徳島県南部";
    case 610: return "香川県東部";
    case 611: return "香川県西部";
    case 620: return "愛媛県東予";
    case 621: return "愛媛県中予";
    case 622: return "愛媛県南予";
    case 630: return "高知県東部";
    case 631: return "高知県中部";
    case 632: return "高知県西部";
    case 673: return "土佐湾";
    case 674: return "紀伊水道";
    case 675: return "大阪湾";
    case 676: return "播磨灘";
    case 677: return "瀬戸内海中部";
    case 678: return "安芸灘";
    case 679: return "周防灘";
    case 680: return "伊予灘";
    case 681: return "豊後水道";
    case 682: return "山口県北西沖";
    case 683: return "島根県沖";
    case 684: return "鳥取県沖";
    case 685: return "隠岐島近海";
    case 686: return "兵庫県北方沖";
    case 687: return "京都府沖";
    case 688: return "淡路島付近";
    case 689: return "和歌山県南方沖";
    case 700: return "山口県北部";
    case 702: return "山口県西部";
    case 703: return "山口県東部";
    case 704: return "山口県中部";
    case 710: return "福岡県福岡地方";
    case 711: return "福岡県北九州地方";
    case 712: return "福岡県筑豊地方";
    case 713: return "福岡県筑後地方";
    case 720: return "佐賀県北部";
    case 721: return "佐賀県南部";
    case 730: return "長崎県北部";
    case 731: return "長崎県南西部";
    case 732: return "長崎県島原半島";
    case 740: return "熊本県阿蘇地方";
    case 741: return "熊本県熊本地方";
    case 742: return "熊本県球磨地方";
    case 743: return "熊本県天草・芦北地方";
    case 750: return "大分県北部";
    case 751: return "大分県中部";
    case 752: return "大分県南部";
    case 753: return "大分県西部";
    case 760: return "宮崎県北部平野部";
    case 761: return "宮崎県北部山沿い";
    case 762: return "宮崎県南部平野部";
    case 763: return "宮崎県南部山沿い";
    case 770: return "鹿児島県薩摩地方";
    case 771: return "鹿児島県大隅地方";
    case 783: return "五島列島近海";
    case 784: return "天草灘";
    case 785: return "有明海";
    case 786: return "橘湾";
    case 787: return "鹿児島湾";
    case 790: return "種子島近海";
    case 791: return "日向灘";
    case 793: return "奄美大島近海";
    case 795: return "壱岐・対馬近海";
    case 796: return "福岡県北西沖";
    case 797: return "薩摩半島西方沖";
    case 798: return "トカラ列島近海";
    case 799: return "奄美大島北西沖";
    case 820: return "大隅半島東方沖";
    case 821: return "九州地方南東沖";
    case 822: return "種子島南東沖";
    case 823: return "奄美大島北東沖";
    case 850: return "沖縄本島近海";
    case 851: return "南大東島近海";
    case 852: return "沖縄本島南方沖";
    case 853: return "宮古島近海";
    case 854: return "石垣島近海";
    case 855: return "石垣島南方沖";
    case 856: return "西表島付近";
    case 857: return "与那国島近海";
    case 858: return "沖縄本島北西沖";
    case 859: return "宮古島北西沖";
    case 860: return "石垣島北西沖";
    case 900: return "台湾付近";
    case 901: return "東シナ海";
    case 902: return "四国沖";
    case 903: return "鳥島近海";
    case 904: return "鳥島東方沖";
    case 905: return "オホーツク海南部";
    case 906: return "サハリン西方沖";
    case 907: return "日本海北部";
    case 908: return "日本海中部";
    case 909: return "日本海西部";
    case 911: return "父島近海";
    case 912: return "千島列島";
    case 913: return "千島列島南東沖";
    case 914: return "北海道南東沖";
    case 915: return "東北地方東方沖";
    case 916: return "小笠原諸島西方沖";
    case 917: return "硫黄島近海";
    case 918: return "小笠原諸島東方沖";
    case 919: return "南海道南方沖";
    case 920: return "薩南諸島東方沖";
    case 921: return "本州南方沖";
    case 922: return "サハリン南部付近";
    case 930: return "北西太平洋";
    case 932: return "マリアナ諸島";
    case 933: return "黄海";
    case 934: return "朝鮮半島南部";
    case 935: return "朝鮮半島北部";
    case 936: return "中国東北部";
    case 937: return "ウラジオストク付近";
    case 938: return "シベリア南部";
    case 939: return "サハリン近海";
    case 940: return "アリューシャン列島";
    case 941: return "カムチャツカ半島付近";
    case 942: return "北米西部";
    case 943: return "北米中部";
    case 944: return "北米東部";
    case 945: return "中米";
    case 946: return "南米西部";
    case 947: return "南米中部";
    case 948: return "南米東部";
    case 949: return "北東太平洋";
    case 950: return "南太平洋";
    case 951: return "インドシナ半島付近";
    case 952: return "フィリピン付近";
    case 953: return "インドネシア付近";
    case 954: return "グアム付近";
    case 955: return "ニューギア付近";
    case 956: return "ニュージランド付近";
    case 957: return "オーストラリア付近";
    case 958: return "シベリア付近";
    case 959: return "ロシア西部";
    case 960: return "ロシア中部";
    case 961: return "ロシア東部";
    case 962: return "中央アジア";
    case 963: return "中国西部";
    case 964: return "中国中部";
    case 965: return "中国東部";
    case 966: return "インド付近";
    case 967: return "インド洋";
    case 968: return "中東";
    case 969: return "ヨーロッパ西部";
    case 970: return "ヨーロッパ中部";
    case 971: return "ヨーロッパ東部";
    case 972: return "地中海";
    case 973: return "アフリカ西部";
    case 974: return "アフリカ中部";
    case 975: return "アフリカ東部";
    case 976: return "北大西洋";
    case 977: return "南大西洋";
    case 978: return "北極付近";
    case 979: return "南極付近";
    case 999: return "遠地";
    case 1000: return "その他震央地名";
    default: return `不明(${code})`;
  }
}

function De(code: number): string {
  return 511 == code ? "不明" : 501 <= code ? "500以上" : code.toString();
}

function Ma(code: number): string {
  return 127 == code ? "不明" : 101 <= code ? "10.0以上" : `${code / 10}`;
}
