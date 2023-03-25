import { getBinaryString, getValueNumber } from "~/plugins/string_converter";
import parsers from "~/plugins/qzqsm_parsers";

interface QzqsmValue {
  value: number,
  string: string,
};

interface Qzqsm {
  parsed: boolean,
  category?: QzqsmValue,
  classification?: QzqsmValue,
  information_type?: QzqsmValue,
  satellite?: QzqsmValue,
  publisher?: QzqsmValue,
  report_time?: Date,
  body?: string,
  nmea: string
};

export function verifyChecksum(t: string): boolean {
  const s = t.replace("$", "").split("*")[0];
  let r = 0;
  [...s].map(x => x.codePointAt(0)).forEach(x => r ^= x!);
  return r.toString(16) === t.split("*")[1];
}

export function parse(t: string): Qzqsm {
  const satellite = parseInt(t.split(",")[1]);

  const sentence = getBinaryString(t.split(",")[2].split("*")[0]);

  const mt = getValueNumber(sentence, 8, 6);
  const rc = getValueNumber(sentence, 14, 3);
  const dc = getValueNumber(sentence, 17, 4);
  const it = getValueNumber(sentence, 41, 2);

  const satelliteStr = (() => {
    switch (satellite) {
      case 55: return "QZS01";
      case 56: return "QZS02";
      case 61: return "QZS03";
      case 57: return "QZS04";
      case 58: return "QZS1R";
      default: return `不明(${satellite})`;
    };
  })();
  const mtStr = (() => {
    switch (mt) {
      case 43: return "気象庁";
      case 44: return "その他";
      default: return `不明(${mt})`;
    };
  })();
  const rcStr = (() => {
    switch (rc) {
      case 1: return "最優先";
      case 2: return "優先";
      case 3: return "通常";
      case 7: return "訓練/テスト";
      default: return `不明(${rc})`;
    };
  })();
  const dcStr = (() => {
    switch (dc) {
      case 1: return "緊急地震速報";
      case 2: return "震源";
      case 3: return "震度";
      case 4: return "南海トラフ地震";
      case 5: return "津波";
      case 6: return "北西太平洋津波";
      case 8: return "火山";
      case 9: return "降灰";
      case 10: return "気象";
      case 11: return "洪水";
      case 12: return "台風";
      case 14: return "海上";
      default: return `不明${dc}`;
    };
  })();
  const itStr = (() => {
    switch (it) {
      case 0: return "発表";
      case 1: return "訂正";
      case 2: return "取消";
      default: return `不明(${it})`;
    };
  })();

  const report_time = new Date(`${new Date().getFullYear()}/${getValueNumber(sentence, 21, 4)}/${getValueNumber(sentence, 25, 5)} ${getValueNumber(sentence, 30, 5)}:${getValueNumber(sentence, 35, 6)}:00`);
  report_time.setHours(report_time.getHours() + 9);

  const parsedText = (() => {
    switch (dc) {
      case 1: return parsers.EarthquakeEarlyWarningParser(sentence);
      case 2: return parsers.HypocenterParser(sentence);
      // case 3: return parsers.SeismicIntensityParser(sentence);
      // case 4: return parsers.NankaiTroughEarthquakeParser(sentence);
      // case 5: return parsers.TsunamiParser(sentence);
      // case 6: return parsers.NorthwestPacificTsunamiParser(sentence);
      // case 8: return parsers.VolcanoParser(sentence);
      // case 9: return parsers.AshFallParser(sentence);
      // case 10: return parsers.WeatherParser(sentence);
      // case 11: return parsers.FloodParser(sentence);
      // case 12: return parsers.TyphoonParser(sentence);
      // case 14: return parsers.MarineParser(sentence);
      // default: return "no parser";
    };
  })();

  return {
    parsed: true,
    category: {
      value: dc,
      string: dcStr
    },
    classification: {
      value: rc,
      string: rcStr
    },
    information_type: {
      value: it,
      string: itStr
    },
    satellite: {
      value: satellite,
      string: satelliteStr
    },
    publisher: {
      value: mt,
      string: mtStr
    },
    report_time: report_time,
    body: parsedText,
    nmea: t
  };
};
