'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var advertisements = [];

  var getAdvertisements = function (data) {
    advertisements = data.filter(function (el) {
      return (el.offer !== undefined);
    });
    return advertisements;
  };


  var showSimilarPins = function (data) {
    var pinListElement = document.querySelector('.map__pins');
    var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = window.similarPins.create(getAdvertisements(data), mapPinTemplate);
    pinListElement.appendChild(fragment);
  };


  var activateMap = function () {
    window.backend.load(showSimilarPins, window.error.show);
    mapElement.classList.remove('map--faded');
    window.filter.activate();
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
