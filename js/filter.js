'use strict';

(function () {
  var filterElement = document.querySelector('.map__filters');
  var filterFields = filterElement.querySelectorAll('select', 'fieldset');
  var advertisements = window.data.list;

  var showSimilarPins = function () {
    var pinListElement = document.querySelector('.map__pins');
    var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = window.similarPins.create(advertisements, mapPinTemplate);
    pinListElement.appendChild(fragment);
  };

  var activateSelects = function () {
    filterFields.forEach(function (el) {
      el.removeAttribute('disabled');
    });
  };

  var disableSelects = function () {
    filterFields.forEach(function (el) {
      el.removeAttribute('disabled');
    });
  };

  window.filter = {
    activate: activateSelects,
    disable: disableSelects,
    showPins: showSimilarPins
  };
})();
