'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var pinListElement = document.querySelector('.map__pins');


  var showSimilarPins = function (fragment) {
    pinListElement.appendChild(fragment);
  };


  var activateMap = function () {
    window.backend.load(window.similarPins.init, window.error.show);
    mapElement.classList.remove('map--faded');
    window.filter.activate();
  };

  var disableMap = function () {
    mapElement.classList.add('map--faded');
    window.filter.disable();
  };

  var resetMap = function () {
    window.similarPins.remove();
    disableMap();
    window.pin.reset();
  };

  disableMap();

  window.map = {
    activate: activateMap,
    disable: disableMap,
    reset: resetMap,
    showPins: showSimilarPins
  };
})();
