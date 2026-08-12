const MULTIPLIER = 37;
const INCREMENT = 123;
const MODULUS = 366;
const OFFSET = 100;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("a").setAttribute("data-value", MULTIPLIER);
  document.getElementById("b").setAttribute("data-value", INCREMENT);
  document.getElementById("m").setAttribute("data-value", MODULUS);
  document.getElementById("offset").setAttribute("data-value", OFFSET);

  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${month}${day}`;
  document.getElementById("inputDate").value = formattedDate;
  document.getElementById("inputMapped").value = mapDates([formattedDate])[0];

  document.getElementById("mapButton").addEventListener("click", mapDate);
  document
    .getElementById("recoverButton")
    .addEventListener("click", recoverDate);
  document
    .getElementById("toggleHistory")
    .addEventListener("click", toggleHistory);

  loadHistory();
});

function dateToDayOfYear(date) {
  const dateString = String(date).trim();
  if (!/^\d{4}$/.test(dateString)) {
    return null;
  }

  const month = Number(dateString.slice(0, 2));
  const day = Number(dateString.slice(2, 4));
  const targetDate = new Date(Date.UTC(2020, month - 1, day));

  if (
    targetDate.getUTCMonth() !== month - 1 ||
    targetDate.getUTCDate() !== day
  ) {
    return null;
  }

  const baseDate = Date.UTC(2020, 0, 1);
  return Math.floor((targetDate.getTime() - baseDate) / 86_400_000) + 1;
}

function dayOfYearToDate(dayOfYear) {
  const normalizedDay = dayOfYear === 0 ? MODULUS : dayOfYear;
  const targetDate = new Date(
    Date.UTC(2020, 0, 1) + (normalizedDay - 1) * 86_400_000
  );
  const month = String(targetDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getUTCDate()).padStart(2, "0");
  return `${month}${day}`;
}

function extendedGcd(left, right) {
  if (right === 0) {
    return [left, 1, 0];
  }

  const [gcd, x, y] = extendedGcd(right, left % right);
  return [gcd, y, x - Math.floor(left / right) * y];
}

function modularInverse(value, modulus) {
  const [gcd, coefficient] = extendedGcd(value, modulus);
  return gcd === 1 ? ((coefficient % modulus) + modulus) % modulus : null;
}

function mapDates(dates) {
  return dates.flatMap((date) => {
    const dayOfYear = dateToDayOfYear(date);
    if (dayOfYear === null) {
      return [];
    }

    return [((MULTIPLIER * dayOfYear + INCREMENT) % MODULUS) + OFFSET];
  });
}

function recoverDates(codes) {
  const inverse = modularInverse(MULTIPLIER, MODULUS);
  return codes.flatMap((code) => {
    if (!Number.isInteger(code) || code < OFFSET || code >= OFFSET + MODULUS) {
      return [];
    }

    const remainder = code - OFFSET - INCREMENT;
    const dayOfYear = (inverse * ((remainder % MODULUS) + MODULUS)) % MODULUS;
    return [dayOfYearToDate(dayOfYear)];
  });
}

function mapDate() {
  const inputDate = document.getElementById("inputDate").value;
  if (!inputDate) {
    alert("Please enter a valid date!");
    return;
  }
  const mapped = mapDates([inputDate]);
  if (mapped.length === 0) {
    alert("Mapping failed. Please enter a valid date.");
    return;
  }
  const mappedDatesDiv = document.getElementById("mappedDates");
  mappedDatesDiv.classList.remove("placeholder");
  mappedDatesDiv.textContent = `Generated code: ${mapped.join(", ")}`;
  document.getElementById("inputMapped").value = "";
  addToHistory("map", inputDate, mapped.join(", "));
}

function recoverDate() {
  const inputMapped = document.getElementById("inputMapped").value;
  if (!inputMapped) {
    alert("Please enter a valid mapped number!");
    return;
  }
  const reversedDates = recoverDates([Number(inputMapped)]);
  if (reversedDates.length === 0) {
    alert("Inverse mapping failed. Please enter a valid mapped number.");
    return;
  }
  const mappedDatesDiv = document.getElementById("mappedDates");
  mappedDatesDiv.classList.remove("placeholder");
  mappedDatesDiv.textContent = `Recovered date: ${reversedDates.join(", ")}`;
  document.getElementById("inputDate").value = "";
  addToHistory("inverse", inputMapped, reversedDates.join(", "));
}

function toggleHistory() {
  const historyDiv = document.getElementById("history");
  if (historyDiv.style.display === "none") {
    historyDiv.style.display = "block";
  } else {
    historyDiv.style.display = "none";
  }
}

function addToHistory(type, input, result) {
  const historyDiv = document.getElementById("history");
  const entry = document.createElement("div");
  entry.className = "history-entry";
  const label = document.createElement("span");
  label.textContent = `${type}: ${input} ➔ ${result}`;

  const deleteButton = document.createElement("button");
  deleteButton.className = "svg-btn";
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", "Delete history entry");
  deleteButton.textContent = "×";
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    entry.remove();
    saveHistory();
  });

  entry.append(label, deleteButton);
  entry.addEventListener("click", () => {
    if (type === "map") {
      document.getElementById("inputDate").value = input;
      document.getElementById("inputMapped").value = "";
      mapDate();
    } else {
      document.getElementById("inputMapped").value = input;
      document.getElementById("inputDate").value = "";
      recoverDate();
    }
  });
  historyDiv.appendChild(entry);
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
    const [typeInput, result] = record.split(" ➔ ");
    const [type, input] = typeInput.split(": ");
    addToHistory(type, input, result);
  }
}
