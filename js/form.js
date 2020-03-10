'use strict';

(function () {
  var TOO_MANY_ROOMS = '100';
  var NO_GUESTS = '0';
  var MIN_PRICE = {
    PALACE: '10000',
    HOUSE: '5000',
    FLAT: '1000',
    BUNGALO: '0'
  };
  var adFormElement = document.querySelector('.ad-form');
  var formFieldsetElements = adFormElement.querySelectorAll('fieldset');
  var typeSelectElement = adFormElement.querySelector('#type');
  var priceInputElement = adFormElement.querySelector('#price');
  var roomSelectElement = adFormElement.querySelector('#room_number');
  var capacitySelectElement = adFormElement.querySelector('#capacity');
  var capacityOptionElements = capacitySelectElement.querySelectorAll('option');
  var timeinSelectElement = adFormElement.querySelector('#timein');
  var timeoutSelectElement = adFormElement.querySelector('#timeout');
  var resetButton = adFormElement.querySelector('.ad-form__reset');

  // Связываем значение поля "Тип жилья" с полем "Цена"
  var setPriceValidity = function () {
    var type = typeSelectElement.value;
    switch (type) {
      case 'palace':
        priceInputElement.setAttribute('min', MIN_PRICE.PALACE);
        priceInputElement.setAttribute('placeholder', MIN_PRICE.PALACE);
        break;
      case 'flat':
        priceInputElement.setAttribute('min', MIN_PRICE.FLAT);
        priceInputElement.setAttribute('placeholder', MIN_PRICE.FLAT);
        break;
      case 'house':
        priceInputElement.setAttribute('min', MIN_PRICE.HOUSE);
        priceInputElement.setAttribute('placeholder', MIN_PRICE.HOUSE);
        break;
      default:
        priceInputElement.setAttribute('min', MIN_PRICE.BUNGALO);
        priceInputElement.setAttribute('placeholder', MIN_PRICE.BUNGALO);
    }
  };

  // Связываем значение поля "Количество комнат" с "Количеством мест"
  var setGuestSelectValidity = function () {
    var rooms = roomSelectElement.value;
    var capacity = capacitySelectElement.value;

    if (rooms === TOO_MANY_ROOMS && capacity !== NO_GUESTS) {
      capacitySelectElement.setCustomValidity('Ваши комнаты - не для гостей. Выберите "Не для гостей".');
    } else if (rooms !== TOO_MANY_ROOMS && capacity > rooms) {
      capacitySelectElement.setCustomValidity('Гостей не должно быть больше чем комнат. Выберите другое значение.');
    } else if (rooms !== TOO_MANY_ROOMS && capacity === NO_GUESTS) {
      capacitySelectElement.setCustomValidity('Выберите хотя бы одного гостя!');
    } else {
      capacitySelectElement.setCustomValidity('');
    }
  };

  var updateCapacityOptions = function (roomAmount) {
    switch (roomAmount) {
      case TOO_MANY_ROOMS:
        [].forEach.call(capacityOptionElements, function (el) {
          if (el.value === NO_GUESTS) {
            el.removeAttribute('disabled');
          } else {
            el.setAttribute('disabled', '');
          }
        });
        break;
      default:
        [].forEach.call(capacityOptionElements, function (el) {
          if (el.value === NO_GUESTS || el.value > roomAmount) {
            el.setAttribute('disabled', '');
          } else {
            el.removeAttribute('disabled');
          }
        });
    }
  };

  // Связываем время заезда и время выезда
  var setSameValue = function (select, value) {
    select.value = value;
  };

  // Действия при сбросе формы
  var doOnFormReset = function () {
    adFormElement.reset();
    adFormElement.classList.toggle('ad-form--invalid', false);
    window.map.reset();
    window.imgLoader.disable();
    disableForm();
  };

  // Действия при успешной оправке формы
  var doOnSuccessfulSending = function () {
    window.success.show();
    doOnFormReset();
  };

  // Обработчики изменения значений полей формы
  var typeChangeHandler = function () {
    setPriceValidity();
  };

  var timeinSelectChangeHandler = function () {
    setSameValue(timeoutSelectElement, timeinSelectElement.value);
  };

  var timeoutSelectChangeHandler = function () {
    setSameValue(timeinSelectElement, timeoutSelectElement.value);
  };

  var capacitySelectChangeHandler = function () {
    setGuestSelectValidity();
  };

  var roomSelectChangeHandler = function () {
    setGuestSelectValidity();
    updateCapacityOptions(roomSelectElement.value);
  };

  var resetButtonClickHandler = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    doOnFormReset();
  };

  var adFormSubmitHandler = function (evt) {
    evt.preventDefault();
    return (adFormElement.reportValidity())
      ? window.backend.save(new FormData(adFormElement), doOnSuccessfulSending, window.error.show)
      : adFormElement.classList.add('ad-form--invalid');
  };

  // Валидация формы
  var validateForm = function () {
    // Проверка полей в начале
    setGuestSelectValidity();
    updateCapacityOptions(roomSelectElement.value);
    setPriceValidity();
    typeSelectElement.addEventListener('change', typeChangeHandler);
    timeinSelectElement.addEventListener('change', timeinSelectChangeHandler);
    timeoutSelectElement.addEventListener('change', timeoutSelectChangeHandler);
    capacitySelectElement.addEventListener('change', capacitySelectChangeHandler);
    roomSelectElement.addEventListener('change', roomSelectChangeHandler);
  };

  var activateForm = function () {
    adFormElement.classList.remove('ad-form--disabled');
    formFieldsetElements.forEach(function (el) {
      el.removeAttribute('disabled');
    });
    validateForm();
    resetButton.addEventListener('click', resetButtonClickHandler);
    adFormElement.addEventListener('submit', adFormSubmitHandler);
    window.imgLoader.activate();
  };

  var disableForm = function () {
    adFormElement.classList.add('ad-form--disabled');
    formFieldsetElements.forEach(function (el) {
      el.setAttribute('disabled', '');
    });
    typeSelectElement.removeEventListener('change', typeChangeHandler);
    timeinSelectElement.removeEventListener('change', timeinSelectChangeHandler);
    timeoutSelectElement.removeEventListener('change', timeoutSelectChangeHandler);
    capacitySelectElement.removeEventListener('change', capacitySelectChangeHandler);
    roomSelectElement.removeEventListener('change', roomSelectChangeHandler);
    adFormElement.removeEventListener('submit', adFormSubmitHandler);
    resetButton.removeEventListener('click', resetButtonClickHandler);
  };

  disableForm();

  window.form = {
    activate: activateForm,
    disable: disableForm
  };
})();
