'use strict';
var ENTER_KEY = 'Enter';
var ADVERTISEMENT_QUANTITY = 8;
var MIN_PRICE = 0;
var MAX_PRICE = 1000000;
var MAX_ROOMS = 10;
var MAX_GUESTS = 30;
var MAX_PHOTOS = 8;
var MAP_TOP = 130;
var MAP_BOTTOM = 630;
var MAIN_PIN_SIZE = 62;
var PIN_ACTIVE_HEIGHT = 84;
var PIN_GAP_X = 20;
var PIN_GAP_Y = 40;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_HOURS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
// var housing = {
//   palace: 'Дворец',
//   flat: 'Квартира',
//   house: 'Дом',
//   bungalo: 'Бунгало'
// };

// Получение случайного числа из заданного диапазона
var getRandomNumberFrom = function (minValue, maxValue) {
  var number = Math.round(Math.random() * (maxValue - minValue)) + minValue;
  return number;
};

// Получение случайного элемента массива
var getRandomElement = function (arr) {
  var index = Math.round(Math.random() * (arr.length - 1));
  return arr[index];
};

// Построение массива случайной длины из элементов массива с фотографиями
var getRandomLengthPhotoList = function () {
  var length = getRandomNumberFrom(1, MAX_PHOTOS);
  var randomPhotos = [];
  for (var i = 0; i < length; i++) {
    randomPhotos[i] = getRandomElement(PHOTOS);
  }
  return randomPhotos;
};

// Получение выборки случайной длины из неповтояющихся элементов массива
var getSubList = function (arr) {
  var subListElements = arr.slice();

  // Получаем количество элементов, которые надо удалить
  var elementsToDelete = getRandomNumberFrom(0, arr.length);

  // Если надо удалить все элементы - возвращаем пустой массив
  if (elementsToDelete === arr.length) {
    return [];
  }
  for (var count = 0; count < elementsToDelete; count++) {
    var randomIndex = getRandomNumberFrom(0, subListElements.length - 1);
    subListElements.splice(randomIndex, 1);
  }
  return subListElements;
};

// Генерирование случайного объекта для объявления
var createMockAdvertisement = function (j) {
  var author = {
    avatar: 'img/avatars/user0' + (j + 1) + '.png'
  };

  var mapWidth = document.querySelector('.map').offsetWidth;
  var location = {
    x: getRandomNumberFrom(0, mapWidth),
    y: getRandomNumberFrom(MAP_TOP, MAP_BOTTOM)
  };

  var offer = {
    title: 'Заголовок предложения',
    address: location.x + ', ' + location.y,
    price: getRandomNumberFrom(MIN_PRICE, MAX_PRICE),
    type: getRandomElement(TYPES),
    rooms: getRandomNumberFrom(1, MAX_ROOMS),
    guests: getRandomNumberFrom(1, MAX_GUESTS),
    checkin: getRandomElement(CHECK_HOURS),
    checkout: getRandomElement(CHECK_HOURS),
    features: getSubList(FEATURES),
    description: 'Описание самого лучшего жилья на свете',
    photos: getRandomLengthPhotoList()
  };

  var element = {};
  element.author = author;
  element.offer = offer;
  element.location = location;

  return element;
};

// Создание массива сгенерированных объявлений
var createMockList = function () {
  var elementList = [];
  for (var i = 0; i < ADVERTISEMENT_QUANTITY; i++) {
    elementList.push(createMockAdvertisement(i));
  }
  return elementList;
};

// Создание и сборка фрагмента из меток на основе шаблона
var createPinFragment = function (arr, template) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    var advertisement = arr[i];
    var pinElement = template.cloneNode(true);
    pinElement.style = 'left: ' + (advertisement.location.x - PIN_GAP_X) + 'px; top: ' + (advertisement.location.y - PIN_GAP_Y) + 'px;';
    var picture = pinElement.querySelector('img');
    picture.src = advertisement.author.avatar;
    picture.alt = advertisement.offer.title;
    fragment.appendChild(pinElement);
  }
  return fragment;
};

// Создание карточки объявления
// var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

// var getTypeInRussian = function (type) {
//   return housing[type];
// };

// var getRoomsText = function (num) {
//   if (num > 10 && num < 15 || num % 10 > 4) {
//     return num + ' комнат для ';
//   }
//   switch (num % 10) {
//     case 1: return num + ' комната для ';
//     default: return num + ' комнаты для ';
//   }
// };

// var getGuestsText = function (num) {
//   return (num % 10 === 1 && num !== 11) ? num + ' гостя' : num + ' гостей';
// };

// var fillFeatureList = function (list, availableFeatures) {
//   // Создаем фрагмент из доступных удобств
//   var fragment = document.createDocumentFragment();
//   for (var i = 0; i < availableFeatures.length; i++) {
//     var listElement = list.querySelector('.popup__feature--' + availableFeatures[i]);
//     var newItem = listElement.cloneNode(true);
//     newItem.textContent = availableFeatures[i];
//     fragment.appendChild(newItem);
//   }
//   // Удаляем из разметки первоначальный список всех возможных удобств
//   // Вставляем собранный фрагмент в разметку
//   list.innerHTML = '';
//   list.appendChild(fragment);
// };

