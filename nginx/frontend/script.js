// надписи и цвета на секторах
const prizes = [
  {
    text: "Массовый подбор персонала",
    comment: "Передача 5 контактов соискателей заказчику на массовый подбор персонала по базе заказчика",
    color: "#24c0bd",
  },
  { 
    text: "Информирование об акции Ваших клиентов",
	comment: "Проведение кампании по информированию клиентов заказчика, срок до 2 РД или до 1000 контактов клиентов",
    color: "#24a3da",
  },
  { 
    text: "Загрузка Вашего курса на Среду",
	comment: "Создание 1 курса на платформе по шаблону (текстовый курс, видеокурс) количество уроков не ограниченно, с возможностью добавления заданий по результатам уроков.  Количество обучающихся на курсе: не более 15 человек.  Период прохождения: 1 месяц",
    color: "#337ae2",
  },
  {
    text: "Курс Профилактика выгорания",
	comment: "Бесплатный доступ к курсу Профилактика выгорания. Количество обучающихся на курсе: не более 30 человек.  Период прохождения: 1 месяц ",
    color: "#692dc1",
  },
  {
    text: "QR-код на 1 месяц",
	comment: "Сбор обратной связи от клиентов с помощью QR-кода на 1 месяц на платформе Спектра",
    color: "#120646",
  },
  {
    text: "Скидка 20% на речевую аналитику",
	comment: "Скидка 20% на внедрение программного обеспечения Речевая аналитика  ",
    color: "#24c0bd",
  },
  {
    text: "5 проверок ВМР",
	comment: "Пилот на 5 проверок по ВМР + помощь в создании чек-листа и краткой аналитической записки",
    color: "#24a3da",
  },
  {
    text: "Чек-лист ВМР",
	comment: "Помощь в создании чек-листа и краткой аналитической записки",
    color: "#337ae2",
  },
  {
    text: "Скидка 5% на рекрутинг",
	comment: "Скидка 5% на рекрутинг респондентов для ФГ или UX",
    color: "#692dc1",
  },
  {
    text: "Скринер на рекрутинг",
	comment: "Бесплатная разработка скринера по техническому заданию клиента",
    color: "#120646",
  },
  {
    text: "Отраслевой отчет",
	comment: "Обезличенный отраслевой отчет по исследованию похожей бизнес задачи, из Вашей сферы бизнеса",
    color: "#24c0bd",
  },
  {
    text: "Скидка 5% на исследование",
	comment: "Скидка на любое маркет рисерч исследование в Лаборатории Мир",
    color: "#24a3da",
  },
  {
    text: "Парсинг отзывов 20 локаций",
	comment: "Парсинг отзывов из Яндекса и 2ГИС до  20 локаций",
    color: "#337ae2",
  },
  {
    text: "Анкета на онлайн-панели",
	comment: "Бесплатная разработка и програмирование анкеты на платформе СборИдей",
    color: "#692dc1",
  }
];

// создаём переменные для быстрого доступа ко всем объектам на странице — блоку в целом, колесу, кнопке и язычку
const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");

// на сколько секторов нарезаем круг
const prizeSlice = 360 / prizes.length;
// на какое расстояние смещаем сектора друг относительно друга
const prizeOffset = Math.floor(180 / prizes.length);
// прописываем CSS-классы, которые будем добавлять и убирать из стилей
const spinClass = "is-spinning";
const selectedClass = "selected";
// получаем все значения параметров стилей у секторов
const spinnerStyles = window.getComputedStyle(spinner);

// переменная для анимации
let tickerAnim;
// угол вращения
let rotation = 0;
// текущий сектор
let currentSlice = 0;
// переменная для текстовых подписей
let prizeNodes;

// расставляем текст по секторам
const createPrizeNodes = () => {
  // обрабатываем каждую подпись
  prizes.forEach(({ text, comment, color, reaction }, i) => {
    // каждой из них назначаем свой угол поворота
    const rotation = ((prizeSlice * i) * -1) - prizeOffset;
    // добавляем код с размещением текста на страницу в конец блока spinner
    spinner.insertAdjacentHTML(
      "beforeend",
      // текст при этом уже оформлен нужными стилями
      `<li class="prize" data-reaction=${reaction} style="--rotate: ${rotation}deg">
        <span class="text" data-comment="${comment}">${text}</span>
      </li>`
    );
  });
};

// рисуем разноцветные секторы
const createConicGradient = () => {
  // устанавливаем нужное значение стиля у элемента spinner
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
      from -90deg,
      ${prizes
        // получаем цвет текущего сектора
        .map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`)
        .reverse()
      }
    );`
  );
};

// создаём функцию, которая нарисует колесо в сборе
const setupWheel = () => {
  // сначала секторы
  createConicGradient();
  // потом текст
  createPrizeNodes();
  // а потом мы получим список всех призов на странице, чтобы работать с ними как с объектами
  prizeNodes = wheel.querySelectorAll(".prize");
};

// определяем количество оборотов, которое сделает наше колесо
const spinertia = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// функция запуска вращения с плавной остановкой
const runTickerAnimation = () => {
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];  
  let rad = Math.atan2(b, a);
  
  if (rad < 0) rad += (2 * Math.PI);
  
  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  // анимация язычка, когда его задевает колесо при вращении
  // если появился новый сектор
  if (currentSlice !== slice) {
    // убираем анимацию язычка
    ticker.style.animation = "none";
    // и через 10 миллисекунд отменяем это, чтобы он вернулся в первоначальное положение
    setTimeout(() => ticker.style.animation = null, 10);
    // после того, как язычок прошёл сектор - делаем его текущим 
    currentSlice = slice;
  }
  // запускаем анимацию
  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

// функция выбора призового сектора
const selectPrize = () => {
  const selected = Math.floor(rotation / prizeSlice);
  prizeNodes[selected].classList.add(selectedClass);
};

// отслеживаем нажатие на кнопку
trigger.addEventListener("click", () => {
  // делаем её недоступной для нажатия
  trigger.disabled = true;
  // задаём начальное вращение колеса
  rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
  // убираем прошлый приз
  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
  // добавляем колесу класс is-spinning, с помощью которого реализуем нужную отрисовку
  wheel.classList.add(spinClass);
  // через CSS говорим секторам, как им повернуться
  spinner.style.setProperty("--rotate", rotation);
  // возвращаем язычок в горизонтальную позицию
  ticker.style.animation = "none";
  // запускаем анимацию вращение
  runTickerAnimation();
});

// отслеживаем, когда закончилась анимация вращения колеса
spinner.addEventListener("transitionend", () => {
  // останавливаем отрисовку вращения
  cancelAnimationFrame(tickerAnim);
  // получаем текущее значение поворота колеса
  rotation %= 360;
  // выбираем приз
  selectPrize();
  // убираем класс, который отвечает за вращение
  wheel.classList.remove(spinClass);
  // отправляем в CSS новое положение поворота колеса
  spinner.style.setProperty("--rotate", rotation);
  // делаем кнопку снова активной
  trigger.disabled = false;
  
  document.querySelector("input[name=prize]").value += document.querySelector(".prize.selected span").innerHTML;
  document.querySelector("p.comment").innerHTML += document.querySelector(".prize.selected span").dataset.comment;
  
  setTimeout(function() {
    $('#callback').modal('show'); 
  }, 1000);
  
});

// подготавливаем всё к первому запуску
setupWheel();