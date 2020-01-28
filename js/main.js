'use strict';
var ADVERTISEMENT_NUMBER = 8;
var MIN_PRICE = 1000;
var MAX_PRICE = 100000;
var MAX_GUESTS = 10;
var MAX_PHOTOS = 8;
var MAP_TOP = 130;
var MAP_BOTTOM = 630;
var PIN_GAP_X = 25;
var PIN_GAP_Y = 70;
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

// Получение случайного индекса массива
var getRandomIndex = function (array) {
  var index = Math.round(Math.random() * (array.length - 1));
  return index;
};

// Построение массива случайной длины из элементов массива с фотографиями
var getRandomLengthArray = function () {
  var length = getRandomNumberFrom(1, MAX_PHOTOS);
  var array = [];
  for (var i = 0; i < length; i++) {
    array[i] = PHOTOS[getRandomIndex(PHOTOS)];
  }
  return array;
};

// Получение выборки случайной длины из неповтояющихся элементов массива
var getSubArray = function (arr) {
  var subArrayLength = getRandomNumberFrom(1, arr.length);
  var subArray = [];
  for (var i = 0; i < subArrayLength; i++) {
    var index = getRandomIndex(arr);
    subArray[i] = arr[index];
    arr.splice(index, 1);
  }
  return subArray;
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
    type: TYPES[getRandomIndex(TYPES)],
    guests: getRandomNumberFrom(1, MAX_GUESTS),
    checkin: CHECK_HOURS[getRandomIndex(CHECK_HOURS)],
    checkout: CHECK_HOURS[getRandomIndex(CHECK_HOURS)],
    features: getSubArray(FEATURES),
    description: 'Описание самого лучшего жилья на свете',
    photos: getRandomLengthArray(PHOTOS, MAX_PHOTOS)
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
  for (var i = 0; i < ADVERTISEMENT_NUMBER; i++) {
    elementList.push(createMockAdvertisement(i));
  }
  return elementList;
};
var advertisements = createMockList();

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pinListElement = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

// Заполнение шаблона данными из объявления
var renderMapPin = function (advertisement) {
  var pinElement = mapPinTemplate.cloneNode(true);
  pinElement.style = 'left: ' + (advertisement.location.x - PIN_GAP_X) + 'px; top: ' + (advertisement.location.y - PIN_GAP_Y) + 'px;';
  var picture = pinElement.querySelector('img');
  picture.src = advertisement.author.avatar;
  return pinElement;
};

// Сборка фрагмента на основе массива
var assembleFragment = function (frag, arr) {
  for (var i = 0; i < arr.length; i++) {
    frag.appendChild(renderMapPin(arr[i]));
  }
  return frag;
};

var fragment = document.createDocumentFragment();
assembleFragment(fragment, advertisements);

// Добавление собранного фрагмента в блок с метками
pinListElement.appendChild(fragment);


