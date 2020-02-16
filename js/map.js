'use strict';

(function () {
  var mapElement = document.querySelector('.map');

  var activateMap = function () {
    mapElement.classList.remove('map--faded');
    window.filter.activate();
    window.filter.showPins();
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
