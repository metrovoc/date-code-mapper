function dateToSequence(date) {
  try {
    let dateStr = String(date).padStart(4, "0"); // 确保日期是 4 位数
    let month = parseInt(dateStr.slice(0, 2));
    let day = parseInt(dateStr.slice(2, 4));
    let baseDate = new Date(2020, 0, 1); // 使用闰年
    let targetDate = new Date(2020, month - 1, day);
    let sequence =
      Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24)) + 1;
    return sequence;
  } catch (e) {
    console.error("非法日期: " + date);
  }
}

function sequenceToDate(sequence) {
  let baseDate = new Date(2020, 0, 1);
  let targetDate = new Date(
    baseDate.getTime() + (sequence - 1) * 24 * 60 * 60 * 1000
  );
  let month = targetDate.getMonth() + 1;
  let day = targetDate.getDate();
  return String(month).padStart(2, "0") + String(day).padStart(2, "0");
}

function extendedGCD(a, b) {
  if (b === 0) {
    return [a, 1, 0];
  } else {
    let [g, x, y] = extendedGCD(b, a % b);
    return [g, y, x - Math.floor(a / b) * y];
  }
}

function modularInverse(a, m) {
  let [g, x, y] = extendedGCD(a, m);
  if (g !== 1) {
    return null; // 逆元不存在
  } else {
    return ((x % m) + m) % m; // 确保结果为正数
  }
}

function dateMapping(dates) {
  const m = 366;
  const a = 37;
  const b = 123;
  const offset = 100;
  let results = [];
  for (let date of dates) {
    let sequence = dateToSequence(date); // 转换为序列号
    if (sequence === undefined) continue; // 跳过非法日期
    let mapped = ((a * sequence + b) % m) + offset;
    results.push(mapped);
  }
  return results;
}

function inverseMapping(mappedList) {
  const m = 366;
  const a = 37;
  const b = 123;
  const offset = 100;
  let aInv = modularInverse(a, m);
  if (aInv === null) {
    console.error("逆元不存在");
    return [];
  }
  let results = [];
  for (let y of mappedList) {
    let temp = y - offset - b;
    let sequence = (aInv * ((temp % m) + m)) % m; // 处理负数取模
    let date = sequenceToDate(sequence);
    results.push(date);
  }
  return results;
}

// 示例
let dates = [101, 1230]; // 输入日期集合（格式 MMDD）
let mapped = dateMapping(dates); // 映射到三位数集合
let reversedDates = inverseMapping(mapped); // 映射回日期
console.log(mapped, reversedDates);
