'use strict';

(function () {
  var filterElement = document.querySelector('.map__filters');
  var filterFields = filterElement.querySelectorAll('select', 'fieldset');
  var typeFilter = filterElement.querySelector('#housing-type');


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

  var typeChangeHandler = function () {
    window.card.close();
    var type = typeFilter.value;
    window.similarPins.updateByType(type);
  };

  typeFilter.addEventListener('change', typeChangeHandler);

  window.filter = {
    activate: activateSelects,
    disable: disableSelects
  };
})();
