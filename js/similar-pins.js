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
    var anyAdvertisements = advertisements.slice(0, MAX_SIMILAR_AMOUNT);
    createPinFragment(anyAdvertisements);
  };


  var updatePins = window.debounce(function (filter) {
    removePins();
    var filteredAdvertisements = [];
    for (var i = 0; i < advertisements.length; i++) {
      if (window.data.matches(advertisements[i].offer, filter)) {
        filteredAdvertisements.push(advertisements[i]);
        if (filteredAdvertisements.length === MAX_SIMILAR_AMOUNT) {
          createPinFragment(filteredAdvertisements);
          return;
        }
      }
    }
    createPinFragment(filteredAdvertisements);
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
    arr.forEach(function (el) {
      var pinElement = template.cloneNode(true);
      pinElement.style = 'left: ' + (el.location.x - PIN_GAP_X) + 'px; top: ' + (el.location.y - PIN_GAP_Y) + 'px;';
      var imgElement = pinElement.querySelector('img');
      imgElement.src = el.author.avatar;
      imgElement.alt = el.offer.title;
      pinElement.card = window.card.create(el);
      pinElement.addEventListener('click', mapPinClickHandler);
      pinElement.addEventListener('keydown', mapPinPressEnterHandler);
      fragment.appendChild(pinElement);
      pins.push(pinElement);
    });
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
