import {
  progressCompleteSelector,
  toggleAnimateSelector,
  toggleActiveAnimate,
  toggleHideSelector,
  valueInputSelector,
  animationInterval,
  toggleActiveHide,
  progressSelector,
  progressFillHide,
  animationDelay,
  white,
  blue,
} from "../utils/constants.js";

// Объект, содержащий ссылки на элементы DOM
const elements = {
  progressComplete: document.querySelector(progressCompleteSelector),
  toggleAnimate: document.querySelector(toggleAnimateSelector),
  toggleHide: document.querySelector(toggleHideSelector),
  valueInput: document.querySelector(valueInputSelector),
  progress: document.querySelector(progressSelector),
};

// Объект для хранения состояния приложения
const state = {
  toggleAnimateActive: false,
  toggleHideActive: false,
  intervalId: null,
};

// Функция для обновления прогресса
const updateProgress = (value) => {
  elements.progress.style.setProperty("--progress-value", value);
  // Изменяем цвет прогресс-бара в зависимости от значения
  elements.progressComplete.style.setProperty(
    "stroke",
    value !== 0 ? blue : white
  );
};

// Функция для анимации заполнения прогресса
const animateFillProgress = (value) => {
  updateProgress(0); // Сначала обновляем прогресс до 0
  setTimeout(() => {
    updateProgress(value); // Затем через определенное время обновляем прогресс до заданного значения
  }, animationDelay);
};

// Обработчик событий при изменении значения ввода
const handleValueInput = (event) => {
  clearInterval(state.intervalId); // Очищаем предыдущий интервал
  let value = Math.max(0, Math.min(100, event.target.value.slice(0, 3))); // Ограничиваем значение от 0 до 100
  updateProgress(value); // Обновляем прогресс с установленным значением
  event.target.value = value; // Устанавливаем значение поля ввода
  // Запускаем новый интервал, если активирована анимация
  if (state.toggleAnimateActive) {
    state.intervalId = setInterval(() => {
      animateFillProgress(elements.valueInput.value); // Запускаем анимацию заполнения прогресса
    }, animationInterval);
  }
};

// Обработчик клика на кнопку анимации
const handleToggleAnimate = () => {
  state.toggleAnimateActive = !state.toggleAnimateActive; // Инвертируем состояние анимации
  elements.toggleAnimate.classList.toggle(
    toggleActiveAnimate,
    state.toggleAnimateActive
  ); // Переключаем класс активного состояния кнопки
  clearInterval(state.intervalId); // Очищаем текущий интервал
  if (state.toggleAnimateActive) {
    // Если активирована анимация
    animateFillProgress(elements.valueInput.value); // Запускаем анимацию заполнения прогресса
    // Устанавливаем новый интервал для анимации
    state.intervalId = setInterval(() => {
      animateFillProgress(elements.valueInput.value);
    }, animationInterval);
  } else {
    // Если анимация не активна, просто обновляем прогресс с текущим значением
    updateProgress(elements.valueInput.value);
  }
};

// Обработчик клика на кнопку скрытия прогресса
const handleToggleHide = () => {
  state.toggleHideActive = !state.toggleHideActive; // Инвертируем состояние скрытия
  elements.toggleHide.classList.toggle(
    toggleActiveHide,
    state.toggleHideActive
  ); // Переключаем класс активного состояния кнопки
  elements.progress.classList.toggle(progressFillHide, state.toggleHideActive); // Скрываем/отображаем прогресс в зависимости от состояния
};

// Добавление обработчиков событий
elements.valueInput.addEventListener("input", handleValueInput);
elements.toggleAnimate.addEventListener("click", handleToggleAnimate);
elements.toggleHide.addEventListener("click", handleToggleHide);

// Обновление прогресса при загрузке контента
document.addEventListener("DOMContentLoaded", () => {
  updateProgress(elements.valueInput.value);
});
