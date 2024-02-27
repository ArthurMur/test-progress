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

class ProgressBar {
  constructor(elements) {
    this.elements = elements; // Ссылки на элементы DOM
    this.state = {
      toggleAnimateActive: false, // Состояние анимации
      toggleHideActive: false, // Состояние скрытия
      intervalId: null, // Идентификатор интервала для анимации
    };
    this.init(); // Инициализация при создании экземпляра класса
  }

  // Инициализация обработчиков событий
  init() {
    this.elements.valueInput.addEventListener(
      "input",
      this.handleValueInput.bind(this)
    );
    this.elements.toggleAnimate.addEventListener(
      "click",
      this.handleToggleAnimate.bind(this)
    );
    this.elements.toggleHide.addEventListener(
      "click",
      this.handleToggleHide.bind(this)
    );
    // Обновление прогресса при загрузке контента
    document.addEventListener("DOMContentLoaded", () => {
      this.updateProgress(this.elements.valueInput.value);
    });
  }

  // Обновление прогресса
  updateProgress(value) {
    this.elements.progress.style.setProperty("--progress-value", value);
    // Изменение цвета прогресс-бара в зависимости от значения
    this.elements.progressComplete.style.setProperty(
      "stroke",
      value !== 0 ? blue : white
    );
  }

  // Анимация заполнения прогресса
  animateFillProgress(value) {
    this.updateProgress(0); // Сначала обновляем прогресс до 0
    setTimeout(() => {
      this.updateProgress(value); // Затем через определенное время обновляем прогресс до заданного значения
    }, animationDelay);
  }

  // Обработчик события ввода значения
  handleValueInput(event) {
    clearInterval(this.state.intervalId); // Очищаем предыдущий интервал
    let value = Math.max(0, Math.min(100, event.target.value.slice(0, 3))); // Ограничиваем значение от 0 до 100
    this.updateProgress(value); // Обновляем прогресс с установленным значением
    event.target.value = value; // Устанавливаем значение поля ввода
    if (this.state.toggleAnimateActive) {
      // Запускаем новый интервал, если активирована анимация
      this.state.intervalId = setInterval(() => {
        this.animateFillProgress(this.elements.valueInput.value); // Запускаем анимацию заполнения прогресса
      }, animationInterval);
    }
  }

  // Обработчик клика на кнопку анимации
  handleToggleAnimate() {
    this.state.toggleAnimateActive = !this.state.toggleAnimateActive; // Инвертируем состояние анимации
    this.elements.toggleAnimate.classList.toggle(
      toggleActiveAnimate,
      this.state.toggleAnimateActive
    ); // Переключаем класс активного состояния кнопки
    clearInterval(this.state.intervalId); // Очищаем текущий интервал
    if (this.state.toggleAnimateActive) {
      // Если активирована анимация
      this.animateFillProgress(this.elements.valueInput.value); // Запускаем анимацию заполнения прогресса
      // Устанавливаем новый интервал для анимации
      this.state.intervalId = setInterval(() => {
        this.animateFillProgress(this.elements.valueInput.value);
      }, animationInterval);
    } else {
      // Если анимация не активна, просто обновляем прогресс с текущим значением
      this.updateProgress(this.elements.valueInput.value);
    }
  }

  // Обработчик клика на кнопку скрытия прогресса
  handleToggleHide() {
    this.state.toggleHideActive = !this.state.toggleHideActive; // Инвертируем состояние скрытия
    this.elements.toggleHide.classList.toggle(
      toggleActiveHide,
      this.state.toggleHideActive
    ); // Переключаем класс активного состояния кнопки
    this.elements.progress.classList.toggle(
      progressFillHide,
      this.state.toggleHideActive
    ); // Скрываем/отображаем прогресс в зависимости от состояния
  }
}

// Создание экземпляра класса ProgressBar с передачей ссылок на элементы DOM
const progressBar = new ProgressBar(elements);
