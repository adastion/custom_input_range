// Функции для кроссбраузерной работы с кастомной полосой и прогрессом
function setProgress(range, value) {
  const min = +range.min;
  const max = +range.max;
  const percent = (value - min) / (max - min);

  // Обновляем кастомную прогресс-полосу
  const progress = range.parentElement.previousElementSibling;
  progress.style.width = `${percent * 100}%`;

  // Обновляем кастомные переменные
  range.closest(".range").style.setProperty("--value", value);
}

function setOutputPosition(range, output) {
  const min = +range.min;
  const max = +range.max;
  const val = +range.value;
  const percent = (val - min) / (max - min);
  const thumbSize = 14;
  const trackWidth = 320;
  const shift = thumbSize / 2;
  const pos = percent * (trackWidth - thumbSize) + shift;
  output.style.left = `${pos}px`;
}

function showBubble(container, value, direction, step) {
  // direction: 'increase' | 'decrease'
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = step;
  // bubble расположить над thumb
  bubble.style.left = "calc(var(--bubble-x))";
  bubble.style.top = "calc(var(--bubble-y))";
  if (direction === "increase") bubble.style.background = "#a259ff";
  else bubble.style.background = "#fff";
  container.appendChild(bubble);
  setTimeout(() => {
    bubble.remove();
  }, 1100);
}

// Основная логика
document.addEventListener("DOMContentLoaded", () => {
  const range = document.querySelector(".range__input");
  const output = document.getElementById("output");
  const progress = document.querySelector(".range__progress");
  const rangeBox = document.querySelector(".range");
  const bubbles = document.querySelector(".range__bubbles");
  let prevValue = +range.value;

  // Первоначальная установка
  setProgress(range, range.value);
  setOutputPosition(range, output);

  range.addEventListener("input", (e) => {
    const val = +range.value;
    setProgress(range, val);
    output.value = val;
    output.textContent = val;

    // Определяем увеличение/уменьшение
    if (val > prevValue) {
      rangeBox.classList.add("increase");
      rangeBox.classList.remove("decrease");
    } else if (val < prevValue) {
      rangeBox.classList.add("decrease");
      rangeBox.classList.remove("increase");
    }

    setOutputPosition(range, output);

    // Кружки-спирали
    const step = 10;
    if (val !== prevValue) {
      // появится столько кружков, сколько шагов между prevValue и val
      const diff = Math.abs(val - prevValue);
      const count = Math.floor(diff / step) || 1;
      const direction = val > prevValue ? "increase" : "decrease";

      // Определяем положение thumb (анимируем над ним)
      const min = +range.min,
        max = +range.max;
      const percent = (val - min) / (max - min);
      const thumbSize = 32;
      const trackWidth = 320;
      const shift = thumbSize / 2;
      const pos = percent * (trackWidth - thumbSize) + shift;

      for (let i = 0; i < count; ++i) {
        // Смещение для нескольких кружков
        let offset = (i - (count - 1) / 2) * 12;
        // left позиция
        let left = pos + offset - 13; // центрируем
        // top чуть выше thumb
        let top = 32 - 13;
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.textContent = step;
        bubble.style.left = `${left}px`;
        bubble.style.top = `${top}px`;
        bubble.style.background = direction === "increase" ? "#a259ff" : "#fff";
        bubble.style.color = direction === "increase" ? "#fff" : "#a259ff";
        bubbles.appendChild(bubble);
        setTimeout(() => {
          bubble.remove();
        }, 1100);
      }
    }

    prevValue = val;
  });

  // Для эффекта возврата цвета при отпускании мышки
  range.addEventListener("change", () => {
    setTimeout(() => {
      rangeBox.classList.remove("increase", "decrease");
    }, 300);
  });

  // Синхронизация при загрузке
  window.addEventListener("resize", () => {
    setOutputPosition(range, output);
  });
});
