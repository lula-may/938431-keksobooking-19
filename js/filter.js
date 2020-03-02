'use strict';

(function () {
  var NOT_SET = 'any';
  var filterElement = document.querySelector('.map__filters');
  var filterFields = filterElement.querySelectorAll('select', 'fieldset');
  var idToProperty = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests'
  };

  var filterState = {};

  var updateFilterState = function (control) {
    switch (control.nodeName.toLowerCase()) {
      case 'input':
        var index = filterState.features.indexOf(control.value);
        if (index === -1) {
          filterState.features.push(control.value);
          return;
        }
        filterState.features.splice(index, 1);
        return;
      default:
        filterState[idToProperty[control.id]] = control.value;
    }
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
    filterFields.forEach(function (el) {
      el.removeAttribute('disabled');
    });
    filterState = {
      type: NOT_SET,
      price: NOT_SET,
      rooms: NOT_SET,
      guests: NOT_SET,
      features: []
    };
    filterElement.addEventListener('change', filterChangeHandler);
  };

  var disableFilter = function () {
    filterFields.forEach(function (el) {
      el.setAttribute('disabled', '');
    });
    filterElement.reset();
    filterElement.removeEventListener('change', filterChangeHandler);
  };

  window.filter = {
    activate: activateFilter,
    disable: disableFilter
  };
})();
