'use strict';

var ADVERTISEMENT_QUANTITY = 8;
var MIN_PRICE = 10;
var MAX_PRICE = 200;
var MAX_ROOMS = 10;
var MAX_GUESTS = 10;
var MAX_PHOTOS = 8;
var MAP_TOP = 130;
var MAP_BOTTOM = 630;
var PIN_GAP_X = 20;
var PIN_GAP_Y = 40;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_HOURS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

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
    price: getRandomNumberFrom(MIN_PRICE, MAX_PRICE) * 100,
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

var advertisements = createMockList();
var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pinListElement = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
pinListElement.appendChild(createPinFragment(advertisements, mapPinTemplate));

// Создание карточки объявления
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var getTypeInRussian = function (type) {
  if (type === 'flat') {
    return 'Квартира';
  } else if (type === 'bungalo') {
    return 'Бунгало';
  } else if (type === 'house') {
    return 'Дом';
  } else if (type === 'palace') {
    return 'Дворец';
  }
  return '';
};

var getRoomsText = function (num) {
  if (num % 20 === 1) {
    return ' комната для ';
  } else if (num % 20 < 5) {
    return ' комнаты для ';
  }
  return ' комнат для ';
};


var containsElementIn = function (el, arr) {
  for (var j = 0; j < arr.length; j++) {
    el.textContent = arr[j];
    if (el.classList.contains('popup__feature--' + arr[j])) {
      return true;
    }
  }
  return false;
};

var fillFeatureList = function (list, arr) {
  // Получаем список возможных удобств
  var listElements = list.querySelectorAll('.popup__feature');

  for (var i = 0; i < listElements.length; i++) {
  // Если элемента нет среди доступных удобств, удаляем его из DOM
    if (!containsElementIn(listElements[i], arr)) {
      list.removeChild(listElements[i]);
    }
  }
};

var fillPhotoList = function (list, arr) {
  var element = list.querySelector('.popup__photo');
  element.src = arr[0];
  for (var i = 1; i < arr.length; i++) {
    var newElement = element.cloneNode(true);
    newElement.src = arr[i];
    list.appendChild(newElement);
  }
};

var fillAdvertisementCard = function (obj) {
  var card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = obj.offer.title;
  card.querySelector('.popup__text--address').textContent = obj.offer.address;
  card.querySelector('.popup__text--price').textContent = obj.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = getTypeInRussian(obj.offer.type);
  card.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + getRoomsText(obj.offer.rooms) + obj.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
  var featureList = card.querySelector('.popup__features');
  fillFeatureList(featureList, obj.offer.features);
  card.querySelector('.popup__description').textContent = obj.offer.description;
  var photoList = card.querySelector('.popup__photos');
  fillPhotoList(photoList, obj.offer.photos);
  card.querySelector('.popup__avatar').src = obj.author.avatar;
  return card;
};

var newCard = fillAdvertisementCard(advertisements[0]);
var filtersContainer = map.querySelector('.map__filters-container');
map.insertBefore(newCard, filtersContainer);
