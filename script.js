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

document.addEventListener("DOMContentLoaded", loadHistory);

function mapDate() {
  const inputDate = document.getElementById("inputDate").value;
  if (!inputDate) {
    alert("Please enter a valid date!");
    return;
  }
  const mapped = dateMapping([parseInt(inputDate)]);
  const reversedDates = inverseMapping(mapped);
  document.getElementById("mappedDates").innerHTML = `
          <p>Mapped result: ${mapped.join(", ")}</p>
          <p>Reversed mapping: ${reversedDates.join(", ")}</p>
      `;
  addToHistory(inputDate, mapped.join(", "), reversedDates.join(", "));
}

function inverseMapDate() {
  const inputMapped = document.getElementById("inputMapped").value;
  if (!inputMapped) {
    alert("Please enter a valid mapped number!");
    return;
  }
  const mapped = [parseInt(inputMapped)];
  const reversedDates = inverseMapping(mapped);
  document.getElementById("mappedDates").innerHTML = `
          <p>Reversed mapping: ${reversedDates.join(", ")}</p>
      `;
  addToHistory(inputMapped, reversedDates.join(", "), mapped.join(", "));
}

function toggleHistory() {
  const historyDiv = document.getElementById("history");
  if (historyDiv.style.display === "none") {
    historyDiv.style.display = "block";
    document.getElementById("toggleHistory").innerText = "🕒 Hide History";
  } else {
    historyDiv.style.display = "none";
    document.getElementById("toggleHistory").innerText = "🕒 Show History";
  }
}

function addToHistory(input, mapped, reversed) {
  const historyDiv = document.getElementById("history");
  const entry = document.createElement("div");
  entry.className = "history-entry";
  entry.innerHTML = `
    <span>${input} ➔ ${mapped} ➔ ${reversed}</span>
    <button class="svg-btn" onclick="deleteHistory(event, this)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6H5H21" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;
  entry.onclick = function (event) {
    if (
      event.target.className !== "svg-btn" &&
      event.target.tagName !== "svg" &&
      event.target.tagName !== "path"
    ) {
      document.getElementById("inputDate").value = input;
      document.getElementById("inputMapped").value = mapped;
      mapDate();
    }
  };
  historyDiv.appendChild(entry);
  saveHistory();
}

function deleteHistory(event, button) {
  event.stopPropagation();
  const entry = button.parentElement;
  entry.remove();
  saveHistory();
}

function saveHistory() {
  const historyDiv = document.getElementById("history");
  const entries = historyDiv.getElementsByClassName("history-entry");
  const history = [];
  for (let entry of entries) {
    const text = entry.getElementsByTagName("span")[0].innerText;
    history.push(text);
  }
  localStorage.setItem("history", JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  for (let record of history) {
    const [input, mapped, reversed] = record.split(" ➔ ");
    addToHistory(input, mapped, reversed);
  }
}
