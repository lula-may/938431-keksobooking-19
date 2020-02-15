'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var filterSelects = mapElement.querySelectorAll('select');
  var advertisements = window.data.list;

  // Показываем сгенерированные метки
  var showSimilarPins = function () {
    var pinListElement = document.querySelector('.map__pins');
    var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = window.similarPins.create(advertisements, mapPinTemplate);
    pinListElement.appendChild(fragment);
  };

  var activateMap = function () {
    mapElement.classList.remove('map--faded');
    filterSelects.forEach(function (el) {
      el.removeAttribute('disabled');
    });
    showSimilarPins();
  };

  var disableMap = function () {
    mapElement.classList.add('map--faded');
    filterSelects.forEach(function (el) {
      el.setAttribute('disabled', '');
    });
  };

  disableMap();

  window.map = {
    activate: activateMap,
    disable: disableMap
  };
})();
