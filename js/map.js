'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var advertisements = window.data.list;

  var showSimilarPins = function () {
    var pinListElement = document.querySelector('.map__pins');
    var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = window.similarPins.create(advertisements, mapPinTemplate);
    pinListElement.appendChild(fragment);
  };


  var activateMap = function () {
    mapElement.classList.remove('map--faded');
    window.filter.activate();
    showSimilarPins();
  };

  var disableMap = function () {
    mapElement.classList.add('map--faded');
    window.filter.disable();
  };

  disableMap();

  window.map = {
    activate: activateMap,
    disable: disableMap
  };
})();
