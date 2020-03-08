'use strict';

(function () {
  var filterElement = document.querySelector('.map__filters');
  var filterFieldElements = filterElement.querySelectorAll('select, fieldset');
  var PREFIX = 'housing-';
  var filterState;

  var updateFilterState = function (control) {
    if (control.name === 'features') {
      filterState.features[control.value] = !(filterState.features[control.value]);
      return;
    }
    filterState[(control.name).replace(PREFIX, '')] = control.value;
  };

  var doOnFilterChange = function (control) {
    window.card.close();
    updateFilterState(control);
    window.similarPins.update(filterState);
  };

  var filterChangeHandler = function (evt) {
    doOnFilterChange(evt.target);
  };

  var activateFilter = function () {
    filterFieldElements.forEach(function (el) {
      el.removeAttribute('disabled');
    });
  };

  var disableFilter = function () {
    filterFieldElements.forEach(function (el) {
      el.setAttribute('disabled', '');
    });
    filterElement.reset();
    filterState = {
      features: {}
    };
  };

  filterElement.addEventListener('change', filterChangeHandler);

  window.filter = {
    activate: activateFilter,
    disable: disableFilter
  };
})();
