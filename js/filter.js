'use strict';

(function () {
  var filterElement = document.querySelector('.map__filters');
  var filterFields = filterElement.querySelectorAll('select', 'fieldset');


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
    disable: disableSelects
  };
})();
