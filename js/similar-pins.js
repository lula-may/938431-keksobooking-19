'use strict';
(function () {
  var ENTER_KEY = 'Enter';
  var PIN_GAP_X = 20;
  var PIN_GAP_Y = 40;
  var MAX_SIMILAR_AMOUNT = 5;
  var PRICE = {
    HIGH: 50000,
    MIDDLE: 10000,
  };
  var RANGE = {
    HIGH: 'high',
    MIDDLE: 'middle',
    LOW: 'low'
  };

  var NOT_SET = 'any';

  var pins = [];
  var advertisements = [];

  var getAdvertisements = function (data) {
    advertisements = data.filter(function (el) {
      return (el.offer !== undefined);
    });
    showAnyPins();
    return advertisements;
  };

  var showAnyPins = function () {
    var currentData = advertisements.slice(0, MAX_SIMILAR_AMOUNT);
    createPinFragment(currentData);
  };

  var getPriceRange = function (value) {
    if (value >= PRICE.HIGH) {
      return RANGE.HIGH;
    }
    if (value >= PRICE.MIDDLE) {
      return RANGE.MIDDLE;
    }
    return RANGE.LOW;
  };

  var fitsToFilter = function (advertisement, filter) {
    var offer = advertisement.offer;
    if (!(offer.type === filter.type || filter.type === NOT_SET)) {
      return false;
    }
    if (!(getPriceRange(offer.price) === filter.price || filter.price === NOT_SET)) {
      return false;
    }
    if (!(offer.rooms + '' === filter.rooms || filter.rooms === NOT_SET)) {
      return false;
    }
    if (!(offer.guests + '' === filter.guests || filter.guests === NOT_SET)) {
      return false;
    }
    for (var i = 0; i < filter.features.length; i++) {
      var currentFeature = filter.features[i];
      if (offer.features.indexOf(currentFeature) === -1) {
        return false;
      }
    }
    return true;
  };

  var updatePins = function (filter) {
    removePins();
    var filteredData = [];
    for (var i = 0; i < advertisements.length; i++) {
      if (fitsToFilter(advertisements[i], filter)) {
        filteredData.push(advertisements[i]);
        if (filteredData.length === MAX_SIMILAR_AMOUNT) {
          createPinFragment(filteredData);
          return;
        }
      }
    }
    createPinFragment(filteredData);
  };

  // Обработчики воздействия на метку объявления
  var mapPinClickHandler = function (evt) {
    window.card.open(evt.currentTarget);
  };

  var mapPinPressEnterHandler = function (evt) {
    if (evt.key === ENTER_KEY) {
      window.card.open(evt.currentTarget);
    }
  };

  // Создание и сборка фрагмента из меток на основе шаблона
  var createPinFragment = function (arr) {
    var template = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      var advertisement = arr[i];
      var pinElement = template.cloneNode(true);
      pinElement.style = 'left: ' + (advertisement.location.x - PIN_GAP_X) + 'px; top: ' + (advertisement.location.y - PIN_GAP_Y) + 'px;';
      var picture = pinElement.querySelector('img');
      picture.src = advertisement.author.avatar;
      picture.alt = advertisement.offer.title;
      pinElement.card = window.card.create(advertisement);
      pinElement.addEventListener('click', mapPinClickHandler);
      pinElement.addEventListener('keydown', mapPinPressEnterHandler);
      fragment.appendChild(pinElement);
      pins.push(pinElement);
    }
    window.map.showPins(fragment);
  };

  var removePins = function () {
    pins.forEach(function (el) {
      el.remove();
    });
    pins.length = 0;
  };

  window.similarPins = {
    create: createPinFragment,
    remove: removePins,
    init: getAdvertisements,
    update: updatePins
  };
})();
