'use strict';

(function () {
  var filterSelects = document.querySelectorAll('select');
  var advertisements = window.data.list;

  var showSimilarPins = function () {
    var pinListElement = document.querySelector('.map__pins');
    var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = window.similarPins.create(advertisements, mapPinTemplate);
    pinListElement.appendChild(fragment);
  };

  var activateSelects = function () {
    filterSelects.forEach(function (el) {
      el.removeAttribute('disabled');
    });
  };

  var disableSelects = function () {
    filterSelects.forEach(function (el) {
      el.removeAttribute('disabled');
    });
  };

  window.filter = {
    activate: activateSelects,
    disable: disableSelects,
    showPins: showSimilarPins
  };
})();
