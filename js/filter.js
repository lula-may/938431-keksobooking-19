'use strict';

(function () {
  var filterElement = document.querySelector('.map__filters');
  var filterFields = filterElement.querySelectorAll('select', 'fieldset');
  var typeFilter = filterElement.querySelector('#housing-type');
  var priceFilter = filterElement.querySelector('#housing-price');
  var roomsFiter = filterElement.querySelector('#housing-rooms');
  var guestsFilter = filterElement.querySelector('#housing-guests');
  var idToProperty = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests'
  };

  var filterState = {};

  var doOnFilterChange = function (control) {
    window.card.close();
    filterState[idToProperty[control.id]] = control.value;
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
      type: typeFilter.value,
      price: priceFilter.value,
      rooms: roomsFiter.value,
      guests: guestsFilter.value
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
