'use strict';
var TEN = 10;
var TWENTY = 20;
var ADVERTISEMENT_QUANTITY = 8;
var MIN_PRICE = 0;
var MAX_PRICE = 1000000;
var MAX_ROOMS = 10;
var MAX_GUESTS = 30;
var MAX_PHOTOS = 8;
var MAP_TOP = 130;
var MAP_BOTTOM = 630;
var PIN_GAP_X = 20;
var PIN_GAP_Y = 40;
var PALACE = 'Дворец';
var FLAT = 'Квартира';
var HOUSE = 'Дом';
var BUNGALO = 'Бунгало';
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

var advertisements = createMockList();
var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pinListElement = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
pinListElement.appendChild(createPinFragment(advertisements, mapPinTemplate));

// Создание карточки объявления
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var getTypeInRussian = function (type) {
  switch (type) {
    case 'palace': return PALACE;
    case 'bungalo': return BUNGALO;
    case 'house': return HOUSE;
    default: return FLAT;
  }
};

var getRoomsText = function (num) {
  if (num >= TEN && num <= TWENTY) {
    return num + ' комнат для ';
  }
  switch (num % TEN) {
    case 1: return num + ' комната для ';
    case 2: return num + ' комнаты для ';
    case 3: return num + ' комнаты для ';
    case 4: return num + ' комнаты для ';
    default: return num + ' комнат для ';
  }
};

var getGuestsText = function (num) {
  if (num >= TEN && num <= TWENTY) {
    return num + ' гостей';
  }
  return (num % TEN === 1) ? num + ' гостя' : num + ' гостей';
};

var fillFeatureList = function (list, availableFeatures) {
  // Создаем фрагмент из доступных удобств
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < availableFeatures.length; i++) {
    var listElement = list.querySelector('.popup__feature--' + availableFeatures[i]);
    var newItem = listElement.cloneNode(true);
    newItem.textContent = availableFeatures[i];
    fragment.appendChild(newItem);
  }
  // Удаляем из разметки первоначальный список всех возможных удобств
  var listElements = list.querySelectorAll('.popup__feature');
  for (var j = 0; j < listElements.length; j++) {
    listElements[j].remove();
  }
  // Вставляем собранный фрагмент в разметку
  list.appendChild(fragment);
};

var fillPhotoList = function (list, photoSources) {
  var element = list.querySelector('.popup__photo');
  element.src = photoSources[0];
  for (var i = 1; i < photoSources.length; i++) {
    var newElement = element.cloneNode(true);
    newElement.src = photoSources[i];
    list.appendChild(newElement);
  }
};

var fillAdvertisementCard = function (advertisement) {
  var card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = advertisement.offer.title;
  card.querySelector('.popup__text--address').textContent = advertisement.offer.address;
  card.querySelector('.popup__text--price').textContent = advertisement.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = getTypeInRussian(advertisement.offer.type);
  card.querySelector('.popup__text--capacity').textContent = getRoomsText(advertisement.offer.rooms) + getGuestsText(advertisement.offer.guests);
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;
  var featureList = card.querySelector('.popup__features');
  fillFeatureList(featureList, advertisement.offer.features);
  card.querySelector('.popup__description').textContent = advertisement.offer.description;
  var photoList = card.querySelector('.popup__photos');
  fillPhotoList(photoList, advertisement.offer.photos);
  card.querySelector('.popup__avatar').src = advertisement.author.avatar;
  return card;
};

var newCard = fillAdvertisementCard(advertisements[0]);
var filtersContainer = map.querySelector('.map__filters-container');
map.insertBefore(newCard, filtersContainer);