// var fillPhotoList = function (list, photoSources) {
//   var element = list.querySelector('.popup__photo');
//   element.src = photoSources[0];
//   for (var i = 1; i < photoSources.length; i++) {
//     var newElement = element.cloneNode(true);
//     newElement.src = photoSources[i];
//     list.appendChild(newElement);
//   }
// };

// var fillAdvertisementCard = function (advertisement) {
//   var card = cardTemplate.cloneNode(true);
//   card.querySelector('.popup__title').textContent = advertisement.offer.title;
//   card.querySelector('.popup__text--address').textContent = advertisement.offer.address;
//   card.querySelector('.popup__text--price').textContent = advertisement.offer.price + '₽/ночь';
//   card.querySelector('.popup__type').textContent = getTypeInRussian(advertisement.offer.type);
//   card.querySelector('.popup__text--capacity').textContent = getRoomsText(advertisement.offer.rooms) + getGuestsText(advertisement.offer.guests);
//   card.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;
//   var featureList = card.querySelector('.popup__features');
//   fillFeatureList(featureList, advertisement.offer.features);
//   card.querySelector('.popup__description').textContent = advertisement.offer.description;
//   var photoList = card.querySelector('.popup__photos');
//   fillPhotoList(photoList, advertisement.offer.photos);
//   card.querySelector('.popup__avatar').src = advertisement.author.avatar;
//   return card;
// };

// Временно закомментировано
// var newCard = fillAdvertisementCard(advertisements[0]);
// var filtersContainer = map.querySelector('.map__filters-container');
// map.insertBefore(newCard, filtersContainer);

var map = document.querySelector('.map');
var mapPinMain = map.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var formFieldsets = adForm.querySelectorAll('fieldset');
var filterSelects = map.querySelectorAll('select');

// Добавление атрибута disabled элементам массива
var disableElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].setAttribute('disabled', 'disabled');
  }
};

var activateElements = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].hasAttribute('disabled')) {
      elements[i].removeAttribute('disabled');
    }
  }
};

var setAddressValue = function (sizeY) {
  var location = {
    x: mapPinMain.offsetLeft + MAIN_PIN_SIZE / 2,
    y: mapPinMain.offsetTop + sizeY
  };
  addressInput.value = location.x + ', ' + location.y;
};

var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  activateElements(formFieldsets);
  activateElements(filterSelects);

  // Проверка соответствия кол-ва комнат кол-ву гостей в начале активации
  setGuestSelectValidity();

  var advertisements = createMockList();
  var pinListElement = document.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  pinListElement.appendChild(createPinFragment(advertisements, mapPinTemplate));
};

var mapPinMainMousedownHandler = function (evt) {
  if (evt.button === 0) {
    activatePage();
    setAddressValue(PIN_ACTIVE_HEIGHT);
  }
};

var mapPinMainPressEnterHandler = function (evt) {
  if (evt.key === ENTER_KEY) {
    activatePage();
    setAddressValue(PIN_ACTIVE_HEIGHT);
  }
};

// Деактивируем все поля формы и фильтра
disableElements(formFieldsets);
disableElements(filterSelects);

// Заполняем поле адреса
var addressInput = adForm.querySelector('#address');
setAddressValue(MAIN_PIN_SIZE / 2);

// Обработчики воздействия на метку
mapPinMain.addEventListener('mousedown', mapPinMainMousedownHandler);
mapPinMain.addEventListener('keydown', mapPinMainPressEnterHandler);

// Связываем значение поля "Количество комнат" с "Количеством мест"
var roomSelect = adForm.querySelector('#room_number');
var capacitySelect = adForm.querySelector('#capacity');

var getSelectedOption = function (select) {
  var options = select.options;
  for (var i = 0; i < options.length; i++) {
    if (options[i].selected) {
      return options[i].value;
    }
  }
  return undefined;
};

var checkedRoomsQuantity;
var checkedCapacity;

var setGuestSelectValidity = function () {
  checkedRoomsQuantity = getSelectedOption(roomSelect);
  checkedCapacity = getSelectedOption(capacitySelect);
  switch (checkedRoomsQuantity) {
    case '100':
      if (checkedCapacity !== '0') {
        capacitySelect.setCustomValidity('Ваши комнаты - не для гостей. Выберите "Не для гостей".');
      } else {
        capacitySelect.setCustomValidity('');
      }
      break;
    default:
      if (checkedCapacity > checkedRoomsQuantity) {
        capacitySelect.setCustomValidity('Гостей не должно быть больше чем комнат. Выберите другое значение.');
      } else if (checkedCapacity === '0') {
        capacitySelect.setCustomValidity('Выберите хотя бы одного гостя!');
      } else {
        capacitySelect.setCustomValidity('');
      }
  }
};

// Обработчики изменения значений полей кол-ва комнат и кол-ва гостей
var capacitySelectChangeHandler = function () {
  setGuestSelectValidity();
};

var roomSelectChangeHandler = function () {
  setGuestSelectValidity();
};

capacitySelect.addEventListener('change', capacitySelectChangeHandler);
roomSelect.addEventListener('change', roomSelectChangeHandler);
