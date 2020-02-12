'use strict';

(function () {
  var mapElement = document.querySelector('.map');

  var filterSelects = mapElement.querySelectorAll('select');
  var adForm = document.querySelector('.ad-form');
  var formFieldsets = adForm.querySelectorAll('fieldset');

  // Добавляем атрибут disabled элементам массива
  var disableElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].setAttribute('disabled', '');
    }
  };

  // Удаляем атрибут у всех элементов массива
  var activateElements = function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].removeAttribute('disabled');
    }
  };
  // Активация карты
  var activateMap = function () {
    mapElement.classList.remove('map--faded');
    activateElements(filterSelects);
  };

  // Активация формы
  var activateForm = function () {
    adForm.classList.remove('ad-form--disabled');
    // addressInput.value = getAddressValue(PIN_ACTIVE_HEIGHT);
    activateElements(formFieldsets);
    window.form.validate();
  };

  // Активация страницы
  var activatePage = function () {
    activateMap();
    window.map.showPins();
    activateForm();
    // getAddressValue(PIN_ACTIVE_HEIGHT);
  };

  // Деактивируем все поля формы и фильтра при загрузке страницы
  var disablePage = function () {
    disableElements(formFieldsets);
    disableElements(filterSelects);
  };

  disablePage();

  window.page = {
    activate: activatePage,
    disable: disablePage
  };
})();
