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

function modularInverse(a, m) {
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return null;
}

function dateMapping(dates) {
  const m = 366;
  const a = 37;
  const b = 123;
  const offset = 100;
  let results = [];
  for (let date of dates) {
    let sequence = dateToSequence(date); // 转换为序列号
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
  let results = [];
  for (let y of mappedList) {
    let sequence = (aInv * (y - offset - b)) % m;
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
