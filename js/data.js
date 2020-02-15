'use strict';

(function () {
  var ADVERTISEMENT_QUANTITY = 8;
  var MIN_PRICE = 0;
  var MAX_PRICE = 1000000;
  var MAX_ROOMS = 30;
  var MAX_GUESTS = 3;
  var MAX_PHOTOS = 8;
  var MAP_TOP = 130;
  var MAP_BOTTOM = 630;
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECK_HOURS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var mockList;

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

  mockList = createMockList();

  window.data = {
    list: mockList
  };
})();