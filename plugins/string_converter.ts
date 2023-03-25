export function getValueNumber(s: string, from: number, length: number): number {
  return parseInt(s.slice(from, from + length), 2);
}

export function getBinaryString(sentence: string): string {
  return [...sentence].map(c => parseInt(c, 16).toString(2).padStart(4, "0")).join("")
}

export function datetimeToString(datetime: Date, format: string): string {
  return format
    .replace("{yyyy}", datetime.getFullYear().toString())
    .replace("{MM}", (datetime.getMonth() + 1).toString().padStart(2, "0"))
    .replace("{dd}", datetime.getDate().toString().padStart(2, "0"))
    .replace("{HH}", datetime.getHours().toString().padStart(2, "0"))
    .replace("{mm}", datetime.getMinutes().toString().padStart(2, "0"))
    .replace("{ss}", datetime.getSeconds().toString().padStart(2, "0"));
}

export default {};
