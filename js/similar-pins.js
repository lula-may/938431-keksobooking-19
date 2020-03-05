'use strict';
(function () {
  var ENTER_KEY = 'Enter';
  var PIN_GAP_X = 20;
  var PIN_GAP_Y = 40;
  var MAX_SIMILAR_AMOUNT = 5;

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


  var updatePins = window.debounce(function (filter) {
    removePins();
    var filteredData = [];
    for (var i = 0; i < advertisements.length; i++) {
      if (window.data.matches(advertisements[i].offer, filter)) {
        filteredData.push(advertisements[i]);
        if (filteredData.length === MAX_SIMILAR_AMOUNT) {
          createPinFragment(filteredData);
          return;
        }
      }
    }
    createPinFragment(filteredData);
  });

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
    remove: removePins,
    init: getAdvertisements,
    update: updatePins
  };
})();
